import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useOrders } from "@/context/OrdersContext";
import { formatINR, formatDate } from "@/lib/utils";
import { usePageSeo } from "@/hooks/usePageSeo";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";

export default function AdminOrders() {
  usePageSeo({ title: "Orders — KDex Admin", canonicalPath: "/admin/orders" });
  const { orders } = useOrders();

  if (!orders.length)
    return (
      <div className="space-y-4">
        <h1 className="font-display text-xl font-bold">Orders</h1>
        <EmptyState
          icon="orders"
          title="No orders yet"
          description="Orders placed through checkout will appear here in real time."
          action={
            <Link to="/games" className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black">
              Open the store
            </Link>
          }
        />
      </div>
    );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-xl font-bold">Orders</h1>
        <p className="text-sm text-muted">{orders.length} orders in this session</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-line bg-card thin-scrollbar">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
              <th className="p-3">Order ID</th>
              <th className="p-3">Date</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Items</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Fulfilment</th>
              <th className="p-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-line/60 last:border-0 hover:bg-surface/60">
                <td className="p-3 font-mono text-xs font-semibold">{o.id}</td>
                <td className="p-3 text-muted">{formatDate(o.createdAt)}</td>
                <td className="p-3">{o.email}</td>
                <td className="p-3 text-muted">
                  {o.items.map((i) => i.title).join(", ")}
                </td>
                <td className="p-3">
                  <Badge tone={o.paymentStatus === "paid" ? "success" : "danger"}>
                    {o.paymentStatus}
                  </Badge>
                </td>
                <td className="p-3">
                  <Badge tone={o.fulfillmentStatus === "fulfilled" ? "success" : "warning"}>
                    {o.fulfillmentStatus}
                  </Badge>
                </td>
                <td className="p-3 text-right font-semibold">{formatINR(o.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="flex items-center gap-2 text-xs text-muted">
        <ShoppingCart className="h-3.5 w-3.5" /> In production this queries the{" "}
        <code className="text-accent">orders</code> collection with admin-claim authorization.
      </p>
    </div>
  );
}
