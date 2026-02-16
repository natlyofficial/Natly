/**
 * Centralized Exam Versions Configuration
 * 
 * This config is designed for future admin panel integration.
 * Versions can be enabled/disabled without code changes.
 */

export const EXAM_VERSIONS = [
  {
    id: "exam_2025_128",
    name: "2025 Exam Version",
    description: "Practice the 128 questions (New version)",
    totalQuestions: 128,
    active: true,
    isDefault: true,
    jsonFile: "civic-128-questions-2025.json",
  },
  {
    id: "exam_2008_100",
    name: "2008 Exam Version",
    description: "Practice the 100 questions",
    totalQuestions: 100,
    active: true, // 👈 Will be managed via admin panel in future
    isDefault: false,
    jsonFile: "civic-100-questions-2008.json",
  },
] as const;

/* ================================
   Type Exports
================================ */

export type ExamVersionId = typeof EXAM_VERSIONS[number]["id"];
export type ExamVersionConfig = typeof EXAM_VERSIONS[number];

/* ================================
   Helper Functions
================================ */

/**
 * Get all currently active exam versions
 * Filters by active flag (future: will check database/API)
 */
export const getActiveVersions = (): ExamVersionConfig[] => {
  return EXAM_VERSIONS.filter((version) => version.active);
};

/**
 * Get the default exam version
 */
export const getDefaultVersion = (): ExamVersionConfig => {
  const active = getActiveVersions();
  return active.find((v) => v.isDefault) || active[0];
};

/**
 * Get version config by ID
 */
export const getVersionById = (id: ExamVersionId): ExamVersionConfig | undefined => {
  return EXAM_VERSIONS.find((v) => v.id === id);
};

/**
 * Check if a specific version is currently active
 */
export const isVersionActive = (id: ExamVersionId): boolean => {
  return getActiveVersions().some((v) => v.id === id);
};

/* ================================
   Language Support
================================ */

export const SUPPORTED_LANGUAGES = [
  {
    code: "en",
    name: "English",
    flag: "🇺🇸",
    nativeName: "English",
  },
  {
    code: "es",
    name: "Spanish",
    flag: "🇪🇸",
    nativeName: "Español",
  },
] as const;

export type QuizLanguage = typeof SUPPORTED_LANGUAGES[number]["code"];

export const getDefaultLanguage = (): QuizLanguage => "en";

export const getLanguageByCode = (code: QuizLanguage) => {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code);
};