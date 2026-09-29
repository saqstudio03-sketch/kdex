import { Check as CheckIcon } from "lucide-react";
import {
  PRICE_BANDS,
  RELEASE_WINDOWS,
  PLATFORMS,
  PRODUCT_TYPES,
  GENRES,
  GAME_MODES,
  FEATURES,
  LANGUAGES,
} from "@/data/catalog";
import { cn } from "@/lib/utils";
import type { Filters } from "@/lib/filtering";

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-line py-4 first:pt-0 last:border-0">
      <h4 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-white">
        {title}
      </h4>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted transition-colors hover:text-white">
      <span
        className={cn(
          "grid h-4 w-4 shrink-0 place-items-center rounded border transition-all",
          checked ? "border-accent bg-accent" : "border-line bg-surface"
        )}
      >
        {checked && <CheckIcon className="h-3 w-3 text-black" />}
      </span>
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
}

/** Desktop filter sidebar (mirrored by the mobile drawer). */
export function FilterPanel({
  value,
  onChange,
  onClear,
  resultCount,
}: {
  value: Filters;
  onChange: (next: Filters) => void;
  onClear: () => void;
  resultCount: number;
}) {
  const toggle = (key: keyof Filters, v: string) =>
    onChange({
      ...value,
      [key]: value[key].includes(v)
        ? value[key].filter((x) => x !== v)
        : [...value[key], v],
    });

  return (
    <div className="rounded-2xl border border-line bg-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-base font-bold">Filters</h3>
        <button
          onClick={onClear}
          className="text-xs font-medium text-accent hover:underline"
        >
          Clear all
        </button>
      </div>
      <p className="mb-2 text-xs text-muted">{resultCount} results</p>

      <Group title="Price">
        {PRICE_BANDS.map((b) => (
          <Check
            key={b.id}
            label={b.label}
            checked={value.price.includes(b.id)}
            onChange={() => toggle("price", b.id)}
          />
        ))}
      </Group>

      <Group title="Release date">
        {RELEASE_WINDOWS.map((w) => (
          <Check
            key={w.id}
            label={w.label}
            checked={value.release.includes(w.id)}
            onChange={() => toggle("release", w.id)}
          />
        ))}
      </Group>

      <Group title="Platform">
        {PLATFORMS.map((p) => (
          <Check
            key={p}
            label={p}
            checked={value.platform.includes(p)}
            onChange={() => toggle("platform", p)}
          />
        ))}
      </Group>

      <Group title="Product type">
        {PRODUCT_TYPES.map((t) => (
          <Check
            key={t}
            label={t}
            checked={value.type.includes(t)}
            onChange={() => toggle("type", t)}
          />
        ))}
      </Group>

      <Group title="Genre">
        {GENRES.map((g) => (
          <Check
            key={g}
            label={g}
            checked={value.genre.includes(g)}
            onChange={() => toggle("genre", g)}
          />
        ))}
      </Group>

      <Group title="Game mode">
        {GAME_MODES.map((m) => (
          <Check
            key={m}
            label={m}
            checked={value.mode.includes(m)}
            onChange={() => toggle("mode", m)}
          />
        ))}
      </Group>

      <Group title="Features">
        {FEATURES.map((f) => (
          <Check
            key={f}
            label={f}
            checked={value.feature.includes(f)}
            onChange={() => toggle("feature", f)}
          />
        ))}
      </Group>

      <Group title="Language">
        {LANGUAGES.map((l) => (
          <Check
            key={l}
            label={l}
            checked={value.language.includes(l)}
            onChange={() => toggle("language", l)}
          />
        ))}
      </Group>
    </div>
  );
}
