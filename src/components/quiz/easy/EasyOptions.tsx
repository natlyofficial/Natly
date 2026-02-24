import { useState } from "react";
import { useTranslation } from "react-i18next";

import easyquizguided from "../../../assets/easyquizguide.webp";
import easyquizquick from "../../../assets/easyquizchallange.webp";
import easyquiztopics from "../../../assets/easyquiztopic.webp";

import { IconLeftArrow } from "../../../natly-icons";
import Popup from "../../ui/Popup";

import QuizSteps from "../layout/QuizSteps";

import { useQuizFlow } from "../context/QuizFlowContext";

export default function EasyOptions() {
  /* ---------------- state ---------------- */
  const [showPopup, setShowPopup] = useState(false);

  /* ---------------- i18n ---------------- */
  const { t } = useTranslation("quiz");
  const { t: tCommon } = useTranslation("common");

  /* ---------------- handlers ---------------- */
  const handleUnavailable = () => setShowPopup(true);

  /* ---------------- shared styles ---------------- */
  const cardBase = `
  relative flex flex-col justify-between
  rounded-xl border-3
  overflow-hidden
  bg-white shadow-sm
  min-h-[420px]
  cursor-pointer
  transition-all duration-300
  hover:-translate-y-2 hover:shadow-xl hover:border-natly-blue
  border-natly-blue-soft
`;

  const { goBack, continueFlow } = useQuizFlow();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Back */}
      <button
        onClick={goBack}
        className="
          flex items-center gap-1
          text-md font-medium
          [--back-color:var(--color-natly-blue-dark)]
          hover:[--back-color:var(--color-natly-blue-soft)]
        "
      >
        <IconLeftArrow size={20} color="var(--back-color)" />
        <span style={{ color: "var(--back-color)" }}>
          {tCommon("buttons.back")}
        </span>
      </button>

      {/* Header */}
      <div className="text-center mt-6">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-natly-blue-dark">
          {t("easy_options.title")}
        </h1>

        <p className="mt-3 text-2xl text-natly-gray">
          {t("easy_options.subtitle")}
        </p>
      </div>

      {/* Step progress */}
      <QuizSteps current={3} />

      {/* Options */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Guided */}
        <div onClick={continueFlow} className={cardBase}>
          <img
            src={easyquizguided}
            alt="Guided practice"
            className="absolute inset-0 h-full w-full object-cover opacity-90 mix-blend-multiply"
          />

          <div className="absolute inset-0 bg-white/10" />

          <div className="relative z-10 flex h-full flex-col p-1 md:p-6 text-center">
            <h3 className="mt-4 text-lg font-extrabold text-natly-blue-dark md:mt-2">
              {t("easy_options.guided.title")}
            </h3>

            <div className="mt-auto space-y-1">
              <p className="text-sm text-natly-gray">
                {t("easy_options.guided.description")}
              </p>

              <button
                onClick={(e) => {
                    e.stopPropagation();
                    continueFlow();
                }}
                className="rounded-full bg-natly-yellow px-6 py-2 font-bold text-natly-blue-dark transition hover:brightness-95"
              >
                {t("easy_options.guided.action")}
              </button>

            </div>
          </div>
        </div>

        {/* Quick */}
        <div onClick={handleUnavailable} className={cardBase}>
          <img
            src={easyquizquick}
            alt="Quick test"
            className="absolute inset-0 h-full w-full object-cover opacity-90 mix-blend-multiply"
          />

          <div className="absolute inset-0 bg-white/10" />

          <div className="relative z-10 flex h-full flex-col p-2 md:p-6 text-center">
            <h3 className="mt-4 text-lg font-extrabold text-natly-blue-dark md:mt-2">
              {t("easy_options.quick.title")}
            </h3>

            <div className="mt-auto space-y-1">
              <p className="text-sm text-natly-gray">
                {t("easy_options.quick.description")}
              </p>

              <button className="rounded-full bg-natly-blue px-6 py-2 font-bold text-white transition hover:brightness-95">
                {t("easy_options.quick.action")}
              </button>
            </div>
          </div>
        </div>

        {/* Topics */}
        <div onClick={handleUnavailable} className={cardBase}>
          <img
            src={easyquiztopics}
            alt="By topic"
            className="absolute inset-0 h-full w-full object-cover opacity-90 mix-blend-multiply"
          />

          <div className="absolute inset-0 bg-white/10" />

          <div className="relative z-10 flex h-full flex-col p-1 md:p-6 text-center">
            <h3 className="mt-6 text-lg font-extrabold text-natly-blue-dark md:mt-2">
              {t("easy_options.topics.title")}
            </h3>

            <div className="mt-auto space-y-1 lg:space-y-5">
              <p className="text-sm text-natly-gray">
                {t("easy_options.topics.description")}
              </p>

              <button className="rounded-full border border-natly-blue px-6 py-2 font-bold text-natly-blue transition hover:bg-natly-blue-soft hover:text-white hover:border-natly-blue-soft">
                {t("easy_options.topics.action")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-6 text-center text-md text-natly-gray">
        {t("easy_options.footer")}
      </p>

      {/* Popup */}
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
