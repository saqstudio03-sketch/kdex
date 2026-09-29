import { useMemo, useState } from "react";
import { Plus, Pencil, Archive } from "lucide-react";
import { products as catalog } from "@/data/products";
import { discountPercent } from "@/lib/utils";
import { load, save } from "@/lib/storage";
import { useStore } from "@/context/StoreContext";
import { usePageSeo } from "@/hooks/usePageSeo";
import { Button } from "@/components/ui/Button";
import { ProductForm, type AdminProductDraft } from "@/components/admin/ProductForm";

export default function AdminProducts() {
  usePageSeo({ title: "Products — Nexora Admin", canonicalPath: "/admin/products" });
  const { toast } = useStore();
  const [custom, setCustom] = useState<AdminProductDraft[]>(() => load("adminProducts", []));
  const [overrides, setOverrides] = useState<Record<string, { price: number; stock: number }>>(
    () => load("adminOverrides", {})
  );
  const [showForm, setShowForm] = useState(false);

  const rows = useMemo(() => {
    const base = catalog.map((p) => {
      const o = overrides[p.id];
      return {
        id: p.id,
        title: p.title,
        platform: p.platform,
        price: o?.price ?? p.price,
        salePrice: p.salePrice,
        stock: o?.stock ?? p.stock,
        archived: false,
      };
    });
    return [...custom, ...base];
  }, [custom, overrides]);

  function create(p: AdminProductDraft) {
    const next = [p, ...custom];
    setCustom(next);
    save("adminProducts", next);
    toast(`“${p.title}” created (stored locally in this demo)`, "success");
    setShowForm(false);
  }

  function setPrice(id: string, price: number, stock: number) {
    const next = { ...overrides, [id]: { price, stock } };
    setOverrides(next);
    save("adminOverrides", next);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold">Products</h1>
          <p className="text-sm text-muted">
            {rows.length} SKUs • edits persist locally (Firestore in production)
          </p>
        </div>
        <Button onClick={() => setShowForm((s) => !s)}>
          <Plus className="h-4 w-4" /> New product
        </Button>
      </div>

      {showForm && <ProductForm onCreate={create} onCancel={() => setShowForm(false)} />}

      <div className="overflow-x-auto rounded-xl border border-line bg-card thin-scrollbar">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
              <th className="p-3">Title</th>
              <th className="p-3">Platform</th>
              <th className="p-3">Price (₹)</th>
              <th className="p-3">Discount</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-line/60 last:border-0 hover:bg-surface/60">
                <td className="p-3 font-medium">{r.title}</td>
                <td className="p-3 text-muted">{r.platform}</td>
                <td className="p-3">
                  <input
                    type="number"
                    value={r.price}
                    onChange={(e) => setPrice(r.id, Number(e.target.value), r.stock)}
                    className="w-24 rounded border border-line bg-surface px-2 py-1 text-sm outline-none focus:border-accent/60"
                  />
                </td>
                <td className="p-3 text-accent">{discountPercent(r.price, r.salePrice)}%</td>
                <td className="p-3">{r.stock}</td>
                <td className="p-3">
                  <span
                    className={`rounded px-2 py-0.5 text-[11px] font-semibold ${
                      r.archived ? "bg-danger/15 text-danger" : "bg-success/15 text-success"
                    }`}
                  >
                    {r.archived ? "Archived" : "Active"}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => toast("Full edit drawer maps to Firestore update (demo)", "info")}
                    className="mr-2 text-muted hover:text-accent"
                    aria-label={`Edit ${r.title}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => toast("Archive requires admin claim + audit log (demo)", "info")}
                    className="text-muted hover:text-danger"
                    aria-label={`Archive ${r.title}`}
                  >
                    <Archive className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
