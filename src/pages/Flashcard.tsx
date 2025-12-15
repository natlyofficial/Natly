import { useState, useEffect, useRef } from "react";
import { useFlashcardsLogic } from "../hooks/useFlashcardsLogic";

import TopBar from "../components/flashcards/TopBar";
import SearchModal from "../components/flashcards/SearchModal";
import FiltersModal from "../components/flashcards/FiltersModal";
import FlashcardCard from "../components/flashcards/FlashcardCard";
import FlashcardFooter from "../components/flashcards/FlashcardFooter";
import LanguageSelector from "../components/flashcards/LanguageSelector";
import FiltersDesktopPanel from "../components/flashcards/FiltersDesktopPanel";

import Popup from "../components/Popup";
import DonationBanner from "../components/DonationBanner";

import { useTranslation } from "react-i18next";

export default function FlashcardsPage() {
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
    filtersActive,
    setFilters,
    statusFilters,
    setStatusFilters,
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
  } = useFlashcardsLogic();

  const { t } = useTranslation("flashcards");
  const { t: tCommon } = useTranslation("common");

  // -------------------------------------------------------
  // DESKTOP FILTER PANEL (ESTADO + CLICK OUTSIDE)
  // -------------------------------------------------------
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setFilterPanelOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setFilterPanelOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20">

      {/* TOP BAR */}
      <TopBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        openSearchMobile={() => setShowMobileSearch(true)}
        openFiltersMobile={() => setShowMobileFilters(true)}
        openFiltersDesktop={() => setFilterPanelOpen((v) => !v)}
        tCommon={tCommon}
      />

      {filterPanelOpen && (
        <div ref={ref} className="hidden md:block relative">
          <FiltersDesktopPanel
            filters={filters}
            setFilters={setFilters}
            statusFilters={statusFilters}
            setStatusFilters={setStatusFilters}
            dynamicCategories={dynamicCategories}
            cardStatus={cardStatus}
            clearAllStatuses={clearAllStatuses}
            tCommon={tCommon}
            close={() => setFilterPanelOpen(false)}
          />
        </div>
      )}

      {/* MOBILE SEARCH MODAL */}
      <SearchModal
        show={showMobileSearch}
        close={() => setShowMobileSearch(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        tCommon={tCommon}
      />

      {/* MOBILE FILTERS MODAL */}
      <FiltersModal
        show={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        filters={filters}
        setFilters={setFilters}
        statusFilters={statusFilters}
        setStatusFilters={setStatusFilters}
        dynamicCategories={dynamicCategories}
        cardStatus={cardStatus}
        clearAllStatuses={clearAllStatuses}
        tCommon={tCommon}
      />

      {/* FLASHCARD */}
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
        filtersActive={filtersActive}
      />

      {/* FOOTER */}
      <FlashcardFooter
        index={index}
        total={total}
        showAnswer={showAnswer}
        onPrev={prevCard}
        onNext={nextCard}
        onToggleAnswer={() => setShowAnswer((v) => !v)}
        onHint={handleHint}
        t={t}
        tCommon={tCommon}
        cardStatus={cardStatus[card.id] || {}}
        toggleStatus={(status) => toggleStatus(card.id, status)}
      />

      {/* LANGUAGE SELECTOR */}
      <LanguageSelector
        langMode={langMode}
        primaryLang={primaryLang}
        languageOptions={languageOptions}
        onSelect={setLangMode}
        t={t}
      />

      <DonationBanner />

      {/* POPUP AUDIO */}
      {showAudioPopup && (
        <Popup
          title={tCommon("messages.feature_unavailable")}
          message={tCommon("messages.audio_unavailable")}
          onClose={() => setShowAudioPopup(false)}
          buttonText={tCommon("buttons.understood")}
        />
      )}
    </div>
  );
}
