import { Link } from "react-router-dom";
import type { Totals } from "@/lib/pricing";
import type { AppliedCoupon } from "@/hooks/useCoupon";
import { formatINR } from "@/lib/utils";

/** Checkout order-summary sidebar (subtotal / discount / coupon / tax / total). */
export function CheckoutSummary({
  totals,
  coupon,
  email,
}: {
  totals: Totals;
  coupon: AppliedCoupon | null;
  email: string;
}) {
  const rows: [string, string][] = [
    ["Subtotal", formatINR(totals.subtotal)],
    ["Discount", `− ${formatINR(totals.itemDiscount)}`],
    ...(coupon
      ? ([[`Coupon ${coupon.code}`, `− ${formatINR(totals.couponDiscount)}`]] as [string, string][])
      : []),
    ["Tax (GST 18%, incl.)", formatINR(totals.tax)],
  ];

  return (
    <div className="rounded-2xl border border-line bg-card p-5">
      <h2 className="mb-3 font-display text-base font-bold">Summary</h2>
      <dl className="space-y-2 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between text-muted">
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
        <div className="flex justify-between border-t border-line pt-2 text-base font-bold text-white">
          <dt>Total</dt>
          <dd>{formatINR(totals.total)}</dd>
        </div>
      </dl>
      <p className="mt-4 text-[11px] leading-relaxed text-muted">
        By paying you agree to the terms of use. Keys are delivered to{" "}
        <span className="text-white">{email || "your email"}</span> and your game library.{" "}
        <Link to="/support" className="text-accent hover:underline">
          Need help?
        </Link>
      </p>
    </div>
  );
}
