import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarRange, ChevronRight } from "lucide-react";
import { upcomingProducts } from "@/data/products";
import { formatINR, daysUntil, cn } from "@/lib/utils";
import { usePageSeo } from "@/hooks/usePageSeo";
import { Artwork } from "@/components/Artwork";
import { EmptyState } from "@/components/ui/EmptyState";

type Range = "all" | "30" | "90";
const RANGES: { id: Range; label: string }[] = [
  { id: "all", label: "All upcoming" },
  { id: "30", label: "Next 30 days" },
  { id: "90", label: "Next 3 months" },
];

/** Release calendar page grouped by date. */
export default function UpcomingPage() {
  usePageSeo({
    title: "Upcoming Release Calendar — KDex Games",
    description: "Every confirmed release date for the next season, grouped day by day.",
    canonicalPath: "/upcoming",
  });

  const [range, setRange] = useState<Range>("all");

  const list = useMemo(
    () =>
      upcomingProducts.filter((p) => {
        const d = daysUntil(p.releaseDate);
        if (range === "30") return d <= 30;
        if (range === "90") return d <= 90;
        return d > 0;
      }),
    [range]
  );

  const groups = useMemo(() => {
    const acc: Record<string, typeof list> = {};
    list.forEach((p) => (acc[p.releaseDate] ??= []).push(p));
    return acc;
  }, [list]);
  const dates = Object.keys(groups).sort();

  return (
    <div className="mx-auto w-full max-w-[1920px] px-4 py-8 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 font-display text-3xl font-bold">
            <CalendarRange className="h-7 w-7 text-accent" /> Release Calendar
          </h1>
          <p className="mt-1.5 text-sm text-muted">Browse everything launching soon.</p>
        </div>
        <div className="flex gap-2">
          {RANGES.map((r) => (
            <button
              key={r.id}
              onClick={() => setRange(r.id)}
              className={cn(
                "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                range === r.id
                  ? "border-accent bg-accent text-black"
                  : "border-line bg-card text-muted hover:text-white"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {dates.length === 0 ? (
        <EmptyState title="Nothing scheduled in this window" description="Try a wider range." />
      ) : (
        <div className="space-y-8">
          {dates.map((date) => {
            const d = new Date(date);
            const days = daysUntil(date);
            return (
              <section key={date}>
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-lg border border-line bg-card px-3 py-1.5 text-center">
                    <p className="font-display text-lg font-bold leading-none">
                      {d.toLocaleDateString("en-IN", { day: "numeric" })}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-muted">
                      {d.toLocaleDateString("en-IN", { month: "short" })}
                    </p>
                  </div>
                  <h2 className="font-display text-lg font-bold">
                    {d.toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })}
                  </h2>
                  <span className="text-xs text-muted">in {days} day{days === 1 ? "" : "s"}</span>
                </div>

                <div className="grid gap-3">
                  {groups[date].map((p) => (
                    <Link
                      key={p.id}
                      to={`/game/${p.slug}`}
                      className="group flex items-center gap-4 rounded-xl border border-line bg-card p-3 transition-colors hover:border-accent/50"
                    >
                      <div className="h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-surface">
                        <Artwork seed={p.imageSeed} alt={p.title} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold group-hover:text-accent">{p.title}</p>
                        <p className="text-xs text-muted">
                          {p.platform} • {p.genre} • {p.availability === "preorder" ? "Pre-order open" : "Coming soon"}
                        </p>
                      </div>
                      <span className="hidden font-display font-bold text-accent sm:block">
                        {formatINR(p.salePrice)}
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted" />
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
