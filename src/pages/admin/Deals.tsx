import { useState } from "react";
import { Plus } from "lucide-react";
import { deals } from "@/data/deals";
import { products } from "@/data/products";
import { formatDate, uid } from "@/lib/utils";
import { load, save } from "@/lib/storage";
import { useStore } from "@/context/StoreContext";
import { usePageSeo } from "@/hooks/usePageSeo";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface DraftDeal {
  id: string;
  productId: string;
  kind: string;
  discountPercent: number;
  endsAt: string;
  maxQuantity: number;
}

export default function AdminDeals() {
  usePageSeo({ title: "Deals — KDex Admin", canonicalPath: "/admin/deals" });
  const { toast } = useStore();
  const [extra, setExtra] = useState<DraftDeal[]>(() => load("adminDeals", []));
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    productId: products[0]?.id ?? "",
    kind: "Daily Deal",
    discountPercent: 30,
    endsAt: new Date(Date.now() + 86_400_000).toISOString().slice(0, 10),
    maxQuantity: 500,
  });

  function create(e: React.FormEvent) {
    e.preventDefault();
    const next = [
      { ...form, id: uid("dl"), endsAt: new Date(form.endsAt).toISOString() },
      ...extra,
    ];
    setExtra(next);
    save("adminDeals", next);
    toast("Deal created — homepage reads active deals automatically", "success");
    setOpen(false);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold">Deals</h1>
          <p className="text-sm text-muted">
            Daily, flash, weekend and featured promotions with capped quantity.
          </p>
        </div>
        <Button onClick={() => setOpen((s) => !s)}>
          <Plus className="h-4 w-4" /> New deal
        </Button>
      </div>

      {open && (
        <form onSubmit={create} className="grid gap-3 rounded-xl border border-line bg-card p-4 sm:grid-cols-2 lg:grid-cols-6">
          <select
            value={form.productId}
            onChange={(e) => setForm({ ...form, productId: e.target.value })}
            className="h-10 rounded-lg border border-line bg-surface px-3 text-sm outline-none"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
          <select
            value={form.kind}
            onChange={(e) => setForm({ ...form, kind: e.target.value })}
            className="h-10 rounded-lg border border-line bg-surface px-3 text-sm outline-none"
          >
            {["Daily Deal", "Flash Sale", "Weekend Deal", "Featured Deal"].map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
          <input
            type="number"
            value={form.discountPercent}
            onChange={(e) => setForm({ ...form, discountPercent: Number(e.target.value) })}
            className="h-10 rounded-lg border border-line bg-surface px-3 text-sm outline-none"
            title="Discount %"
          />
          <input
            type="date"
            value={form.endsAt}
            onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
            className="h-10 rounded-lg border border-line bg-surface px-3 text-sm outline-none"
          />
          <input
            type="number"
            value={form.maxQuantity}
            onChange={(e) => setForm({ ...form, maxQuantity: Number(e.target.value) })}
            className="h-10 rounded-lg border border-line bg-surface px-3 text-sm outline-none"
            title="Max quantity"
          />
          <Button type="submit">Create</Button>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border border-line bg-card thin-scrollbar">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
              <th className="p-3">Product</th>
              <th className="p-3">Type</th>
              <th className="p-3">Discount</th>
              <th className="p-3">Ends</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {extra.map((d) => {
              const p = products.find((x) => x.id === d.productId);
              return (
                <tr key={d.id} className="border-b border-line/60">
                  <td className="p-3 font-medium">{p?.title ?? d.productId}</td>
                  <td className="p-3 text-muted">{d.kind}</td>
                  <td className="p-3 text-accent">-{d.discountPercent}%</td>
                  <td className="p-3 text-muted">{formatDate(d.endsAt)}</td>
                  <td className="p-3">{d.maxQuantity}</td>
                  <td className="p-3"><Badge tone="success">Active</Badge></td>
                </tr>
              );
            })}
            {deals.map((d) => {
              const p = products.find((x) => x.id === d.productId);
              return (
                <tr key={d.id} className="border-b border-line/60 last:border-0 hover:bg-surface/60">
                  <td className="p-3 font-medium">{p?.title ?? d.productId}</td>
                  <td className="p-3 text-muted">{d.kind}</td>
                  <td className="p-3 text-accent">-{d.discountPercent}%</td>
                  <td className="p-3 text-muted">{formatDate(d.endsAt)}</td>
                  <td className="p-3">{d.sold} / {d.maxQuantity}</td>
                  <td className="p-3"><Badge tone="success">Active</Badge></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
