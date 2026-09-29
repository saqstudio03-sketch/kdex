import { Link } from "react-router-dom";
import { CalendarClock, Gift, Bell } from "lucide-react";
import { preorderProducts } from "@/data/products";
import { formatINR, daysUntil, formatDate } from "@/lib/utils";
import { useStore } from "@/context/StoreContext";
import { usePageSeo } from "@/hooks/usePageSeo";
import { Artwork } from "@/components/Artwork";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export default function PreOrdersPage() {
  usePageSeo({
    title: "Pre-order Upcoming Games — Nexora Games",
    description: "Reserve upcoming PC and console releases. Keys delivered on launch day.",
    canonicalPath: "/pre-orders",
  });

  const { addToCart, toast, setCartOpen } = useStore();

  return (
    <div className="mx-auto w-full max-w-[1920px] px-4 py-8 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <div className="mb-8 rounded-2xl border border-line bg-card p-6">
        <h1 className="flex items-center gap-2 font-display text-3xl font-bold">
          <CalendarClock className="h-7 w-7 text-accent" /> Pre-orders
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-muted">
          Reserve launch titles at the best price. Keys are delivered to your library on
          release day, and pre-order bonuses are applied automatically.
        </p>
      </div>

      {preorderProducts.length === 0 ? (
        <EmptyState title="No pre-orders open right now" description="Check the upcoming calendar." />
      ) : (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6">
          {preorderProducts.map((p) => {
            const days = daysUntil(p.releaseDate);
            return (
              <article
                key={p.id}
                className="group flex flex-col overflow-hidden rounded-xl border border-line bg-card transition-all hover:-translate-y-1 hover:border-accent/50 hover:shadow-lift"
              >
                <Link to={`/game/${p.slug}`} className="relative block aspect-[16/10] overflow-hidden">
                  <Artwork
                    seed={p.imageSeed}
                    alt={p.title}
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute left-1.5 top-1.5 rounded-md bg-accent px-1.5 py-0.5 text-[9px] font-bold uppercase text-black">
                    Pre-order
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-2">
                    <p className="flex items-center gap-1 text-[10px] text-white">
                      <Bell className="h-3 w-3 text-accent" /> {days} day{days === 1 ? "" : "s"} to go
                    </p>
                  </div>
                </Link>

                <div className="flex flex-1 flex-col gap-1.5 p-3">
                  <Link to={`/game/${p.slug}`} className="line-clamp-1 text-xs font-semibold hover:text-accent md:text-sm">
                    {p.title}
                  </Link>
                  <p className="flex items-center gap-1 text-[10px] text-muted">
                    <CalendarClock className="h-3 w-3" /> {formatDate(p.releaseDate)} • {p.platform}
                  </p>
                  <p className="flex items-center gap-1 text-[10px] text-success">
                    <Gift className="h-3 w-3" /> Bonus included
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-1.5">
                    <span className="font-display text-sm font-bold text-white md:text-base">{formatINR(p.salePrice)}</span>
                    <Button
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() => {
                        addToCart(p.id);
                        toast("Pre-order added to cart");
                        setCartOpen(true);
                      }}
                    >
                      Pre-order
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
