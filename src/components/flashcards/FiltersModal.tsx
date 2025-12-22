import { IconClose } from "../../natly-icons";

interface FiltersModalProps {
  show: boolean;
  onClose: () => void;

  filters: {
    category: string;
    range: { min: number; max: number };
  };
  setFilters: (value: any) => void;

  statusFilters: {
    known: boolean;
    hard: boolean;
    save: boolean;
  };
  setStatusFilters: (value: any) => void;

  dynamicCategories: Array<{ id: string; labelKey: string }>;

  clearAllStatuses: () => void;

  cardStatus: Record<
    number,
    { known: boolean; hard: boolean; save: boolean }
  >;

  tCommon: (key: string) => string;
}

export default function FiltersModal({
  show,
  onClose,
  filters,
  setFilters,
  statusFilters,
  setStatusFilters,
  dynamicCategories,
  cardStatus,
  clearAllStatuses,
  tCommon,
}: FiltersModalProps) {
  if (!show) return null;

  // Counters
  const knownCount = Object.values(cardStatus).filter((s) => s.known).length;
  const hardCount = Object.values(cardStatus).filter((s) => s.hard).length;
  const saveCount = Object.values(cardStatus).filter((s) => s.save).length;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50">
      <div className="bg-white w-full p-6 rounded-t-3xl shadow-xl animate-slideUp">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-natly-teal">
            {tCommon("actions.filters")}
          </h2>

          <button className="text-natly-teal text-2xl" onClick={onClose}>
            <IconClose size={24} />
          </button>
        </div>

        {/* Categories */}
        <p className="font-semibold text-natly-teal mb-2">
          {tCommon("filters.categories")}
        </p>

        <div className="space-y-2 mb-6">
          {dynamicCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilters({ ...filters, category: cat.id })}
              className={`w-full flex justify-between items-center px-3 py-2 rounded-lg ${
                filters.category === cat.id
                  ? "bg-natly-teal text-white"
                  : "bg-natly-cream"
              }`}
            >
              {tCommon(cat.labelKey)}
            </button>
          ))}
        </div>

        {/* Status */}
        <p className="font-semibold text-natly-teal mb-2">
          {tCommon("filters.status")}
        </p>

        <div className="space-y-4 mb-6">
          
          {/* Known */}
          <label className="flex justify-between items-center cursor-pointer">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={statusFilters.known}
                onChange={() =>
                  setStatusFilters({
                    ...statusFilters,
                    known: !statusFilters.known,
                  })
                }
              />
              {tCommon("actions.like")}
            </div>

            <span className="font-bold">({knownCount})</span>
          </label>

          {/* Hard */}
          <label className="flex justify-between items-center cursor-pointer">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={statusFilters.hard}
                onChange={() =>
                  setStatusFilters({
                    ...statusFilters,
                    hard: !statusFilters.hard,
                  })
                }
              />
              {tCommon("actions.dislike")}
            </div>

            <span className="font-bold">({hardCount})</span>
          </label>

          {/* Save */}
          <label className="flex justify-between items-center cursor-pointer">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={statusFilters.save}
                onChange={() =>
                  setStatusFilters({
                    ...statusFilters,
                    save: !statusFilters.save,
                  })
                }
              />
              {tCommon("filters.status_saved")}
            </div>

            <span className="font-bold">({saveCount})</span>
          </label>

          <button onClick={clearAllStatuses}
            className="text-natly-teal underline">
            {tCommon("actions.clear_all_statuses")}
          </button>
        </div>

        {/* Range */}
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
            className="w-20 border border-natly-teal rounded-xl px-3 py-2"
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
            className="w-20 border border-natly-teal rounded-xl px-3 py-2"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => {
              setFilters({ category: "all", range: { min: 1, max: 120 } });
              setStatusFilters({
                known: false,
                hard: false,
                save: false,
              });
            }}
            className="text-natly-teal underline"
          >
            {tCommon("buttons.reset")}
          </button>

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
