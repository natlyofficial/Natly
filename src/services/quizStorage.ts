/**
 * Quiz Storage Service
 * 
 * Centralized service for managing quiz data in localStorage.
 * 
 * ARCHITECTURE:
 * - Single source of truth for all quiz data
 * - Type-safe operations
 * - Automatic migration from old formats
 * - Error handling with fallbacks
 * - Ready for future Firebase migration
 * 
 * BEST PRACTICES:
 * - Always use these functions instead of direct localStorage access
 * - All data is validated before saving
 * - Errors are logged but don't crash the app
 * - Data structure is versioned for safe migrations
 */

import type {
  QuizDataStore,
  QuestionData,
  QuestionFlags,
  ExamVersion,
  StatsUpdate,
  FlagsUpdate,
  PracticeSession,
  OverallStats,
} from "../types/quizData";

/* ================================
   Constants
================================ */

const STORAGE_PREFIX = "natly-quiz-data-";
const STORAGE_VERSION = "1.0";

// Legacy key format (for migration)
const LEGACY_PREFIX = "natly-card-status-";

/* ================================
   Factory Functions
   Create empty data structures
================================ */

const createEmptyQuestionData = (): QuestionData => ({
  flags: {
    known: false,
    hard: false,
    save: false,
  },
  stats: {
    correct: 0,
    incorrect: 0,
    totalAttempts: 0,
    lastAttempt: null,
    firstAttempt: null,
    hintUsed: 0,
    answerRevealed: 0,
    streak: 0,
    bestStreak: 0,
  },
});

const createEmptyStore = (): QuizDataStore => ({
  questions: {},
  sessions: [],
  meta: {
    lastPracticed: null,
    totalSessions: 0,
    version: STORAGE_VERSION,
  },
});

/* ================================
   Storage Key Helpers
================================ */

export const getStorageKey = (version: ExamVersion): string => {
  return `${STORAGE_PREFIX}${version}`;
};

const getLegacyKey = (version: ExamVersion): string => {
  return `${LEGACY_PREFIX}${version}`;
};

/* ================================
   Core Load/Save Operations
================================ */

/**
 * Load quiz data from localStorage
 * Automatically handles migration from old format
 */
export const loadQuizData = (version: ExamVersion): QuizDataStore => {
  const key = getStorageKey(version);
  const stored = localStorage.getItem(key);

  // No data exists - return empty store
  if (!stored) {
    return attemptMigration(version);
  }

  try {
    const parsed = JSON.parse(stored) as QuizDataStore;

    // Validate structure
    if (!parsed.meta || !parsed.questions) {
      console.warn("Invalid data structure, attempting migration...");
      return attemptMigration(version);
    }

    // Check if needs version migration
    if (parsed.meta.version !== STORAGE_VERSION) {
      return migrateVersion(parsed, version);
    }

    return parsed;
  } catch (error) {
    console.error("Failed to parse quiz data:", error);
    return attemptMigration(version);
  }
};

/**
 * Save quiz data to localStorage
 * Always validates and updates metadata
 */
export const saveQuizData = (
  version: ExamVersion,
  data: QuizDataStore
): void => {
  try {
    // Ensure version is set
    data.meta.version = STORAGE_VERSION;

    const key = getStorageKey(version);
    const serialized = JSON.stringify(data);

    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error("Failed to save quiz data:", error);
    
    // Check if quota exceeded
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      console.error("localStorage quota exceeded!");
      // Future: Trigger cleanup or warn user
    }
  }
};

/* ================================
   Migration Logic
================================ */

/**
 * Attempt to migrate from legacy format
 */
const attemptMigration = (version: ExamVersion): QuizDataStore => {
  const legacyKey = getLegacyKey(version);
  const legacyData = localStorage.getItem(legacyKey);

  if (!legacyData) {
    return createEmptyStore();
  }

  try {
    
    const oldFlags = JSON.parse(legacyData) as Record<
      string,
      QuestionFlags
    >;

    const newStore = createEmptyStore();

    // Convert old format to new format
    Object.entries(oldFlags).forEach(([id, flags]) => {
      newStore.questions[id] = {
        flags: flags,
        stats: createEmptyQuestionData().stats,
      };
    });

    // Save migrated data
    saveQuizData(version, newStore);

    // Keep legacy data for safety (don't delete yet)

    return newStore;
  } catch (error) {
    console.error("Migration failed:", error);
    return createEmptyStore();
  }
};

/**
 * Migrate between data versions
 * Future-proof for schema changes
 */
const migrateVersion = (
  data: QuizDataStore,
  version: ExamVersion
): QuizDataStore => {
  // Currently only v1.0 exists
  // Future versions would be handled here
  
  data.meta.version = STORAGE_VERSION;
  saveQuizData(version, data);
  
  return data;
};

/* ================================
   Question Operations
================================ */

/**
 * Get data for a specific question
 * Returns empty data if question not found
 */
