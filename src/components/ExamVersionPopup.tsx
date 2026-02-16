interface ExamVersionPopupProps {
  onSelect: (v: "exam_2008_100" | "exam_2025_128") => void;
  tCommon: (key: string) => string;
}

export default function ExamVersionPopup({
  onSelect,
  tCommon,
}: ExamVersionPopupProps) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">

        <h2 className="text-natly-teal text-lg font-semibold mb-4">
          {tCommon("options.choose_exam_version")}
        </h2>

        {/* 128 */}
        <button
          onClick={() => onSelect("exam_2025_128")}
          className="
            w-full mb-3 p-4 rounded-xl border
            border-natly-teal bg-natly-teal/10
            text-left hover:bg-natly-teal/20
          "
        >
          <p className="font-semibold text-natly-teal">
            {tCommon("options.exam_version_128")}
          </p>
          <p className="text-sm text-natly-blue/70">
            {tCommon("options.exam_version_recommended")}
          </p>
        </button>

        {/* 100 */}
        <button
          onClick={() => onSelect("exam_2008_100")}
          className="
            w-full p-4 rounded-xl border
            border-natly-teal text-left
            hover:bg-natly-teal/10
          "
        >
          <p className="font-semibold text-natly-blue">
            {tCommon("options.exam_version_100")}
          </p>
          <p className="text-sm text-natly-blue/70">
            {tCommon("options.exam_version_previous")}
          </p>
        </button>
      </div>
    </div>
  );
}
