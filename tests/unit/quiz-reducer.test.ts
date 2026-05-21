// ═══════════════════════════════════════════════════════════════
// QUIZ REDUCER UNIT TESTS
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest';
import { quizReducer } from '../../src/components/quiz/flow/reducer';
import type { QuizState } from '../../src/components/quiz/flow/types';

// ───────────────────────────────────────────────────────────────
// BASE STATE — construido manualmente para no depender de localStorage
// ───────────────────────────────────────────────────────────────

const baseState: QuizState = {
  step: "mode",
  selections: {
    version: "exam_2025_128",
    mode: "easy",
    quizLanguage: "en",
  },
  ui: {
    showLockedPopup: false,
  },
  sessionId: 1000,
  lastQuizStep: null,
};

// Helper para construir estados intermedios limpiamente
function stateAt(step: QuizState["step"], overrides: Partial<QuizState> = {}): QuizState {
  return { ...baseState, step, ...overrides };
}

// ───────────────────────────────────────────────────────────────
// NAVIGATION FLOW — camino principal
// ───────────────────────────────────────────────────────────────

describe('Quiz Reducer — Navigation Flow', () => {

  it('CONTINUE from mode goes to config', () => {
    const result = quizReducer(stateAt("mode"), { type: "CONTINUE" }, false);
    expect(result.step).toBe("config");
  });

  it('CONTINUE from config (easy mode) goes to easy-options', () => {
    const result = quizReducer(stateAt("config"), { type: "CONTINUE" }, false);
    expect(result.step).toBe("easy-options");
  });

  it('CONTINUE from easy-options goes to easy-guide and records lastQuizStep', () => {
    const result = quizReducer(stateAt("easy-options"), { type: "CONTINUE" }, false);
    expect(result.step).toBe("easy-guide");
    expect(result.lastQuizStep).toBe("easy-guide");
  });

  it('CONTINUE from easy-guide goes to results', () => {
    const result = quizReducer(stateAt("easy-guide"), { type: "CONTINUE" }, false);
    expect(result.step).toBe("results");
  });

  it('BACK from config goes to mode', () => {
    const result = quizReducer(stateAt("config"), { type: "BACK" }, false);
    expect(result.step).toBe("mode");
  });

  it('BACK from easy-options goes to config', () => {
    const result = quizReducer(stateAt("easy-options"), { type: "BACK" }, false);
    expect(result.step).toBe("config");
  });

  it('BACK from easy-guide goes to easy-options', () => {
    const result = quizReducer(stateAt("easy-guide"), { type: "BACK" }, false);
    expect(result.step).toBe("easy-options");
  });

  it('BACK from results goes to mode', () => {
    const result = quizReducer(stateAt("results"), { type: "BACK" }, false);
    expect(result.step).toBe("mode");
  });

});

// ───────────────────────────────────────────────────────────────
// QUICK EXAM — flujo nuevo
// ───────────────────────────────────────────────────────────────

describe('Quiz Reducer — Quick Exam Flow', () => {

  it('START_QUICKEXAM sets step to easy-quickexam', () => {
    const result = quizReducer(stateAt("easy-options"), { type: "START_QUICKEXAM" }, false);
    expect(result.step).toBe("easy-quickexam");
  });

  it('START_QUICKEXAM records lastQuizStep as easy-quickexam', () => {
    const result = quizReducer(stateAt("easy-options"), { type: "START_QUICKEXAM" }, false);
    expect(result.lastQuizStep).toBe("easy-quickexam");
  });

  it('START_QUICKEXAM generates a new sessionId', () => {
    const result = quizReducer(stateAt("easy-options"), { type: "START_QUICKEXAM" }, false);
    expect(result.sessionId).not.toBe(baseState.sessionId);
  });

  it('CONTINUE from easy-quickexam goes to results', () => {
    const result = quizReducer(stateAt("easy-quickexam"), { type: "CONTINUE" }, false);
    expect(result.step).toBe("results");
  });

  it('BACK from easy-quickexam goes to easy-options', () => {
    const result = quizReducer(stateAt("easy-quickexam"), { type: "BACK" }, false);
    expect(result.step).toBe("easy-options");
  });

  it('BACK from easy-quickexam does not change lastQuizStep', () => {
    const state = stateAt("easy-quickexam", { lastQuizStep: "easy-quickexam" });
    const result = quizReducer(state, { type: "BACK" }, false);
    expect(result.lastQuizStep).toBe("easy-quickexam");
  });

});

// ───────────────────────────────────────────────────────────────
// RESTART — vuelve al modo correcto
// ───────────────────────────────────────────────────────────────

