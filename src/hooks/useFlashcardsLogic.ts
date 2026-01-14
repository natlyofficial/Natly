import { useEffect, useState } from "react";
import civic100 from "../data/civic-100-questions-2008.json";
import civic128 from "../data/civic-128-questions-2025.json";
import { CIVIC_CATEGORIES } from "../data/civicCategories";
import i18n from "../i18n";

import defaultImg from "../assets/question/noimage.png";

/* -----------------------------------------
   Types
----------------------------------------- */
export type LanguageCode = "en" | "es";
export type LangMode = LanguageCode | "both";

interface LanguageBlock {
  question: string;
  correct: string[];
  distractors: string[];
  audioQuestion: string;
  audioAnswer: string;
  hints: string[];
}

interface Flashcard {
  id: number;
  order: number;
  version: string;
  country: string;
  category: string;
  subcategory: string;
  illustration: string;
  isSpecial65_20: boolean;
  languages: Record<LanguageCode, LanguageBlock>;
}

type CardFlags = {
  known: boolean;
  hard: boolean;
  save: boolean;
};

type CardStatusMap = Record<number, CardFlags>;

/* -----------------------------------------
   Fallback card
----------------------------------------- */
const NO_RESULTS_CARD: Flashcard = {
  id: -1,
  order: 0,
  version: "none",
  country: "none",
  category: "none",
  subcategory: "none",
  illustration: "noimage.png",
  isSpecial65_20: false,
  languages: {
    en: {
      question: "No results found",
      correct: [],
      distractors: [],
      audioQuestion: "",
      audioAnswer: "",
      hints: ["Try another search term"],
    },
    es: {
      question: "No se encontraron resultados",
      correct: [],
      distractors: [],
      audioQuestion: "",
      audioAnswer: "",
      hints: ["Prueba otra palabra de búsqueda"],
    },
  },
};

const getCardStatusKey = (examVersion: "100" | "128") =>
  `natly-card-status-${examVersion}`;

