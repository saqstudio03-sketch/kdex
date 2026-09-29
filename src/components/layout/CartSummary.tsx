import { useState } from "react";
import { Tag } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { byId } from "@/data/products";
import { formatINR } from "@/lib/utils";
import { computeTotals } from "@/lib/pricing";
import { useCoupon, tryApplyCoupon } from "@/hooks/useCoupon";
import { Button } from "@/components/ui/Button";

/** Subtotal / discount / coupon / tax / total block — shared by drawer & cart page. */
export function CartSummary({ compact = false }: { compact?: boolean }) {
  const { cart, toast } = useStore();
  const coupon = useCoupon();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const lines = cart
    .map((i) => byId(i.productId))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const totals = computeTotals(
    lines.map((p) => ({ price: p.price, salePrice: p.salePrice, qty: cart.find((c) => c.productId === p.id)!.qty })),
    coupon?.amount ?? 0
  );

  function apply() {
    const err = tryApplyCoupon(code, totals.total);
    setError(err);
    if (!err) toast(`Coupon ${code.toUpperCase()} applied`, "success");
    else if (err) toast(err, "error");
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-line bg-surface px-3">
          <Tag className="h-4 w-4 text-muted" />
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Coupon code"
            className="h-9 w-full bg-transparent text-sm text-white outline-none placeholder:text-muted"
            aria-label="Coupon code"
          />
        </div>
        <Button variant="dark" size="md" onClick={apply}>
          Apply
        </Button>
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}

      <dl className={`space-y-1.5 ${compact ? "text-sm" : "text-sm"}`}>
        <Row label="Subtotal" value={formatINR(totals.subtotal)} />
        {totals.itemDiscount > 0 && (
          <Row
            label="Discount"
            value={`− ${formatINR(totals.itemDiscount)}`}
            className="text-success"
          />
        )}
        {coupon && (
          <Row
            label={`Coupon ${coupon.code}`}
            value={`− ${formatINR(coupon.amount)}`}
            className="text-success"
          />
        )}
        <Row label="Tax (GST 18%, incl.)" value={formatINR(totals.tax)} />
        <div className="border-t border-line pt-2">
          <Row
            label="Total"
            value={formatINR(totals.total)}
            className="text-base font-bold text-white"
          />
        </div>
        {totals.saved > 0 && (
          <p className="pt-1 text-xs font-medium text-success">
            You save {formatINR(totals.saved)} on this order
          </p>
        )}
      </dl>
    </div>
  );
}

function Row({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <dt className="text-muted">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
