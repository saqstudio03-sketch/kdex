import { useState } from "react";
import { KeyRound, Upload, ShieldAlert } from "lucide-react";
import { products } from "@/data/products";
import { load, save } from "@/lib/storage";
import { useStore } from "@/context/StoreContext";
import { usePageSeo } from "@/hooks/usePageSeo";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface KeyRow {
  productId: string;
  available: number;
  reserved: number;
  sold: number;
}

/** Digital key inventory + secure bulk import workflow (demo). */
export default function AdminInventory() {
  usePageSeo({ title: "Digital Inventory — Nexora Admin", canonicalPath: "/admin/inventory" });
  const { toast } = useStore();
  const [extra, setExtra] = useState<Record<string, number>>(() => load("adminKeyImports", {}));
  const [importOpen, setImportOpen] = useState(false);
  const [bulk, setBulk] = useState("");
  const [target, setTarget] = useState(products[0]?.id ?? "");

  const rows: KeyRow[] = products
    .filter((p) => p.productType === "Game" || p.productType === "DLC")
    .slice(0, 16)
    .map((p) => {
      const imported = extra[p.id] ?? 0;
      const sold = Math.round(p.stock * 0.35);
      return {
        productId: p.id,
        available: Math.max(p.stock - sold, 0) + imported,
        reserved: Math.min(3, p.stock),
        sold,
      };
    });

  function importKeys(e: React.FormEvent) {
    e.preventDefault();
    const keys = bulk.split(/[\n,]+/).map((k) => k.trim()).filter(Boolean);
    if (!keys.length) return toast("Paste at least one key", "error");
    // Production: keys upload to a protected bucket, get hashed/locked, and are
    // only ever readable by the fulfilment Cloud Function.
    const next = { ...extra, [target]: (extra[target] ?? 0) + keys.length };
    setExtra(next);
    save("adminKeyImports", next);
    setBulk("");
    setImportOpen(false);
    toast(`${keys.length} keys imported (demo)`, "success");
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold">Digital Inventory</h1>
          <p className="text-sm text-muted">Key pools per product — full keys are never shown here.</p>
        </div>
        <Button onClick={() => setImportOpen((s) => !s)}>
          <Upload className="h-4 w-4" /> Bulk import keys
        </Button>
      </div>

      <div className="flex items-start gap-2 rounded-lg border border-warning/40 bg-warning/10 p-3 text-xs leading-relaxed text-warning">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
        Keys are write-only for admins and only decrypted inside the fulfilment transaction
        (Firestore rules + Cloud Function). The table below shows masked inventory counts.
      </div>

      {importOpen && (
        <form onSubmit={importKeys} className="space-y-3 rounded-xl border border-line bg-card p-4">
          <div className="flex flex-wrap gap-3">
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="h-10 rounded-lg border border-line bg-surface px-3 text-sm outline-none"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
            <span className="self-center text-xs text-muted">One key per line or comma-separated</span>
          </div>
          <textarea
            value={bulk}
            onChange={(e) => setBulk(e.target.value)}
            rows={4}
            placeholder={"XXXX-XXXX-XXXX\nYYYY-YYYY-YYYY"}
            className="w-full rounded-lg border border-line bg-surface p-3 font-mono text-sm outline-none focus:border-accent/60"
          />
          <Button type="submit" size="sm">
            Import keys
          </Button>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border border-line bg-card thin-scrollbar">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
              <th className="p-3">Product</th>
              <th className="p-3">Available</th>
              <th className="p-3">Reserved</th>
              <th className="p-3">Sold</th>
              <th className="p-3">Status</th>
              <th className="p-3">Pool</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const p = products.find((x) => x.id === r.productId)!;
              const low = r.available < 40;
              return (
                <tr key={r.productId} className="border-b border-line/60 last:border-0 hover:bg-surface/60">
                  <td className="p-3 font-medium">{p.title}</td>
                  <td className="p-3">{r.available}</td>
                  <td className="p-3 text-warning">{r.reserved}</td>
                  <td className="p-3 text-muted">{r.sold}</td>
                  <td className="p-3">
                    <Badge tone={low ? "warning" : "success"}>{low ? "Low stock" : "Healthy"}</Badge>
                  </td>
                  <td className="p-3 font-mono text-xs text-muted">NX-••••-••••-••••</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="flex items-center gap-2 text-xs text-muted">
        <KeyRound className="h-3.5 w-3.5 text-accent" /> Import counts are stored locally in this
        demo; production writes to the <code className="text-accent">digitalKeys</code> collection.
      </p>
    </div>
  );
}
