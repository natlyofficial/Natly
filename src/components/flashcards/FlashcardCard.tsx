import { type Dispatch, type SetStateAction } from "react";
import { IconAudio } from "../../natly-icons";
import IconCheck from "./Check";

interface FlashcardCardProps {
  card: any;
  total: number;
  imgPath: string;

  // Estados y lógica
  showHint: boolean;
  hintIndex: number;
  showAnswer: boolean;

  // Lenguaje
  langMode: "es" | "en" | "both";
  primaryLang: "es" | "en";

  // Traducciones
  t: any;
  tCommon?: any;

  // Progreso
  progress: number;

  // Audio (aún no usado pero necesario)
  audioSrc?: string;
  setShowAudioPopup: Dispatch<SetStateAction<boolean>>;

  filtersActive: boolean;
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
  progress,
  audioSrc,
  setShowAudioPopup,
  filtersActive,
}: FlashcardCardProps) {
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
        {/* ---------- Número de pregunta ---------- */}
        <p className="absolute top-4 right-11 text-natly-gray text-sm md:text-lg">
          {t("labels.question")} {card.order} {!filtersActive && ` / ${total}`}
        </p>

        {/* ---------- Barra de progreso ---------- */}
        <div className="mt-4 mb-6 md:mb-8">
          <div className="relative w-full h-4 md:h-6 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-natly-teal transition-all"
              style={{ width: `${progress}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-xs md:text-sm font-semibold text-white drop-shadow">
              {progress}%
            </span>
          </div>
        </div>

        {/* ---------- Imagen + Pregunta ---------- */}
        <div className="mt-4">
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-start">
            
            <img src={imgPath} className="w-100 rounded-2xl shadow-md" />

            <div className="flex-1">
                {/* Español */}
                {(langMode === "es" || langMode === "both") && (
                <div className="flex justify-between items-start mb-4">

                  {/* Texto Pregunta */}
                  <h2 className="text-left text-3xl md:text-[38px] font-bold text-natly-teal-dark leading-snug flex-1">
                    {card.languages.es.question}
                  </h2>

                  {/* Botón Audio */}
                  <button
                    onClick={() => setShowAudioPopup(true)}
                    className="
                      bg-gray-300 
                      w-10 h-10 md:w-16 md:h-16 
                      rounded-full 
                      flex items-center justify-center
                      text-white text-xl md:text-3xl 
                      shadow-md ml-4 flex-shrink-0
                    "
                  >
                    <IconAudio size={30} className="md:size-10" />
                    <audio src={audioSrc} />
                  </button>

                </div>
              )}

              {/* Inglés */}
              {(langMode === "en" || langMode === "both") && (
                <div className="flex justify-between items-start mb-4">

                  {/* Texto Pregunta (EN) */}
                  <h2 className="text-left text-3xl md:text-[38px] font-bold text-natly-teal-dark leading-snug italic flex-1">
                    {card.languages.en.question}
                  </h2>

                  {/* Botón Audio */}
                  <button
                    onClick={() => setShowAudioPopup(true)}
                    className="
                      bg-gray-300 
                      w-10 h-10 md:w-16 md:h-16 
                      rounded-full 
                      flex items-center justify-center
                      text-white text-xl md:text-3xl 
                      shadow-md ml-4 flex-shrink-0
                    "
                  >
                    <IconAudio size={30} className="md:size-10" />
                    <audio src={audioSrc} />
                  </button>

                </div>
              )}
            </div>
          </div>

          {/* ---------- HINT ---------- */}
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

              {/* ----------------- HINT ESPAÑOL ----------------- */}
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

              {/* ----------------- HINT INGLÉS ----------------- */}
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

              {/* Contador de hints */}
              <p className="text-sm text-natly-gray mt-3">
                {hintIndex + 1} / {card.languages[primaryLang].hints.length}
              </p>
            </div>
          )}

          {/* ---------- RESPUESTA ---------- */}
          {showAnswer && (
            <div className="mt-10 p-6 bg-natly-cream border-l-4 border-natly-teal rounded-xl shadow-sm animate-slideDown">

              {(langMode === "es" || langMode === "both") && (
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-natly-blue mb-2">
                    Respuesta correcta:
                  </h3>

                  {card.languages.es.correct.map((ans: string, idx: number) => (
                    <p key={idx} className="flex items-center gap-2 text-natly-blue text-xl font-semibold">
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
                    <p key={idx} className="
                      flex items-center gap-2
                      text-natly-teal-dark text-xl font-semibold
                    ">
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
