import { Button } from "@/components/ui/Button";
import { CartLineItem } from "@/components/layout/CartLineItem";
import { sanitizeText } from "@/lib/utils";

export interface CheckoutInfo {
  name: string;
  email: string;
  phone: string;
}

/** Step 1 — customer information. */
export function CustomerStep({
  info,
  setInfo,
  next,
}: {
  info: CheckoutInfo;
  setInfo: (i: CheckoutInfo) => void;
  next: () => void;
}) {
  const fields: [keyof CheckoutInfo, string, string][] = [
    ["name", "Full name", "text"],
    ["email", "Email (for key delivery)", "email"],
    ["phone", "Phone (optional)", "tel"],
  ];
  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg font-bold">Customer information</h2>
      {fields.map(([key, label, type]) => (
        <label key={key} className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase text-muted">{label}</span>
          <input
            type={type}
            value={info[key]}
            onChange={(e) => setInfo({ ...info, [key]: sanitizeText(e.target.value) })}
            className="h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm text-white outline-none focus:border-accent/60"
          />
        </label>
      ))}
      <Button size="lg" className="w-full" onClick={next}>
        Continue to review
      </Button>
    </div>
  );
}

/** Step 2 — order review. */
export function ReviewStep({
  items,
  back,
  next,
}: {
  items: { productId: string; qty: number }[];
  back: () => void;
  next: () => void;
}) {
  return (
    <div>
      <h2 className="mb-4 font-display text-lg font-bold">Order review</h2>
      <div className="space-y-3">
        {items.map((i) => (
          <CartLineItem key={i.productId} productId={i.productId} qty={i.qty} />
        ))}
      </div>
      <div className="mt-5 flex gap-3">
        <Button variant="outline" onClick={back}>
          Back
        </Button>
        <Button onClick={next}>Continue to payment</Button>
      </div>
    </div>
  );
}
