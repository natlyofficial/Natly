import type { ExamMode } from "./types";

export function canSelectMode(mode: ExamMode, hasNatlyPlus: boolean) {
  if (mode === "hard") return false; // coming soon
  if (mode === "interview" && !hasNatlyPlus) return false;
  return true;
}