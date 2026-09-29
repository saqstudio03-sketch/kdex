import { Outlet, NavLink, Link, useLocation } from "react-router-dom";
import {
  User,
  Package,
  Library,
  Heart,
  Star,
  Ticket,
  LifeBuoy,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/Button";

const NAV = [
  { to: "/account", label: "Profile", Icon: User, end: true },
  { to: "/account/orders", label: "Orders", Icon: Package },
  { to: "/account/library", label: "Game Library", Icon: Library },
  { to: "/wishlist", label: "Wishlist", Icon: Heart },
  { to: "/account/reviews", label: "Reviews", Icon: Star },
  { to: "/account/coupons", label: "Coupons", Icon: Ticket },
  { to: "/account/support", label: "Support", Icon: LifeBuoy },
  { to: "/account/settings", label: "Settings", Icon: Settings },
];

export default function AccountLayout() {
  const { user, logout } = useAuth();
  const { wishlist } = useStore();
  const location = useLocation();

  if (!user)
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold">Sign in required</h1>
        <p className="mt-2 text-sm text-muted">
          Access your orders, game library and settings after signing in.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/login" state={{ from: location.pathname }}>
            <Button>Sign in</Button>
          </Link>
          <Link to="/register">
            <Button variant="outline">Create account</Button>
          </Link>
        </div>
      </div>
    );

  return (
    <div className="mx-auto w-full max-w-[1920px] px-4 py-8 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-accent/15 font-display text-lg font-bold text-accent">
            {user.displayName.slice(0, 1).toUpperCase()}
          </span>
          <div>
            <h1 className="font-display text-xl font-bold">{user.displayName}</h1>
            <p className="text-xs text-muted">
              {user.email}
              {user.emailVerified && <span className="ml-2 text-success">✓ verified</span>}
            </p>
          </div>
        </div>
        <Button variant="dark" size="sm" onClick={logout}>
          Log out
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <nav className="lg:sticky lg:top-24 lg:self-start" aria-label="Account">
          <ul className="flex gap-1 overflow-x-auto no-scrollbar lg:flex-col lg:overflow-visible">
            {NAV.map(({ to, label, Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    cn(
                      "flex shrink-0 items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-accent-soft text-accent"
                        : "text-muted hover:bg-white/5 hover:text-white"
                    )
                  }
                >
                  <Icon className="h-4 w-4" /> {label}
                  {to === "/wishlist" && wishlist.length > 0 && (
                    <span className="ml-auto grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-black">
                      {wishlist.length}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
