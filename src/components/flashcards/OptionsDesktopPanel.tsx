interface OptionsDesktopPanelProps {
  examVersion: "100" | "128";
  setExamVersion: (v: "100" | "128") => void;

  tCommon: (key: string) => string;
  close: () => void;
}

export default function OptionsDesktopPanel({
  examVersion,
  setExamVersion,
  tCommon,
  close,
}: OptionsDesktopPanelProps) {
  return (
    <div
      className="
        absolute right-0 
        w-72 bg-white border border-natly-teal 
        rounded-2xl shadow-xl p-5 z-50 animate-fadeIn
      "
    >
      {/* --- EXAM VERSION --- */}
      <p className="text-natly-teal font-semibold mb-3">
        {tCommon("options.exam_version")}
      </p>

      <div className="space-y-3 mb-5">

        {/* 128 – DEFAULT / RECOMMENDED */}
        <label
          className={`
            flex items-center gap-3 cursor-pointer rounded-lg px-3 py-2
            ${
              examVersion === "128"
                ? "bg-natly-teal/10 text-natly-teal font-semibold"
                : "hover:bg-natly-teal/5 text-natly-blue"
            }
          `}
        >
          <input
            type="checkbox"
            checked={examVersion === "128"}
            onChange={() => {
              // 128 is default: if already selected, do nothing
              if (examVersion !== "128") {
                setExamVersion("128");
              }
            }}
            className="accent-natly-teal"
          />
          <div className="flex flex-col">
            <span>{tCommon("options.exam_version_128")}</span>
            <span className="text-xs text-natly-blue/60">
              {tCommon("options.exam_version_recommended")}
            </span>
          </div>
        </label>

        {/* 100 – PREVIOUS */}
        <label
          className={`
            flex items-center gap-3 cursor-pointer rounded-lg px-3 py-2
            ${
              examVersion === "100"
                ? "bg-natly-teal/10 text-natly-teal font-semibold"
                : "hover:bg-natly-teal/5 text-natly-blue"
            }
          `}
        >
          <input
            type="checkbox"
            checked={examVersion === "100"}
            onChange={() => {
              // switching to previous version must be explicit
              if (examVersion !== "100") {
                setExamVersion("100");
              }
            }}
            className="accent-natly-teal"
          />
          <div className="flex flex-col">
            <span>{tCommon("options.exam_version_100")}</span>
            <span className="text-xs text-natly-blue/60">
              {tCommon("options.exam_version_previous")}
            </span>
          </div>
        </label>
      </div>

      {/* --- ACTIONS --- */}
      <div className="flex justify-end">
        <button
          onClick={close}
          className="
            bg-natly-teal text-white px-4 py-2 rounded-full
            shadow-md hover:bg-natly-teal-dark
          "
        >
          {tCommon("buttons.apply")}
        </button>
      </div>
    </div>
  );
}
