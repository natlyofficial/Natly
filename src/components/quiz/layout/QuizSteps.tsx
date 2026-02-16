import { useTranslation } from "react-i18next";

type Props = {
  current: 1 | 2 | 3;
  onBack?: () => void;
};

export default function QuizSteps({ current, onBack }: Props) {
  const { t } = useTranslation("quiz");

  const base =
    "rounded-full px-4 py-2 text-xs font-bold md:px-7 md:py-2";

  return (
    <div className="mt-3 mb-4 flex items-center justify-center gap-3">

      {/* Step 1 */}
      <span
        onClick={current > 1 ? onBack : undefined}
        className={`
          ${base}
          ${
            current === 1
              ? "bg-natly-yellow text-natly-blue-dark"
              : "bg-natly-blue text-white cursor-pointer"
          }
        `}
      >
        {t("steps.step_1")}
      </span>

      <div
        className={`h-1 w-10 sm:w-20 rounded-full ${
          current >= 2
            ? "bg-natly-yellow"
            : "bg-natly-blue opacity-30"
        }`}
      />

      {/* Step 2 */}
      <span
        className={`
          ${base}
          ${
            current === 2
              ? "bg-natly-yellow text-natly-blue-dark"
              : current > 2
              ? "bg-natly-blue text-white"
              : "border border-natly-blue text-natly-blue cursor-default"
          }
        `}
      >
        {t("steps.step_2")}
      </span>
      
      <div
        className={`h-1 w-10 sm:w-20 rounded-full ${
          current >= 3
            ? "bg-natly-yellow"
            : "bg-natly-blue opacity-20"
        }`}
      />

      {/* Step 3 */}
      <span
        className={`
          ${base}
          ${
            current === 3
              ? "bg-natly-yellow text-natly-blue-dark"
              : "border border-natly-blue text-natly-blue"
          }
        `}
      >
        {t("steps.step_3")}
      </span>
    </div>
  );
}
