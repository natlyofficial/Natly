export interface Flashcard {
  id: number;
  order: number;
  version: string;
  country: string;
  category: string;
  illustration: string;

  languages: {
    es: {
      question: string;
      correct: string[];
      distractors: string[];
      audioQuestion: string;
      audioAnswer: string;
      hints: string[];
    };
    en: {
      question: string;
      correct: string[];
      distractors: string[];
      audioQuestion: string;
      audioAnswer: string;
      hints: string[];
    };
  };
}
