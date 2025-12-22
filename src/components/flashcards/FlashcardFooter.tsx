import {
  IconLeftArrow,
  IconRightArrow,
  IconShowAnswer,
  IconHideAnswer,
  IconHint,
  IconThumbUp,
  IconThumbDown
} from "../../natly-icons";

interface FlashcardFooterProps {
  index: number;
  total: number;
  showAnswer: boolean;
  showHint: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToggleAnswer: () => void;
  onHint: () => void;
  t: any;
  tCommon: any;
  cardStatus: {
    known?: boolean;
    hard?: boolean;
    save?: boolean;
  };

  toggleStatus: (status: "known" | "hard" | "save") => void;
}

export default function FlashcardFooter({
  index,
  total,
  showAnswer,
  showHint,
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
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all       
            ${showAnswer
              ? "bg-natly-teal text-white border-natly-teal" 
              : "bg-white text-natly-teal-dark border-natly-teal"}
          `}
        >          
          {showAnswer ? (
            <IconHideAnswer size={35} className="md:size-8" color="#FFFFFF" />
          ) : (
            <IconShowAnswer size={35} className="md:size-8" color="#1F6F73" />
          )}

          <span className="hidden sm:inline font-semibold text-sm sm:text-base md:text-lg">
            {showAnswer ? t("actions.hide_answer") : t("actions.show_answer")}
          </span>
        </button>

        {/* Hint */}
        <button
          onClick={onHint}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all       
            ${showHint
              ? "bg-natly-yellow text-white border-natly-yellow" 
              : "bg-white text-natly-yellow border-natly-yellow"}
          `}
        >
          <IconHint 
            size={35} 
            className="md:size-8"
            color={showHint ? "#FFFFFF" : "#f5af00"} 
          />
          <span className="hidden sm:inline font-semibold text-sm sm:text-base md:text-lg">{t("actions.hint")}</span>
        </button>

        {/* Ya me la sé */}
        <button
          onClick={() => toggleStatus("known")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all       
            ${cardStatus.known 
              ? "bg-natly-known-soft text-natly-known-text border-natly-known" 
              : "bg-white text-natly-known-text border-natly-known"}
          `}
        >
          <IconThumbUp 
            size={35} 
            className="md:size-8" 
            color={cardStatus.known ? "#1F6F73" : "#1F6F73"}
          />
          <span className="hidden sm:inline font-semibold text-sm sm:text-base md:text-lg">{tCommon("actions.like")}</span>
        </button>

        {/* Me cuesta */}
        <button
          onClick={() => toggleStatus("hard")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all
            ${
              cardStatus.hard
                ? "bg-natly-hard-soft text-natly-hard-text border-natly-hard"
                : "bg-white text-natly-hard-text border-natly-hard"
            }
          `}
        >
          <IconThumbDown
            size={35}
            className="md:size-8"
            color={cardStatus.hard ? "#9C3A3A" : "#9C3A3A"}
          />
          <span className="hidden sm:inline font-semibold text-sm sm:text-base md:text-lg">
            {tCommon("actions.dislike")}
          </span>
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
