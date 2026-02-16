/**
 * useQuestionFlags Hook
 * 
 * React hook for managing question flags (known/hard/save)
 * Integrates with the centralized storage service
 * 
 * USAGE:
 * ```tsx
 * const { flags, toggleFlag } = useQuestionFlags(examVersion);
 * 
 * // Check if question is marked as known
 * const isKnown = flags[questionId]?.known;
 * 
 * // Toggle flag
 * toggleFlag(questionId, 'known');
 * ```
 */

import { useState, useEffect, useCallback } from "react";
import {
  getAllQuestionFlags,
  updateQuestionFlags,
} from "../services/quizStorage";
import type { ExamVersion, QuestionFlags } from "../types/quizData";

export const useQuestionFlags = (version: ExamVersion) => {
  const [flags, setFlags] = useState<Record<number, QuestionFlags>>({});
  const [isLoading, setIsLoading] = useState(true);

  /* ================================
     Load flags on mount and version change
  ================================ */

  useEffect(() => {
    setIsLoading(true);
    
    try {
      const loaded = getAllQuestionFlags(version);
      setFlags(loaded);
    } catch (error) {
      console.error("Failed to load question flags:", error);
      setFlags({});
    } finally {
      setIsLoading(false);
    }
  }, [version]);

  /* ================================
     Toggle flag helper
  ================================ */

  const toggleFlag = useCallback(
    (questionId: number, flag: keyof QuestionFlags) => {
      try {
        // Get current state
        const current = flags[questionId] || {
          known: false,
          hard: false,
          save: false,
        };

        // Determine new value
        const newValue = !current[flag];

        // Update in storage (handles mutual exclusivity)
        const updated = updateQuestionFlags(version, questionId, {
          [flag]: newValue,
        });

        // Update local state
        setFlags((prev) => ({
          ...prev,
          [questionId]: updated.flags,
        }));
      } catch (error) {
        console.error("Failed to toggle flag:", error);
      }
    },
    [version, flags]
  );

  /* ================================
     Get flag for specific question
  ================================ */

  const getFlag = useCallback(
    (questionId: number, flag: keyof QuestionFlags): boolean => {
      return flags[questionId]?.[flag] || false;
    },
    [flags]
  );

  /* ================================
     Check if any flag is set for question
  ================================ */

  const hasAnyFlag = useCallback(
    (questionId: number): boolean => {
      const questionFlags = flags[questionId];
      if (!questionFlags) return false;

      return questionFlags.known || questionFlags.hard || questionFlags.save;
    },
    [flags]
  );

  /* ================================
     Get counts
  ================================ */

  const getCounts = useCallback(() => {
    let knownCount = 0;
    let hardCount = 0;
    let savedCount = 0;

    Object.values(flags).forEach((f) => {
      if (f.known) knownCount++;
      if (f.hard) hardCount++;
      if (f.save) savedCount++;
    });

    return { knownCount, hardCount, savedCount };
  }, [flags]);

  return {
    flags,
    isLoading,
    toggleFlag,
    getFlag,
    hasAnyFlag,
    getCounts,
  };
};
