import { useState, useEffect, useRef } from "react";
import { useFlashcardsLogic } from "../hooks/useFlashcardsLogic";

/* Flashcards UI components */
import TopBar from "../components/flashcards/TopBar";
import SearchModal from "../components/flashcards/SearchModal";
import FlashcardCard from "../components/flashcards/FlashcardCard";
import FlashcardFooter from "../components/flashcards/FlashcardFooter";
import LanguageSelector from "../components/flashcards/LanguageSelector";

/* Filters & Options */
import FiltersDesktopPanel from "../components/flashcards/FiltersDesktopPanel";
import OptionsDesktopPanel from "../components/flashcards/OptionsDesktopPanel";
import FiltersMobilePanel from "../components/flashcards/FiltersMobilePanel";
import OptionsMobilePanel from "../components/flashcards/OptionsMobilePanel";

/* Popups */
import ExamVersionPopup from "../components/ExamVersionPopup";
import GenericPopup from "../components/ui/Popup";

/* Other UI */
import DonationBanner from "../components/DonationBanner";

import { useTranslation } from "react-i18next";

import { useExamVersion } from "../utils/useExamVersion";

import { 
  trackFlashcardViewed,
  trackFlashcardFlipped,
  trackFlashcardMarked,
  trackAudioPlayed 
} from "../lib/analyticsEvents";

/* -----------------------------------------
   Constants
----------------------------------------- */

