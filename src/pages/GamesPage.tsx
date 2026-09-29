import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import { products } from "@/data/products";
import { SORT_OPTIONS, type SortId } from "@/data/catalog";
import { applyFilters, emptyFilters, activeFilterCount, type Filters } from "@/lib/filtering";
import { usePageSeo } from "@/hooks/usePageSeo";
import { ProductCard } from "@/components/product/ProductCard";
import { FilterPanel } from "@/components/catalog/FilterPanel";
import { FilterDrawer } from "@/components/catalog/FilterDrawer";
import { ActiveChips } from "@/components/catalog/ActiveChips";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

const PER_PAGE = 12;
const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function GamesPage() {
  const { platform, genre } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = (searchParams.get("sort") as SortId) || "recommended";
  const typeParam = searchParams.get("type");

  const [filters, setFilters] = useState<Filters>({
    ...emptyFilters,
    platform: platform ? [titleCase(platform)] : [],
    genre: genre ? [titleCase(genre)] : [],
    type: typeParam ? [typeParam] : [],
  });
  const [page, setPage] = useState(1);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    setFilters({
      ...emptyFilters,
      platform: platform ? [titleCase(platform)] : [],
      genre: genre ? [titleCase(genre)] : [],
      type: typeParam ? [typeParam] : [],
    });
    setPage(1);
  }, [platform, genre, typeParam]);

  const results = useMemo(() => applyFilters(products, filters, sort), [filters, sort]);
  useEffect(() => setPage(1), [filters, sort]);

  const heading = platform
    ? `${titleCase(platform)} Games`
    : genre
      ? `${titleCase(genre)} Games`
      : typeParam
        ? `${typeParam}s`
        : "All Games";

  usePageSeo({
    title: `${heading} — KDex Games`,
    description: `Browse ${heading.toLowerCase()} — filter by price, platform, genre, game mode and more.`,
    canonicalPath: platform ? `/platform/${platform}` : genre ? `/genre/${genre}` : "/games",
  });

  const visible = results.slice(0, page * PER_PAGE);
  const pages = Math.max(1, Math.ceil(results.length / PER_PAGE));
  const count = activeFilterCount(filters);
  const clear = () => setFilters({ ...emptyFilters });

  const setSort = (id: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("sort", id);
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="mx-auto w-full max-w-[1920px] px-4 py-8 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <p className="mb-4 text-xs text-muted">
        <Link to="/" className="hover:text-accent">Home</Link> /{" "}
        <Link to="/games" className="hover:text-accent">Games</Link>
        {heading !== "All Games" && <span className="text-white"> / {heading}</span>}
      </p>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold md:text-3xl">{heading}</h1>
          <p className="mt-1 text-sm text-muted">
            {results.length} product{results.length === 1 ? "" : "s"} available
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="lg:hidden" onClick={() => setDrawer(true)}>
            <SlidersHorizontal className="h-4 w-4" /> Filters
            {count > 0 && (
              <span className="ml-1 grid h-5 w-5 place-items-center rounded-full bg-accent text-[10px] font-bold text-black">
                {count}
              </span>
            )}
          </Button>
          <label className="flex items-center gap-2 rounded-lg border border-line bg-card px-3 py-2 text-sm">
            <span className="hidden text-muted sm:block">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent text-white outline-none"
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.id} value={o.id} className="bg-card">{o.label}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <ActiveChips filters={filters} onChange={setFilters} />

      <div className="mt-6 flex gap-6">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24">
            <FilterPanel value={filters} onChange={setFilters} onClear={clear} resultCount={results.length} />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {results.length === 0 ? (
            <EmptyState
              icon="search"
              title="No products match these filters"
              description="Try removing a filter or widening your price range."
              action={<Button onClick={clear}>Reset filters</Button>}
            />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                {visible.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              {page < pages && (
                <div className="mt-8 flex justify-center">
                  <Button variant="outline" size="lg" onClick={() => setPage((p) => p + 1)}>
                    Load more ({results.length - visible.length} remaining)
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <FilterDrawer
        open={drawer}
        onClose={() => setDrawer(false)}
        filters={filters}
        setFilters={setFilters}
        onClear={clear}
        resultCount={results.length}
      />
    </div>
  );
}