/* -----------------------------------------
   Hook
----------------------------------------- */
export function useFlashcardsLogic(examVersion: "100" | "128") {
  const flashcards: Flashcard[] =
    examVersion === "128"
      ? (civic128 as Flashcard[])
      : (civic100 as Flashcard[]);

  const dynamicCategories = CIVIC_CATEGORIES[examVersion];

  useEffect(() => {
    const validCategoryIds = dynamicCategories.map(c => c.id);

    if (
      filters.category !== "all" &&
      !validCategoryIds.includes(filters.category)
    ) {
      setFilters({
        category: "all",
        range: { min: 1, max: flashcards.length },
      });
    }
  }, [examVersion, dynamicCategories]);

  const [index, setIndex] = useState<number>(0);
  const [langMode, setLangMode] = useState<LangMode>("en");

  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [hintIndex, setHintIndex] = useState<number>(0);

  const [filteredCards, setFilteredCards] =
    useState<Flashcard[]>(flashcards);

  const [showMobileSearch, setShowMobileSearch] = useState<boolean>(false);
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState<string>("");

  const [filters, setFilters] = useState<{
    category: string;
    range: { min: number; max: number };
  }>({
    category: "all",
    range: { min: 1, max: flashcards.length },
  });

  const [statusFilters, setStatusFilters] = useState<CardFlags>({
    known: false,
    hard: false,
    save: false,
  });

  const hasResults = filteredCards.length > 0;

  const card: Flashcard = hasResults
    ? filteredCards[index]
    : NO_RESULTS_CARD;

  const total = Math.max(filteredCards.length, 1);

  const [cardStatus, setCardStatus] = useState<CardStatusMap>(() => {
    const saved = localStorage.getItem(getCardStatusKey(examVersion));
    return saved ? (JSON.parse(saved) as CardStatusMap) : {};
  });

  /* -----------------------------------------
     Persist status
  ----------------------------------------- */
  useEffect(() => {
    localStorage.setItem(
      getCardStatusKey(examVersion),
      JSON.stringify(cardStatus)
    );
  }, [cardStatus]);

  useEffect(() => {
    setCardStatus({});

    const saved = localStorage.getItem(getCardStatusKey(examVersion));
    if (saved) {
      setCardStatus(JSON.parse(saved));
    }
  }, [examVersion]);

  /* -----------------------------------------
     Toggle status
  ----------------------------------------- */
  const toggleStatus = (
    id: number,
    status: keyof CardFlags
  ) => {
    setCardStatus((prev) => {
      const current = prev[id] ?? {
        known: false,
        hard: false,
        save: false,
      };

      if (status === "known") current.hard = false;
      if (status === "hard") current.known = false;

      const next = { ...current, [status]: !current[status] };

      return { ...prev, [id]: next };
    });
  };

  /* -----------------------------------------
     Language logic
  ----------------------------------------- */
  const systemLang = i18n.language.startsWith("es") ? "es" : "en";
  const primaryLang: LanguageCode =
    systemLang in card.languages ? systemLang : "en";

  const languageOptions: LangMode[] =
    primaryLang === "en"
      ? ["en", "both"]
      : [primaryLang, "en", "both"];

  useEffect(() => {
    if (langMode !== primaryLang && langMode !== "both") {
      setLangMode(primaryLang);
    }
  }, [primaryLang]);

  /* -----------------------------------------
     Reset UI on card change
  ----------------------------------------- */
  useEffect(() => {
    setShowHint(false);
    setHintIndex(0);
    setShowAnswer(false);
  }, [index]);

  /* -----------------------------------------
     Image resolution
  ----------------------------------------- */
  const illustrationFile = card?.illustration ?? "";

  const examFolder =
    card.version.startsWith("2008") ? "2008" :
    card.version.startsWith("2025") ? "2025" :
  "";

  const questionImages = import.meta.glob(
    "/src/assets/question/*/*.png",
    { eager: true, import: "default" }
  ) as Record<string, string>;

  const imgKey = `/src/assets/question/${examFolder}/${illustrationFile}`;

  const imgPath = questionImages[imgKey] ?? defaultImg;

  /* -----------------------------------------
     Hint handler
  ----------------------------------------- */
  const handleHint = () => {
    const hints = card.languages[primaryLang].hints;

    if (!hints.length) return;

    if (!showHint) {
      setShowHint(true);
      setHintIndex(0);
      return;
    }

    if (hintIndex < hints.length - 1) {
      setHintIndex((v) => v + 1);
    } else {
      setShowHint(false);
      setHintIndex(0);
    }
  };

  /* -----------------------------------------
     Filtering engine
  ----------------------------------------- */
  useEffect(() => {
    let list = [...flashcards];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.languages.en.question.toLowerCase().includes(q) ||
          c.languages.es.question.toLowerCase().includes(q)
      );
    }

    if (filters.category !== "all") {
      list = list.filter(
        (c) => c.category === filters.category
      );
    }

    list = list.filter(
      (c) =>
        c.order >= filters.range.min &&
        c.order <= filters.range.max
    );

    if (
      statusFilters.known ||
      statusFilters.hard ||
      statusFilters.save
    ) {
      list = list.filter((c) => {
        const s = cardStatus[c.id];
        return (
          (statusFilters.known && s?.known) ||
          (statusFilters.hard && s?.hard) ||
          (statusFilters.save && s?.save)
        );
      });
    }

    setFilteredCards(list);
    setIndex((prev) =>
    prev >= list.length ? 0 : prev
  );
  }, [
    examVersion,
    searchQuery,
    filters.category,
    filters.range.min,
    filters.range.max,
    statusFilters.known,
    statusFilters.hard,
    statusFilters.save,
    cardStatus
  ]);

  /* -----------------------------------------
     Reset on exam version change
  ----------------------------------------- */
  useEffect(() => {

    setIndex(0);
    setFilteredCards(flashcards);

    setFilters({
      category: "all",
      range: { min: 1, max: flashcards.length },
    });

    setStatusFilters({
      known: false,
      hard: false,
      save: false,
    });

    setSearchQuery("");
    setShowHint(false);
    setHintIndex(0);
    setShowAnswer(false);
  }, [examVersion, flashcards]);

  const progress = Math.round(((index + 1) / total) * 100);

  const audioSrc =
    langMode === "es"
      ? card.languages.es.audioQuestion
      : card.languages.en.audioQuestion;

  const [showAudioPopup, setShowAudioPopup] = useState(false);

  const clearAllStatuses = () => {

    setCardStatus({});
    localStorage.removeItem(getCardStatusKey(examVersion));

    setSearchQuery("");

    setFilters({
      category: "all",
      range: { min: 1, max: flashcards.length },
    });

    setStatusFilters({
      known: false,
      hard: false,
      save: false,
    });

    setFilteredCards(flashcards);
    setIndex(0);
  };

   const filtersActive =
    searchQuery.trim() !== "" ||
    filters.category !== "all" ||
    filters.range.min !== 1 ||
    filters.range.max !== flashcards.length ||
    statusFilters.known ||
    statusFilters.hard ||
    statusFilters.save;

  return {
    card,
    index,
    total,
    imgPath,

    primaryLang,
    langMode,
    setLangMode,
    languageOptions,

    searchQuery,
    setSearchQuery,

    filters,
    setFilters,
    filtersActive,

    statusFilters,
    setStatusFilters,
    dynamicCategories,

    cardStatus,
    toggleStatus,

    showMobileSearch,
    setShowMobileSearch,
    showMobileFilters,
    setShowMobileFilters,

    nextCard: () => index < total - 1 && setIndex((v) => v + 1),
    prevCard: () => index > 0 && setIndex((v) => v - 1),

    showHint,
    hintIndex,
    handleHint,
    showAnswer,
    setShowAnswer,

    progress,

    audioSrc,
    showAudioPopup,
    setShowAudioPopup,

    clearAllStatuses,
  };
}