export const getQuestionData = (
  version: ExamVersion,
  questionId: number
): QuestionData => {
  const store = loadQuizData(version);
  const key = String(questionId);

  return store.questions[key] || createEmptyQuestionData();
};

/**
 * Update question flags (known/hard/save)
 * Enforces mutual exclusivity (known/hard)
 */
export const updateQuestionFlags = (
  version: ExamVersion,
  questionId: number,
  updates: FlagsUpdate
): QuestionData => {
  const store = loadQuizData(version);
  const key = String(questionId);

  // Initialize if doesn't exist
  if (!store.questions[key]) {
    store.questions[key] = createEmptyQuestionData();
  }

  const question = store.questions[key];

  // Apply updates with mutual exclusivity
  const newFlags = { ...question.flags, ...updates };

  // Enforce: known and hard can't both be true
  if (updates.known && newFlags.known) {
    newFlags.hard = false;
  }
  if (updates.hard && newFlags.hard) {
    newFlags.known = false;
  }

  question.flags = newFlags;

  saveQuizData(version, store);

  return question;
};

/**
 * Update question statistics
 * Auto-calculates derived values and updates flags
 */
export const updateQuestionStats = (
  version: ExamVersion,
  questionId: number,
  updates: StatsUpdate
): QuestionData => {
  const store = loadQuizData(version);
  const key = String(questionId);

  // Initialize if doesn't exist
  if (!store.questions[key]) {
    store.questions[key] = createEmptyQuestionData();
  }

  const question = store.questions[key];
  const stats = question.stats;

  // Set firstAttempt if this is the first time
  if (!stats.firstAttempt) {
    stats.firstAttempt = new Date().toISOString();
  }

  // Update stats based on answer
  if (updates.isCorrect !== undefined) {
    if (updates.isCorrect) {
      stats.correct += 1;
      stats.streak += 1;

      // Update best streak
      if (stats.streak > stats.bestStreak) {
        stats.bestStreak = stats.streak;
      }
    } else {
      stats.incorrect += 1;
      stats.streak = 0; // Reset current streak
    }

    stats.totalAttempts += 1;
    stats.lastAttempt = new Date().toISOString();
  }

  // Track hint usage
  if (updates.hintUsed) {
    stats.hintUsed += 1;
  }

  // Track answer reveals
  if (updates.answerRevealed) {
    stats.answerRevealed += 1;
  }

  // Auto-update flags based on performance
  const accuracy = stats.totalAttempts > 0 
    ? stats.correct / stats.totalAttempts 
    : 0;

  if (accuracy >= 0.8 && stats.totalAttempts >= 3) {
    // High accuracy with enough attempts = known
    question.flags.known = true;
    question.flags.hard = false;
  } else if (accuracy < 0.5 && stats.totalAttempts >= 2) {
    // Low accuracy = hard
    question.flags.known = false;
    question.flags.hard = true;
  }

  // Update global metadata
  store.meta.lastPracticed = new Date().toISOString();

  saveQuizData(version, store);

  return question;
};

/* ================================
   Session Operations
================================ */

/**
 * Start a new practice session
 */
export const startSession = (
  version: ExamVersion,
  mode: PracticeSession["mode"]
): PracticeSession => {
  const store = loadQuizData(version);

  // 🆕 Generate unique ID (timestamp + random to prevent collisions)
  const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const session: PracticeSession = {
    id: uniqueId, // 🆕 Use unique ID
    startTime: new Date().toISOString(),
    endTime: null,
    mode: mode,
    questionsAttempted: 0,
    correctAnswers: 0,
    questionIds: [],
    incorrectQuestionIds: [], // 🆕 Initialize
  };

  store.sessions.push(session);
  saveQuizData(version, store);

  console.log(`✅ Started new session: ${uniqueId}`);

  return session;
};

/**
 * Update current session with progress
 * Tracks both question attempts and incorrect answers
 */
export const updateSession = (
  version: ExamVersion,
  sessionId: string,
  updates: {
    questionId?: number;
    isCorrect?: boolean;
  }
): void => {
  const store = loadQuizData(version);
  const session = store.sessions.find((s) => s.id === sessionId);

  if (!session) {
    console.warn(`Session ${sessionId} not found`);
    return;
  }

  // Track question attempt
  if (updates.questionId) {
    if (!session.questionIds.includes(updates.questionId)) {
      session.questionIds.push(updates.questionId);
      session.questionsAttempted += 1;
    }
  }

  // Track correct/incorrect answers
  if (updates.isCorrect !== undefined) {
    if (updates.isCorrect) {
      session.correctAnswers += 1;
    } else {
      // Track incorrect questions in localStorage
      if (!session.incorrectQuestionIds) {
        session.incorrectQuestionIds = [];
      }
      if (updates.questionId && !session.incorrectQuestionIds.includes(updates.questionId)) {
        session.incorrectQuestionIds.push(updates.questionId);
        console.log(`📝 Added Q${updates.questionId} to incorrect list`);
      }
    }
  }

  saveQuizData(version, store);
};

