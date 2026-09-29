import { Check, CreditCard, Smartphone, Wallet, AlertTriangle } from "lucide-react";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const METHODS = [
  { id: "razorpay", label: "Razorpay (UPI / Card / Netbanking)", Icon: Wallet },
  { id: "upi", label: "UPI", Icon: Smartphone },
  { id: "card", label: "Credit / Debit card", Icon: CreditCard },
];

/** Step 3 — payment method + demo gateway notice. */
export function PaymentStep({
  method,
  setMethod,
  error,
  placing,
  total,
  back,
  pay,
}: {
  method: string;
  setMethod: (m: string) => void;
  error: string | null;
  placing: boolean;
  total: number;
  back: () => void;
  pay: () => void;
}) {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg font-bold">Payment method</h2>
      <div className="space-y-2">
        {METHODS.map(({ id, label, Icon }) => (
          <label
            key={id}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
              method === id
                ? "border-accent bg-accent-soft"
                : "border-line bg-surface hover:border-accent/40"
            }`}
          >
            <input
              type="radio"
              name="method"
              checked={method === id}
              onChange={() => setMethod(id)}
              className="accent-accent"
            />
            <Icon className="h-5 w-5 text-accent" />
            <span className="text-sm font-medium">{label}</span>
          </label>
        ))}
      </div>

      <div className="flex items-start gap-2 rounded-lg border border-warning/40 bg-warning/10 p-3 text-xs leading-relaxed text-warning">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        Payment runs through a mock gateway in this build. Production uses Razorpay Checkout
        with server-side signature verification — the publishable key only lives in
        VITE_RAZORPAY_KEY_ID, the secret stays in Cloud Functions.
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="flex gap-3">
        <Button variant="outline" onClick={back}>
          Back
        </Button>
        <Button size="lg" className="flex-1" loading={placing} onClick={pay}>
          Pay {formatINR(total)}
        </Button>
      </div>
    </div>
  );
}

/** Step 4 — confirmation + demo fulfilment notice. */
export function ConfirmationStep({
  orderId,
  onLibrary,
  onOrders,
  onShop,
}: {
  orderId: string;
  onLibrary: () => void;
  onOrders: () => void;
  onShop: () => void;
}) {
  return (
    <div className="py-6 text-center">
      <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-success/15">
        <Check className="h-8 w-8 text-success" />
      </div>
      <h2 className="font-display text-2xl font-bold">Payment successful</h2>
      <p className="mt-2 text-sm text-muted">
        Order <span className="font-mono text-white">{orderId}</span> is fulfilled — your
        activation keys are ready.
      </p>
      <p className="mt-1 text-xs font-medium text-warning">
        ⚠ DEMO FULFILLMENT — simulated keys, not real activations
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button onClick={onLibrary}>View my keys</Button>
        <Button variant="outline" onClick={onOrders}>
          Order history
        </Button>
        <Button variant="ghost" onClick={onShop}>
          Keep shopping
        </Button>
      </div>
    </div>
  );
}
