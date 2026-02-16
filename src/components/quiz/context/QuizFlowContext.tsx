import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  useEffect,
} from "react";

import { quizReducer } from "../flow/reducer";
import { createInitialQuizState } from "../flow/state";

import type { QuizState, QuizLanguage } from "../flow/types";
import type { QuizAction } from "../flow/actions";

/* ================================
   Context Types
================================ */

type QuizFlowContextType = {
  state: QuizState;

  selectVersion: (v: any) => void;
  selectMode: (m: any) => void;
  selectLanguage: (l: QuizLanguage) => void;

  continueFlow: () => void;
  startEasy: () => void;

  goBack: () => void;

  closePopup: () => void;
  
  // 🆕 New actions
  restartQuiz: () => void;
  resetFlow: () => void;
};

/* ================================
   Context
================================ */

const QuizFlowContext =
  createContext<QuizFlowContextType | null>(null);

/* ================================
   Provider
================================ */

type ProviderProps = {
  children: ReactNode;
  hasNatlyPlus: boolean;
};

export function QuizFlowProvider({
  children,
  hasNatlyPlus,
}: ProviderProps) {
  const [state, dispatchBase] = useReducer(
    (s: QuizState, a: QuizAction) =>
      quizReducer(s, a, hasNatlyPlus),

    createInitialQuizState(hasNatlyPlus)
  );

  /* ================================
     Helpers
  ================================ */

  const dispatch = (action: QuizAction) =>
    dispatchBase(action);

  /* ================================
     Public API
  ================================ */

  const selectVersion = (version: any) => {
    dispatch({
      type: "SELECT_VERSION",
      version,
    });
  };

  const selectMode = (mode: any) => {
    dispatch({
      type: "SELECT_MODE",
      mode,
    });
  };

  // 🆕 Language selection
  const selectLanguage = (language: QuizLanguage) => {
    dispatch({
      type: "SELECT_LANGUAGE",
      language,
    });
  };

  const continueFlow = () => {
    dispatch({ type: "CONTINUE" });
  };

  const startEasy = () => {
    dispatch({ type: "START_EASY" });
  };

  const goBack = () => {
    dispatch({ type: "BACK" });
  };

  const closePopup = () => {
    dispatch({ type: "CLOSE_LOCKED_POPUP" });
  };

  // 🆕 Restart quiz (same settings, new session)
  const restartQuiz = () => {
    dispatch({ type: "RESTART_QUIZ" });
  };

  // 🆕 Reset entire flow (back to start)
  const resetFlow = () => {
    dispatch({ type: "RESET_FLOW" });
  };

  /* ================================
     (Optional) Persist
  ================================ */

  useEffect(() => {
    localStorage.setItem(
      "natly-quiz-flow",
      JSON.stringify(state)
    );
  }, [state]);

  return (
    <QuizFlowContext.Provider
      value={{
        state,

        selectVersion,
        selectMode,
        selectLanguage,

        continueFlow,
        startEasy,

        goBack,

        closePopup,
        
        restartQuiz,
        resetFlow,
      }}
    >
      {children}
    </QuizFlowContext.Provider>
  );
}

/* ================================
   Hook
================================ */

export function useQuizFlow() {
  const ctx = useContext(QuizFlowContext);

  if (!ctx) {
    throw new Error(
      "useQuizFlow must be used inside QuizFlowProvider"
    );
  }

  return ctx;
}