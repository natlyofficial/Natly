import { useTranslation } from "react-i18next";
import { useEffect, useState, useCallback } from "react";

import { useQuizFlow }     from "../context/QuizFlowContext";
import { useEasyPractice } from "../../../hooks/useEasyPractice";
import { useQuizSession }  from "../../../hooks/useQuizSession";
import { useQuizTracking } from "../../../hooks/useAnalytics";

import quickTimerIcon from "../../../assets/icon/clock.webp";

import { updateQuestionStats } from "../../../services/quizStorage";
import {
  trackQuizStarted,
  trackQuestionAnswered,
  trackQuizCompleted,
  updateQuestionPerformance,
} from "../../../lib/analyticsEvents";

const EXAM_DURATION_SECONDS = 10 * 60;

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type Option = { text: string; correct: boolean };

export default function EasyQuickExamOption() {
  const { t }          = useTranslation("quiz");
  const { t: tCommon } = useTranslation("common");

  const { state, continueFlow } = useQuizFlow();
  const { startQuestion, getQuestionTime } = useQuizTracking();

  const { current, index, next, total, done } = useEasyPractice(
    state.selections.version,
    state.sessionId
  );

  const quizLanguage = state.selections.quizLanguage;

  const { recordAnswer, finishSession } = useQuizSession(
    state.selections.version,
    "easy-quickexam"
  );

  const [options,   setOptions]   = useState<Option[]>([]);
  const [selected,  setSelected]  = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score,     setScore]     = useState(0);
  const [timeLeft,  setTimeLeft]  = useState(EXAM_DURATION_SECONDS);
  const [finished,  setFinished]  = useState(false);

  const timerColor =
    timeLeft > 120 ? "text-green-600" :
    timeLeft > 60  ? "text-yellow-500" :
                     "text-red-600";

  const handleFinish = useCallback(() => {
    if (finished) return;
    setFinished(true);

    trackQuizCompleted({
      mode: "easy" as any,
      version: state.selections.version,
      score,
      totalQuestions: total,
      timeSpent: EXAM_DURATION_SECONDS - timeLeft,
      correctAnswers: score,
      incorrectAnswers: total - score,
    });

    finishSession();
    continueFlow();
  }, [finished, score, total, timeLeft, state.selections.version,
      finishSession, continueFlow]);

  useEffect(() => {
    trackQuizStarted({
      mode: "easy" as any,
      version: state.selections.version,
      language: state.selections.quizLanguage,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (finished) return;
    const id = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(id); handleFinish(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [finished, handleFinish]);

  useEffect(() => {
    if (!current) return;
    const qd = current.languages[quizLanguage];
    if (!qd) return;

    const correctText = qd.correct[Math.floor(Math.random() * qd.correct.length)];
    const distractors = [...qd.distractors].sort(() => Math.random() - 0.5).slice(0, 3);

    const mixed: Option[] = [
      { text: correctText, correct: true },
      ...distractors.map(d => ({ text: d, correct: false })),
    ].sort(() => Math.random() - 0.5);

    setOptions(mixed);
  }, [current, quizLanguage]);

  useEffect(() => {
    setSelected(null);
    setIsCorrect(null);
    startQuestion();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const handleAnswer = (opt: Option) => {
    if (selected || finished) return;

    setSelected(opt.text);
    setIsCorrect(opt.correct);

    updateQuestionStats(state.selections.version, current.id, {
      isCorrect: opt.correct,
      hintUsed: false,
      answerRevealed: false,
    });

    recordAnswer(current.id, opt.correct);

    const timeSpent = getQuestionTime();

    trackQuestionAnswered({
      questionId: current.id,
      correct: opt.correct,
      timeSpent,
      hintUsed: false,
      answerRevealed: false,
      examVersion: state.selections.version,
    });

    updateQuestionPerformance({ questionId: current.id, correct: opt.correct, timeSpent });

    if (opt.correct) setScore(v => v + 1);
  };

  const handleNext = () => {
    if (done) handleFinish();
    else next();
  };

  // Mismo patrón de objeto que EasyGuideOption
  const getOptionStyles = (opt: Option) => {
    const isSelected = selected === opt.text;

    if (!selected) {
      return {
        border: "border-natly-blue-soft",
        bg: "bg-white",
        text: "text-natly-blue-dark",
        hover: "hover:bg-natly-blue-soft/40",
        disabled: false,
      };
    }
    if (isSelected && opt.correct) {
      return { border: "border-green-600", bg: "bg-green-100", text: "text-green-800", hover: "", disabled: true };
    }
    if (isSelected && !opt.correct) {
      return { border: "border-red-600",   bg: "bg-red-100",   text: "text-red-800",   hover: "", disabled: true };
    }
    if (!isSelected && opt.correct) {
      return { border: "border-green-400", bg: "bg-green-50",  text: "text-green-800", hover: "", disabled: true };
    }
    return { border: "border-natly-blue-soft", bg: "bg-white opacity-60", text: "text-natly-blue-dark", hover: "", disabled: true };
  };

  if (!current) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <p className="text-center text-natly-blue-dark font-semibold">Loading...</p>
      </div>
    );
  }

  const questionData = current.languages[quizLanguage];

  if (!questionData) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <p className="text-center text-red-600 font-semibold">
          Question not available in {quizLanguage.toUpperCase()}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-2 font-bold text-xl tabular-nums ${timerColor}`}>
            <img src={quickTimerIcon} alt="timer" className="h-6 w-6 object-contain" />
            <span>{formatTime(timeLeft)}</span>
        </div>

        <button
            onClick={handleFinish}
            className="rounded-full border border-red-700 px-6 py-2 font-bold text-red-700 transition hover:bg-red-700 hover:text-white"
        >
            {t("actions.finish_quiz")}
        </button>
      </div>

      {/* Progress */}
      <div className="mt-4 flex items-center gap-3 text-sm font-semibold text-natly-blue-dark">
        <span>{t("easy_options.quick.title")}</span>
        <span className="opacity-40">|</span>
        <span>{t("quiz_progress.question", { current: index + 1, total })}</span>
        <span className="opacity-40">|</span>
        <span className="text-natly-blue">{score} pts</span>
      </div>

      <div className="mt-2 h-2 w-full rounded-full bg-natly-blue-soft/40">
        <div
          className="h-2 rounded-full bg-natly-blue transition-all duration-300"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      {/* Question */}
      <h1 className="mt-8 text-center text-2xl font-extrabold text-natly-blue-dark">
        {questionData.question}
      </h1>

      {/* Feedback */}
      {selected && (
        <div className={`mt-4 text-center font-semibold text-lg ${
          isCorrect ? "text-green-600" : "text-red-600"
        }`}>
          {isCorrect
            ? `✅ ${t("feedback.correct")}`
            : `❌ ${t("feedback.incorrect")}`}
        </div>
      )}

      {/* Options */}
      <div className="mt-8 space-y-4">
        {options.map((opt, i) => {
          const styles = getOptionStyles(opt);
          return (
            <button
              key={`${opt.text}-${i}`}
              disabled={styles.disabled || !!selected || finished}
              onClick={() => handleAnswer(opt)}
              className={`
                w-full rounded-xl border
                px-4 py-4
                text-left font-medium
                transition
                disabled:cursor-not-allowed
                ${styles.border}
                ${styles.bg}
                ${styles.text}
                ${styles.hover}
              `}
            >
              <span className="mr-2 font-bold">
                {String.fromCharCode(65 + i)})
              </span>
              {opt.text}
            </button>
          );
        })}
      </div>

      {/* Next / Finish */}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button
          disabled={!selected}
          onClick={handleNext}
          className={`
            rounded-full border px-3 py-2 md:px-6 md:py-2 font-bold transition
            ${selected
              ? "border-natly-yellow-dark text-natly-yellow-dark hover:bg-natly-yellow-dark hover:text-natly-blue-dark"
              : "border-gray-300 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          {done ? tCommon("actions.finish") : t("actions.next_question")}
        </button>
      </div>

    </div>
  );
}