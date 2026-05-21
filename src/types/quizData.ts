/**
 * Quiz Data Type Definitions
 * 
 * This file contains all TypeScript types for the quiz data system.
 * Centralized types ensure consistency across the application.
 */

/* ================================
   Exam Version
================================ */

export type ExamVersion = "exam_2025_128" | "exam_2008_100";

/* ================================
   Question Flags
   User-controlled markers for organizing questions
================================ */

export type QuestionFlags = {
  /** User marked this question as "known/mastered" */
  known: boolean;
  
  /** User marked this question as "hard/difficult" */
  hard: boolean;
  
  /** User saved this question for later review */
  save: boolean;
};

/* ================================
   Question Statistics
   Auto-tracked performance metrics
================================ */

export type QuestionStats = {
  /** Number of times answered correctly */
  correct: number;
  
  /** Number of times answered incorrectly */
  incorrect: number;
  
  /** Total attempts (correct + incorrect) */
  totalAttempts: number;
  
  /** ISO timestamp of most recent attempt */
  lastAttempt: string | null;
  
  /** ISO timestamp of first attempt */
  firstAttempt: string | null;
  
  /** Number of times hint was used */
  hintUsed: number;
  
  /** Number of times answer was revealed */
  answerRevealed: number;
  
  /** Current consecutive correct answers */
  streak: number;
  
  /** Highest streak ever achieved */
  bestStreak: number;
};

/* ================================
   Question Data
   Complete data for a single question
================================ */

export type QuestionData = {
  flags: QuestionFlags;
  stats: QuestionStats;
};

/* ================================
   Practice Session
   Record of a single practice session
================================ */

export type PracticeSession = {
  /** Unique session identifier (timestamp) */
  id: string;
  
  /** ISO timestamp when session started */
  startTime: string;
  
  /** ISO timestamp when session ended */
  endTime: string | null;
  
  /** Quiz mode used */
  mode: "easy-guide" | "easy-quickexam" | "by-topic" | "flashcards";
  
  /** Number of questions attempted in this session */
  questionsAttempted: number;
  
  /** Number of correct answers in this session */
  correctAnswers: number;
  
  /** Question IDs attempted in this session */
  questionIds: number[];

   /** 🆕 Optional: Track incorrectly answered question IDs for review */
  incorrectQuestionIds?: number[];
};

/* ================================
   Metadata
   Global information about quiz progress
================================ */

export type QuizMeta = {
  /** ISO timestamp of last practice activity */
  lastPracticed: string | null;
  
  /** Total number of practice sessions completed */
  totalSessions: number;
  
  /** Data structure version (for migrations) */
  version: string;
  
  /** Total time spent practicing (seconds) - future */
  totalTimeSeconds?: number;
};

/* ================================
   Complete Data Store
   Root structure for localStorage
================================ */

export type QuizDataStore = {
  /** Question data indexed by question ID */
  questions: Record<string, QuestionData>;
  
  /** Array of practice sessions */
  sessions: PracticeSession[];
  
  /** Global metadata */
  meta: QuizMeta;
};

/* ================================
   Overall Statistics
   Computed analytics from stored data
================================ */

export type OverallStats = {
  totalCorrect: number;
  totalIncorrect: number;
  totalAttempts: number;
  accuracy: number;
  knownCount: number;
  hardCount: number;
  savedCount: number;
  totalHintsUsed: number;
  totalAnswersRevealed: number;
  questionsAttempted: number;
  lastPracticed: string | null;
  averageSessionScore: number;
  totalSessions: number;
  currentStreak: number;
  longestStreak: number;
};

/* ================================
   Update Payloads
   Data passed to update functions
================================ */

export type StatsUpdate = {
  /** Was the answer correct? */
  isCorrect?: boolean;
  
  /** Was hint used for this attempt? */
  hintUsed?: boolean;
  
  /** Was answer revealed? */
  answerRevealed?: boolean;
};

export type FlagsUpdate = Partial<QuestionFlags>;

export type SessionUpdate = Partial<PracticeSession>;
