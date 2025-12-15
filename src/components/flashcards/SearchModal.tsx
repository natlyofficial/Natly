import { IconClose } from "../../natly-icons";

interface SearchModalProps {
  show: boolean;
  close: () => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  tCommon: any;
}

export default function SearchModal({
  show,
  close,
  searchQuery,
  setSearchQuery,
  tCommon,
}: SearchModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50">
      <div className="bg-white w-full p-6 rounded-t-3xl shadow-xl animate-slideUp">
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-natly-teal">
            {tCommon("titles.search_question_title")}
          </h2>
          <button className="text-natly-teal" onClick={close}>
            <IconClose size={26} />
          </button>
        </div>

        {/* 🔍 SEARCH INPUT + CLEAR BUTTON */}
        <div className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={tCommon("actions.search_question")}
            className="w-full p-3 pr-10 border border-natly-teal rounded-xl text-natly-teal"
          />

          {searchQuery.length > 0 && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-natly-teal/60 text-xl"
            >
              <IconClose size={25}/>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
