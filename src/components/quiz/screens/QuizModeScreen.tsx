import { useTranslation } from "react-i18next";

import mascotaquiz from "../../../assets/natlyquiz.webp";
import natlyeasy from "../../../assets/natly-easy-mode.webp";
import natlyhard from "../../../assets/natly-hard-mode.webp";
import natlyinterview from "../../../assets/natly-interview-mode.webp";

import Popup from "../../ui/Popup";
import { IconCheck } from "../../../natly-icons";

import { useQuizFlow } from "../context/QuizFlowContext";
import type { ExamMode } from "../flow/types";

import QuizSteps from "../layout/QuizSteps";

import {
  getStoredExamVersion,
  setStoredExamVersion,
} from "../../../utils/examStorage";

import { useEffect } from "react";

/* ================================
   Component
================================ */

export default function QuizModeScreen() {
  const { t } = useTranslation("quiz");
  const { t: tCommon } = useTranslation("common");

  const {
    state,
    selectVersion,
    selectMode,
    continueFlow,
    closePopup,
  } = useQuizFlow();

  const selectedVersion = state.selections.version;
  const selectedMode = state.selections.mode;
  const showPopup = state.ui.showLockedPopup;

  /* ================================
     Config
  ================================ */

  const modes = [
    {
      id: "easy" as ExamMode,
      image: natlyeasy,
      tag: t("modes.easy.tag"),
      showTag: true,
      premium: false,
    },
    {
      id: "hard" as ExamMode,
      image: natlyhard,
      tag: null,
      showTag: false,
      premium: false,
    },
    {
      id: "interview" as ExamMode,
      image: natlyinterview,
      tag: t("modes.interview.included"),
      showTag: true,
      premium: true,
    },
  ];

  /* ================================
     Keyboard helper
  ================================ */

  const handleKeyDown = (
    e: React.KeyboardEvent,
    callback: () => void
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      callback();
    }
  };

  /* ================================
     Effects
  ================================ */

  useEffect(() => {
    const stored = getStoredExamVersion();

    if (stored !== selectedVersion) {
      selectVersion(stored);
    }
  }, []);

  useEffect(() => {
    setStoredExamVersion(selectedVersion);
  }, [selectedVersion]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "natly_exam_version") {
        const value = getStoredExamVersion();

        if (value !== selectedVersion) {
          selectVersion(value);
        }
      }
    };

    window.addEventListener("storage", onStorage);

    return () =>
      window.removeEventListener("storage", onStorage);
  }, [selectedVersion]);

  /* ================================
     Render
  ================================ */

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">

      {/* Mascot */}
      <div className="flex justify-center">
        <img
          src={mascotaquiz}
          alt="Natly mascot"
          className="w-56 sm:w-72 md:w-136"
        />
      </div>

      {/* Headline */}
      <h1 className="mb-4 text-center text-2xl font-extrabold tracking-tight text-natly-blue-dark sm:text-3xl">
        {t("headlines.main")}
      </h1>

      {/* Steps */}
      <QuizSteps current={1} />

      {/* Main container */}
      <div className="relative mx-auto w-full max-w-[1200px] rounded-xl border-4 border-natly-blue-soft bg-white flex flex-col pb-6 sm:pb-8">

        {/* Title */}
        <div className="pt-5 text-center">
          <h2 className="text-lg font-extrabold tracking-wide text-natly-blue-dark sm:text-xl">
            {t("sections.exam_mode.title")}
          </h2>
        </div>

        {/* Mode divider */}
        <div className="mt-4 px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-xs font-semibold text-natly-blue-dark sm:text-sm">
            <div className="h-px bg-natly-blue-soft" />
            <span>
              {t("sections.exam_mode.subtitle_mode")}
            </span>
            <div className="h-px bg-natly-blue-soft" />
          </div>
        </div>

        {/* Mode cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 px-4 sm:grid-cols-3 sm:px-6 md:px-8">

          {modes.map((mode) => {
            const isSelected = selectedMode === mode.id;

            return (
              <div
                key={mode.id}
                role="button"
                tabIndex={0}
                onClick={() => selectMode(mode.id)}
                onKeyDown={(e) =>
                  handleKeyDown(e, () =>
                    selectMode(mode.id)
                  )
                }
                aria-pressed={isSelected}
                className={`
                  relative flex flex-col items-center rounded-xl border-3 p-6
                  text-center cursor-pointer
                  min-h-[420px]
                  transition-all duration-300
                  hover:-translate-y-2 hover:shadow-xl
                  focus:outline-none focus:ring-4 focus:ring-natly-yellow/30
                  ${
                    isSelected
                      ? "border-natly-yellow bg-amber-50 shadow-xl shadow-natly-yellow/30 scale-[1.02] ring-2 ring-natly-yellow"
                      : "border-natly-blue-soft bg-white shadow-sm"
                  }
                `}
              >

                {/* Background */}
                <div className="absolute inset-0 z-0 overflow-hidden rounded-xl">
                  <img
                    src={mode.image}
                    alt={`${mode.id} background`}
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-white/50 via-white/15 to-transparent" />
                </div>

                {/* Badge */}
                {mode.showTag && mode.tag && (
                  <div
                    className={`
                      absolute -top-4 z-20
                      px-4 py-2 rounded-full
                      text-xs font-extrabold shadow-md
                      ${
                        mode.premium
                          ? "right-3 bg-natly-yellow text-natly-blue-dark"
                          : "left-1/2 -translate-x-1/2 bg-natly-blue-dark text-white"
                      }
                    `}
                  >
                    {mode.tag}
                  </div>
                )}

                {/* Radio */}
                <div
                  className={`
                    absolute top-3 right-3 z-30
                    w-6 h-6 rounded-full border-2
                    flex items-center justify-center
                    ${
                      isSelected
                        ? "border-natly-yellow bg-natly-yellow"
                        : "border-gray-300 bg-white"
                    }
                  `}
                >
                  {isSelected && (
                    <IconCheck
                      size={14}
                      className="text-natly-blue-dark"
                    />
                  )}
                </div>

                {/* Content */}
                <div className="relative z-10 mt-auto text-center">
                  <h3 className="text-lg font-extrabold text-natly-blue-dark drop-shadow">
                    {t(`modes.${mode.id}.title`)}
                  </h3>

                  <p className="text-sm text-natly-blue-dark/90 leading-relaxed drop-shadow">
                    {t(`modes.${mode.id}.description`)}
                  </p>
                </div>

              </div>
            );
          })}

        </div>

        {/* Continue */}
        <div className="mt-8 px-4 sm:px-6 md:px-8 flex justify-center">

          <button
            onClick={continueFlow}
            className="px-12 py-4 rounded-xl font-bold text-lg
              bg-natly-yellow text-natly-blue-dark
              shadow-lg shadow-natly-yellow/30
              hover:bg-amber-500 hover:-translate-y-1 hover:shadow-xl
              transition-all duration-300
              focus:outline-none focus:ring-4 focus:ring-natly-yellow/50"
          >
            {tCommon("buttons.continue")}
          </button>

        </div>

      </div>

      {/* Locked popup */}
      {showPopup && (
        <Popup
          title={tCommon("messages.feature_unavailable")}
          message={tCommon("messages.exam_mode_unavailable")}
          buttonText={tCommon("buttons.understood")}
          accent="blue"
          onClose={closePopup}
        />
      )}

    </div>
  );
}