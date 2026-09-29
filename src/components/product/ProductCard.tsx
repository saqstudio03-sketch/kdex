import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Plus, Check, Star } from "lucide-react";
import type { Product } from "@/types";
import { discountPercent, cn } from "@/lib/utils";
import { formatINR } from "@/lib/utils";
import { useStore } from "@/context/StoreContext";
import { Artwork } from "@/components/Artwork";
import { DiscountBadge } from "@/components/ui/Badge";

export function ProductCard({
  product,
  className,
  showRank,
  eager,
}: {
  product: Product;
  className?: string;
  showRank?: number;
  eager?: boolean;
}) {
  const { addToCart, cart, toggleWishlist, isWished, toast } = useStore();
  const inCart = cart.some((i) => i.productId === product.id);
  const wished = isWished(product.id);
  const off = discountPercent(product.price, product.salePrice);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-line bg-card shadow-card transition-all duration-300 hover:border-accent/50 hover:shadow-accent",
        className
      )}
    >
      <Link
        to={`/game/${product.slug}`}
        className="relative block aspect-[16/10] overflow-hidden bg-surface"
        aria-label={product.title}
      >
        <Artwork
          seed={product.imageSeed}
          alt={product.title}
          eager={eager}
          className="scale-100 transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {off > 0 && <DiscountBadge percent={off} className="absolute left-1.5 top-1.5 px-1.5 py-0.5 text-[10px]" />}
        {product.availability === "preorder" && (
          <span className="absolute right-1.5 top-1.5 rounded-md bg-accent/90 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-black">
            Pre-order
          </span>
        )}
        {typeof showRank === "number" && (
          <span className="absolute left-0 top-0 font-display text-2xl font-bold leading-none text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] p-1.5">
            #{showRank}
          </span>
        )}

        {/* Quick info revealed on hover (desktop) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-1 p-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <p className="line-clamp-2 text-[10px] leading-snug text-white/90">
            {product.tagline}
          </p>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-1 p-2.5">
        <Link
          to={`/game/${product.slug}`}
          className="line-clamp-1 text-xs font-semibold text-white transition-colors hover:text-accent md:text-sm"
        >
          {product.title}
        </Link>

        <p className="text-[10px] uppercase tracking-wide text-muted">
          {product.platform} • {product.activationPlatform}
        </p>

        {product.reviewCount > 0 ? (
          <div className="flex items-center gap-1 text-[11px] text-muted">
            <Star className="h-3 w-3 fill-warning text-warning shrink-0" />
            <span className="font-semibold text-white/90">{product.rating.toFixed(1)}</span>
            <span className="text-[10px] text-muted/60">({product.reviewCount.toLocaleString("en-IN")})</span>
          </div>
        ) : (
          <span className="text-[10px] text-muted">Pre-order release</span>
        )}

        <div className="mt-auto flex items-end justify-between gap-1.5 pt-1.5">
          <div className="flex flex-col">
            {off > 0 && (
              <span className="text-[10px] text-muted line-through">
                {formatINR(product.price)}
              </span>
            )}
            <span className={cn("font-display text-sm font-bold md:text-base", off > 0 ? "text-accent" : "text-white")}>
              {formatINR(product.salePrice)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => toggleWishlist(product.id)}
              aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
              className={cn(
                "focus-ring grid h-7 w-7 place-items-center rounded-full border border-line bg-surface transition-all hover:border-accent/50",
                wished && "border-accent/60 bg-accent-soft"
              )}
            >
              <motion.span
                key={String(wished)}
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                <Heart className={cn("h-3.5 w-3.5", wished ? "fill-accent text-accent" : "text-muted")} />
              </motion.span>
            </button>

            <button
              onClick={() => {
                addToCart(product.id);
                toast(inCart ? "Quantity updated in cart" : "Added to cart");
              }}
              aria-label="Quick add to cart"
              className={cn(
                "focus-ring grid h-7 w-7 place-items-center rounded-full border transition-all md:w-0 md:overflow-hidden md:border-transparent md:bg-transparent md:opacity-0 md:group-hover:w-7 md:group-hover:border-line md:group-hover:bg-surface md:group-hover:opacity-100",
                inCart
                  ? "border-success/50 bg-success/15 text-success"
                  : "border-line bg-surface text-white hover:border-accent/50 hover:text-accent"
              )}
            >
              {inCart ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
