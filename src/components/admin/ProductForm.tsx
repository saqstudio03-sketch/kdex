import { useState } from "react";
import { PLATFORMS } from "@/data/catalog";
import { uid } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export interface AdminProductDraft {
  id: string;
  title: string;
  platform: string;
  price: number;
  salePrice: number;
  stock: number;
  archived: boolean;
}

const EMPTY = { title: "", platform: "PC", price: 1999, salePrice: 1499, stock: 100 };

/** Compact "create product" form used by the admin products screen. */
export function ProductForm({
  onCreate,
  onCancel,
}: {
  onCreate: (p: AdminProductDraft) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(EMPTY);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!form.title.trim()) return;
        onCreate({ id: uid("p"), ...form, archived: false });
        setForm(EMPTY);
      }}
      className="grid gap-3 rounded-xl border border-line bg-card p-4 sm:grid-cols-5"
    >
      <input
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        placeholder="Title"
        className="h-10 rounded-lg border border-line bg-surface px-3 text-sm outline-none focus:border-accent/60 sm:col-span-2"
      />
      <select
        value={form.platform}
        onChange={(e) => setForm({ ...form, platform: e.target.value })}
        className="h-10 rounded-lg border border-line bg-surface px-3 text-sm outline-none"
      >
        {PLATFORMS.map((p) => (
          <option key={p}>{p}</option>
        ))}
      </select>
      <input
        type="number"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
        placeholder="Price (₹)"
        className="h-10 rounded-lg border border-line bg-surface px-3 text-sm outline-none"
      />
      <div className="flex gap-2">
        <Button type="submit">Create</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
