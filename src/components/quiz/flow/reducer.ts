import type { QuizAction } from "./actions";
import type { QuizState } from "./types";
import { canSelectMode } from "./engine";
import { createInitialQuizState } from "./state";

export function quizReducer(
  state: QuizState,
  action: QuizAction,
  hasNatlyPlus: boolean
): QuizState {
  switch (action.type) {
    case "SELECT_VERSION":
      return {
        ...state,
        selections: {
          ...state.selections,
          version: action.version,
        },
      };

    case "SELECT_MODE": {
      const allowed = canSelectMode(action.mode, hasNatlyPlus);

      if (!allowed) {
        return {
          ...state,
          ui: { ...state.ui, showLockedPopup: true },
        };
      }

      return {
        ...state,
        selections: {
          ...state.selections,
          mode: action.mode,
        },
      };
    }

    // Handle language selection
    case "SELECT_LANGUAGE":
      return {
        ...state,
        selections: {
          ...state.selections,
          quizLanguage: action.language,
        },
      };

    case "CLOSE_LOCKED_POPUP":
      return {
        ...state,
        ui: { ...state.ui, showLockedPopup: false },
      };

    case "CONTINUE": {
      switch (state.step) {
        case "mode":
          return { ...state, step: "config" };

        case "config":
          if (state.selections.mode === "easy") {
            return { ...state, step: "easy-options" };
          }
          return state;

        case "easy-options":
          return { ...state, step: "easy-guide" };

        case "easy-guide":
          // Quiz finished, go to results
          return { ...state, step: "results" };

        default:
          return state;
      }
    }

    case "BACK": {
      // centralized back behavior
      switch (state.step) {
        case "config":
          return { ...state, step: "mode" };
        case "easy-options":
          return { ...state, step: "config" };
        case "easy-guide":
          return { ...state, step: "easy-options" };
        case "results":
          return { ...state, step: "mode" };
        default:
          return state;
      }
    }

    // 🆕 Restart quiz (same settings, new session)
    case "RESTART_QUIZ":
      return {
        ...state,
        step: "easy-options", // Go back to practice type selection
      };

    // 🆕 Reset entire flow (back to start)
    case "RESET_FLOW":
      return createInitialQuizState(hasNatlyPlus);

    default:
      return state;
  }
}