import { useEffect, useState } from "react";
import flashcards from "../data/flashcards.json";
import i18n from "../i18n";

import defaultImg from "../assets/question/noimage.png";

const illustrations = import.meta.glob("/src/assets/question/*", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const NO_RESULTS_CARD = {
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

type AvailableLang = keyof typeof flashcards[0]["languages"];

export function useFlashcardsLogic() {
  const [index, setIndex] = useState(0);
  const [langMode, setLangMode] = useState<"es" | "en" | "both">("en");

  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);

  const [filteredCards, setFilteredCards] = useState(flashcards);

  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [filters, setFilters] = useState({
    category: "all",
    range: { min: 1, max: flashcards.length },
  });

  const [statusFilters, setStatusFilters] = useState({
    known: false,
    hard: false,
    save: false,
  });

  // 🔑 NEW: reset control
  const [isResetting, setIsResetting] = useState(false);

  const card = filteredCards[index];
  const total = filteredCards.length;

  const [cardStatus, setCardStatus] = useState<Record<
    number,
    { known: boolean; hard: boolean; save: boolean }
  >>(() => {
    const saved = localStorage.getItem("natly-card-status");
    return saved ? JSON.parse(saved) : {};
  });

  // Persist card status
  useEffect(() => {
    localStorage.setItem("natly-card-status", JSON.stringify(cardStatus));
  }, [cardStatus]);

  // Toggle known / hard / save
  const toggleStatus = (
    id: number,
    status: "known" | "hard" | "save"
  ) => {
    setCardStatus((prev) => {
      const current = prev[id] || {
        known: false,
        hard: false,
        save: false,
      };

      // Mutual exclusion
      if (status === "known") current.hard = false;
      if (status === "hard") current.known = false;

      const nextValue = !current[status];

      const nextStatus = {
        ...current,
        [status]: nextValue,
      };

      const nextCardStatus = {
        ...prev,
        [id]: nextStatus,
      };

      // Auto-disable filter only if no cards remain with that status
      if (!nextValue && statusFilters[status]) {
        const stillExists = Object.values(nextCardStatus).some(
          (s) => s[status]
        );

        if (!stillExists) {
          setStatusFilters((prevFilters) => ({
            ...prevFilters,
            [status]: false,
          }));
        }
      }

      return nextCardStatus;
    });
  };

  // Language logic
  const fallbackLang: AvailableLang = "en";
  const systemLang = i18n.language;

  const primaryLang: AvailableLang =
    systemLang in card.languages ? (systemLang as AvailableLang) : fallbackLang;

  const languageOptions =
    primaryLang === "en" ? ["en", "both"] : [primaryLang, "en", "both"];

  useEffect(() => {
    if (langMode !== primaryLang && langMode !== "both") {
      setLangMode(primaryLang);
    }
  }, [i18n.language]);

  // Reset transient UI on card change
  useEffect(() => {
    setShowHint(false);
    setHintIndex(0);
    setShowAnswer(false);
  }, [index]);

  // Image resolution
  const illustrationFile = card?.illustration || "";
  const imgMatch = Object.values(illustrations).find((p) =>
    p.endsWith(illustrationFile)
  );
  const imgPath = imgMatch || defaultImg;

  // Hint handler
  const handleHint = () => {
    const totalHints = card.languages[primaryLang].hints.length;

    if (!showHint) {
      setShowHint(true);
      setHintIndex(0);
      return;
    }

    if (hintIndex < totalHints - 1) {
      setHintIndex((prev) => prev + 1);
    } else {
      setShowHint(false);
      setHintIndex(0);
    }
  };

  // Reset when category changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      range: { min: 1, max: flashcards.length },
    }));

    setSearchQuery("");
    setStatusFilters({ known: false, hard: false, save: false });
    setIndex(0);
  }, [filters.category]);

  // 🔥 CENTRAL FILTERING ENGINE (FINAL + SAFE)
  useEffect(() => {
    let list = [...flashcards];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.languages.es.question.toLowerCase().includes(q) ||
          c.languages.en.question.toLowerCase().includes(q)
      );
    }

    if (filters.category !== "all") {
      list = list.filter(
        (c) =>
          c.category === filters.category ||
          c.subcategory === filters.category
      );
    }

    list = list.filter(
      (c) => c.order >= filters.range.min && c.order <= filters.range.max
    );

    if (statusFilters.known || statusFilters.hard || statusFilters.save) {
      list = list.filter((c) => {
        const status = cardStatus[c.id] || {
          known: false,
          hard: false,
          save: false,
        };

        return (
          (statusFilters.known && status.known) ||
          (statusFilters.hard && status.hard) ||
          (statusFilters.save && status.save)
        );
      });
    }

    if (list.length === 0) {
      setFilteredCards([NO_RESULTS_CARD]);
      setIndex(0);
      setIsResetting(false);
      return;
    }

    setFilteredCards(list);

    // ✅ FIX: force index = 0 only on reset
    setIndex((prev) => {
      if (isResetting) return 0;
      if (prev < list.length) return prev;
      return Math.max(list.length - 1, 0);
    });

    setIsResetting(false);
  }, [
    searchQuery,
    filters.category,
    filters.range,
    statusFilters,
    cardStatus,
    isResetting,
  ]);

  const filtersActive =
    filters.category !== "all" ||
    filters.range.min !== 1 ||
    filters.range.max !== flashcards.length ||
    searchQuery.trim() !== "" ||
    statusFilters.known ||
    statusFilters.hard ||
    statusFilters.save;

  const dynamicCategories = [
    { id: "all", labelKey: "filters.category_all" },
    ...Array.from(new Set(flashcards.map((c) => c.category))).map((cat) => ({
      id: cat,
      labelKey: `filters.category_${cat}`,
    })),
  ];

  const nextCard = () => {
    if (index < total - 1) setIndex((prev) => prev + 1);
  };

  const prevCard = () => {
    if (index > 0) setIndex((prev) => prev - 1);
  };

  const progress = Math.round(((index + 1) / total) * 100);

  const audioSrc =
    langMode === "es"
      ? card.languages.es.audioQuestion
      : card.languages.en.audioQuestion;

  const [showAudioPopup, setShowAudioPopup] = useState(false);

  // 🔄 FULL RESET (DESKTOP + MOBILE)
  const clearAllStatuses = () => {
    setIsResetting(true);

    setCardStatus({});
    localStorage.removeItem("natly-card-status");

    setStatusFilters({ known: false, hard: false, save: false });
    setSearchQuery("");
    setFilters({
      category: "all",
      range: { min: 1, max: flashcards.length },
    });

    setIndex(0);
  };

  const clearSearch = () => setSearchQuery("");

  return {
    card,
    index,
    total,
    imgPath,

    primaryLang,
    langMode,
    setLangMode,

    searchQuery,
    setSearchQuery,

    filters,
    setFilters,

    statusFilters,
    setStatusFilters,

    dynamicCategories,
    filtersActive,

    cardStatus,
    toggleStatus,

    showMobileSearch,
    setShowMobileSearch,
    showMobileFilters,
    setShowMobileFilters,

    nextCard,
    prevCard,

    showHint,
    setShowHint,
    hintIndex,
    handleHint,
    showAnswer,
    setShowAnswer,

    progress,

    audioSrc,
    showAudioPopup,
    setShowAudioPopup,

    languageOptions,

    clearAllStatuses,
    clearSearch,
  };
}
