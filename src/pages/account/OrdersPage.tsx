import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { useOrders } from "@/context/OrdersContext";
import { formatINR, formatDate } from "@/lib/utils";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function OrdersPage() {
  const { orders } = useOrders();

  if (!orders.length)
    return (
      <EmptyState
        icon="orders"
        title="No orders yet"
        description="When you buy something, it will appear here with its receipt and status."
        action={
          <Link to="/games">
            <Button>Browse the store</Button>
          </Link>
        }
      />
    );

  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg font-bold">Orders</h2>
      {orders.map((o) => (
        <article key={o.id} className="rounded-xl border border-line bg-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
            <div>
              <p className="font-mono text-sm font-semibold text-white">#{o.id}</p>
              <p className="text-xs text-muted">{formatDate(o.createdAt)} • {o.email}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge tone={o.paymentStatus === "paid" ? "success" : "danger"}>
                {o.paymentStatus === "paid" ? "Paid" : o.paymentStatus}
              </Badge>
              <Badge tone={o.fulfillmentStatus === "fulfilled" ? "success" : "warning"}>
                {o.fulfillmentStatus === "fulfilled" ? "Fulfilled" : o.fulfillmentStatus}
              </Badge>
              <Badge tone="muted">{o.paymentMethod}</Badge>
            </div>
          </div>

          <ul className="mt-3 space-y-1.5">
            {o.items.map((i) => (
              <li key={i.productId} className="flex justify-between text-sm">
                <span className="text-white">
                  {i.title} <span className="text-muted">× {i.qty}</span>
                </span>
                <span className="text-muted">{formatINR(i.unitPrice * i.qty)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3 text-sm">
            <span className="text-muted">
              Discount: <span className="text-success">− {formatINR(o.discount)}</span>
              {o.couponCode && <span className="ml-2">({o.couponCode})</span>}
            </span>
            <span className="font-display font-bold">
              Total {formatINR(o.total)}
            </span>
          </div>

          <div className="mt-3 flex gap-2">
            <Link to="/account/library" className="text-xs font-medium text-accent hover:underline">
              View keys →
            </Link>
            <Link to="/support" className="text-xs text-muted hover:text-accent">
              Need help?
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
