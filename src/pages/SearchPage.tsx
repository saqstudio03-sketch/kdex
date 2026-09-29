import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import { products } from "@/data/products";
import { applyFilters, emptyFilters } from "@/lib/filtering";
import { usePageSeo } from "@/hooks/usePageSeo";
import { save, load } from "@/lib/storage";
import { ProductCard } from "@/components/product/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";

export default function SearchPage() {
  usePageSeo({
    title: "Search — KDex Games",
    description: "Search games, DLC, gift cards and subscriptions by title, developer or genre.",
    canonicalPath: "/search",
  });

  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const [term, setTerm] = useState(q);

  useEffect(() => setTerm(q), [q]);

  const results = useMemo(
    () => applyFilters(products, emptyFilters, "recommended", q || undefined),
    [q]
  );

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next = new URLSearchParams(params);
    term.trim() ? next.set("q", term.trim()) : next.delete("q");
    setParams(next);
    const recent = load<string[]>("recentSearch", []);
    if (term.trim())
      save("recentSearch", [term.trim(), ...recent.filter((r) => r !== term.trim())].slice(0, 6));
  }

  const groups = useMemo(() => {
    const g: Record<string, typeof results> = {};
    results.forEach((p) => (g[p.productType] ??= []).push(p));
    return g;
  }, [results]);

  return (
    <div className="mx-auto w-full max-w-[1920px] px-4 py-8 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <h1 className="font-display text-2xl font-bold md:text-3xl">Search</h1>

      <form onSubmit={submit} className="mt-4 flex max-w-2xl gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-line bg-card px-4">
          <SearchIcon className="h-4 w-4 text-accent" />
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search by title, developer, publisher, genre or tag…"
            className="h-12 w-full bg-transparent text-[15px] text-white outline-none placeholder:text-muted"
            autoFocus
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-accent px-5 text-sm font-semibold text-black transition hover:bg-accent-hover"
        >
          Search
        </button>
      </form>

      <div className="mt-8">
        {!q ? (
          <EmptyState
            icon="search"
            title="Start typing to find your next game"
            description="Search covers titles, developers, publishers, genres, platforms and tags."
          />
        ) : results.length === 0 ? (
          <EmptyState
            icon="search"
            title={`No results for “${q}”`}
            description="Check the spelling, or browse our categories instead."
            action={
              <Link to="/games" className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black">
                Browse all games
              </Link>
            }
          />
        ) : (
          <>
            <p className="mb-5 text-sm text-muted">
              {results.length} result{results.length === 1 ? "" : "s"} for “{q}”
            </p>
            {Object.entries(groups).map(([type, items]) => (
              <section key={type} className="mb-10">
                <h2 className="mb-4 font-display text-lg font-bold text-white">{type}s</h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {items.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </section>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
