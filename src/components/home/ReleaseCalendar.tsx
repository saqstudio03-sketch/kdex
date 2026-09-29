import { Link } from "react-router-dom";
import { CalendarRange } from "lucide-react";
import { upcomingProducts } from "@/data/products";
import { SectionHeading } from "./SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

/** Release-calendar style section grouped by date. */
export function ReleaseCalendar() {
  const upcoming = upcomingProducts
    .filter((p) => p.availability !== "in_stock" || true)
    .slice(0, 8);

  const groups = upcoming.reduce<Record<string, typeof upcoming>>((acc, p) => {
    (acc[p.releaseDate] ??= []).push(p);
    return acc;
  }, {});
  const dates = Object.keys(groups).sort().slice(0, 6);

  return (
    <section className="mx-auto w-full max-w-[1920px] px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <SectionHeading
        title="Upcoming Releases"
        subtitle="Mark your calendar — new drops every week."
        to="/upcoming"
        linkLabel="Full calendar"
      />

      {dates.length === 0 ? (
        <EmptyState title="No upcoming releases scheduled" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dates.map((date) => {
            const d = new Date(date);
            const isToday = new Date().toDateString() === d.toDateString();
            return (
              <div
                key={date}
                className="flex flex-col rounded-xl border border-line bg-card p-4 transition-colors hover:border-accent/40"
              >
                <div className="mb-3 flex items-baseline justify-between border-b border-line pb-3">
                  <div>
                    <p className="font-display text-2xl font-bold text-white">
                      {d.toLocaleDateString("en-IN", { day: "numeric" })}
                    </p>
                    <p className="text-xs uppercase tracking-widest text-muted">
                      {d.toLocaleDateString("en-IN", { month: "long" })}
                    </p>
                  </div>
                  {isToday && <Badge tone="accent">Today</Badge>}
                </div>
                <ul className="space-y-2.5">
                  {groups[date].map((p) => (
                    <li key={p.id}>
                      <Link
                        to={`/game/${p.slug}`}
                        className="group flex items-center justify-between gap-2"
                      >
                        <span className="line-clamp-1 text-sm font-medium text-white group-hover:text-accent">
                          {p.title}
                        </span>
                        <span className="shrink-0 text-[11px] text-muted">{p.platform}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      <Link
        to="/upcoming"
        className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-accent lg:hidden"
      >
        <CalendarRange className="h-4 w-4" /> Browse full release calendar
      </Link>
    </section>
  );
}
