interface PopupProps {
  title: string;
  message: string;
  onClose: () => void;
  buttonText?: string;
  accent?: "teal" | "blue" | "yellow";
  secondaryButton?: {
    text: string;
    onClick: () => void;
  };
  icon?: "lock" | "star" | "info";
}

export default function Popup({
  title,
  message,
  onClose,
  buttonText = "Entendido",
  accent = "teal",
  secondaryButton,
  icon
}: PopupProps) {
  const accentMap = {
    teal: "border-natly-teal text-natly-blue bg-natly-teal hover:bg-natly-teal-dark",
    blue: "border-natly-blue text-natly-blue bg-natly-blue hover:brightness-95",
    yellow: "border-natly-yellow text-natly-blue-dark bg-natly-yellow hover:brightness-95"
  };

  /* ================================
     Icon rendering
  ================================ */

  const renderIcon = () => {
    if (!icon) return null;

    const iconMap = {
      lock: "🔒",
      star: "⭐",
      info: "ℹ️"
    };

    return (
      <div className="text-5xl mb-4">
        {iconMap[icon]}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className={`bg-white rounded-2xl shadow-xl p-8 max-w-sm text-center border animate-fadeIn ${accentMap[accent].split(" ")[0]}`}
      >
        {/* Optional icon */}
        {renderIcon()}

        {/* Title */}
        <h2 className="text-2xl font-bold mb-2 text-natly-blue">
          {title}
        </h2>

        {/* Message - preserve line breaks */}
        <p className="text-natly-gray mt-6 mb-4 whitespace-pre-line">
          {message}
        </p>

        {/* Buttons container */}
        <div className={`flex gap-3 ${secondaryButton ? 'flex-col sm:flex-row' : 'justify-center'}`}>
          {/* Primary button */}
          <button
            onClick={onClose}
            className={`
              flex-1 px-6 py-2 rounded-full font-semibold transition text-white
              ${accentMap[accent].replace(accentMap[accent].split(" ")[0], "")}
            `}
          >
            {buttonText}
          </button>

          {/* Secondary button (optional) */}
          {secondaryButton && (
            <button
              onClick={secondaryButton.onClick}
              className="
                flex-1 px-6 py-2 rounded-full font-semibold transition
                border-2 border-gray-300 text-gray-700
                hover:bg-gray-100
              "
            >
              {secondaryButton.text}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}