export default function FlashcardsPage() {

  /* -----------------------------------------
     Exam version (state + persistence)
  ----------------------------------------- */
  const { examVersion, setExamVersion } = useExamVersion();
  const [showExamPopup, setShowExamPopup] = useState(false);

  /* -----------------------------------------
     Flashcards business logic
  ----------------------------------------- */
  const {
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
    statusFilter,
    setStatusFilter,
    setFilters,
    filtersActive,
    
    dynamicCategories,
    clearAllStatuses,

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

    cardStatus,
    toggleStatus,
  } = useFlashcardsLogic(examVersion);

  const { t } = useTranslation("flashcards");
  const { t: tCommon } = useTranslation("common");

  /* -----------------------------------------
     Desktop panels state
  ----------------------------------------- */
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);

  const filterRef = useRef<HTMLDivElement | null>(null);
  const optionsRef = useRef<HTMLDivElement | null>(null);

  /* -----------------------------------------
     Mobile options state
  ----------------------------------------- */
  const [showMobileOptions, setShowMobileOptions] = useState(false);

  /* -----------------------------------------
     Close panels when clicking outside
  ----------------------------------------- */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;

      if (
        (filterRef.current && filterRef.current.contains(target)) ||
        (optionsRef.current && optionsRef.current.contains(target))
      ) {
        return;
      }

      setFilterPanelOpen(false);
      setOptionsOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* -----------------------------------------
     Close desktop panels on resize (mobile)
  ----------------------------------------- */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowMobileSearch(false);
        setShowMobileFilters(false);
        setShowMobileOptions(false);
      } else {
        setFilterPanelOpen(false);
        setOptionsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* -----------------------------------------
     Load exam version on first render
  ----------------------------------------- */
  useEffect(() => {
    if (!localStorage.getItem("natly_exam_version")) {
      setShowExamPopup(true);
    }
  }, []);

  const saveExamVersion = (version: "exam_2008_100" | "exam_2025_128") => {
    setExamVersion(version);
  };

  const handleInitialExamSelect = (version: "exam_2008_100" | "exam_2025_128") => {
    setExamVersion(version);
    setShowExamPopup(false);
  };

  /* -----------------------------------------
    Track flashcard viewed
  ----------------------------------------- */
  useEffect(() => {
    if (card) {
      trackFlashcardViewed({
        questionId: card.id,
        examVersion: examVersion,
        language: langMode,
      });
    }
  }, [card?.id, examVersion, langMode]);

  /* -----------------------------------------
    Handle status toggle with tracking
  ----------------------------------------- */
  const handleToggleStatus = (id: number, status: "known" | "hard" | "save") => {
    // Only track known/hard (save is just bookmarking)
    if (status === "known" || status === "hard") {
      trackFlashcardMarked({
        questionId: id,
        status,
        examVersion: examVersion,
      });
    }
    
    // Call original function
    toggleStatus(id, status);
  };

  /* -----------------------------------------
    Handle show answer with tracking
  ----------------------------------------- */
  const handleShowAnswer = () => {
    if (!showAnswer) {
      // Track flip (only when showing answer for first time)
      trackFlashcardFlipped({
        questionId: card.id,
        timeSpent: 0, // We'll improve this later with timer
      });
    }
    
    setShowAnswer((v) => !v);
  };

  /* -----------------------------------------
    Handle audio click with tracking
  ----------------------------------------- */
  const handleAudioClick = () => {
    trackAudioPlayed({
      questionId: card.id,
      audioType: "question",
      language: primaryLang,
    });
    
    setShowAudioPopup(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20">

      <TopBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        openSearchMobile={() => setShowMobileSearch(true)}
        openFiltersMobile={() => setShowMobileFilters(true)}
        openOptionsMobile={() => setShowMobileOptions(true)}
        openFiltersDesktop={() => {
          setOptionsOpen(false);
          setFilterPanelOpen((v) => !v);
        }}
        openOptionsDesktop={() => {
          if (!showExamPopup) {
            setFilterPanelOpen(false);
            setOptionsOpen((v) => !v);
          }
        }}
        tCommon={tCommon}
      />

      {filterPanelOpen && (
        <div ref={filterRef} className="hidden md:block relative">
          <FiltersDesktopPanel
            filters={filters}
            setFilters={setFilters}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            dynamicCategories={dynamicCategories}
            cardStatus={cardStatus}
            clearAllStatuses={clearAllStatuses}
            tCommon={tCommon}
            close={() => setFilterPanelOpen(false)}
          />
        </div>
      )}

      {optionsOpen && (
        <div ref={optionsRef} className="hidden md:block relative">
          <OptionsDesktopPanel
            examVersion={examVersion}
            setExamVersion={saveExamVersion}
            tCommon={tCommon}
            close={() => setOptionsOpen(false)}
          />
        </div>
      )}

      {showExamPopup && (
        <ExamVersionPopup
          onSelect={handleInitialExamSelect}
          tCommon={tCommon}
        />
      )}

      <SearchModal
        show={showMobileSearch}
        close={() => setShowMobileSearch(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        tCommon={tCommon}
      />

      <FiltersMobilePanel
        show={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        filters={filters}
        setFilters={setFilters}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dynamicCategories={dynamicCategories}
        cardStatus={cardStatus}
        clearAllStatuses={clearAllStatuses}
        tCommon={tCommon}
      />

      <OptionsMobilePanel
        show={showMobileOptions}
        onClose={() => setShowMobileOptions(false)}
        examVersion={examVersion}
        setExamVersion={saveExamVersion}
        tCommon={tCommon}
      />

      <FlashcardCard
        card={card}
        total={total}
        imgPath={imgPath}
        showHint={showHint}
        hintIndex={hintIndex}
        showAnswer={showAnswer}
        langMode={langMode}
        primaryLang={primaryLang}
        t={t}
        tCommon={tCommon}
        progress={progress}
        audioSrc={audioSrc}
        statusFilter={statusFilter}
        filteredIndex={index}
        filteredTotal={total}
        filtersActive={filtersActive}
        searchQuery={searchQuery}
        filters={filters}
        dynamicCategories={dynamicCategories}
        cardStatus={cardStatus[card.id]}
        setShowAudioPopup={handleAudioClick}
        toggleStatus={handleToggleStatus}
      />

      <FlashcardFooter
        index={index}
        total={total}
        showAnswer={showAnswer}
        showHint={showHint}
        onPrev={prevCard}
        onNext={nextCard}
        onHint={handleHint}
        t={t}
        tCommon={tCommon}
        cardStatus={cardStatus[card.id] || {}}
        onToggleAnswer={handleShowAnswer}
        toggleStatus={(status) => handleToggleStatus(card.id, status)}
      />

      <LanguageSelector
        langMode={langMode}
        primaryLang={primaryLang}
        languageOptions={languageOptions}
        onSelect={setLangMode}
        t={t}
      />

      <DonationBanner />

      {showAudioPopup && (
        <GenericPopup
          title={tCommon("messages.feature_unavailable")}
          message={tCommon("messages.audio_unavailable")}
          onClose={() => setShowAudioPopup(false)}
          buttonText={tCommon("buttons.understood")}
        />
      )}
    </div>
  );
}
