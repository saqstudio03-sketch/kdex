import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, ShoppingBag, ShieldCheck } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { byId } from "@/data/products";
import { Artwork } from "@/components/Artwork";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { CartSummary } from "./CartSummary";
import { CartLineItem } from "./CartLineItem";

export function CartDrawer() {
  const { cart, cartOpen, setCartOpen } = useStore();
  const navigate = useNavigate();

  const lines = cart
    .map((i) => ({ item: i, product: byId(i.productId) }))
    .filter((x) => x.product);

  return (
    <AnimatePresence>
      {cartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm"
          onClick={() => setCartOpen(false)}
        >
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-line bg-surface"
            aria-label="Shopping cart"
          >
            <header className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="flex items-center gap-2 font-display text-base font-bold">
                <ShoppingBag className="h-5 w-5 text-accent" /> Your Cart
                <span className="text-muted">({lines.length})</span>
              </h2>
              <button
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
                className="focus-ring grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-white/5 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="flex-1 p-5">
                <EmptyState
                  icon="cart"
                  title="Your cart is empty"
                  description="Browse the store and add games to see them here."
                  action={
                    <Button
                      onClick={() => {
                        setCartOpen(false);
                        navigate("/games");
                      }}
                    >
                      Browse games
                    </Button>
                  }
                />
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-3 overflow-y-auto thin-scrollbar p-4">
                  {lines.map(({ item, product }) => (
                    <motion.div key={item.productId} layout exit={{ opacity: 0, x: 40 }}>
                      <CartLineItem productId={product!.id} qty={item.qty} />
                    </motion.div>
                  ))}
                </div>

                <footer className="border-t border-line bg-card p-4">
                  <CartSummary />
                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setCartOpen(false)}
                    >
                      Continue Shopping
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={() => {
                        setCartOpen(false);
                        navigate("/checkout");
                      }}
                    >
                      Checkout
                    </Button>
                  </div>
                  <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted">
                    <ShieldCheck className="h-3.5 w-3.5 text-success" /> Secure checkout •
                    Instant digital delivery
                  </p>
                </footer>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
