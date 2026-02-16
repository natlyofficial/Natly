/**
 * Question Helpers
 * 
 * Utility functions to work with question data
 */

import civic100 from "../data/civic-100-questions-2008.json";
import civic128 from "../data/civic-128-questions-2025.json";
import type { ExamVersion } from "../types/quizData";

type QuizLanguage = "en" | "es";

interface Question {
  id: number;
  languages: {
    en: {
      question: string;
      correct: string[];
      distractors: string[];
    };
    es: {
      question: string;
      correct: string[];
      distractors: string[];
    };
  };
}

/**
 * Get all questions for a specific exam version
 */
export function getQuestionsForVersion(version: ExamVersion): Question[] {
  return version === "exam_2025_128" 
    ? (civic128 as Question[]) 
    : (civic100 as Question[]);
}

/**
 * Get a specific question by ID
 */
export function getQuestionById(
  questionId: number,
  version: ExamVersion
): Question | null {
  const questions = getQuestionsForVersion(version);
  return questions.find(q => q.id === questionId) || null;
}

/**
 * Get question text by ID and language
 * Returns the question text or null if not found
 */
export function getQuestionText(
  questionId: number,
  version: ExamVersion,
  language: QuizLanguage
): string | null {
  const question = getQuestionById(questionId, version);
  
  if (!question) {
    return null;
  }

  return question.languages[language]?.question || null;
}

/**
 * Get truncated question text (useful for previews)
 */
export function getTruncatedQuestionText(
  questionId: number,
  version: ExamVersion,
  language: QuizLanguage,
  maxLength: number = 100
): string | null {
  const text = getQuestionText(questionId, version, language);
  
  if (!text) {
    return null;
  }

  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength) + "...";
}

/**
 * Get question with all details
 */
export function getQuestionDetails(
  questionId: number,
  version: ExamVersion,
  language: QuizLanguage
) {
  const question = getQuestionById(questionId, version);
  
  if (!question) {
    return null;
  }

  const langData = question.languages[language];
  
  return {
    id: question.id,
    question: langData.question,
    correctAnswers: langData.correct,
    incorrectAnswers: langData.distractors,
  };
}

export function getCorrectAnswer(
  questionId: number,
  version: ExamVersion,
  language: QuizLanguage
): string | null {
  const question = getQuestionById(questionId, version);
  if (!question) return null;
  return question.languages[language]?.correct[0] || null;
}

export function getAllCorrectAnswers(
  questionId: number,
  version: ExamVersion,
  language: QuizLanguage
): string[] {
  const question = getQuestionById(questionId, version);
  if (!question) return [];
  return question.languages[language]?.correct || [];
}