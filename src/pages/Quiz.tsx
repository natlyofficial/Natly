import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IconHappyFace, IconSeriousQuestion } from "../natly-icons";
import mascotaquiz from "../assets/natlyquiz.webp";
import IconMicrophone from "../natly-icons/Microphone";
import Popup from "../components/ui/Popup"; 

type Mode = "easy" | "hard" | "interview" | null;

export default function CardConMuesca() {

  const { t } = useTranslation("quiz");
  const { t: tCommon } = useTranslation("common");

  const [selectedMode, setSelectedMode] = useState<Mode>(null);

  const baseCard =
  "relative flex flex-col items-center rounded-xl border-4 p-4 pt-10 text-center cursor-pointer focus:outline-none transition-transform transition-shadow transition-colors duration-700 ease-in-out";

  const hoverCard =
  "hover:-translate-y-3 hover:shadow-lg hover:border-natly-blue hover:border-4";

  const selectedCard =
  "-translate-y-3 shadow-lg";

  const handleSelect = (mode: Mode) => {
    setSelectedMode((prev) => (prev === mode ? null : mode));
  };

  const hasNatlyPlus = false;

  const [showPopup, setShowPopup] = useState(false);

  const handleUnavailable = () => {
    setShowPopup(true);
  };

  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* Mascot */}
      <div className="flex justify-center">
        <img
          src={mascotaquiz}
          alt="Natly mascot"
          className="w-56 sm:w-72 md:w-136"
        />
      </div>

      {/* Main headline */}
      <h1 className="mb-4 text-center text-2xl font-extrabold tracking-tight text-natly-blue-dark sm:text-3xl">
        {t("headlines.main")}
      </h1>

      {/* Step progress */}
      <div className="mb-4 flex items-center justify-center gap-3">
        <span className="rounded-full bg-natly-blue px-2 py-1 text-xs font-bold text-white md:px-4 md:py-2">
          {t("steps.step_1")}
        </span>

        <div className="h-1 w-10 sm:w-20 rounded-full bg-natly-blue opacity-30" />

        <span className="rounded-full border border-natly-blue px-2 py-1 text-xs font-bold text-natly-blue md:px-4 md:py-2">
          {t("steps.step_2")}
        </span>

        <div className="h-1 w-10 sm:w-20 rounded-full bg-natly-blue opacity-20" />

        <span className="rounded-full border border-natly-blue px-2 py-1 text-xs font-bold text-natly-blue md:px-4 md:py-2">
          {t("steps.step_3")}
        </span>
      </div>

      {/* Main container */}
      <div
        className="
          relative mx-auto w-full max-w-[1200px]
          rounded-xl border-4 border-natly-blue-soft
          bg-white flex flex-col
          pb-16 sm:pb-20 md:pb-20
        "
      >
        {/* Module title */}
        <div className="pt-5 text-center">
          <h2 className="text-lg font-extrabold tracking-wide text-natly-blue-dark sm:text-xl">
            {t("sections.exam_mode.title")}
          </h2>

          <div className="mt-2 px-4 sm:px-6 md:px-8">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-xs font-semibold text-natly-blue-dark sm:text-sm">
              <div className="h-px bg-natly-blue-soft" />
              <span className="whitespace-nowrap">
                {t("sections.exam_mode.subtitle")}
              </span>
              <div className="h-px bg-natly-blue-soft" />
            </div>
          </div>
        </div>

        {/* Mode cards */}
        <div className="mt-8 md:mt-10 grid grid-cols-1 gap-4 px-4 sm:grid-cols-3 sm:px-6 md:px-8">
          {/* Easy */}
          <div
            role="button"
            tabIndex={0}
            onClick={handleUnavailable}
            className={`
              ${baseCard}
              border-4 ${selectedMode === "easy" ? "border-natly-blue" : "border-natly-blue-soft"} bg-white shadow-sm
              ${hoverCard}
              ${selectedMode === "easy" ? selectedCard : ""}
            `}
          >
            <span
              className="
                absolute -top-4 left-1/2 -translate-x-1/2
                rounded-full px-4 py-1
                text-[11px] font-extrabold text-white
                bg-natly-blue-dark
              "
            >
              {t("modes.easy.tag")}
            </span>

            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-natly-blue-soft">
              <IconHappyFace size={24} color="#052859" />
            </div>

            <div className="font-extrabold text-natly-blue-dark">
              {t("modes.easy.title")}
            </div>

            <div className="mt-1 text-sm text-natly-gray">
              {t("modes.easy.description")}
            </div>
          </div>

          {/* Hard */}
          <div
            role="button"
            tabIndex={0}
            onClick={handleUnavailable}
            className={`
              ${baseCard}
              border-4 ${selectedMode === "hard" ? "border-natly-blue" : "border-natly-blue-soft"} bg-white shadow-sm
              ${hoverCard}
              ${selectedMode === "hard" ? selectedCard : ""}
            `}
          >
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-natly-blue">
              <IconSeriousQuestion size={24} color="#052859" />
            </div>

            <div className="font-extrabold text-natly-blue-dark">
              {t("modes.hard.title")}
            </div>

            <div className="mt-1 text-sm text-natly-gray">
              {t("modes.hard.description")}
            </div>

            <div className="mt-1 text-[11px] font-semibold text-natly-blue">
              {t("modes.hard.level")}
            </div>
          </div>

          {/* Interview */}
          <div
            role="button"
            tabIndex={0}
            onClick={handleUnavailable}
            className={`
              ${baseCard}
              border-4 ${selectedMode === "interview" ? "border-natly-blue" : "border-natly-blue-soft"} bg-white shadow-sm
              ${hoverCard}
              ${selectedMode === "interview" ? selectedCard : ""}
            `}
          >
            <span
              className="
                absolute -top-3 right-3
                rounded-full px-3 py-1
                text-[11px] font-extrabold
                text-natly-blue-dark
                bg-natly-yellow
              "
            >
              {t("modes.interview.included")}
            </span>

            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-natly-blue-soft">
              <IconMicrophone size={24} color="#052859" />
            </div>

            <div className="font-extrabold text-natly-blue-dark">
              {t("modes.interview.title")}
            </div>

            <div className="mt-1 text-sm text-natly-gray">
              {t("modes.interview.description")}
            </div>
          </div>
        </div>

        {/* Bottom notch */}
        {hasNatlyPlus && (
          <div
            className="
              absolute bottom-0 left-1/2 -translate-x-1/2
              flex items-center justify-center
              h-12
              w-[90%] sm:w-[70%] md:w-[600px]
              rounded-t-xl
              border border-x-4 border-t-4 border-natly-blue-soft
              bg-white
              text-sm font-semibold text-natly-blue
            "
          >
          </div>
        )}
      </div>

      {showPopup && (
        <Popup
          title={tCommon("messages.feature_unavailable")}
          message={tCommon("messages.exam_mode_unavailable")}
          buttonText={tCommon("buttons.understood")}
          accent="blue"
          onClose={() => setShowPopup(false)}
        />
      )}

    </div>
  );
}
