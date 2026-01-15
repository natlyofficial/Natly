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
import AudioUnavailablePopup from "../components/AudioUnavailablePopup";
import ExamVersionPopup from "../components/ExamVersionPopup";

/* Other UI */
import DonationBanner from "../components/DonationBanner";

import { useTranslation } from "react-i18next";

/* -----------------------------------------
   Constants
----------------------------------------- */
const EXAM_VERSION_KEY = "natly_exam_version";

export default function FlashcardsPage() {

  /* -----------------------------------------
     Exam version (state + persistence)
  ----------------------------------------- */
  const [examVersion, setExamVersion] = useState<"100" | "128">("128");
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
    const storedVersion = localStorage.getItem(EXAM_VERSION_KEY) as
      | "100"
      | "128"
      | null;

    if (storedVersion) {
      setExamVersion(storedVersion);
    } else {
      setShowExamPopup(true);
    }
  }, []);

  const saveExamVersion = (version: "100" | "128") => {
    localStorage.setItem(EXAM_VERSION_KEY, version);
    setExamVersion(version);
  };

  const handleInitialExamSelect = (version: "100" | "128") => {
    saveExamVersion(version);
    setShowExamPopup(false);
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
        setShowAudioPopup={setShowAudioPopup}
        statusFilter={statusFilter}
        filteredIndex={index}
        filteredTotal={total}
        cardStatus={cardStatus[card.id]}
        toggleStatus={toggleStatus}
      />

      <FlashcardFooter
        index={index}
        total={total}
        showAnswer={showAnswer}
        showHint={showHint}
        onPrev={prevCard}
        onNext={nextCard}
        onToggleAnswer={() => setShowAnswer((v) => !v)}
        onHint={handleHint}
        t={t}
        tCommon={tCommon}
        cardStatus={cardStatus[card.id] || {}}
        toggleStatus={(status) => toggleStatus(card.id, status)}
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
        <AudioUnavailablePopup
          title={tCommon("messages.feature_unavailable")}
          message={tCommon("messages.audio_unavailable")}
          onClose={() => setShowAudioPopup(false)}
          buttonText={tCommon("buttons.understood")}
        />
      )}
    </div>
  );
}
