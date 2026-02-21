import { useTranslation } from "react-i18next";
import { IconBars } from "../../../natly-icons";

import { useQuizFlow } from "../context/QuizFlowContext";
import { useEasyPractice } from "../../../hooks/useEasyPractice";
import { useQuizSession } from "../../../hooks/useQuizSession";

import { updateQuestionStats } from "../../../services/quizStorage";

import { useState, useEffect } from "react";

export default function EasyGuideOption() {
  const { t } = useTranslation("quiz");
  const { t: tCommon } = useTranslation("common");

  const { state, continueFlow } = useQuizFlow();

  const { current, index, next, total, done } = useEasyPractice(
    state.selections.version,
    state.sessionId
  );

  // Get selected language from state
  const quizLanguage = state.selections.quizLanguage;

  // Session tracking
  const { recordAnswer, finishSession } = useQuizSession(
    state.selections.version,
    "easy-guide"
  );

  /* ===============================
     State
  =============================== */

  type Option = {
    text: string;
    correct: boolean;
  };

  const [options, setOptions] = useState<Option[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  
  const [hintUsed, setHintUsed] = useState(false);
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);

  /* ===============================
     Build options ONCE per question
  =============================== */

  useEffect(() => {
    if (!current) return;

    const questionData = current.languages[quizLanguage];

    if (!questionData) {
      console.error(`Language "${quizLanguage}" not available for this question`);
      return;
    }

    // Pick 1 correct
    const correctText =
      questionData.correct[
        Math.floor(Math.random() * questionData.correct.length)
      ];

    // Pick 3 distractors
    const distractors = [...questionData.distractors]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const mixed = [
      { text: correctText, correct: true },
      ...distractors.map(d => ({
        text: d,
        correct: false,
      })),
    ].sort(() => Math.random() - 0.5);

    setOptions(mixed);

  }, [current, quizLanguage]);

  /* ===============================
     Reset on question change
  =============================== */

  useEffect(() => {
    setSelected(null);
    setIsCorrect(null);
    setHintUsed(false);
    setAnswerRevealed(false);
    setEliminatedOptions([]);
  }, [index]);

  /* ===============================
     Handle answer
  =============================== */

  const handleAnswer = (option: Option) => {
    if (selected) return;

    setSelected(option.text);
    setIsCorrect(option.correct);

    // Update localStorage with comprehensive stats
    updateQuestionStats(
      state.selections.version,
      current.id,
      {
        isCorrect: option.correct,
        hintUsed: hintUsed,
        answerRevealed: answerRevealed,
      }
    );

    // Record in session
    recordAnswer(current.id, option.correct);

    // Update UI score
    if (option.correct) {
      setScore(v => v + 1);
    }
  };

  /* ===============================
     Handle Hint
  =============================== */

  const handleHint = () => {
    if (hintUsed || selected || answerRevealed) return;

    const incorrectOptions = options
      .filter(opt => !opt.correct)
      .map(opt => opt.text);

    const toEliminate = incorrectOptions
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    setEliminatedOptions(toEliminate);
    setHintUsed(true);
  };

  /* ===============================
     Handle Answer Reveal
  =============================== */

  const handleRevealAnswer = () => {
    if (selected || answerRevealed) return;

    const correctOption = options.find(opt => opt.correct);
    
    if (correctOption) {
      setSelected(correctOption.text);
      setIsCorrect(true);
      setAnswerRevealed(true);

      // Record as incorrect attempt with answer revealed
      updateQuestionStats(
        state.selections.version,
        current.id,
        {
          isCorrect: false, // Revealing = wrong attempt
          answerRevealed: true,
        }
      );

      // Record in session as incorrect
      recordAnswer(current.id, false);
    }
  };

  /* ===============================
     Handle Finish Quiz
  =============================== */

  const handleFinish = () => {
    finishSession();
    continueFlow(); // Navigate to results screen
  };

  /* ===============================
     Helper for option styles
  =============================== */

  const getOptionStyles = (opt: Option, isSelected: boolean) => {
    const isRight = opt.correct;
    const isEliminated = eliminatedOptions.includes(opt.text);

    if (isEliminated) {
      return {
        border: "border-gray-300",
        bg: "bg-gray-100",
        text: "text-gray-400 line-through",
        hover: "",
        disabled: true
      };
    }

    if (!selected) {
      return {
        border: "border-natly-blue-soft",
        bg: "bg-white",
        text: "text-natly-blue-dark",
        hover: "hover:bg-natly-blue-soft/40",
        disabled: false
      };
    }

    if (isSelected && isRight) {
      return {
        border: "border-green-600",
        bg: "bg-green-100",
        text: "text-green-800",
        hover: "",
        disabled: true
      };
    }

    if (isSelected && !isRight) {
      return {
        border: "border-red-600",
        bg: "bg-red-100",
        text: "text-red-800",
        hover: "",
        disabled: true
      };
    }

    if (!isSelected && isRight) {
      return {
        border: "border-green-400",
        bg: "bg-green-50",
        text: "text-green-800",
        hover: "",
        disabled: true
      };
    }

    return {
      border: "border-natly-blue-soft",
      bg: "bg-white opacity-60",
      text: "text-natly-blue-dark",
      hover: "",
      disabled: true
    };
  };

  /* ===============================
     Loading
  =============================== */

  if (!current) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <p className="text-center text-natly-blue-dark font-semibold">
          Loading...
        </p>
      </div>
    );
  }

  // Check if language data exists
  const questionData = current.languages[quizLanguage];

  if (!questionData) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <p className="text-center text-red-600 font-semibold">
          This question is not available in {quizLanguage.toUpperCase()}
        </p>
      </div>
    );
  }

  /* ===============================
     Render
  =============================== */

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">

      {/* Header */}
      <div className="flex items-center justify-end">

        {/* Finish Button (replaces back button) */}
        <button 
          onClick={handleFinish}
          className="rounded-full border border-red-700 px-6 py-2 font-bold text-red-700 transition hover:bg-red-700 hover:text-white"
        >
          {t("actions.finish_quiz")}
        </button>

      </div>

      {/* Progress */}
      <div className="mt-4 flex items-center gap-3 text-sm font-semibold text-natly-blue-dark">

        <span>{t("modes.easy.title")}</span>

        <span className="opacity-40">|</span>

        <span>
          {t("quiz_progress.question", {
            current: index + 1,
            total,
          })}
        </span>

        <span className="opacity-40">|</span>        

        <span className="flex items-center gap-1 text-natly-blue">   
          <IconBars size={35} color="#0A3A78"/>       
          {score} pts
        </span>

      </div>

      {/* Progress bar */}
      <div className="mt-2 h-2 w-full rounded-full bg-natly-blue-soft/40">

        <div
          className="h-2 rounded-full bg-natly-blue transition-all duration-300"
          style={{
            width: `${((index + 1) / total) * 100}%`,
          }}
        />

      </div>

      {/* Question */}
      <h1 className="mt-8 text-center text-2xl font-extrabold text-natly-blue-dark">
        {questionData.question}
      </h1>

      {/* Feedback Message */}
      {selected && (
        <div className={`mt-4 text-center font-semibold text-lg ${
          isCorrect ? "text-green-600" : "text-red-600"
        }`}>
          {isCorrect 
            ? (answerRevealed 
                ? "✅ " + t("feedback.answer_revealed")
                : "✅ " + t("feedback.correct"))
            : "❌ " + t("feedback.incorrect")
          }
        </div>
      )}

      {/* Options */}
      <div className="mt-8 space-y-4">

        {options.map((opt, i) => {
          const isSelected = selected === opt.text;
          const styles = getOptionStyles(opt, isSelected);

          return (
            <button
              key={`${opt.text}-${i}`}
              disabled={styles.disabled || !!selected}
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

      {/* Actions */}
      <div className="mt-8 flex flex-wrap justify-center gap-4">

        {/* Hint Button */}
        <button 
          onClick={handleHint}
          disabled={hintUsed || !!selected || answerRevealed}
          className={`
            rounded-full border px-3 py-2 md:px-6 md:py-2 font-bold transition
            ${hintUsed || selected || answerRevealed
              ? "border-gray-300 text-gray-400 cursor-not-allowed"
              : "border-natly-blue text-natly-blue hover:bg-natly-blue hover:text-white"
            }
          `}
        >
          {tCommon("actions.hint")}
          {hintUsed && " ✓"}
        </button>

        {/* Answer Button */}
        <button 
          onClick={handleRevealAnswer}
          disabled={!!selected || answerRevealed}
          className={`
            rounded-full border px-3 py-2 md:px-6 md:py-2 font-bold transition
            ${selected || answerRevealed
              ? "border-gray-300 text-gray-400 cursor-not-allowed"
              : "border-natly-blue text-natly-blue hover:bg-natly-blue hover:text-white"
            }
          `}
        >
          {tCommon("actions.show_answer")}
        </button>

        {/* Next Button */}
        <button
          disabled={!selected}
          onClick={() => {
            if (!done) {
              next();
            } else {
              handleFinish();
            }
          }}
          className={`
            rounded-full border px-3 py-2 md:px-6 md:py-2 font-bold
            transition
            ${
              selected
                ? "border-natly-yellow-dark text-natly-yellow-dark hover:bg-natly-yellow-dark hover:text-natly-blue-dark"
                : "border-gray-300 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          {done ? tCommon("actions.finish") : tCommon("actions.next_question")}
        </button>

      </div>

    </div>
  );
}
