import { IndianRupee, ShoppingCart, Users, Boxes, Clock, AlertTriangle, Star, LifeBuoy } from "lucide-react";
import { products } from "@/data/products";
import { reviews } from "@/data/reviews";
import { useOrders } from "@/context/OrdersContext";
import { formatINR } from "@/lib/utils";
import { usePageSeo } from "@/hooks/usePageSeo";
import { Stat, LineChart, Bars } from "./Charts";

const REVENUE_SERIES = [42, 55, 48, 71, 66, 84, 79, 96, 88, 112, 104, 131];
const ORDERS_SERIES = [18, 24, 21, 30, 27, 36, 33, 41, 38, 47, 44, 55];
const MONTHS = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
const PLATFORM_SPLIT = [
  { label: "PC", pct: 46 },
  { label: "PlayStation", pct: 27 },
  { label: "Xbox", pct: 17 },
  { label: "Nintendo", pct: 10 },
];

export default function AdminDashboard() {
  usePageSeo({ title: "Admin Dashboard — KDex", canonicalPath: "/admin" });
  const { orders, tickets } = useOrders();

  const localRevenue = orders.reduce((s, o) => s + o.total, 0);
  const pending = orders.filter((o) => o.fulfillmentStatus !== "fulfilled").length;
  const lowStock = products.filter((p) => p.availability === "in_stock" && p.stock < 50).length;
  const pendingReviews = reviews.filter((r) => r.status === "pending").length;
  const openTickets = tickets.filter((t) => t.status === "open").length;
  const topProducts = [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted">
          Seeded demo series until Firestore analytics are connected; session metrics are live.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Revenue (session)" value={formatINR(localRevenue)} sub={`${orders.length} local orders`} Icon={IndianRupee} />
        <Stat label="Today's sales" value={formatINR(ORDERS_SERIES[11] * 420)} sub="seeded demo" Icon={ShoppingCart} tone="success" />
        <Stat label="Customers" value="1,284" sub="seeded demo" Icon={Users} />
        <Stat label="Products" value={String(products.length)} sub="live catalog" Icon={Boxes} />
        <Stat label="Pending orders" value={String(pending)} sub="awaiting fulfilment" Icon={Clock} tone="warning" />
        <Stat label="Low stock" value={String(lowStock)} sub="SKUs under 50 keys" Icon={AlertTriangle} tone="warning" />
        <Stat label="Pending reviews" value={String(pendingReviews)} sub="moderation queue" Icon={Star} tone="warning" />
        <Stat label="Open tickets" value={String(openTickets)} sub="support inbox" Icon={LifeBuoy} tone="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-xl border border-line bg-card p-5 lg:col-span-2">
          <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wide text-muted">
            Revenue over time (₹ thousands)
          </h2>
          <LineChart data={REVENUE_SERIES} color="#E5A800" />
          <div className="mt-2 flex justify-between text-[10px] text-muted">
            <span>{MONTHS[0]}</span>
            <span>{MONTHS[11]}</span>
          </div>
        </section>

        <section className="rounded-xl border border-line bg-card p-5">
          <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wide text-muted">
            Sales by platform
          </h2>
          <div className="space-y-3">
            {PLATFORM_SPLIT.map((p) => (
              <div key={p.label}>
                <div className="mb-1 flex justify-between text-xs">
                  <span>{p.label}</span>
                  <span className="text-muted">{p.pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${p.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-line bg-card p-5 lg:col-span-2">
          <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wide text-muted">
            Orders over time
          </h2>
          <Bars data={ORDERS_SERIES} labels={MONTHS} />
        </section>

        <section className="rounded-xl border border-line bg-card p-5">
          <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wide text-muted">
            Top products
          </h2>
          <ol className="space-y-3">
            {topProducts.map((p, i) => (
              <li key={p.id} className="flex items-center gap-3 text-sm">
                <span className="w-4 font-display font-bold text-accent">{i + 1}</span>
                <span className="min-w-0 flex-1 truncate">{p.title}</span>
                <span className="text-xs text-muted">{p.reviewCount.toLocaleString("en-IN")}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
