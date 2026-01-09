import {
  IconSearch,
  IconFilter,
  IconClose,
  IconSetting,
} from "../../natly-icons";

/**
 * Props for the Flashcards TopBar component.
 * This component is responsible only for UI interactions
 * (it does NOT manage state or business logic).
 */
interface TopBarProps {
  searchQuery: string;
  setSearchQuery: (v: string) => void;

  /** Mobile actions */
  openSearchMobile: () => void;
  openFiltersMobile: () => void;
  openOptionsMobile: () => void;

  /** Desktop actions */
  openFiltersDesktop: () => void;
  openOptionsDesktop: () => void;

  /** Translation helper */
  tCommon: (key: string) => string;
}

/**
 * Top navigation bar for Flashcards page.
 * Handles search, filters, and options actions
 * for both mobile and desktop layouts.
 */
export default function TopBar({
  searchQuery,
  setSearchQuery,
  openSearchMobile,
  openFiltersMobile,
  openOptionsMobile,
  openFiltersDesktop,
  openOptionsDesktop,
  tCommon,
}: TopBarProps) {
  return (
    <div className="flex flex-col gap-3 my-6 text-natly-teal md:flex-row md:items-center md:justify-between">

      {/* ---------------------------------
          Search Area
      --------------------------------- */}
      <div className="w-full md:w-auto">

        {/* Mobile search button */}
        <button
          className="md:hidden w-full flex items-center gap-2 text-natly-blue/40 bg-white border border-natly-teal rounded-full px-4 py-3 shadow-sm"
          onClick={openSearchMobile}
        >
          <IconSearch size={22} />
          <span>{tCommon("titles.search_question_title")}</span>
        </button>

        {/* Desktop search input */}
        <div className="hidden md:flex items-center gap-3 bg-white border border-natly-teal rounded-full px-5 py-2 shadow-sm w-80">
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
              aria-label="Clear search"
            >
              <IconClose size={26} />
            </button>
          )}
        </div>
      </div>

      {/* ---------------------------------
          Filters & Options
      --------------------------------- */}
      <div className="flex gap-3 w-full md:w-auto">

        {/* Mobile filters button */}
        <button
          className="md:hidden w-full flex items-center justify-center gap-2 bg-white border border-natly-teal rounded-full px-4 py-3 shadow-sm"
          onClick={openFiltersMobile}
        >
          <IconFilter size={22} />
          <span>{tCommon("actions.filters")}</span>
        </button>

        {/* Mobile options button */}
        <button
          className="md:hidden w-full flex items-center justify-center gap-2 bg-white border border-natly-teal rounded-full px-4 py-3 shadow-sm"
          onClick={openOptionsMobile}
        >
          <IconSetting size={22} />
          <span>{tCommon("actions.options")}</span>
        </button>

        {/* Desktop filters button */}
        <button
          onClick={openFiltersDesktop}
          className="
            hidden md:flex items-center gap-2
            border border-natly-teal
            rounded-full px-4 py-2 bg-white shadow-sm
            hover:bg-natly-teal-dark hover:text-white
          "
        >
          <IconFilter size={22} />
          <span>{tCommon("actions.filters")}</span>
        </button>

        {/* Desktop options button */}
        <button
          onClick={openOptionsDesktop}
          className="
            hidden md:flex items-center gap-2
            border border-natly-teal
            rounded-full px-4 py-2 bg-white shadow-sm
            hover:bg-natly-teal-dark hover:text-white
          "
        >
          <IconSetting size={22} />
          <span>{tCommon("actions.options")}</span>
        </button>
      </div>
    </div>
  );
}
