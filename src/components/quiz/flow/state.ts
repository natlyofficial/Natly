import type { QuizState } from "./types";
import { getStoredExamVersion } from "../../../utils/examStorage";
import type { QuizLanguage } from "../../../config/examVersions";

export const createInitialQuizState = (
  hasNatlyPlus: boolean
): QuizState => {
  
  // Read saved exam version from localStorage using existing storage system
  const defaultVersion = getStoredExamVersion();

  // Read saved quiz language from localStorage
  const savedLanguage = localStorage.getItem("natly-selected-quiz-language") as QuizLanguage | null;
  const defaultLanguage: QuizLanguage = 
    (savedLanguage === "en" || savedLanguage === "es")
      ? savedLanguage
      : "en";

  console.log(`🎯 Initial quiz state: version=${defaultVersion}, language=${defaultLanguage}, plus=${hasNatlyPlus}`);

  return {
    step: "mode",
    selections: {
      version: defaultVersion,
      mode: "easy",
      quizLanguage: defaultLanguage,
    },
    ui: {
      showLockedPopup: false,
    },
  };
};