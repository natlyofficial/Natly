import { useEffect, useState } from "react";
import civic100 from "../data/civic-100-questions-2008.json";
import civic128 from "../data/civic-128-questions-2025.json";

type Question = any;

function shuffle<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function useEasyPractice(
  examVersion: "exam_2008_100" | "exam_2025_128",
  sessionId?: number
) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const source =
      examVersion === "exam_2025_128"
        ? civic128
        : civic100;

    const selected = shuffle(source).slice(0, 10);

    setQuestions(selected);
    setIndex(0);
  }, [examVersion, sessionId]);

  const next = () => {
    if (index < 9) {
      setIndex(v => v + 1);
    }
  };

  return {
    questions,
    current: questions[index],
    index,
    next,
    total: 10,
    done: index === 9,
  };
}
