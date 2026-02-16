/**
 * useQuizSession Hook - FIXED VERSION
 * 
 * 🔧 FIX: Previene sesiones duplicadas y maneja correctamente el retry
 */

import { useState, useCallback, useEffect, useRef } from "react";
import {
  startSession,
  updateSession,
  endSession,
  loadQuizData,
} from "../services/quizStorage";
import type { ExamVersion, PracticeSession } from "../types/quizData";

// 🆕 Extended session type to track incorrect questions
type ExtendedSession = PracticeSession & {
  incorrectQuestionIds?: number[];
};

export const useQuizSession = (
  version: ExamVersion,
  mode: PracticeSession["mode"]
) => {
  const [session, setSession] = useState<ExtendedSession | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const isInitializedRef = useRef(false); // 🆕 Track if already initialized

  /* ================================
     Start session on mount
  ================================ */

  useEffect(() => {
    // 🆕 Prevent creating duplicate sessions
    if (isInitializedRef.current) {
      console.log("Session already initialized, skipping");
      return;
    }

    // 🆕 Check if there's an active session already
    const store = loadQuizData(version);
    const activeSession = store.sessions.find(
      (s) => s.mode === mode && s.endTime === null
    );

    if (activeSession) {
      // Resume existing active session
      console.log("Resuming active session:", activeSession.id);
      setSession({
        ...activeSession,
        incorrectQuestionIds: activeSession.incorrectQuestionIds || [],
      });
      sessionIdRef.current = activeSession.id;
    } else {
      // Create new session
      const newSession = startSession(version, mode);
      console.log("Created new session:", newSession.id);
      setSession({
        ...newSession,
        incorrectQuestionIds: [],
      });
      sessionIdRef.current = newSession.id;
    }

    isInitializedRef.current = true;

    // Cleanup: Reset initialization flag when component unmounts
    return () => {
      isInitializedRef.current = false;
    };
  }, [version, mode]);

  /* ================================
     Record an answer
  ================================ */

  const recordAnswer = useCallback(
    (questionId: number, isCorrect: boolean) => {
      if (!sessionIdRef.current) {
        console.warn("No active session to record answer");
        return;
      }

      try {
        updateSession(version, sessionIdRef.current, {
          questionId,
          isCorrect,
        });

        // Update local state
        setSession((prev) => {
          if (!prev) return prev;

          const newQuestionIds = prev.questionIds.includes(questionId)
            ? prev.questionIds
            : [...prev.questionIds, questionId];

          // 🆕 Track incorrect questions
          const newIncorrectIds = isCorrect
            ? prev.incorrectQuestionIds || []
            : [...(prev.incorrectQuestionIds || []), questionId];

          return {
            ...prev,
            questionIds: newQuestionIds,
            questionsAttempted: newQuestionIds.length,
            correctAnswers: isCorrect
              ? prev.correctAnswers + 1
              : prev.correctAnswers,
            incorrectQuestionIds: newIncorrectIds,
          };
        });

        console.log(`Recorded answer for Q${questionId}: ${isCorrect ? "✓" : "✗"}`);
      } catch (error) {
        console.error("Failed to record answer:", error);
      }
    },
    [version]
  );

  /* ================================
     Finish session
  ================================ */

  const finishSession = useCallback(() => {
    if (!sessionIdRef.current) {
      console.warn("No active session to finish");
      return;
    }

    try {
      console.log("Finishing session:", sessionIdRef.current);
      endSession(version, sessionIdRef.current);

      setSession((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          endTime: new Date().toISOString(),
        };
      });

      // 🆕 Reset initialization flag to allow new session
      isInitializedRef.current = false;
    } catch (error) {
      console.error("Failed to finish session:", error);
    }
  }, [version]);

  /* ================================
     Get session stats
  ================================ */

  const getSessionStats = useCallback(() => {
    if (!session) {
      return {
        score: 0,
        percentage: 0,
        duration: 0,
      };
    }

    const score = session.correctAnswers;
    const percentage =
      session.questionsAttempted > 0
        ? Math.round((session.correctAnswers / session.questionsAttempted) * 100)
        : 0;

    let duration = 0;
    if (session.startTime) {
      const endTime = session.endTime
        ? new Date(session.endTime)
        : new Date();
      const start = new Date(session.startTime);
      duration = Math.floor((endTime.getTime() - start.getTime()) / 1000);
    }

    return { score, percentage, duration };
  }, [session]);

  return {
    session,
    recordAnswer,
    finishSession,
    getSessionStats,
    isActive: session?.endTime === null,
  };
};