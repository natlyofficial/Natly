import { useTranslation } from "react-i18next";
import { IconLeftArrow, IconCheck } from "../../../natly-icons";
import iconversion from "../../../assets/icon/iconversionexam.webp";

import QuizSteps from "../layout/QuizSteps";
import { useQuizFlow } from "../context/QuizFlowContext";
import type { ExamVersion, QuizLanguage } from "../flow/types";
import { setStoredExamVersion } from "../../../utils/examStorage"; // Import existing storage helper

export default function ConfigScreen() {
  const { t } = useTranslation("quiz");
  const { t: tCommon } = useTranslation("common");

  const {
    state,
    selectVersion,
    selectLanguage,
    continueFlow,
    goBack,
  } = useQuizFlow();

  const selectedVersion = state.selections.version;
  const selectedLanguage = state.selections.quizLanguage;

  /* ================================
     Config
  ================================ */

  const languages = [
    { code: "en" as QuizLanguage, name: "English" },
    { code: "es" as QuizLanguage, name: "Español" },
  ];

  /* ================================
     Handle version selection with persistence
  ================================ */

  const handleVersionSelect = (version: ExamVersion) => {
    selectVersion(version);
    
    // Persist to localStorage using existing storage system
    setStoredExamVersion(version);
    console.log(`✅ Saved exam version to localStorage: ${version}`);
  };

  /* ================================
     Handle language selection with persistence
  ================================ */

  const handleLanguageSelect = (language: QuizLanguage) => {
    selectLanguage(language);
    
    // Persist to localStorage
    localStorage.setItem("natly-selected-quiz-language", language);
    console.log(`✅ Saved quiz language to localStorage: ${language}`);
  };

  /* ================================
     Keyboard accessibility helper
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
     Render
  ================================ */

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      
      {/* Back Button */}
      <button
        onClick={goBack}
        className="
          flex items-center gap-1 text-md font-medium
          [--back-color:var(--color-natly-blue-dark)]
          hover:[--back-color:var(--color-natly-blue-soft)]
          transition-colors
        "
      >
        <IconLeftArrow size={20} color="var(--back-color)" />
        <span style={{ color: "var(--back-color)" }}>
          {tCommon("buttons.back")}
        </span>
      </button>

      {/* Header */}
      <div className="text-center mt-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-natly-blue-dark">
          {t("config.title")}
        </h1>
        <p className="text-gray-600 mt-2">
          {t("config.subtitle")}
        </p>
      </div>

      {/* Steps */}
      <QuizSteps current={2} />

      {/* Main Container */}
      <div className="mt-8 rounded-xl border-4 border-natly-blue-soft bg-white p-6 sm:p-8">

        {/* Version Section */}
        <section aria-labelledby="version-heading">
          
          {/* Divider */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-xs font-semibold text-natly-blue-dark sm:text-sm">
            <div className="h-px bg-natly-blue-soft" />
            <h2 id="version-heading">
              {t("sections.exam_mode.subtitle_version")}
            </h2>
            <div className="h-px bg-natly-blue-soft" />
          </div>

          {/* Version Cards */}
          <div 
            role="radiogroup" 
            aria-labelledby="version-heading"
            className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            {(["exam_2025_128", "exam_2008_100"] as ExamVersion[]).map(
              (version) => {
                const isSelected = selectedVersion === version;
                
                return (
                  <button
                    key={version}
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleVersionSelect(version)}
                    onKeyDown={(e) => handleKeyDown(e, () => handleVersionSelect(version))}
                    className={`
                      relative flex items-center gap-4 px-6 py-4 rounded-xl border-3
                      transition-all duration-300 hover:shadow-lg hover:-translate-y-1
                      focus:outline-none focus:ring-4 focus:ring-natly-yellow/30
                      ${
                        isSelected
                          ? "border-natly-yellow bg-[#FFF6D6] shadow-lg shadow-natly-yellow/20"
                          : "border-natly-blue-soft bg-[#F5F7FA]"
                      }
                    `}
                  >
                    {/* Radio Circle */}
                    <div
                      aria-hidden="true"
                      className={`
                        absolute top-3 right-3 w-6 h-6 rounded-full border-2
                        flex items-center justify-center transition-colors
                        ${
                          isSelected
                            ? "border-natly-yellow bg-natly-yellow"
                            : "border-gray-300"
                        }
                      `}
                    >
                      {isSelected && (
                        <IconCheck size={14} className="text-natly-blue-dark" />
                      )}
                    </div>

                    {/* Icon */}
                    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-white shadow-sm">
                      <img 
                        src={iconversion} 
                        className="w-6 h-6" 
                        alt="" 
                        aria-hidden="true"
                      />
                    </div>

                    {/* Content */}
                    <div className="text-left flex-1">
                      <p className="font-bold text-natly-blue-dark">
                        {version === "exam_2025_128"
                          ? tCommon("options.exam_version_2025")
                          : tCommon("options.exam_version_2008")}
                      </p>
                      <p className="text-sm text-gray-600 mt-0.5">
                        {version === "exam_2025_128"
                          ? tCommon("options.exam_version_2025_subtitle")
                          : tCommon("options.exam_version_2008_subtitle")}
                      </p>
                    </div>
                  </button>
                );
              }
            )}
          </div>
        </section>

        {/* Language Section */}
        <section aria-labelledby="language-heading" className="mt-8">
          
          {/* Divider */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-xs font-semibold text-natly-blue-dark sm:text-sm">
            <div className="h-px bg-natly-blue-soft" />
            <h2 id="language-heading">
              {t("sections.exam_mode.subtitle_language")}
            </h2>
            <div className="h-px bg-natly-blue-soft" />
          </div>

          {/* Language Cards */}
          <div 
            role="radiogroup" 
            aria-labelledby="language-heading"
            className="mt-4 grid grid-cols-2 gap-4 max-w-md mx-auto"
          >
            {languages.map((lang) => {
              const isSelected = selectedLanguage === lang.code;
              
              return (
                <button
                  key={lang.code}
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handleLanguageSelect(lang.code)}
                  onKeyDown={(e) => handleKeyDown(e, () => handleLanguageSelect(lang.code))}
                  className={`
                    flex items-center justify-center gap-2
                    px-4 py-3 rounded-lg border-2 font-medium
                    transition-all duration-300
                    focus:outline-none focus:ring-4 focus:ring-natly-yellow/30
                    ${
                      isSelected
                        ? "border-natly-yellow bg-natly-yellow/10 text-natly-blue-dark shadow-md"
                        : "border-gray-300 bg-white text-gray-700 hover:border-natly-blue-soft hover:shadow-sm"
                    }
                  `}
                >
                  <span>{lang.name}</span>
                </button>
              );
            })}
          </div>

          {/* Helper Text */}
          <p className="text-xs text-gray-500 mt-3 text-center max-w-md mx-auto">
            {t("hints.quiz_language_info")}
          </p>
        </section>

        {/* Continue Button */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={continueFlow}
            className="
              px-12 py-4 rounded-xl font-bold text-lg
              bg-natly-yellow text-natly-blue-dark
              shadow-lg shadow-natly-yellow/30
              hover:bg-amber-500 hover:-translate-y-1 hover:shadow-xl
              active:translate-y-0 active:shadow-lg
              transition-all duration-300
              focus:outline-none focus:ring-4 focus:ring-natly-yellow/50
            "
          >
            {tCommon("buttons.continue")}
          </button>
        </div>

      </div>
    </div>
  );
}