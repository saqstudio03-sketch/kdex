import { NavLink, Outlet, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Boxes,
  ShoppingCart,
  KeyRound,
  Ticket,
  Zap,
  Star,
  LifeBuoy,
  Newspaper,
  Settings,
  ExternalLink,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/admin", label: "Dashboard", Icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", Icon: Boxes },
  { to: "/admin/orders", label: "Orders", Icon: ShoppingCart },
  { to: "/admin/inventory", label: "Digital Inventory", Icon: KeyRound },
  { to: "/admin/coupons", label: "Coupons", Icon: Ticket },
  { to: "/admin/deals", label: "Deals", Icon: Zap },
  { to: "/admin/reviews", label: "Reviews", Icon: Star },
  { to: "/admin/support", label: "Support", Icon: LifeBuoy },
  { to: "/admin/content", label: "Homepage & News", Icon: Newspaper },
  { to: "/admin/settings", label: "Settings", Icon: Settings },
];

/** Completely separate admin shell (no storefront chrome). */
export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-line bg-surface px-4">
        <Link to="/admin" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent font-display font-bold text-black">
            K
          </span>
          <span className="font-display text-sm font-bold">
            KDEX <span className="text-accent">ADMIN</span>
          </span>
        </Link>
        <span className="rounded-md border border-warning/40 bg-warning/10 px-2 py-1 text-[10px] font-bold uppercase text-warning">
          Demo admin — role checks enforced server-side in production
        </span>
        <div className="ml-auto flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-1.5 rounded-lg border border-line bg-card px-3 py-1.5 text-xs font-medium text-white hover:border-accent/50"
          >
            <Store className="h-3.5 w-3.5" /> View store
          </Link>
          <span className="grid h-8 w-8 place-items-center rounded-full bg-accent/15 text-xs font-bold text-accent">
            A
          </span>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px]">
        <nav className="sticky top-14 hidden h-[calc(100vh-56px)] w-56 shrink-0 border-r border-line p-3 md:block">
          <ul className="space-y-1">
            {NAV.map(({ to, label, Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-accent-soft text-accent"
                        : "text-muted hover:bg-white/5 hover:text-white"
                    )
                  }
                >
                  <Icon className="h-4 w-4" /> {label}
                </NavLink>
              </li>
            ))}
          </ul>
          <a
            href="https://firebase.google.com/docs/firestore"
            target="_blank"
            rel="noreferrer"
            className="mt-6 flex items-center gap-1.5 px-3 text-[11px] text-muted hover:text-accent"
          >
            <ExternalLink className="h-3 w-3" /> Firestore docs
          </a>
        </nav>

        {/* Mobile admin nav */}
        <div className="sticky top-14 z-30 flex gap-1 overflow-x-auto border-b border-line bg-surface p-2 no-scrollbar md:hidden">
          {NAV.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium",
                  isActive ? "bg-accent text-black" : "bg-card text-muted"
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        <main className="min-w-0 flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
