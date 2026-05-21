import type { ExamMode, ExamVersion, QuizLanguage } from "./types";

export type QuizAction =
  | { type: "SELECT_VERSION"; version: ExamVersion }
  | { type: "SELECT_MODE"; mode: ExamMode }
  | { type: "SELECT_LANGUAGE"; language: QuizLanguage }
  | { type: "CONTINUE" }
  | { type: "BACK" }
  | { type: "CLOSE_LOCKED_POPUP" }
  | { type: "START_EASY" }
  | { type: "START_QUICKEXAM" }
  | { type: "RESTART_QUIZ" }
  | { type: "RESET_FLOW" };