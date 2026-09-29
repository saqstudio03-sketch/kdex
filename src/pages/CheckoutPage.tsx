import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { byId } from "@/data/products";
import { formatINR } from "@/lib/utils";
import { computeTotals } from "@/lib/pricing";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrdersContext";
import { useCoupon } from "@/hooks/useCoupon";
import { usePageSeo } from "@/hooks/usePageSeo";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Stepper } from "@/components/checkout/Stepper";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";
import { CustomerStep, ReviewStep, type CheckoutInfo } from "@/components/checkout/StepsA";
import { PaymentStep, ConfirmationStep } from "@/components/checkout/StepsB";

export default function CheckoutPage() {
  usePageSeo({
    title: "Checkout — KDex Games",
    description: "Secure multi-step checkout with instant digital delivery.",
    canonicalPath: "/checkout",
  });

  const { cart, clearCart } = useStore();
  const { user } = useAuth();
  const { placeOrder, placing } = useOrders();
  const coupon = useCoupon();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [info, setInfo] = useState<CheckoutInfo>({
    name: user?.displayName ?? "",
    email: user?.email ?? "",
    phone: "",
  });
  const [method, setMethod] = useState("razorpay");
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState("");

  const lines = useMemo(
    () =>
      cart
        .map((c) => ({ c, p: byId(c.productId) }))
        .filter((x): x is { c: typeof x.c; p: NonNullable<typeof x.p> } => Boolean(x.p)),
    [cart]
  );

  const totals = computeTotals(
    lines.map(({ p, c }) => ({ price: p.price, salePrice: p.salePrice, qty: c.qty })),
    coupon?.amount ?? 0
  );

  async function pay() {
    setError(null);
    if (!info.name.trim() || !/^\S+@\S+\.\S+$/.test(info.email)) {
      setError("Please provide a valid name and email.");
      setStep(0);
      return;
    }
    try {
      // Production flow lives in Cloud Functions (createPaymentOrder →
      // verify signature → transactionally reserve key → fulfil).
      const order = await placeOrder({
        email: info.email,
        lines: lines.map(({ p, c }) => ({
          productId: p.id,
          title: p.title,
          platform: p.platform,
          unitPrice: p.salePrice,
          qty: c.qty,
        })),
        subtotal: totals.subtotal,
        discount: totals.itemDiscount + totals.couponDiscount,
        couponCode: coupon?.code,
        tax: totals.tax,
        total: totals.total,
        paymentMethod: method,
      });
      setOrderId(order.id);
      clearCart();
      setStep(3);
    } catch {
      setError("Payment failed — please try again. (demo)");
    }
  }

  if (cart.length === 0 && step < 3)
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          icon="cart"
          title="Nothing to check out"
          description="Your cart is empty — add something first."
          action={<Button onClick={() => navigate("/games")}>Browse games</Button>}
        />
      </div>
    );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold md:text-3xl">Checkout</h1>
        <span className="rounded-lg border border-warning/40 bg-warning/10 px-3 py-1.5 text-xs font-semibold text-warning">
          DEMO CHECKOUT — no real payment is processed
        </span>
      </div>

      <Stepper step={step} />

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-line bg-card p-6"
        >
          {step === 0 && <CustomerStep info={info} setInfo={setInfo} next={() => setStep(1)} />}
          {step === 1 && (
            <ReviewStep
              items={cart}
              back={() => setStep(0)}
              next={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <PaymentStep
              method={method}
              setMethod={setMethod}
              error={error}
              placing={placing}
              total={totals.total}
              back={() => setStep(1)}
              pay={pay}
            />
          )}
          {step === 3 && (
            <ConfirmationStep
              orderId={orderId}
              onLibrary={() => navigate("/account/library")}
              onOrders={() => navigate("/account/orders")}
              onShop={() => navigate("/games")}
            />
          )}
        </motion.div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <CheckoutSummary totals={totals} coupon={coupon} email={info.email} />
          <p className="mt-3 text-center text-[11px] text-muted">
            Payable now: <span className="font-semibold text-accent">{formatINR(totals.total)}</span>
          </p>
        </aside>
      </div>
    </div>
  );
}
