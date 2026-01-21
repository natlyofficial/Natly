import { type Dispatch, type SetStateAction } from "react";
import { IconAudio, IconSaveFilled, IconSaveOutline } from "../../natly-icons";
import IconCheck from "./Check";
import type { Category } from "../../data/civicCategories";

interface FlashcardCardProps {
  card: {
    id: number;
    order: number;
    languages: any;
  };
  total: number;
  imgPath: string;

  // UI state
  showHint: boolean;
  hintIndex: number;
  showAnswer: boolean;

  // Language
  langMode: "es" | "en" | "both";
  primaryLang: "es" | "en";

  // Translations
  t: any;
  tCommon: (key: string) => string;

  // Progress
  progress: number;

  // Audio
  audioSrc?: string;
  setShowAudioPopup: Dispatch<SetStateAction<boolean>>;

  // Filters
  statusFilter: "known" | "hard" | "save" | null;
  filteredIndex: number;
  filteredTotal: number;
  filtersActive: boolean;
  searchQuery: string;
  filters: {
    category: string;
  };

  dynamicCategories: Category[];

  // Save state
  cardStatus?: {
    save?: boolean;
  };

  toggleStatus: (id: number, status: "save") => void;
}

export default function FlashcardCard({
  card,
  total,
  imgPath,
  showHint,
  hintIndex,
  showAnswer,
  langMode,
  primaryLang,
  t,
  tCommon,
  progress,
  audioSrc,
  setShowAudioPopup,
  statusFilter,
  filteredIndex,
  filteredTotal,
  filtersActive,
  searchQuery,
  filters,
  dynamicCategories,
  cardStatus,
  toggleStatus,
}: FlashcardCardProps) {

  const statusLabelMap: Record<"known" | "hard" | "save", string> = {
    known: tCommon("actions.like"),
    hard: tCommon("actions.dislike"),
    save: tCommon("filters.status_saved"),
  };

  const categoryLabel =
    filters.category !== "all"
      ? tCommon(
          dynamicCategories.find(c => c.id === filters.category)?.labelKey ?? ""
        )
      : null;

  const contextLabel = (() => {
    if (statusFilter) return statusLabelMap[statusFilter];
    if (searchQuery.trim()) return tCommon("filters.search");
    if (categoryLabel) return `${tCommon("filters.category")} ${categoryLabel}`;
    return "";
  })();

  return (
    <div className="relative flex justify-center">
      <div
        className="
          bg-white rounded-[30px] shadow-xl
          p-6 md:p-10 
          w-full 
          relative border-4 border-natly-teal
        "
      >

        {/* 
          HEADER BEHAVIOR (KEY FIX)
          - Mobile: stays in normal flow, aligned to the card width
          - Desktop: returns to your original absolute top-right layout
        */}
        <div
          className="
            relative w-full mx-auto
            md:absolute md:top-4 md:right-4 
            md:w-auto md:mb-0 md:px-0 md:mx-0
            flex items-center gap-3
            justify-end
          "
        >

          <p className="flex flex-wrap items-center gap-2 text-xs sm:text-sm md:text-lg text-natly-gray">

            {filtersActive ? (
              <>
                <span className="font-semibold text-natly-teal-dark">
                  {t("labels.question")} {card.order}
                </span>

                {/* Context badge */}
                <span
                  className={`
                    inline-flex items-center gap-1
                    px-3 py-1
                    rounded-full
                    text-md
                    font-semibold
                    transition-colors
                    ${
                      statusFilter === "known"
                        ? "bg-natly-known-soft text-natly-known-text"
                        : statusFilter === "hard"
                        ? "bg-natly-hard-soft text-natly-hard-text"
                        : statusFilter === "save"
                        ? "bg-natly-teal/10 text-natly-teal-dark"
                        : "bg-gray-100 text-natly-gray"
                    }
                  `}
                >
                  <span className="opacity-70 whitespace-nowrap">
                    {filteredIndex + 1} / {filteredTotal}
                  </span>
                  {contextLabel && (
                    <span className="whitespace-nowrap">{contextLabel}</span>
                  )}
                </span>
              </>
            ) : (
              /* Prevent line break when there is NO filter */
              <span className="font-semibold text-natly-teal-dark whitespace-nowrap">
                {t("labels.question")} {card.order} / {total}
              </span>
            )}
          </p>

          {/* Save button */}
          <button
            onClick={() => toggleStatus(card.id, "save")}
            className="
              w-10 h-10 md:w-12 md:h-12
              rounded-full
              flex items-center justify-center
              transition
              hover:bg-gray-100
            "
            aria-label="Save question"
            aria-pressed={!!cardStatus?.save}
          >
            {cardStatus?.save ? (
              <IconSaveFilled size={28} color="#0D5C63" />
            ) : (
              <IconSaveOutline size={28} color="#0D5C63" />
            )}
          </button>
        </div>

        {/* ---------- Progress bar ---------- */}
        <div className="mt-4 mb-4 md:mb-8 md:mt-6">
          <div className="relative w-full h-4 md:h-6 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-natly-teal transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* ---------- Image + Question ---------- */}
        <div className="mt-4">
          <div className="flex flex-col md:flex-row md:gap-6 xl:gap-10 items-center md:items-start">

            {/* Illustration */}
            <img
              src={imgPath}
              className="w-100 md:w-70 lg:w-100 xl:w-100 rounded-2xl shadow-md"
              alt="Question illustration"
            />

            {/* Question content */}
            <div className="flex-1 mt-6 md:mt-0 w-full">

              {/* Spanish */}
              {(langMode === "es" || langMode === "both") && (
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-left text-3xl lg:text-[38px] font-bold text-natly-teal-dark leading-snug flex-1">
                    {card.languages.es.question}
                  </h2>

                  <button
                    onClick={() => setShowAudioPopup(true)}
                    className="
                      bg-gray-300 
                      w-10 h-10 md:w-16 md:h-16 
                      rounded-full 
                      flex items-center justify-center
                      text-white shadow-md ml-4 flex-shrink-0
                    "
                    aria-label="Play audio"
                  >
                    <IconAudio size={30} className="md:size-10" />
                    <audio src={audioSrc} />
                  </button>
                </div>
              )}

              {/* English */}
              {(langMode === "en" || langMode === "both") && (
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-left text-3xl md:text-[38px] font-bold text-natly-teal-dark leading-snug italic flex-1">
                    {card.languages.en.question}
                  </h2>

                  <button
                    onClick={() => setShowAudioPopup(true)}
                    className="
                      bg-gray-300 
                      w-10 h-10 md:w-16 md:h-16 
                      rounded-full 
                      flex items-center justify-center
                      text-white shadow-md ml-4 flex-shrink-0
                    "
                    aria-label="Play audio"
                  >
                    <IconAudio size={30} className="md:size-10" />
                    <audio src={audioSrc} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ---------- Hint ---------- */}
          {showHint && (
            <div
              className="
                animate-slideDown
                mt-6 p-5 
                bg-natly-cream 
                border-l-4 border-natly-teal 
                rounded-xl shadow-sm
              "
            >
              {(langMode === "es" || langMode === "both") && (
                <>
                  <h3 className="text-lg font-bold text-natly-teal-dark mb-1">
                    Pista
                  </h3>
                  <p className="text-natly-blue text-base md:text-lg font-semibold mb-4">
                    {card.languages.es.hints[hintIndex]}
                  </p>
                </>
              )}

              {(langMode === "en" || langMode === "both") && (
                <>
                  <h3 className="text-lg font-bold text-natly-teal-dark mb-1">
                    Hint
                  </h3>
                  <p className="text-natly-blue text-base md:text-lg italic font-semibold">
                    {card.languages.en.hints[hintIndex]}
                  </p>
                </>
              )}

              <p className="text-sm text-natly-gray mt-3">
                {hintIndex + 1} / {card.languages[primaryLang].hints.length}
              </p>
            </div>
          )}

          {/* ---------- Answer ---------- */}
          {showAnswer && (
            <div className="mt-10 p-6 bg-natly-cream border-l-4 border-natly-teal rounded-xl shadow-sm animate-slideDown">

              {(langMode === "es" || langMode === "both") && (
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-natly-blue mb-2">
                    Respuesta correcta:
                  </h3>

                  {card.languages.es.correct.map((ans: string, idx: number) => (
                    <p
                      key={idx}
                      className="flex items-center gap-2 text-natly-blue text-xl font-semibold"
                    >
                      <IconCheck size={20} className="md:size-8" /> {ans}
                    </p>
                  ))}
                </div>
              )}

              {(langMode === "en" || langMode === "both") && (
                <div>
                  <h3 className="text-lg font-bold text-natly-teal-dark mb-2">
                    Correct answer:
                  </h3>

                  {card.languages.en.correct.map((ans: string, idx: number) => (
                    <p
                      key={idx}
                      className="flex items-center gap-2 text-natly-teal-dark text-xl font-semibold"
                    >
                      <IconCheck size={20} className="md:size-8" /> {ans}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
