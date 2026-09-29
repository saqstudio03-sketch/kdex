import { useState } from "react";
import { Save, ShieldCheck, Database } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { usePageSeo } from "@/hooks/usePageSeo";
import { Button } from "@/components/ui/Button";

const ROLES = [
  { role: "admin", members: 1, desc: "Full access, including inventory & settings" },
  { role: "manager", members: 2, desc: "Products, deals, orders, reviews" },
  { role: "support", members: 3, desc: "Tickets and order lookup only" },
];

export default function AdminSettings() {
  usePageSeo({ title: "Settings — KDex Admin", canonicalPath: "/admin/settings" });
  const { toast } = useStore();
  const [store, setStore] = useState({
    name: "KDex Games",
    email: "support@kdex.demo",
    currency: "INR",
    gst: 18,
    region: "IN",
  });

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-line bg-card p-5">
        <h1 className="font-display text-xl font-bold">Store settings</h1>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs uppercase text-muted">Store name</span>
            <input
              value={store.name}
              onChange={(e) => setStore({ ...store, name: e.target.value })}
              className="h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm outline-none focus:border-accent/60"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs uppercase text-muted">Support email</span>
            <input
              value={store.email}
              onChange={(e) => setStore({ ...store, email: e.target.value })}
              className="h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm outline-none focus:border-accent/60"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs uppercase text-muted">Default currency</span>
            <select
              value={store.currency}
              onChange={(e) => setStore({ ...store, currency: e.target.value })}
              className="h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm outline-none"
            >
              <option value="INR">INR ₹</option>
              <option value="USD" disabled>USD $ (coming soon)</option>
              <option value="EUR" disabled>EUR € (coming soon)</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs uppercase text-muted">GST %</span>
            <input
              type="number"
              value={store.gst}
              onChange={(e) => setStore({ ...store, gst: Number(e.target.value) })}
              className="h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm outline-none"
            />
          </label>
        </div>
        <Button
          className="mt-4"
          onClick={() => toast("Settings saved (local demo)", "success")}
        >
          <Save className="h-4 w-4" /> Save settings
        </Button>
      </section>

      <section className="rounded-xl border border-line bg-card p-5">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold">
          <ShieldCheck className="h-5 w-5 text-accent" /> Roles & authorization
        </h2>
        <p className="mt-1 text-sm text-muted">
          Roles are enforced with custom claims + Firestore rules — never a client-side flag.
        </p>
        <div className="mt-4 space-y-3">
          {ROLES.map((r) => (
            <div key={r.role} className="flex items-center justify-between rounded-lg border border-line bg-surface px-4 py-3">
              <div>
                <p className="text-sm font-semibold capitalize">{r.role}</p>
                <p className="text-xs text-muted">{r.desc}</p>
              </div>
              <span className="text-xs text-muted">{r.members} user(s)</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-line bg-card p-5">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold">
          <Database className="h-5 w-5 text-accent" /> Integrations status
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            ["Firebase Auth", "Not configured — demo mode"],
            ["Firestore", "Not configured — local storage"],
            ["Razorpay", "Not configured — mock gateway"],
            ["Cloud Functions", "Not configured — simulated fulfilment"],
            ["Transactional email", "Not configured — no emails sent"],
            ["Firebase Hosting", "Run `firebase deploy` after setup"],
          ].map(([name, state]) => (
            <div key={name} className="flex items-center justify-between rounded-lg border border-line bg-surface px-4 py-3 text-sm">
              <span className="font-medium">{name}</span>
              <span className="text-xs text-warning">{state}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
