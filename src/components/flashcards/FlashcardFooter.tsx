import {
  IconLeftArrow,
  IconRightArrow,
  IconShowAnswer,
  IconHideAnswer,
  IconHint,
  IconThumbUp,
  IconThumbDown,
} from "../../natly-icons";
import IconFavorite from "../../natly-icons/Favorite";

interface FlashcardFooterProps {
  index: number;
  total: number;
  showAnswer: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToggleAnswer: () => void;
  onHint: () => void;
  t: any;
  tCommon: any;
  cardStatus: {
    known?: boolean;
    hard?: boolean;
    favorite?: boolean;
  };

  toggleStatus: (status: "known" | "hard" | "favorite") => void;
}

export default function FlashcardFooter({
  index,
  total,
  showAnswer,
  onPrev,
  onNext,
  onToggleAnswer,
  onHint,
  t,
  tCommon,
  cardStatus,
  toggleStatus,
}: FlashcardFooterProps) {
  return (
    <div className="mt-10 px-2 flex items-center justify-between">

      {/* 🔹 Flecha izquierda */}
      <button
        onClick={onPrev}
        disabled={index === 0}
        className={`
          bg-white border-2 shadow-lg 
          w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 
          rounded-full flex items-center justify-center
          text-natly-teal-dark 
          transition
          ${index === 0 ? "opacity-40 cursor-not-allowed" : "hover:scale-105"}
        `}
      >
        <IconLeftArrow size={20} className="md:size-24" />
      </button>

      {/* Botones centrales */}
      <div className="flex gap-2 sm:gap-4 md:gap-6 flex-wrap justify-center">

        {/* Mostrar respuesta */}
        <button
          onClick={onToggleAnswer}
          className="
            flex items-center gap-2
            px-4 py-2 md:px-6 md:py-2 rounded-full 
            bg-natly-teal text-white 
            font-semibold text-sm sm:text-base md:text-lg 
            shadow-md hover:bg-natly-teal-dark transition
          "
        >
          {showAnswer ? (
            <IconHideAnswer size={22} className="md:size-8" />
          ) : (
            <IconShowAnswer size={22} className="md:size-8" />
          )}

          <span className="hidden sm:inline">
            {showAnswer ? t("actions.hide_answer") : t("actions.show_answer")}
          </span>
        </button>

        {/* Hint */}
        <button
          onClick={onHint}
          className="
            flex items-center gap-2
            px-4 py-2 md:px-6 md:py-2 rounded-full 
            bg-natly-teal text-white 
            font-semibold text-sm sm:text-base md:text-lg 
            shadow-md hover:bg-natly-teal-dark transition
          "
        >
          <IconHint size={20} className="md:size-8" />
          <span className="hidden sm:inline">{t("actions.hint")}</span>
        </button>

        {/* Ya me la sé */}
        <button
          onClick={() => toggleStatus("known")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full
             
            ${cardStatus.known ? "bg-natly-known text-white" : "bg-natly-teal text-white"}
          `}
        >
          <IconThumbUp size={20} className="md:size-8" />
          <span className="hidden sm:inline font-semibold text-sm sm:text-base md:text-lg">{tCommon("actions.like")}</span>
        </button>


        {/* Me cuesta */}
        <button
          onClick={() => toggleStatus("hard")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full 
            ${cardStatus.hard ? "bg-natly-hard text-white" : "bg-natly-teal text-white"}
          `}
        >
          <IconThumbDown size={20} className="md:size-8" />
          <span className="hidden sm:inline font-semibold text-sm sm:text-base md:text-lg">{tCommon("actions.dislike")}</span>
        </button>

        {/* Favorito */}
        <button
          onClick={() => toggleStatus("favorite")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full 
            ${cardStatus.favorite ? "bg-natly-favorite text-white" : "bg-natly-teal text-white"}
          `}
        >
          <IconFavorite size={20} className="md:size-8" />
          <span className="hidden sm:inline font-semibold text-sm sm:text-base md:text-lg">{tCommon("actions.favorite")}</span>
        </button>
      </div>

      {/* 🔹 Flecha derecha */}
      <button
        onClick={onNext}
        disabled={index === total - 1}
        className={`
          bg-white border-2 shadow-lg 
          w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 
          rounded-full flex items-center justify-center
          text-natly-teal-dark 
          transition
          ${
            index === total - 1
              ? "opacity-40 cursor-not-allowed"
              : "hover:scale-105"
          }
        `}
      >
        <IconRightArrow size={20} className="md:size-24" />
      </button>
    </div>
  );
}