describe('Quiz Reducer — Restart Behavior', () => {

  it('RESTART_QUIZ with lastQuizStep easy-guide returns to easy-guide', () => {
    const state = stateAt("results", { lastQuizStep: "easy-guide" });
    const result = quizReducer(state, { type: "RESTART_QUIZ" }, false);
    expect(result.step).toBe("easy-guide");
  });

  it('RESTART_QUIZ with lastQuizStep easy-quickexam returns to easy-quickexam', () => {
    const state = stateAt("results", { lastQuizStep: "easy-quickexam" });
    const result = quizReducer(state, { type: "RESTART_QUIZ" }, false);
    expect(result.step).toBe("easy-quickexam");
  });

  it('RESTART_QUIZ with lastQuizStep null falls back to easy-options', () => {
    const state = stateAt("results", { lastQuizStep: null });
    const result = quizReducer(state, { type: "RESTART_QUIZ" }, false);
    expect(result.step).toBe("easy-options");
  });

  it('RESTART_QUIZ always generates a new sessionId', () => {
    const state = stateAt("results", { lastQuizStep: "easy-guide", sessionId: 1000 });
    const result = quizReducer(state, { type: "RESTART_QUIZ" }, false);
    expect(result.sessionId).not.toBe(1000);
  });

  it('RESTART_QUIZ preserves selections (version, language, mode)', () => {
    const state = stateAt("results", {
      lastQuizStep: "easy-guide",
      selections: { version: "exam_2008_100", mode: "easy", quizLanguage: "es" },
    });
    const result = quizReducer(state, { type: "RESTART_QUIZ" }, false);
    expect(result.selections.version).toBe("exam_2008_100");
    expect(result.selections.quizLanguage).toBe("es");
  });

});

// ───────────────────────────────────────────────────────────────
// SELECTIONS — configuración del quiz
// ───────────────────────────────────────────────────────────────

describe('Quiz Reducer — Selections', () => {

  it('SELECT_VERSION updates version', () => {
    const result = quizReducer(baseState, { type: "SELECT_VERSION", version: "exam_2008_100" }, false);
    expect(result.selections.version).toBe("exam_2008_100");
  });

  it('SELECT_VERSION does not change step', () => {
    const result = quizReducer(baseState, { type: "SELECT_VERSION", version: "exam_2008_100" }, false);
    expect(result.step).toBe("mode");
  });

  it('SELECT_LANGUAGE updates quizLanguage', () => {
    const result = quizReducer(baseState, { type: "SELECT_LANGUAGE", language: "es" }, false);
    expect(result.selections.quizLanguage).toBe("es");
  });

  it('SELECT_LANGUAGE does not change step', () => {
    const result = quizReducer(baseState, { type: "SELECT_LANGUAGE", language: "es" }, false);
    expect(result.step).toBe("mode");
  });

});

// ───────────────────────────────────────────────────────────────
// UI — popup de feature bloqueada
// ───────────────────────────────────────────────────────────────

describe('Quiz Reducer — UI State', () => {

  it('SELECT_MODE hard without plus opens locked popup', () => {
    const result = quizReducer(baseState, { type: "SELECT_MODE", mode: "hard" }, false);
    expect(result.ui.showLockedPopup).toBe(true);
    expect(result.step).toBe("mode"); // No avanza
  });

  it('SELECT_MODE easy without plus does not open popup', () => {
    const result = quizReducer(baseState, { type: "SELECT_MODE", mode: "easy" }, false);
    expect(result.ui.showLockedPopup).toBe(false);
  });

  it('CLOSE_LOCKED_POPUP hides popup', () => {
    const state = { ...baseState, ui: { showLockedPopup: true } };
    const result = quizReducer(state, { type: "CLOSE_LOCKED_POPUP" }, false);
    expect(result.ui.showLockedPopup).toBe(false);
  });

});

// ───────────────────────────────────────────────────────────────
// IMMUTABILITY — el reducer no muta el estado original
// ───────────────────────────────────────────────────────────────

describe('Quiz Reducer — Immutability', () => {

  it('does not mutate the original state', () => {
    const original = { ...baseState };
    quizReducer(baseState, { type: "CONTINUE" }, false);
    expect(baseState.step).toBe(original.step);
    expect(baseState.sessionId).toBe(original.sessionId);
    expect(baseState.lastQuizStep).toBe(original.lastQuizStep);
  });

  it('returns the same reference on unknown action', () => {
    // @ts-expect-error — probando acción desconocida intencionalmente
    const result = quizReducer(baseState, { type: "UNKNOWN_ACTION" }, false);
    expect(result).toBe(baseState);
  });

});