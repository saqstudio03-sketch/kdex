import { Link } from "react-router-dom";
import { Zap, Timer, Flame } from "lucide-react";
import { deals } from "@/data/deals";
import { byId } from "@/data/products";
import { formatINR, discountPercent } from "@/lib/utils";
import { useCountdown } from "@/hooks/useCountdown";
import { usePageSeo } from "@/hooks/usePageSeo";
import { Artwork } from "@/components/Artwork";
import { EmptyState } from "@/components/ui/EmptyState";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function DealsPage() {
  usePageSeo({
    title: "Daily Deals & Flash Sales — KDex Games",
    description: "Limited-time discounts on PC and console games. Countdown timers are live.",
    canonicalPath: "/deals",
  });

  const soonest = [...deals].sort((a, b) => a.endsAt.localeCompare(b.endsAt))[0];
  const { days, hours, minutes, seconds, done } = useCountdown(soonest?.endsAt);

  return (
    <div className="mx-auto w-full max-w-[1920px] px-4 py-8 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-accent/30 bg-gradient-to-r from-accent-soft to-transparent p-6">
        <div>
          <h1 className="flex items-center gap-2 font-display text-3xl font-bold">
            <Flame className="h-7 w-7 text-accent" /> Deals & Flash Sales
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            {deals.length} active deals — discounted stock is limited per promotion.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted">
            <Timer className="h-4 w-4 text-accent" /> {done ? "Ended" : "Next ending"}
          </span>
          <div className="flex gap-1.5">
            {[
              [days, "D"],
              [hours, "H"],
              [minutes, "M"],
              [seconds, "S"],
            ].map(([v, l]) => (
              <div key={l as string} className="min-w-[44px] rounded-lg border border-line bg-card px-2 py-1.5 text-center">
                <div className="font-display text-lg font-bold leading-none">{pad(v as number)}</div>
                <div className="text-[10px] uppercase text-muted">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {deals.length === 0 ? (
        <EmptyState
          title="No active deals right now"
          description="New promotions go live every morning — check back soon."
          action={
            <Link to="/games" className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black">
              Browse all games
            </Link>
          }
        />
      ) : (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {deals.map((deal) => {
            const p = byId(deal.productId);
            if (!p) return null;
            const off = discountPercent(p.price, p.salePrice);
            const left = Math.max(deal.maxQuantity - deal.sold, 0);
            return (
              <Link
                key={deal.id}
                to={`/game/${p.slug}`}
                className="group overflow-hidden rounded-xl border border-line bg-card transition-all hover:-translate-y-1 hover:border-accent/50 hover:shadow-lift"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Artwork
                    seed={p.imageSeed}
                    variant="wide"
                    alt={p.title}
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-2 top-2 rounded-md bg-accent px-2 py-1 font-display text-sm font-bold text-black shadow-accent">
                    -{off}%
                  </span>
                  <span className="absolute right-2 top-2 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white backdrop-blur">
                    {deal.kind}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2">
                    <div className="flex justify-between text-[10px] text-white/80">
                      <span className="flex items-center gap-1">
                        <Zap className="h-2.5 w-2.5 text-accent" /> {left} left
                      </span>
                      <span>{Math.round((deal.sold / deal.maxQuantity) * 100)}% claimed</span>
                    </div>
                    <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/20">
                      <div
                        className="h-full bg-accent"
                        style={{ width: `${Math.min((deal.sold / deal.maxQuantity) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <h2 className="line-clamp-1 text-xs font-semibold group-hover:text-accent md:text-sm">
                    {p.title}
                  </h2>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wide text-muted">
                    {p.platform} • {p.activationPlatform}
                  </p>
                  <div className="mt-1.5 flex items-baseline gap-2">
                    <span className="font-display text-base font-bold text-accent">
                      {formatINR(p.salePrice)}
                    </span>
                    <span className="text-xs text-muted line-through">{formatINR(p.price)}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
