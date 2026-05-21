export type ExamVersion =
  | "exam_2025_128"
  | "exam_2008_100";

export type ExamMode = "easy" | "hard" | "interview";

export type QuizLanguage = "en" | "es";

export type QuizStep =
  | "mode"
  | "config"
  | "easy-options"
  | "easy-guide"
  | "easy-quickexam"
  | "results";
// futuro:
// | "hard-options"
// | "interview-guide"
// | "quiz"
// | "results";

export type QuizContext = {
  hasNatlyPlus: boolean;
};

export type QuizSelections = {
  version: ExamVersion;
  mode: ExamMode;
  quizLanguage: QuizLanguage;
};

export type QuizState = {
  step: QuizStep;
  selections: QuizSelections;
  ui: {
    showLockedPopup: boolean;
  };
  sessionId: number;
  lastQuizStep: "easy-guide" | "easy-quickexam" | null;
};