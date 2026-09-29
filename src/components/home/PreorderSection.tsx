import { Link, useNavigate } from "react-router-dom";
import { CalendarDays, Bell } from "lucide-react";
import { preorderProducts } from "@/data/products";
import { formatINR, daysUntil } from "@/lib/utils";
import { useStore } from "@/context/StoreContext";
import { SectionHeading } from "./SectionHeading";
import { ProductRail } from "@/components/product/ProductRail";
import { Artwork } from "@/components/Artwork";
import { Rating } from "@/components/ui/Rating";
import { Button } from "@/components/ui/Button";

/** Pre-order rail: artwork, title, release date, platform, price, action. */
export function PreorderSection() {
  const { addToCart, toast, setCartOpen } = useStore();
  const navigate = useNavigate();

  return (
    <section className="mx-auto w-full max-w-[1920px] px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <SectionHeading
        title="Pre-orders"
        subtitle="Lock in launch titles — keys are delivered on release day."
        to="/pre-orders"
      />
      <ProductRail>
        {preorderProducts.map((p) => {
          const days = daysUntil(p.releaseDate);
          return (
            <article
              key={p.id}
              className="group flex flex-col overflow-hidden rounded-xl border border-line bg-card shadow-card transition-all duration-300 hover:border-accent/40 hover:shadow-lift"
            >
              <Link to={`/game/${p.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-surface">
                <Artwork
                  seed={p.imageSeed}
                  alt={p.title}
                  className="transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute left-1.5 top-1.5 rounded-md bg-accent/90 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-black">
                  Pre-order
                </span>
                <div className="absolute inset-x-0 bottom-0 p-2">
                  <p className="flex items-center gap-1 text-[10px] font-medium text-white/90">
                    <CalendarDays className="h-3 w-3 text-accent" />
                    In {days} day{days === 1 ? "" : "s"}
                  </p>
                </div>
              </Link>

              <div className="flex flex-1 flex-col gap-1 p-2.5">
                <Link
                  to={`/game/${p.slug}`}
                  className="line-clamp-1 text-xs font-semibold hover:text-accent md:text-sm"
                >
                  {p.title}
                </Link>
                <p className="text-[10px] uppercase tracking-wide text-muted">
                  {p.platform} • {new Date(p.releaseDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <div className="mt-auto flex items-center justify-between pt-1.5">
                  <span className="font-display text-sm font-bold text-white md:text-base">
                    {formatINR(p.salePrice)}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 rounded-full px-2.5 text-xs"
                    onClick={() => {
                      addToCart(p.id);
                      toast("Pre-order added to cart");
                      setCartOpen(true);
                    }}
                  >
                    <Bell className="h-3 w-3" /> Pre-order
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
      </ProductRail>
      <button
        onClick={() => navigate("/pre-orders")}
        className="mt-5 text-sm font-medium text-muted hover:text-accent sm:hidden"
      >
        View all pre-orders →
      </button>
    </section>
  );
}