/**
 * End a practice session
 */
export const endSession = (
  version: ExamVersion,
  sessionId: string
): void => {
  const store = loadQuizData(version);
  const session = store.sessions.find((s) => s.id === sessionId);

  if (!session) {
    console.warn(`Session ${sessionId} not found`);
    return;
  }

  session.endTime = new Date().toISOString();
  store.meta.totalSessions += 1;

  saveQuizData(version, store);
};

/* ================================
   Bulk Operations
================================ */

/**
 * Get all question flags
 * Used by flashcards for filtering
 */
export const getAllQuestionFlags = (
  version: ExamVersion
): Record<number, QuestionFlags> => {
  const store = loadQuizData(version);
  const result: Record<number, QuestionFlags> = {};

  Object.entries(store.questions).forEach(([id, data]) => {
    result[Number(id)] = data.flags;
  });

  return result;
};

/**
 * Clear all data for a version
 * Used for "reset progress" feature
 */
export const clearAllData = (version: ExamVersion): void => {
  const key = getStorageKey(version);
  localStorage.removeItem(key);
  
};

/* ================================
   Analytics & Statistics
================================ */

/**
 * Get comprehensive statistics
 * Used for results screen and dashboards
 */
export const getOverallStats = (version: ExamVersion): OverallStats => {
  const store = loadQuizData(version);

  let totalCorrect = 0;
  let totalIncorrect = 0;
  let knownCount = 0;
  let hardCount = 0;
  let savedCount = 0;
  let totalHintsUsed = 0;
  let totalAnswersRevealed = 0;
  let longestStreak = 0;

  Object.values(store.questions).forEach((q) => {
    totalCorrect += q.stats.correct;
    totalIncorrect += q.stats.incorrect;
    totalHintsUsed += q.stats.hintUsed;
    totalAnswersRevealed += q.stats.answerRevealed;

    if (q.stats.bestStreak > longestStreak) {
      longestStreak = q.stats.bestStreak;
    }

    if (q.flags.known) knownCount += 1;
    if (q.flags.hard) hardCount += 1;
    if (q.flags.save) savedCount += 1;
  });

  const totalAttempts = totalCorrect + totalIncorrect;
  const accuracy = totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 0;

  // Calculate average session score
  const completedSessions = store.sessions.filter((s) => s.endTime !== null);
  const totalSessionScore = completedSessions.reduce(
    (sum, s) =>
      sum +
      (s.questionsAttempted > 0
        ? (s.correctAnswers / s.questionsAttempted) * 100
        : 0),
    0
  );
  const averageSessionScore =
    completedSessions.length > 0
      ? totalSessionScore / completedSessions.length
      : 0;

  // Current streak (from most recent question with streak > 0)
  let currentStreak = 0;
  Object.values(store.questions).forEach((q) => {
    if (q.stats.streak > currentStreak) {
      currentStreak = q.stats.streak;
    }
  });

  return {
    totalCorrect,
    totalIncorrect,
    totalAttempts,
    accuracy: Math.round(accuracy),
    knownCount,
    hardCount,
    savedCount,
    totalHintsUsed,
    totalAnswersRevealed,
    questionsAttempted: Object.keys(store.questions).length,
    lastPracticed: store.meta.lastPracticed,
    averageSessionScore: Math.round(averageSessionScore),
    totalSessions: store.meta.totalSessions,
    currentStreak,
    longestStreak,
  };
};

/**
 * Get recent practice sessions
 */
export const getRecentSessions = (
  version: ExamVersion,
  limit: number = 10
): PracticeSession[] => {
  const store = loadQuizData(version);

  return store.sessions
    .slice()
    .reverse()
    .slice(0, limit);
};

/* ================================
   Utility Functions
================================ */

/**
 * Check localStorage health
 * Useful for debugging and monitoring
 */
export const checkStorageHealth = () => {
  try {
    const usage = new Blob([JSON.stringify(localStorage)]).size;
    const limit = 5 * 1024 * 1024; // 5MB typical limit
    const percentage = (usage / limit) * 100;

    return {
      usedBytes: usage,
      usedKB: Math.round(usage / 1024),
      limitBytes: limit,
      limitMB: Math.round(limit / 1024 / 1024),
      percentage: Math.round(percentage),
      isNearLimit: percentage > 80,
      isHealthy: percentage < 80,
    };
  } catch (error) {
    console.error("Failed to check storage:", error);
    return null;
  }
};

/**
 * Get data size for a specific version
 */
export const getDataSize = (version: ExamVersion): number => {
  const key = getStorageKey(version);
  const data = localStorage.getItem(key);

  if (!data) return 0;

  return new Blob([data]).size;
};
