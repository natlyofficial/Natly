interface FiltersDesktopPanelProps {
  filters: any;
  setFilters: (value: any) => void;

  statusFilter: "known" | "hard" | "save" | null;
  setStatusFilter: (v: "known" | "hard" | "save" | null) => void;

  dynamicCategories: Array<{ id: string; labelKey: string }>;

  cardStatus: Record<
    number,
    { known: boolean; hard: boolean; save: boolean }
  >;

  clearAllStatuses: () => void;

  tCommon: (key: string) => string;

  close: () => void;
}

export default function FiltersDesktopPanel({
  filters,
  setFilters,
  statusFilter,
  setStatusFilter,
  dynamicCategories,
  cardStatus,
  clearAllStatuses,
  tCommon,
  close,
}: FiltersDesktopPanelProps) {
  const knownCount = Object.values(cardStatus).filter((s) => s.known).length;
  const hardCount = Object.values(cardStatus).filter((s) => s.hard).length;
  const saveCount = Object.values(cardStatus).filter((s) => s.save).length;
  return (
    <div
      className="
        absolute right-0 
        w-72 bg-white border border-natly-teal 
        rounded-2xl shadow-xl p-5 z-50 animate-fadeIn
      "
    >
      {/* --- Categorías --- */}
      <p className="text-natly-teal font-semibold mb-2">
        {tCommon("filters.categories")}
      </p>

      <div className="space-y-2 mb-4">
        {dynamicCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilters({ ...filters, category: cat.id })}
            className={`w-full text-left px-3 py-2 rounded-lg ${
              filters.category === cat.id
                ? "bg-natly-teal text-white"
                : "hover:bg-natly-teal hover:text-white text-natly-blue"
            }`}
          >
            {tCommon(cat.labelKey)}
          </button>
        ))}
      </div>

      {/* --- Estados --- */}
      <p className="font-semibold text-natly-teal mb-2">
        {tCommon("filters.status")}
      </p>

      <div className="space-y-3 mb-4">
        <label className="flex items-center gap-2 text-natly-teal cursor-pointer">
          <input
            type="radio"
            name="statusFilter"
            checked={statusFilter === "known"}
            onChange={() => setStatusFilter("known")}
          />
          {tCommon("actions.like")}
          <span className="font-bold">({knownCount})</span>
        </label>

        <label className="flex items-center gap-2 text-natly-teal cursor-pointer">
          <input
            type="radio"
            name="statusFilter"
            checked={statusFilter === "hard"}
            onChange={() => setStatusFilter("hard")}
          />

          {tCommon("actions.dislike")}
          <span className="font-bold">({hardCount})</span>
        </label>

        <label className="flex items-center gap-2 text-natly-teal cursor-pointer">
          <input
            type="radio"
            name="statusFilter"
            checked={statusFilter === "save"}
            onChange={() => setStatusFilter("save")}
          />

          {tCommon("filters.status_saved")}
          <span className="font-bold">({saveCount})</span>
        </label>

        <button
          onClick={() => {
            clearAllStatuses();
            close();
          }}
          className="text-natly-teal underline cursor-pointer"
        >
          {tCommon("actions.clear_all_statuses")}
        </button>

      </div>

      {/* --- Rango --- */}
      <p className="font-semibold text-natly-teal mb-2">
        {tCommon("filters.range")}
      </p>

      <div className="flex items-center gap-3 mb-6">
        <input
          type="number"
          value={filters.range.min}
          onChange={(e) =>
            setFilters({
              ...filters,
              range: { ...filters.range, min: Number(e.target.value) },
            })
          }
          className="w-20 border border-natly-teal rounded-full px-3 py-2"
        />

        <span>–</span>

        <input
          type="number"
          value={filters.range.max}
          onChange={(e) =>
            setFilters({
              ...filters,
              range: { ...filters.range, max: Number(e.target.value) },
            })
          }
          className="w-20 border border-natly-teal rounded-full px-3 py-2"
        />
      </div>

      {/* --- Acciones --- */}
      <div className="flex justify-between">
        <button
          onClick={() => {
            setFilters({
              category: "all",
              range: { min: 1, max: filters.range.max },
            });
            setStatusFilter(null);
          }}
          className="text-natly-teal underline"
        >
          {tCommon("buttons.reset")}
        </button>

        <button
          onClick={close}
          className="bg-natly-teal text-white px-4 py-2 rounded-full shadow-md hover:bg-natly-teal-dark"
        >
          {tCommon("buttons.apply")}
        </button>
      </div>
    </div>
  );
}
