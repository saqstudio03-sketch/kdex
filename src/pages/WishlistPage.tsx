import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { byId } from "@/data/products";
import { formatINR, discountPercent } from "@/lib/utils";
import { useStore } from "@/context/StoreContext";
import { usePageSeo } from "@/hooks/usePageSeo";
import { Artwork } from "@/components/Artwork";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Rating } from "@/components/ui/Rating";

export default function WishlistPage() {
  usePageSeo({
    title: "My Wishlist — KDex Games",
    description: "Games you saved for later, with price-drop highlights.",
    canonicalPath: "/wishlist",
  });

  const { wishlist, toggleWishlist, addToCart, setCartOpen, toast } = useStore();
  const navigate = useNavigate();
  const items = wishlist.map((id) => byId(id)).filter(Boolean);

  return (
    <div className="mx-auto w-full max-w-[1920px] px-4 py-8 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <div className="mb-6 flex items-center gap-3">
        <Heart className="h-6 w-6 text-accent" />
        <h1 className="font-display text-2xl font-bold md:text-3xl">My Wishlist</h1>
        <span className="text-sm text-muted">({items.length})</span>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon="wishlist"
          title="Your wishlist is empty"
          description="Tap the heart on any game to save it here and track price drops."
          action={<Button onClick={() => navigate("/games")}>Discover games</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => {
            const prod = p!;
            const off = discountPercent(prod.price, prod.salePrice);
            const discounted = off > 0;
            return (
              <motion.div
                key={prod.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 rounded-xl border bg-card p-4 ${
                  discounted ? "border-accent/50" : "border-line"
                }`}
              >
                <Link
                  to={`/game/${prod.slug}`}
                  className="h-28 w-20 shrink-0 overflow-hidden rounded-lg bg-surface"
                >
                  <Artwork seed={prod.imageSeed} alt={prod.title} />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <Link
                    to={`/game/${prod.slug}`}
                    className="line-clamp-1 font-semibold hover:text-accent"
                  >
                    {prod.title}
                  </Link>
                  <p className="text-[11px] uppercase tracking-wide text-muted">
                    {prod.platform} • {prod.availability === "preorder" ? "Pre-order" : "In stock"}
                  </p>
                  <div className="mt-1">
                    <Rating value={prod.rating} count={prod.reviewCount} />
                  </div>

                  {discounted && (
                    <p className="mt-1.5 inline-flex w-fit items-center gap-1 rounded bg-accent-soft px-1.5 py-0.5 text-[11px] font-semibold text-accent">
                      <Tag className="h-3 w-3" /> Price dropped -{off}%
                    </p>
                  )}

                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div>
                      {discounted && (
                        <span className="mr-1.5 text-xs text-muted line-through">
                          {formatINR(prod.price)}
                        </span>
                      )}
                      <span className="font-display font-bold text-accent">
                        {formatINR(prod.salePrice)}
                      </span>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => toggleWishlist(prod.id)}
                        aria-label="Remove from wishlist"
                        className="grid h-8 w-8 place-items-center rounded-lg border border-line text-muted hover:border-danger/50 hover:text-danger"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <Button
                        size="sm"
                        onClick={() => {
                          addToCart(prod.id);
                          toast("Added to cart");
                          setCartOpen(true);
                        }}
                      >
                        <ShoppingCart className="h-3.5 w-3.5" /> Add
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
