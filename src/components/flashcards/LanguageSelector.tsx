
type Props = {
  langMode: "es" | "en" | "both";
  primaryLang: "es" | "en"; // puedes ajustar si agregas más idiomas
  languageOptions: string[];
  onSelect: (mode: "es" | "en" | "both") => void;
  t: any;
};

export default function LanguageSelector({
  langMode,
  primaryLang,
  languageOptions,
  onSelect,
  t,
}: Props) {
  return (
    <div className="flex justify-center mt-4 gap-4 sm:gap-6">
      {languageOptions.map((lm) => {
        const isDisabled = primaryLang === "en" && lm === "both";

        return (
          <button
            key={lm}
            onClick={() => !isDisabled && onSelect(lm as any)}
            disabled={isDisabled}
            className={`
              px-6 py-2 sm:px-8 sm:py-3 rounded-full border 
              text-sm sm:text-xl transition
              ${isDisabled ? "opacity-40 cursor-not-allowed" : ""}
              ${
                langMode === lm
                  ? "bg-natly-teal text-white border-natly-teal shadow-md"
                  : "border-gray-300 text-natly-blue bg-white"
              }
            `}
          >
            {lm === "both"
              ? t("labels.language_both")
              : t(`labels.language_${lm}`)}
          </button>
        );
      })}
    </div>
  );
}
