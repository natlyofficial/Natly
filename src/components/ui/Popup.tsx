interface PopupProps {
  title: string;
  message: string;
  onClose: () => void;
  buttonText?: string;
  accent?: "teal" | "blue" | "yellow";
}

export default function Popup({
  title,
  message,
  onClose,
  buttonText = "Entendido",
  accent = "teal"
}: PopupProps) {
  const accentMap = {
    teal: "border-natly-teal text-natly-blue bg-natly-teal hover:bg-natly-teal-dark",
    blue: "border-natly-blue text-natly-blue bg-natly-blue hover:brightness-95",
    yellow: "border-natly-yellow text-natly-blue-dark bg-natly-yellow hover:brightness-95"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className={`bg-white rounded-2xl shadow-xl p-8 max-w-sm text-center border animate-fadeIn ${accentMap[accent].split(" ")[0]}`}
      >
        <h2 className="text-2xl font-bold mb-2 text-natly-blue">
          {title}
        </h2>

        <p className="text-natly-gray mt-6 mb-4">
          {message}
        </p>

        <button
          onClick={onClose}
          className={`
            px-6 py-2 rounded-full font-semibold transition text-white
            ${accentMap[accent].replace(accentMap[accent].split(" ")[0], "")}
          `}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
