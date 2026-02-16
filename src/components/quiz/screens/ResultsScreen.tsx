import { useTranslation } from "react-i18next";
import { useQuizFlow } from "../context/QuizFlowContext";
import { getOverallStats, getRecentSessions, loadQuizData } from "../../../services/quizStorage";
import { useState, useEffect } from "react";

import CircularProgress from "../../../components/progress/CircularProgress";
import { getMotivationalMessage } from "../../../config/motivationalMessages";
import { getTruncatedQuestionText, getCorrectAnswer } from "../../../utils/questionHelpers";

import bgResult from "../../../assets/backgroundresult.webp";
import Popup from "../../ui/Popup";

export default function ResultsScreen() {
  const { t } = useTranslation("quiz");
  const { t: tCommon } = useTranslation("common");
  const { state, restartQuiz, resetFlow } = useQuizFlow();

  const [stats, setStats] = useState<any>(null);
  const [currentSession, setCurrentSession] = useState<any>(null);

  // TODO: Get this from user context/subscription
  const hasNatlyPlus = false; // Change to true for premium users

  
  const PREMIUM_FEATURES = {
    showLockIcons: false,           // 🔒 Lock icons on Known/Hard cards
    showClickToUnlock: false,       // "Click to unlock" text
    showUpgradeCTA: false,          // "Upgrade to Natly Plus" banner in Questions to Review
    showHistoricalQuestions: false, // Historical incorrect questions (Premium users only)
    enableProgressClick: false,     // Make Known/Hard cards clickable
  };

  const [showPremiumPopup, setShowPremiumPopup] = useState(false);

  
  const handleProgressClick = (type: 'known' | 'hard') => {
    // Only respond to clicks if feature is enabled
    if (!PREMIUM_FEATURES.enableProgressClick) {
      return; // Do nothing if feature is disabled
    }

    if (hasNatlyPlus) {
      // Navigate to detailed progress page (future feature)
      console.log(`Navigate to ${type} questions page`);
    } else {
      // Show premium popup for freemium users
      setShowPremiumPopup(true);
    }
  };

  /* ================================
     Load stats on mount
  ================================ */

  useEffect(() => {
    const overallStats = getOverallStats(state.selections.version);
    const sessions = getRecentSessions(state.selections.version, 1);
    
    setStats(overallStats);
    setCurrentSession(sessions[0] || null);
  }, [state.selections.version]);

  /* ================================
     Derived values
  ================================ */

  const score = currentSession?.correctAnswers || 0;
  const totalAttempted = currentSession?.questionsAttempted || 0;
  const totalQuestions = 10;
  const incorrect = totalAttempted - score;
  const unanswered = totalQuestions - totalAttempted;
  
  const percentage = totalAttempted > 0 ? Math.round((score / totalAttempted) * 100) : 0;

  // Calculate time
  const duration = currentSession?.startTime && currentSession?.endTime
    ? Math.floor(
        (new Date(currentSession.endTime).getTime() - 
         new Date(currentSession.startTime).getTime()) / 1000
      )
    : 0;

  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  const timeDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  /* ================================
     Get motivational message
  ================================ */

  const motivationalMsg = getMotivationalMessage(percentage, totalAttempted);

  /* ================================
     Get incorrect question IDs
     FREEMIUM: Only current session
     PREMIUM: All incorrect questions from history (excluding mastered ones)
  ================================ */

  const getIncorrectQuestions = () => {
    if (hasNatlyPlus) {
      // PREMIUM: Get all incorrect questions across sessions
      const store = loadQuizData(state.selections.version);
      const allIncorrect: number[] = [];

      // Collect all questions with incorrect > 0 and not mastered (correct < 3)
      Object.entries(store.questions).forEach(([id, data]) => {
        const questionId = Number(id);
        const { stats } = data;
        
        // Include if: has incorrect answers AND hasn't been answered correctly 3+ times
        if (stats.incorrect > 0 && stats.correct < 3) {
          allIncorrect.push(questionId);
        }
      });

      // Sort: Current session incorrect first, then others by most recent attempt
      const currentSessionIncorrect = currentSession?.incorrectQuestionIds || [];
      
      const otherIncorrect = allIncorrect
        .filter(id => !currentSessionIncorrect.includes(id))
        .sort((a, b) => {
          const aStats = store.questions[String(a)]?.stats;
          const bStats = store.questions[String(b)]?.stats;
          const aTime = aStats?.lastAttempt ? new Date(aStats.lastAttempt).getTime() : 0;
          const bTime = bStats?.lastAttempt ? new Date(bStats.lastAttempt).getTime() : 0;
          return bTime - aTime; // Most recent first
        });

      return {
        currentSession: currentSessionIncorrect,
        historical: otherIncorrect,
        total: [...currentSessionIncorrect, ...otherIncorrect],
      };
    } else {
      // FREEMIUM: Only current session incorrect
      const currentSessionIncorrect = currentSession?.incorrectQuestionIds || [];
      return {
        currentSession: currentSessionIncorrect,
        historical: [],
        total: currentSessionIncorrect,
      };
    }
  };

  const incorrectQuestions = getIncorrectQuestions();

  /* ================================
     Navigate to flashcard
  ================================ */

  const goToFlashcard = (questionId: number) => {
    const examVersion = state.selections.version;
    window.open(`/flashcards?exam=${examVersion}&question=${questionId}`, '_blank');
  };

  if (!stats || !currentSession) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20">
        <p className="text-center text-natly-blue-dark font-semibold">
          {t("results.loading")}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-natly-blue-dark">
          {t("results.title")}
        </h1>
        <p className="mt-2 text-gray-600">
          {t("results.subtitle")}
        </p>
      </div>

      {/* Main Results Card */}
      <div
        className="
          relative
          rounded-3xl
          border-2 border-gray-200
          p-8 sm:p-10
          shadow-lg
          overflow-hidden
          bg-white/70
          backdrop-blur-md
        "
        style={{
          backgroundImage: `url(${bgResult})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
          {/* Circular Progress */}
          <div className="flex justify-center mt-4 mb-12">
            <CircularProgress percentage={percentage} />
          </div>

          {/* Score Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

            {/* Correct Answers */}
            <div className="group text-center p-6 rounded-2xl bg-white border-t-8 border-green-500 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="flex items-center justify-center mb-3">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="text-5xl font-black text-green-600 mb-2">
                {score}
              </div>
              <p className="text-sm font-bold text-gray-700">
                {t("results.correct_answers")}
              </p>
            </div>

            {/* Incorrect Answers */}
            <div className="group text-center p-6 rounded-2xl bg-white border-t-8 border-red-500 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="flex items-center justify-center mb-3">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="text-5xl font-black text-red-600 mb-2">
                {incorrect}
              </div>
              <p className="text-sm font-bold text-gray-700">
                {t("results.incorrect_answers")}
              </p>
            </div>

            {/* Unanswered */}
            <div className="group text-center p-6 rounded-2xl bg-white border-t-8 border-gray-400 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="flex items-center justify-center mb-3">
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="text-5xl font-black text-gray-600 mb-2">
                {unanswered}
              </div>
              <p className="text-sm font-bold text-gray-700">
                {t("results.unanswered")}
              </p>
            </div>

          </div>

          {/* Time Display */}
          <div className="flex justify-center mb-8">
            <div className="w-full max-w-xs p-6 ">

              <div className="flex items-center justify-center gap-8">

                {/* Icon Circle */}
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-natly-blue-soft/20 flex items-center justify-center">
                    
                    <svg
                      className="w-9 h-9 text-natly-blue-soft animate-pulse"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>

                  </div>

                  {/* Soft ring animation */}
                  <div className="absolute inset-0 rounded-full border-2 border-natly-blue/20 animate-ping" />
                </div>

                {/* Time Text */}
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-500">
                    {t("results.time_taken")}
                  </p>

                  <p className="text-4xl font-black text-natly-blue-soft">
                    {timeDisplay}
                  </p>
                </div>

              </div>

            </div>
          </div>

          {/* Motivational Message */}
          <div className="p-6 rounded-xl bg-linear-to-br from-yellow-50 to-yellow-100 border border-yellow-200 shadow-md">
            <div className="flex items-start gap-4">
              <div className="text-5xl">
                {t(motivationalMsg.emoji)}
              </div>
              <div className="flex-1">
                <h3 className={`text-xl font-bold ${motivationalMsg.color} mb-2`}>
                  {t(motivationalMsg.titleKey)}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t(motivationalMsg.subtitleKey)}
                </p>
              </div>
            </div>
          </div>
      </div>

      {/* Questions to Review */}
      {incorrectQuestions.total.length > 0 && (
        <div className="mt-6 rounded-xl border-l-6 border-red-500 p-6 shadow-md">
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <span>{t("results.questions_to_review")}</span>
              {PREMIUM_FEATURES.showHistoricalQuestions && hasNatlyPlus && incorrectQuestions.historical.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-natly-yellow text-natly-blue-dark rounded-full">
                  PLUS
                </span>
              )}
            </h3>            
            
            {/* Current Session Incorrect */}
            {incorrectQuestions.currentSession.length > 0 && (
              <div className="space-y-3 mb-6">
                {incorrectQuestions.currentSession.map((qId: number) => {
                  // Get question text
                  const questionText = getTruncatedQuestionText(
                    qId, 
                    state.selections.version, 
                    state.selections.quizLanguage,
                    150
                  );

                  // Get correct answer
                  const correctAnswer = getCorrectAnswer(
                    qId,
                    state.selections.version,
                    state.selections.quizLanguage
                  );
                  
                  return (
                    <div 
                      key={qId}
                      className="flex flex-col gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      {/* Question Number and Text */}
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                          <span className="text-xl font-bold text-red-600">
                            {qId}
                          </span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 mb-1">
                            {t("results.question_number", { number: qId })}
                          </p>
                          <p className="text-sm text-gray-700">
                            {questionText || t("results.question_unavailable")}
                          </p>
                        </div>
                      </div>

                      {/* Correct Answer Section */}
                      {correctAnswer && (
                        <div className="ml-15 pl-4 border-l-2 border-green-400 bg-green-50 rounded-r-lg p-3">
                          <div className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-green-700 mb-1">
                                {t("results.correct_answers")}
                              </p>
                              <p className="text-sm text-gray-800 font-medium">
                                {correctAnswer}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Optional: Review button (currently hidden) */}
                      {false && (
                        <button 
                          onClick={() => goToFlashcard(qId)}
                          className="self-end px-4 py-2 text-sm font-bold text-white bg-natly-blue rounded-lg hover:bg-natly-blue-dark transition-colors"
                        >
                          {t("results.review")}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Historical Incorrect (Premium Only) - Only show if feature enabled */}
            {PREMIUM_FEATURES.showHistoricalQuestions && hasNatlyPlus && incorrectQuestions.historical.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Previous Sessions (Need More Practice)
                  </p>
                  <span className="px-2 py-0.5 text-xs font-bold bg-amber-100 text-amber-700 rounded-full">
                    {incorrectQuestions.historical.length}
                  </span>
                </div>
                {incorrectQuestions.historical.slice(0, 5).map((qId: number) => {
                  const questionText = getTruncatedQuestionText(
                    qId, 
                    state.selections.version, 
                    state.selections.quizLanguage,
                    150
                  );
                  
                  return (
                    <div 
                      key={qId}
                      className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors group border border-amber-200"
                    >
                      <div className="shrink-0 w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                        <span className="text-xl font-bold text-amber-700">
                          {qId}
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 mb-1">
                          {t("results.question_number", { number: qId })}
                        </p>
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {questionText || t("results.question_unavailable")}
                        </p>
                        <p className="text-xs text-amber-600 mt-1">
                          💡 Answer correctly 3 times to master this question
                        </p>
                      </div>
                      
                      <button 
                        onClick={() => goToFlashcard(qId)}
                        className="shrink-0 px-4 py-2 text-sm font-bold text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors"
                      >
                        {t("results.review")}
                      </button>
                    </div>
                  );
                })}
                
                {incorrectQuestions.historical.length > 5 && (
                  <p className="text-xs text-center text-gray-500">
                    +{incorrectQuestions.historical.length - 5} more questions need practice
                  </p>
                )}
              </div>
            )}

            {/* Upgrade CTA - Only show if feature enabled */}
            {PREMIUM_FEATURES.showUpgradeCTA && !hasNatlyPlus && incorrectQuestions.currentSession.length > 0 && (
              <div className="mt-6 p-4 bg-gradient-to-r from-natly-yellow/20 to-amber-100 border-2 border-natly-yellow rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">⭐</div>
                  <div className="flex-1">
                    <p className="font-bold text-natly-blue-dark mb-1">
                      {tCommon("natlyplus.upgrade.title")}
                    </p>
                    <p className="text-sm text-gray-700">
                      {tCommon("natlyplus.features.quiz.description")}
                    </p>
                    <button className="mt-2 px-4 py-2 bg-natly-yellow text-natly-blue-dark font-bold rounded-lg hover:bg-amber-500 transition-colors text-sm">
                      {tCommon("natlyplus.upgrade.cta")}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overall Progress */}
      <div
        className="mt-14 p-6 rounded-3xl border-3 border-natly-blue-soft shadow-lg">
        <div className="relative z-10">

          <h3 className="text-lg font-bold text-natly-blue-dark mb-6 text-center">
            {t("results.overall_progress")}
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="text-center p-4 rounded-xl border-4 border-blue-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="text-3xl font-black text-natly-blue mb-2">
                {stats.totalSessions}
              </div>
              <p className="text-xs font-semibold text-gray-700">
                {t("results.sessions")}
              </p>
            </div>
            
            <div 
              onClick={() => handleProgressClick('known')}
              className={`
                relative
                text-center p-4 rounded-xl border-4 border-green-200 
                transition-all duration-300
                ${PREMIUM_FEATURES.enableProgressClick && !hasNatlyPlus 
                  ? 'cursor-pointer hover:shadow-xl hover:-translate-y-2 hover:border-green-300' 
                  : 'hover:shadow-xl hover:-translate-y-2'
                }
              `}
            >
              {/* Lock icon in top-right corner */}
              {PREMIUM_FEATURES.showLockIcons && !hasNatlyPlus && (
                <div className="absolute top-2 right-2">
                  <span className="text-lg text-amber-500">🔒</span>
                </div>
              )}

              <div className="text-3xl font-black text-green-600 mb-2">
                {stats.knownCount}
              </div>
              <p className="text-xs font-semibold text-gray-700">
                {t("results.known")}
              </p>
              {PREMIUM_FEATURES.showClickToUnlock && !hasNatlyPlus && (
                <p className="text-xs text-gray-500 mt-1">
                  Click to unlock
                </p>
              )}
            </div>
            
            <div 
              onClick={() => handleProgressClick('hard')}
              className={`
                relative
                text-center p-4 rounded-xl border-4 border-orange-200 
                transition-all duration-300
                ${PREMIUM_FEATURES.enableProgressClick && !hasNatlyPlus 
                  ? 'cursor-pointer hover:shadow-xl hover:-translate-y-2 hover:border-orange-300' 
                  : 'hover:shadow-xl hover:-translate-y-2'
                }
              `}
            >
              {/* Lock icon in top-right corner */}
              {PREMIUM_FEATURES.showLockIcons && !hasNatlyPlus && (
                <div className="absolute top-2 right-2">
                  <span className="text-lg text-amber-500">🔒</span>
                </div>
              )}

              <div className="text-3xl font-black text-orange-600 mb-2">
                {stats.hardCount}
              </div>
              <p className="text-xs font-semibold text-gray-700">
                {t("results.hard")}
              </p>
              {PREMIUM_FEATURES.showClickToUnlock && !hasNatlyPlus && (
                <p className="text-xs text-gray-500 mt-1">
                  Click to unlock
                </p>
              )}
            </div>

            <div className="text-center p-4 rounded-xl border-4 border-purple-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="text-3xl font-black text-purple-600 mb-2">
                {stats.longestStreak}
              </div>
              <p className="text-xs font-semibold text-gray-700">
                {t("results.streak")}
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Action Buttons - Full Width */}
      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        <button 
          onClick={restartQuiz}
          className="w-full px-8 py-4 rounded-xl bg-natly-yellow text-natly-blue-dark font-bold shadow-lg hover:bg-amber-500 hover:-translate-y-1 transition-all"
        >
          {t("results.retry_quiz")}
        </button>

        <button 
          onClick={resetFlow}
          className="w-full px-8 py-4 rounded-xl border-2 border-natly-blue text-natly-blue font-bold hover:bg-natly-blue hover:text-white transition-all"
        >
          {t("results.back_to_home")}
        </button>

      </div>

      {/* Progress saved message */}
      <p className="mt-6 text-center text-sm text-gray-500">
        ✓ {t("results.progress_saved")}
      </p>

      {showPremiumPopup && (
        <Popup
          title={tCommon("natlyplus.feature_locked")}
          message={tCommon("natlyplus.unlock_progress.message", { 
            known: stats.knownCount, 
            hard: stats.hardCount 
          })}
          buttonText={tCommon("natlyplus.unlock_progress.upgrade_button")}
          accent="yellow"
          icon="lock"
          onClose={() => {
            setShowPremiumPopup(false);
          }}
          secondaryButton={{
            text: tCommon("natlyplus.unlock_progress.dismiss_button"),
            onClick: () => setShowPremiumPopup(false)
          }}
        />
      )}

    </div>    
  );
}