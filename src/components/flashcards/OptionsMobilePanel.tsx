import { IconClose } from "../../natly-icons";

interface OptionsMobilePanelProps {
  show: boolean;
  onClose: () => void;

  examVersion: "exam_2008_100" | "exam_2025_128";
  setExamVersion: (v: "exam_2008_100" | "exam_2025_128") => void;

  tCommon: (key: string) => string;
}

export default function OptionsMobilePanel({
  show,
  onClose,
  examVersion,
  setExamVersion,
  tCommon,
}: OptionsMobilePanelProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50">
      <div className="bg-white w-full p-6 rounded-t-3xl shadow-xl animate-slideUp">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-natly-teal">
            {tCommon("actions.options")}
          </h2>

          <button className="text-natly-teal" onClick={onClose}>
            <IconClose size={24} />
          </button>
        </div>

        {/* Exam Version */}
        <p className="font-semibold text-natly-teal mb-3">
          {tCommon("options.exam_version")}
        </p>

        <div className="space-y-3 mb-6">

          {/* 128 – Recommended */}
          <button
            onClick={() => setExamVersion("exam_2025_128")}
            className={`
              w-full text-left px-4 py-3 rounded-xl border
              ${
                examVersion === "exam_2025_128"
                  ? "border-natly-teal bg-natly-teal/10 text-natly-teal"
                  : "border-gray-200 bg-white text-natly-blue"
              }
            `}
          >
            <p className="font-semibold">
              {tCommon("options.exam_version_128")}
            </p>
            <p className="text-sm opacity-70">
              {tCommon("options.exam_version_recommended")}
            </p>
          </button>

          {/* 100 – Previous */}
          <button
            onClick={() => setExamVersion("exam_2008_100")}
            className={`
              w-full text-left px-4 py-3 rounded-xl border
              ${
                examVersion === "exam_2008_100"
                  ? "border-natly-teal bg-natly-teal/10 text-natly-teal"
                  : "border-gray-200 bg-white text-natly-blue"
              }
            `}
          >
            <p className="font-semibold">
              {tCommon("options.exam_version_100")}
            </p>
            <p className="text-sm opacity-70">
              {tCommon("options.exam_version_previous")}
            </p>
          </button>
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-natly-teal text-white px-6 py-2 rounded-full"
          >
            {tCommon("buttons.apply")}
          </button>
        </div>
      </div>
    </div>
  );
}
