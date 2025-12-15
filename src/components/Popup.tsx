interface PopupProps {
  title: string;
  message: string;
  onClose: () => void;
  buttonText?: string;
}

export default function Popup({
  title,
  message,
  onClose,
  buttonText = "Entendido"
}: PopupProps) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm text-center border border-natly-teal animate-fadeIn">
        
        <h2 className="text-2xl font-bold text-natly-blue mb-2">
          {title}
        </h2>

        <p className="text-natly-gray mb-6">
          {message}
        </p>

        <button
          onClick={onClose}
          className="
            px-6 py-2 rounded-full 
            bg-natly-teal text-white font-semibold 
            hover:bg-natly-teal-dark transition
          "
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
