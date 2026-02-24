import { trackEvent, getDeviceInfo } from "./analytics";

/* ================================
   QUIZ EVENTS
================================ */

export const trackQuizStarted = (params: {
  mode: string;
  version: string;
  language: string;
}) => {
  trackEvent("quiz_started", {
    quiz_mode: params.mode,
    exam_version: params.version,
    quiz_language: params.language,
    ...getDeviceInfo(),
  });
};

export const trackQuizCompleted = (params: {
  mode: string;
  version: string;
  score: number;
  totalQuestions: number;
  timeSpent: number; // seconds
  correctAnswers: number;
  incorrectAnswers: number;
}) => {
  const percentage = Math.round((params.score / params.totalQuestions) * 100);
  
  trackEvent("quiz_completed", {
    quiz_mode: params.mode,
    exam_version: params.version,
    score: params.score,
    total_questions: params.totalQuestions,
    percentage,
    time_spent_seconds: params.timeSpent,
    correct_answers: params.correctAnswers,
    incorrect_answers: params.incorrectAnswers,
    passed: percentage >= 60, // 60% es passing score
  });
};

export const trackQuestionAnswered = (params: {
  questionId: number;
  correct: boolean;
  timeSpent: number; // seconds on the question
  hintUsed: boolean;
  answerRevealed: boolean;
  examVersion: string;
}) => {
  trackEvent("question_answered", {
    question_id: params.questionId,
    is_correct: params.correct,
    time_spent_seconds: params.timeSpent,
    hint_used: params.hintUsed,
    answer_revealed: params.answerRevealed,
    exam_version: params.examVersion,
  });
};

export const trackQuizRetried = (params: {
  previousScore: number;
  mode: string;
}) => {
  trackEvent("quiz_retried", {
    previous_score: params.previousScore,
    quiz_mode: params.mode,
  });
};

export const trackQuizAbandoned = (params: {
  mode: string;
  questionsCompleted: number;
  totalQuestions: number;
  currentStep: string;
}) => {
  const completionRate = Math.round(
    (params.questionsCompleted / params.totalQuestions) * 100
  );
  
  trackEvent("quiz_abandoned", {
    quiz_mode: params.mode,
    questions_completed: params.questionsCompleted,
    total_questions: params.totalQuestions,
    completion_rate: completionRate,
    abandoned_at_step: params.currentStep,
  });
};

export const trackHintUsed = (params: {
  questionId: number;
  examVersion: string;
}) => {
  trackEvent("hint_used", {
    question_id: params.questionId,
    exam_version: params.examVersion,
  });
};

export const trackAnswerRevealed = (params: {
  questionId: number;
  examVersion: string;
}) => {
  trackEvent("answer_revealed", {
    question_id: params.questionId,
    exam_version: params.examVersion,
  });
};

/* ================================
   FLASHCARD EVENTS
================================ */

export const trackFlashcardViewed = (params: {
  questionId: number;
  examVersion: string;
  language: string;
}) => {
  trackEvent("flashcard_viewed", {
    question_id: params.questionId,
    exam_version: params.examVersion,
    language: params.language,
  });
};

export const trackFlashcardFlipped = (params: {
  questionId: number;
  timeSpent: number; // tiempo antes de flip
}) => {
  trackEvent("flashcard_flipped", {
    question_id: params.questionId,
    time_before_flip_seconds: params.timeSpent,
  });
};

export const trackFlashcardMarked = (params: {
  questionId: number;
  status: "known" | "hard";
  examVersion: string;
}) => {
  trackEvent("flashcard_marked", {
    question_id: params.questionId,
    marked_as: params.status,
    exam_version: params.examVersion,
  });
};

export const trackAudioPlayed = (params: {
  questionId: number;
  audioType: "question" | "answer";
  language: string;
}) => {
  trackEvent("audio_played", {
    question_id: params.questionId,
    audio_type: params.audioType,
    language: params.language,
  });
};

/* ================================
   NAVIGATION EVENTS
================================ */

