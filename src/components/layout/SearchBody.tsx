import { Link, useNavigate } from "react-router-dom";
import { TrendingUp, Clock, ArrowRight } from "lucide-react";
import type { Product } from "@/types";
import { GENRES } from "@/data/catalog";
import { formatINR, discountPercent } from "@/lib/utils";
import { Artwork } from "@/components/Artwork";
import { EmptyState } from "@/components/ui/EmptyState";

const POPULAR = ["Neon Revenant", "Ashfall Protocol", "gift card", "horror", "pre-order"];

export function SearchBody({
  q,
  setQ,
  results,
  recent,
  commit,
  onNavigate,
}: {
  q: string;
  setQ: (v: string) => void;
  results: Product[];
  recent: string[];
  commit: (term: string) => void;
  onNavigate: () => void;
}) {
  const navigate = useNavigate();

  if (q.trim() === "")
    return (
      <div className="space-y-5">
        {recent.length > 0 && (
          <section>
            <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
              <Clock className="h-3.5 w-3.5" /> Recent searches
            </h4>
            <div className="flex flex-wrap gap-2">
              {recent.map((r) => (
                <button
                  key={r}
                  onClick={() => commit(r)}
                  className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-white hover:border-accent/50"
                >
                  {r}
                </button>
              ))}
            </div>
          </section>
        )}
        <section>
          <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
            <TrendingUp className="h-3.5 w-3.5" /> Popular searches
          </h4>
          <div className="flex flex-wrap gap-2">
            {POPULAR.map((r) => (
              <button
                key={r}
                onClick={() => commit(r)}
                className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs text-white hover:border-accent/50"
              >
                {r}
              </button>
            ))}
          </div>
        </section>
        <section>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
            Categories
          </h4>
          <div className="flex flex-wrap gap-2">
            {GENRES.slice(0, 8).map((g) => (
              <button
                key={g}
                onClick={() => {
                  onNavigate();
                  navigate(`/genre/${g.toLowerCase()}`);
                }}
                className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs text-muted hover:border-accent/50 hover:text-white"
              >
                {g}
              </button>
            ))}
          </div>
        </section>
      </div>
    );

  if (results.length === 0)
    return (
      <EmptyState
        icon="search"
        title={`No results for “${q}”`}
        description="Try a different title, developer or genre — or jump to a popular search."
        className="border-0 bg-transparent py-8"
        action={
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR.slice(0, 3).map((s) => (
              <button
                key={s}
                onClick={() => setQ(s)}
                className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs text-white hover:border-accent/50"
              >
                {s}
              </button>
            ))}
          </div>
        }
      />
    );

  return (
    <ul className="space-y-1">
      {results.map((p) => (
        <li key={p.id}>
          <Link
            to={`/game/${p.slug}`}
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-surface"
          >
            <div className="h-14 w-11 shrink-0 overflow-hidden rounded-md bg-bg">
              <Artwork seed={p.imageSeed} alt={p.title} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{p.title}</p>
              <p className="text-xs text-muted">
                {p.platform} • {p.genre}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-accent">{formatINR(p.salePrice)}</p>
              {discountPercent(p.price, p.salePrice) > 0 && (
                <p className="text-[11px] text-muted line-through">{formatINR(p.price)}</p>
              )}
            </div>
          </Link>
        </li>
      ))}
      <li>
        <button
          onClick={() => commit(q)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-surface p-3 text-sm font-medium text-accent hover:border-accent/50"
        >
          View all results <ArrowRight className="h-4 w-4" />
        </button>
      </li>
    </ul>
  );
}
