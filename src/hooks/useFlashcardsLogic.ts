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
    favorite: false,
  });

  const card = filteredCards[index];
  const total = filteredCards.length;

  const [cardStatus, setCardStatus] = useState<Record<
    number,
    { known: boolean; hard: boolean; favorite: boolean }
  >>(() => {
    const saved = localStorage.getItem("natly-card-status");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("natly-card-status", JSON.stringify(cardStatus));
  }, [cardStatus]);

  const toggleStatus = (
    id: number,
    status: "known" | "hard" | "favorite"
  ) => {
    setCardStatus((prev) => {
      const current = prev[id] || {
        known: false,
        hard: false,
        favorite: false,
      };

      if (status === "known") current.hard = false;
      if (status === "hard") current.known = false;

      return {
        ...prev,
        [id]: {
          ...current,
          [status]: !current[status],
        },
      };
    });
  };

  // Remove a card when it stops matching a status filter
  useEffect(() => {
    const filteringByStatus =
      statusFilters.known || statusFilters.hard || statusFilters.favorite;

    if (!filteringByStatus) return;

    const current = filteredCards[index];
    if (!current) return;

    const status = cardStatus[current.id] || {
      known: false,
      hard: false,
      favorite: false,
    };

    const stillValid =
      (statusFilters.known && status.known) ||
      (statusFilters.hard && status.hard) ||
      (statusFilters.favorite && status.favorite);

    if (!stillValid) {
      setFilteredCards((prev) => prev.filter((c) => c.id !== current.id));
      setIndex((prev) => (prev > 0 ? prev - 1 : 0));
    }
  }, [cardStatus, statusFilters, filteredCards, index]);

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

  useEffect(() => {
    setShowHint(false);
    setHintIndex(0);
    setShowAnswer(false);
  }, [index]);

  const illustrationFile = card.illustration || "";
  const imgMatch = Object.values(illustrations).find((p) =>
    p.endsWith(illustrationFile)
  );
  const imgPath = imgMatch || defaultImg;

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

  // Reset everything when category changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      range: { min: 1, max: flashcards.length },
    }));

    setSearchQuery("");

    setStatusFilters({
      known: false,
      hard: false,
      favorite: false,
    });

    setIndex(0);
  }, [filters.category]);

  // Central filtering engine
  useEffect(() => {
    let list = [...flashcards];

    if (searchQuery.trim() !== "") {
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

    const anyStatus =
      statusFilters.known || statusFilters.hard || statusFilters.favorite;

    if (anyStatus) {
      list = list.filter((c) => {
        const status = cardStatus[c.id] || {
          known: false,
          hard: false,
          favorite: false,
        };

        return (
          (statusFilters.known && status.known) ||
          (statusFilters.hard && status.hard) ||
          (statusFilters.favorite && status.favorite)
        );
      });
    }

    if (list.length === 0) {
      setFilteredCards([NO_RESULTS_CARD]);
      setIndex(0);
      return;
    }

    setFilteredCards(list);
    setIndex(0);
  }, [searchQuery, filters.range, filters.category, statusFilters]);

  const filtersActive =
    filters.category !== "all" ||
    filters.range.min !== 1 ||
    filters.range.max !== flashcards.length ||
    searchQuery.trim() !== "" ||
    statusFilters.known ||
    statusFilters.hard ||
    statusFilters.favorite;

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
      : langMode === "en"
      ? card.languages.en.audioQuestion
      : card.languages.en.audioQuestion;

  const [showAudioPopup, setShowAudioPopup] = useState(false);

  // FULLY FUNCTIONAL CLEAR ALL STATUSES
  const clearAllStatuses = () => {
    // Clear React state (all statuses)
    setCardStatus({});

    // Clear localStorage
    localStorage.removeItem("natly-card-status");

    // Turn off status filters
    setStatusFilters({
      known: false,
      hard: false,
      favorite: false,
    });
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

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
