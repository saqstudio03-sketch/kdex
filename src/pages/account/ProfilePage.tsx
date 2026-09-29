import { Link } from "react-router-dom";
import { BadgeCheck, Library, Package, Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrdersContext";
import { useStore } from "@/context/StoreContext";
import { formatINR, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export default function ProfilePage() {
  const { user, verifyEmail } = useAuth();
  const { orders } = useOrders();
  const { wishlist } = useStore();

  const spent = orders.reduce((s, o) => s + o.total, 0);
  const keys = orders.reduce((s, o) => s + o.keys.length, 0);

  const stats = [
    { label: "Orders", value: orders.length, Icon: Package, to: "/account/orders" },
    { label: "Keys owned", value: keys, Icon: Library, to: "/account/library" },
    { label: "Wishlist", value: wishlist.length, Icon: Heart, to: "/wishlist" },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-line bg-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-bold">Profile</h2>
            <p className="mt-1 text-sm text-muted">
              {user!.displayName} • joined {formatDate(new Date().toISOString())}
            </p>
          </div>
          {!user!.emailVerified ? (
            <Button variant="outline" onClick={() => verifyEmail()}>
              <BadgeCheck className="h-4 w-4" /> Verify email (demo)
            </Button>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-success/12 px-3 py-1.5 text-xs font-semibold text-success">
              <BadgeCheck className="h-4 w-4" /> Email verified
            </span>
          )}
        </div>

        <dl className="mt-5 grid gap-4 sm:grid-cols-3">
          {stats.map(({ label, value, Icon, to }) => (
            <Link
              key={label}
              to={to}
              className="rounded-xl border border-line bg-surface p-4 transition-colors hover:border-accent/50"
            >
              <Icon className="h-4 w-4 text-accent" />
              <p className="mt-2 font-display text-2xl font-bold">{value}</p>
              <p className="text-xs text-muted">{label}</p>
            </Link>
          ))}
        </dl>
      </section>

      <section className="rounded-2xl border border-line bg-card p-6">
        <h2 className="font-display text-lg font-bold">Account summary</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between border-b border-line pb-2">
            <dt className="text-muted">Lifetime spend</dt>
            <dd className="font-semibold">{formatINR(spent)}</dd>
          </div>
          <div className="flex justify-between border-b border-line pb-2">
            <dt className="text-muted">Sign-in provider</dt>
            <dd className="font-semibold capitalize">{user!.provider}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Currency</dt>
            <dd className="font-semibold">INR ₹ (India)</dd>
          </div>
        </dl>
        <div className="mt-5 flex gap-3">
          <Link to="/account/settings">
            <Button variant="outline" size="sm">Account settings</Button>
          </Link>
          <Link to="/games">
            <Button size="sm">Start shopping</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
