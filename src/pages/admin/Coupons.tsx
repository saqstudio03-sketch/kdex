import { useState } from "react";
import { Plus, Ticket } from "lucide-react";
import { coupons as seed } from "@/data/coupons";
import { formatDate, uid } from "@/lib/utils";
import { load, save } from "@/lib/storage";
import { useStore } from "@/context/StoreContext";
import { usePageSeo } from "@/hooks/usePageSeo";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface Draft {
  id: string;
  code: string;
  value: number;
  type: "percentage" | "fixed";
  minOrder: number;
  maxDiscount: number;
  expiresAt: string;
}

export default function AdminCoupons() {
  usePageSeo({ title: "Coupons — KDex Admin", canonicalPath: "/admin/coupons" });
  const { toast } = useStore();
  const [extra, setExtra] = useState<Draft[]>(() => load("adminCoupons", []));
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    code: "",
    value: 10,
    type: "percentage" as const,
    minOrder: 499,
    maxDiscount: 500,
    expiresAt: "2027-06-30",
  });

  function create(e: React.FormEvent) {
    e.preventDefault();
    const code = form.code.trim().toUpperCase();
    if (!code) return;
    const next = [{ ...form, code, id: uid("c") }, ...extra];
    setExtra(next);
    save("adminCoupons", next);
    toast(`Coupon ${code} created (local demo)`, "success");
    setOpen(false);
    setForm({ ...form, code: "" });
  }

  const all = [
    ...extra.map((c) => ({ ...c, used: 0, usageLimit: 1000 })),
    ...seed.map((c) => ({ ...c, id: c.code })),
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold">Coupons</h1>
          <p className="text-sm text-muted">Validated server-side in production (Cloud Function).</p>
        </div>
        <Button onClick={() => setOpen((s) => !s)}>
          <Plus className="h-4 w-4" /> New coupon
        </Button>
      </div>

      {open && (
        <form onSubmit={create} className="grid gap-3 rounded-xl border border-line bg-card p-4 sm:grid-cols-3 lg:grid-cols-6">
          <input
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            placeholder="CODE"
            className="h-10 rounded-lg border border-line bg-surface px-3 font-mono text-sm uppercase outline-none focus:border-accent/60"
          />
          <input
            type="number"
            value={form.value}
            onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
            className="h-10 rounded-lg border border-line bg-surface px-3 text-sm outline-none"
            title="Discount value"
          />
          <input
            type="number"
            value={form.minOrder}
            onChange={(e) => setForm({ ...form, minOrder: Number(e.target.value) })}
            className="h-10 rounded-lg border border-line bg-surface px-3 text-sm outline-none"
            title="Min order"
          />
          <input
            type="number"
            value={form.maxDiscount}
            onChange={(e) => setForm({ ...form, maxDiscount: Number(e.target.value) })}
            className="h-10 rounded-lg border border-line bg-surface px-3 text-sm outline-none"
            title="Max discount"
          />
          <input
            type="date"
            value={form.expiresAt}
            onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
            className="h-10 rounded-lg border border-line bg-surface px-3 text-sm outline-none"
          />
          <Button type="submit">Create</Button>
        </form>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {all.map((c) => {
          const expired = new Date(c.expiresAt).getTime() < Date.now();
          return (
            <article key={c.id} className="rounded-xl border border-line bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-mono text-lg font-bold">
                  <Ticket className="h-4 w-4 text-accent" /> {c.code}
                </span>
                <Badge tone={expired ? "danger" : "success"}>{expired ? "Expired" : "Active"}</Badge>
              </div>
              <p className="mt-2 text-sm text-muted">
                {c.type === "percentage" || c.id.length > 0 ? `${c.value}% / fixed` : ""} off • min
                ₹{c.minOrder.toLocaleString("en-IN")} • max ₹{c.maxDiscount.toLocaleString("en-IN")}
              </p>
              <p className="mt-1 text-xs text-muted">
                Expires {formatDate(c.expiresAt)} • used {c.used.toLocaleString("en-IN")} /{" "}
                {c.usageLimit.toLocaleString("en-IN")}
              </p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface">
                <div
                  className="h-full bg-accent"
                  style={{ width: `${Math.min((c.used / c.usageLimit) * 100, 100)}%` }}
                />
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
