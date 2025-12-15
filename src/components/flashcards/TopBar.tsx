import { IconSearch, IconFilter, IconClose } from "../../natly-icons";

interface TopBarProps {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  openSearchMobile: () => void;
  openFiltersMobile: () => void;
  openFiltersDesktop: () => void;
  tCommon: any;
}

export default function TopBar({
  searchQuery,
  setSearchQuery,
  openSearchMobile,
  openFiltersMobile,
  openFiltersDesktop,
  tCommon,
}: TopBarProps) {
  return (
    <div className="flex justify-between items-center text-natly-blue my-6">

      {/* 🔍 MOBILE SEARCH BUTTON */}
      <button
        className="md:hidden flex items-center gap-2 bg-white border border-natly-teal rounded-full px-4 py-2 shadow-sm"
        onClick={openSearchMobile}
      >
        <IconSearch size={22} />
        <span>{tCommon("titles.search_question_title")}</span>
      </button>

      {/* 🔍 DESKTOP SEARCH INPUT */}
      <div className="hidden md:flex items-center gap-3 bg-white border border-natly-teal rounded-full px-5 py-2 shadow-sm w-full md:w-80">
        <IconSearch size={26} />
        <input
          type="text"
          placeholder={tCommon("actions.search_question")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 outline-none text-natly-blue placeholder-natly-blue/40"
        />
        {searchQuery.length > 0 && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-natly-blue/60 hover:text-natly-blue"
          >
            <IconClose size={26} />
          </button>
        )}
      </div>



      {/* ⚙ MOBILE FILTER BUTTON */}
      <button
        className="md:hidden flex items-center gap-2 bg-white border border-natly-teal rounded-full px-4 py-2 shadow-sm"
        onClick={openFiltersMobile}
      >
        <IconFilter color="#0a6a73" size={22} />
        <span>{tCommon("actions.filters")}</span>
      </button>

      {/* DESKTOP FILTER BUTTON */}
      <button
        onClick={openFiltersDesktop}
        className="
          hidden md:flex items-center gap-2 
          border border-natly-teal text-natly-teal
          rounded-full px-4 py-2 bg-white shadow-sm
          hover:bg-natly-teal-dark hover:text-white
        "
      >
        <IconFilter size={22} />
        <span>{tCommon("actions.filters")}</span>
      </button>
    </div>
  );
}
