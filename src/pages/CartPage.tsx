import { useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { usePageSeo } from "@/hooks/usePageSeo";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { CartLineItem } from "@/components/layout/CartLineItem";
import { CartSummary } from "@/components/layout/CartSummary";

export default function CartPage() {
  usePageSeo({
    title: "Shopping Cart — KDex Games",
    description: "Review the games in your cart before checkout.",
    canonicalPath: "/cart",
  });

  const { cart } = useStore();
  const navigate = useNavigate();

  return (
    <div className="mx-auto w-full max-w-[1920px] px-4 py-8 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <h1 className="mb-6 flex items-center gap-3 font-display text-2xl font-bold md:text-3xl">
        <ShoppingBag className="h-6 w-6 text-accent" /> Shopping Cart
        <span className="text-base font-normal text-muted">({cart.length} items)</span>
      </h1>

      {cart.length === 0 ? (
        <EmptyState
          icon="cart"
          title="Your cart is empty"
          description="Add a game and it will show up here."
          action={<Button onClick={() => navigate("/games")}>Browse the store</Button>}
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-3">
            {cart.map((item) => (
              <CartLineItem key={item.productId} productId={item.productId} qty={item.qty} />
            ))}
            <button
              onClick={() => navigate("/games")}
              className="text-sm font-medium text-muted hover:text-accent"
            >
              ← Continue shopping
            </button>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-line bg-card p-5 shadow-card">
              <h2 className="mb-4 font-display text-base font-bold">Order summary</h2>
              <CartSummary />
              <Button size="lg" className="mt-4 w-full" onClick={() => navigate("/checkout")}>
                Proceed to Checkout
              </Button>
              <p className="mt-3 text-center text-[11px] text-muted">
                Taxes are GST-inclusive. Digital keys are delivered instantly after payment.
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
