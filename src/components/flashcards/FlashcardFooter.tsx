import {
  IconLeftArrow,
  IconRightArrow,
  IconShowAnswer,
  IconHideAnswer,
  IconHint,
  IconThumbUp,
  IconThumbDown,
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
    <div className="mt-8 px-2">

      {/* MAIN CONTENT (desktop keeps arrows inline) */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">

        {/* LEFT ARROW – desktop only */}
        <div className="hidden sm:block">
          <ArrowButton onClick={onPrev} disabled={index === 0}>
            <IconLeftArrow size={18} />
          </ArrowButton>
        </div>

        {/* CENTER CONTROLS */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">

          {/* SHOW ANSWER */}
          <button
            onClick={onToggleAnswer}
            className={`
              flex items-center justify-center gap-3
              w-full sm:w-auto
              px-4 py-3 rounded-full border transition-all
              ${showAnswer
                ? "bg-natly-teal text-white border-natly-teal"
                : "bg-white text-natly-teal-dark border-natly-teal"}
            `}
          >
            {showAnswer ? (
              <IconHideAnswer size={32} color="#FFFFFF" />
            ) : (
              <IconShowAnswer size={32} color="#1F6F73" />
            )}
            <span className="font-semibold text-lg whitespace-nowrap">
              {showAnswer ? t("actions.hide_answer") : t("actions.show_answer")}
            </span>
          </button>

          {/* HINT */}
          <button
            onClick={onHint}
            className={`
              flex items-center justify-center gap-3
              w-full sm:w-auto
              px-4 py-3 rounded-full border transition-all
              ${showHint
                ? "bg-natly-yellow text-white border-natly-yellow"
                : "bg-white text-natly-yellow border-natly-yellow"}
            `}
          >
            <IconHint size={32} color={showHint ? "#FFFFFF" : "#f5af00"} />
            <span className="font-semibold text-lg whitespace-nowrap">
              {t("actions.hint")}
            </span>
          </button>

          {/* DIFFICULTY LABEL – mobile only */}
          <p className="mt-5 block sm:hidden text-center text-lg text-natly-gray">
            {t("questions.difficulty")}
          </p>

          {/* DIFFICULTY BUTTONS */}
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => toggleStatus("known")}
              className={`
                flex items-center gap-2
                px-4 py-3
                rounded-full border transition-all whitespace-nowrap
                ${cardStatus.known
                  ? "bg-natly-known-soft text-natly-known-text border-natly-known"
                  : "bg-white text-natly-known-text border-natly-known"}
              `}
            >
              <IconThumbUp size={32} color="#1F6F73" />
              <span className="font-semibold text-sm sm:text-lg">
                {tCommon("actions.like")}
              </span>
            </button>

            <button
              onClick={() => toggleStatus("hard")}
              className={`
                flex items-center gap-2
                px-3 py-2 sm:px-4 sm:py-3
                rounded-full border transition-all whitespace-nowrap
                ${cardStatus.hard
                  ? "bg-natly-hard-soft text-natly-hard-text border-natly-hard"
                  : "bg-white text-natly-hard-text border-natly-hard"}
              `}
            >
              <IconThumbDown size={32} color="#9C3A3A" />
              <span className="font-semibold text-sm sm:text-lg">
                {tCommon("actions.dislike")}
              </span>
            </button>
          </div>
        </div>

        {/* RIGHT ARROW – desktop only */}
        <div className="hidden sm:block">
          <ArrowButton onClick={onNext} disabled={index === total - 1}>
            <IconRightArrow size={18} />
          </ArrowButton>
        </div>
      </div>

      {/* MOBILE ARROWS – moved to bottom */}
      <div className="flex justify-between sm:hidden mt-4">
        <ArrowButton onClick={onPrev} disabled={index === 0}>
          <IconLeftArrow size={18} />
        </ArrowButton>

        <ArrowButton onClick={onNext} disabled={index === total - 1}>
          <IconRightArrow size={18} />
        </ArrowButton>
      </div>
    </div>
  );
}

/* Reusable arrow button */
function ArrowButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        bg-white border-2 shadow-lg
        w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14
        rounded-full flex items-center justify-center
        text-natly-teal-dark transition
        ${disabled ? "opacity-40 cursor-not-allowed" : "hover:scale-105"}
      `}
    >
      {children}
    </button>
  );
}
