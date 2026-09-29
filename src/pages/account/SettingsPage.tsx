import { useState } from "react";
import { Globe, Bell, Shield, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/Button";

const LANGUAGES = [
  { id: "en", label: "English" },
  { id: "hi", label: "हिन्दी (Hindi)" },
  { id: "ml", label: "മലയാളം (Malayalam)" },
];

export default function SettingsPage() {
  const { user, updateProfile, verifyEmail } = useAuth();
  const { toast } = useStore();

  const [name, setName] = useState(user?.displayName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [language, setLanguage] = useState("en");
  const [notifyDeals, setNotifyDeals] = useState(true);
  const [notifyOrders, setNotifyOrders] = useState(true);

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-line bg-card p-5">
        <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
          <Shield className="h-4 w-4 text-accent" /> Profile details
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs uppercase text-muted">Display name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm outline-none focus:border-accent/60"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs uppercase text-muted">Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm outline-none focus:border-accent/60"
            />
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            size="sm"
            onClick={() => {
              updateProfile({ displayName: name, email });
              toast("Profile updated", "success");
            }}
          >
            Save changes
          </Button>
          <Button size="sm" variant="outline" onClick={() => { verifyEmail(); toast("Verification email sent (demo)"); }}>
            Send verification email
          </Button>
        </div>
      </section>

      <section className="rounded-xl border border-line bg-card p-5">
        <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
          <Globe className="h-4 w-4 text-accent" /> Localization
        </h2>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted">Language</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="h-10 rounded-lg border border-line bg-surface px-3 outline-none focus:border-accent/60"
            >
              {LANGUAGES.map((l) => (
                <option key={l.id} value={l.id}>{l.label}</option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted">Currency</span>
            <select className="h-10 rounded-lg border border-line bg-surface px-3 outline-none focus:border-accent/60" defaultValue="INR" disabled>
              <option value="INR">INR ₹ (India)</option>
            </select>
          </label>
        </div>
        <p className="mt-3 text-xs text-muted">
          i18n is architecturally modular — UI copy for Hindi and Malayalam plugs into this
          selector once translation files are added.
        </p>
      </section>

      <section className="rounded-xl border border-line bg-card p-5">
        <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
          <Bell className="h-4 w-4 text-accent" /> Notifications
        </h2>
        <div className="space-y-3 text-sm">
          <label className="flex cursor-pointer items-center justify-between">
            <span>Deal & price-drop alerts</span>
            <input
              type="checkbox"
              checked={notifyDeals}
              onChange={(e) => setNotifyDeals(e.target.checked)}
              className="h-5 w-5 accent-accent"
            />
          </label>
          <label className="flex cursor-pointer items-center justify-between">
            <span>Order & key delivery updates</span>
            <input
              type="checkbox"
              checked={notifyOrders}
              onChange={(e) => setNotifyOrders(e.target.checked)}
              className="h-5 w-5 accent-accent"
            />
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-danger/40 bg-danger/5 p-5">
        <h2 className="mb-2 font-display text-lg font-bold text-danger">Danger zone</h2>
        <p className="text-sm text-muted">
          Deleting your account removes local demo data (orders, wishlist, tickets) from this
          browser.
        </p>
        <Button
          variant="danger"
          size="sm"
          className="mt-3"
          onClick={() => {
            Object.keys(localStorage)
              .filter((k) => k.startsWith("nexora:"))
              .forEach((k) => localStorage.removeItem(k));
            toast("Local demo data cleared", "info");
          }}
        >
          <Trash2 className="h-4 w-4" /> Clear local demo data
        </Button>
      </section>
    </div>
  );
}
