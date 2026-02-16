import type { ExamVersion } from "../components/quiz/flow/types";

const EXAM_KEY = "natly_exam_version";

export function getStoredExamVersion(): ExamVersion {
  const value = localStorage.getItem(EXAM_KEY);

  if (
    value === "exam_2025_128" ||
    value === "exam_2008_100"
  ) {
    return value;
  }

  // Default → 128 (2025)
  return "exam_2025_128";
}

export function setStoredExamVersion(
  version: ExamVersion
) {
  localStorage.setItem(EXAM_KEY, version);
}