export const trackLanguageChanged = (params: {
  from: string;
  to: string;
  context: "navbar" | "quiz" | "flashcard";
}) => {
  trackEvent("language_changed", {
    from_language: params.from,
    to_language: params.to,
    changed_in: params.context,
  });
};

export const trackVersionSwitched = (params: {
  from: string;
  to: string;
  context: "quiz" | "flashcard";
}) => {
  trackEvent("version_switched", {
    from_version: params.from,
    to_version: params.to,
    switched_in: params.context,
  });
};

export const trackPageDropOff = (params: {
  page: string;
  timeSpent: number; // seconds on the page before leaving
  scrollDepth: number; // % de scroll
}) => {
  trackEvent("page_drop_off", {
    page_path: params.page,
    time_on_page_seconds: params.timeSpent,
    scroll_depth_percent: params.scrollDepth,
  });
};

/* ================================
   CONVERSION EVENTS
================================ */

export const trackDonationClicked = (params: {
  amount?: number;
  source: "navbar" | "footer" | "about" | "quiz_complete";
}) => {
  trackEvent("donation_clicked", {
    donation_amount: params.amount,
    click_source: params.source,
  });
};

export const trackUpgradeClicked = (params: {
  feature: string; // "quiz_unlimited" | "audio" | "interview" etc
  source: string; // dónde clickeó
}) => {
  trackEvent("upgrade_clicked", {
    requested_feature: params.feature,
    click_source: params.source,
  });
};

/* ================================
   QUESTION PERFORMANCE TRACKING
================================ */

// storage key para stats de preguntas
const QUESTION_STATS_KEY = "natly_question_performance";

interface QuestionPerformance {
  questionId: number;
  attempts: number;
  correct: number;
  incorrect: number;
  totalTimeSpent: number;
}

export const updateQuestionPerformance = (params: {
  questionId: number;
  correct: boolean;
  timeSpent: number;
}) => {
  const stats = JSON.parse(
    localStorage.getItem(QUESTION_STATS_KEY) || "{}"
  ) as Record<number, QuestionPerformance>;

  if (!stats[params.questionId]) {
    stats[params.questionId] = {
      questionId: params.questionId,
      attempts: 0,
      correct: 0,
      incorrect: 0,
      totalTimeSpent: 0,
    };
  }

  const q = stats[params.questionId];
  q.attempts++;
  if (params.correct) q.correct++;
  else q.incorrect++;
  q.totalTimeSpent += params.timeSpent;

  localStorage.setItem(QUESTION_STATS_KEY, JSON.stringify(stats));

  // Track if question is consistently difficult (e.g. <40% success rate after 3+ attempts)
  const successRate = q.correct / q.attempts;
  if (q.attempts >= 3 && successRate < 0.4) {
    trackEvent("difficult_question_identified", {
      question_id: params.questionId,
      attempts: q.attempts,
      success_rate: Math.round(successRate * 100),
      avg_time_seconds: Math.round(q.totalTimeSpent / q.attempts),
    });
  }
};

export const getQuestionPerformanceData = (): QuestionPerformance[] => {
  const stats = JSON.parse(
    localStorage.getItem(QUESTION_STATS_KEY) || "{}"
  );
  return Object.values(stats);
};

/* ================================
   USER ENGAGEMENT
================================ */

export const trackScrollDepth = (depth: number) => {
  // Just track every 25% scroll to avoid spamming
  if (depth % 25 === 0 && depth > 0) {
    trackEvent("scroll_depth", {
      depth_percent: depth,
      page_path: window.location.pathname,
    });
  }
};

export const trackTimeOnPage = (params: {
  page: string;
  timeSpent: number; // segundos
}) => {
  // Just track if user spends more than 10 seconds to avoid spam
  if (params.timeSpent >= 10) {
    trackEvent("time_on_page", {
      page_path: params.page,
      time_spent_seconds: params.timeSpent,
    });
  }
};

/* ================================
   ERROR TRACKING
================================ */

export const trackError = (params: {
  errorType: string;
  errorMessage: string;
  page: string;
}) => {
  trackEvent("error_occurred", {
    error_type: params.errorType,
    error_message: params.errorMessage,
    page_path: params.page,
  });
};