import { Link } from "react-router-dom";
import { Zap, Timer } from "lucide-react";
import { deals, dealFor } from "@/data/deals";
import { byId } from "@/data/products";
import { formatINR, discountPercent } from "@/lib/utils";
import { useCountdown } from "@/hooks/useCountdown";
import { SectionHeading } from "./SectionHeading";
import { ProductRail } from "@/components/product/ProductRail";
import { ProductCard } from "@/components/product/ProductCard";
import { Artwork } from "@/components/Artwork";
import { Badge } from "@/components/ui/Badge";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** Daily Deals — countdown driven by each deal's `endsAt` data field. */
export function DealsSection() {
  const first = deals[0];
  const { days, hours, minutes, seconds, done } = useCountdown(first?.endsAt);

  const dealProducts = deals
    .map((d) => byId(d.productId))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 8);

  const heroDeal = byId(first?.productId ?? "");
  const heroOff = heroDeal ? discountPercent(heroDeal.price, heroDeal.salePrice) : 0;

  return (
    <section className="mx-auto w-full max-w-[1920px] px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16" aria-labelledby="deals-heading">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-6 w-1 rounded-full bg-accent" aria-hidden />
            <h2 id="deals-heading" className="font-display text-xl font-bold md:text-2xl">
              Daily Deals
            </h2>
            <Badge tone="danger">
              <Zap className="h-3 w-3" /> Limited time
            </Badge>
          </div>
          <p className="mt-1.5 pl-4 text-sm text-muted">
            Fresh discounts every day — stock is capped per deal.
          </p>
        </div>

        {/* Countdown */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted">
            <Timer className="h-4 w-4 text-accent" />
            {done ? "Ended" : "Ends in"}
          </span>
          <div className="flex gap-1.5" role="timer" aria-label="Deal countdown">
            {[
              [days, "D"],
              [hours, "H"],
              [minutes, "M"],
              [seconds, "S"],
            ].map(([v, label]) => (
              <div
                key={label as string}
                className="min-w-[46px] rounded-lg border border-line bg-card px-2 py-1.5 text-center"
              >
                <div className="font-display text-lg font-bold leading-none text-white">
                  {pad(v as number)}
                </div>
                <div className="mt-0.5 text-[10px] uppercase text-muted">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Spotlight deal */}
      {heroDeal && (
        <Link
          to={`/game/${heroDeal.slug}`}
          className="group mb-8 grid overflow-hidden rounded-2xl border border-line bg-card shadow-card transition-all hover:border-accent/50 md:grid-cols-[1.4fr_1fr]"
        >
          <div className="relative h-52 overflow-hidden md:h-full md:min-h-[260px]">
            <Artwork
              seed={heroDeal.imageSeed}
              variant="wide"
              alt={heroDeal.title}
              className="transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/80 md:to-card" />
            <span className="absolute left-4 top-4 rounded-lg bg-accent px-3 py-2 font-display text-xl font-bold text-black shadow-accent">
              -{heroOff}%
            </span>
          </div>
          <div className="flex flex-col justify-center gap-3 p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              Deal of the day
            </p>
            <h3 className="font-display text-2xl font-bold">{heroDeal.title}</h3>
            <p className="line-clamp-2 text-sm text-muted">{heroDeal.tagline}</p>
            <div className="mt-1 flex items-baseline gap-3">
              <span className="font-display text-3xl font-bold text-accent">
                {formatINR(heroDeal.salePrice)}
              </span>
              <span className="text-base text-muted line-through">
                {formatINR(heroDeal.price)}
              </span>
              <span className="text-sm font-medium text-success">
                Save {formatINR(heroDeal.price - heroDeal.salePrice)}
              </span>
            </div>
            <DealStock dealId={first.id} />
          </div>
        </Link>
      )}

      <ProductRail>
        {dealProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </ProductRail>
    </section>
  );
}

function DealStock({ dealId }: { dealId: string }) {
  const deal = dealFor(dealId);
  if (!deal) return null;
  const pct = Math.min(Math.round((deal.sold / deal.maxQuantity) * 100), 100);
  return (
    <div className="mt-2">
      <div className="mb-1 flex justify-between text-[11px] text-muted">
        <span>{deal.kind}</span>
        <span>
          {deal.sold}/{deal.maxQuantity} claimed
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface">
        <div className="h-full rounded-full bg-gradient-to-r from-accent to-accent-deep" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
