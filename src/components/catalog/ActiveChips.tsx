import { X } from "lucide-react";
import type { Filters } from "@/lib/filtering";
import { emptyFilters } from "@/lib/filtering";

const LABELS: Record<keyof Filters, string> = {
  price: "Price",
  release: "Release",
  platform: "Platform",
  type: "Type",
  genre: "Genre",
  mode: "Mode",
  feature: "Feature",
  language: "Language",
};

/** Removable chips for every active filter. */
export function ActiveChips({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
}) {
  const chips = (Object.keys(filters) as (keyof Filters)[]).flatMap((key) =>
    filters[key].map((v) => ({ key, v }))
  );
  if (!chips.length) return null;

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {chips.map(({ key, v }) => (
        <button
          key={key + v}
          onClick={() => onChange({ ...filters, [key]: filters[key].filter((x) => x !== v) })}
          className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent-soft px-3 py-1.5 text-xs font-medium text-accent transition hover:bg-accent/20"
          aria-label={`Remove ${LABELS[key]} filter ${v}`}
        >
          {v} <X className="h-3 w-3" />
        </button>
      ))}
      <button
        onClick={() => onChange({ ...emptyFilters })}
        className="rounded-full border border-line px-3 py-1.5 text-xs text-muted hover:text-white"
      >
        Clear all
      </button>
    </div>
  );
}
