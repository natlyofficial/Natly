import { useEffect, useState } from "react";
import type { ExamVersion } from "../components/quiz/flow/types";
import {
  getStoredExamVersion,
  setStoredExamVersion,
} from "./examStorage";

export function useExamVersion() {
  const [examVersion, setExamVersionState] =
    useState<ExamVersion>(getStoredExamVersion());

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === "natly_exam_version") {
        setExamVersionState(getStoredExamVersion());
      }
    };

    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const setExamVersion = (v: ExamVersion) => {
    setStoredExamVersion(v);
    setExamVersionState(v);
  };

  return {
    examVersion,
    setExamVersion,
  };
}
