import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, Home, Gamepad2, Tag, Heart, User, CalendarClock, Sparkles, LifeBuoy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { PLATFORMS, GENRES } from "@/data/catalog";

const GENRE_ICONS: Record<string, string> = {
  Action: "⚔",
  Adventure: "🧭",
  RPG: "🛡",
  FPS: "🎯",
  Racing: "🏁",
  Sports: "🏆",
  Strategy: "♟",
  Simulation: "⚙",
  Horror: "👻",
  Indie: "✦",
  Multiplayer: "👥",
  Survival: "⛺",
};

const MAIN = [
  { to: "/", label: "Home", Icon: Home },
  { to: "/games", label: "All Games", Icon: Gamepad2 },
  { to: "/deals", label: "Deals", Icon: Tag },
  { to: "/pre-orders", label: "Pre-orders", Icon: CalendarClock },
  { to: "/upcoming", label: "Upcoming", Icon: Sparkles },
  { to: "/wishlist", label: "Wishlist", Icon: Heart },
  { to: "/support", label: "Support", Icon: LifeBuoy },
];

/** Left slide-in menu (mobile) with full information architecture. */
export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAuth();
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[85] bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.nav
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.26, ease: [0.32, 0.72, 0, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="flex h-full w-80 max-w-[85vw] flex-col border-r border-line bg-surface"
            aria-label="Mobile navigation"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <Link to="/" onClick={onClose} className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent font-display font-bold text-black">
                  K
                </span>
                <span className="font-display font-bold">KDEX</span>
              </Link>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="focus-ring grid h-8 w-8 place-items-center rounded-lg text-muted hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto thin-scrollbar p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                Discover
              </p>
              <ul className="space-y-1">
                {MAIN.map(({ to, label, Icon }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      onClick={onClose}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                          isActive ? "bg-accent-soft text-accent" : "text-white hover:bg-white/5"
                        )
                      }
                    >
                      <Icon className="h-4 w-4" /> {label}
                    </NavLink>
                  </li>
                ))}
              </ul>

              <p className="mb-2 mt-6 text-xs font-semibold uppercase tracking-wide text-muted">
                Categories & Genres
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {GENRES.map((g) => (
                  <NavLink
                    key={g}
                    to={`/genre/${g.toLowerCase()}`}
                    onClick={onClose}
                    className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-white/90 transition-colors hover:bg-white/5 hover:text-accent"
                  >
                    <span>{GENRE_ICONS[g]}</span>
                    <span className="truncate">{g}</span>
                  </NavLink>
                ))}
              </div>

              <p className="mb-2 mt-6 text-xs font-semibold uppercase tracking-wide text-muted">
                Platforms
              </p>
              <ul className="space-y-1">
                {PLATFORMS.map((p) => (
                  <li key={p}>
                    <NavLink
                      to={`/platform/${p.toLowerCase()}`}
                      onClick={onClose}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white hover:bg-white/5"
                    >
                      {p}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              to={user ? "/account" : "/login"}
              onClick={onClose}
              className="m-4 flex items-center justify-center gap-2 rounded-full bg-accent py-3 text-sm font-semibold text-black shadow-accent"
            >
              <User className="h-4 w-4" />
              {user ? "My Account" : "Sign in / Register"}
            </Link>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const BOTTOM = [
  { to: "/", label: "Home", Icon: Home },
  { to: "/games", label: "Browse", Icon: Gamepad2 },
  { to: "/deals", label: "Deals", Icon: Tag },
  { to: "/wishlist", label: "Wishlist", Icon: Heart },
  { to: "/account", label: "Account", Icon: User },
];

function bottomClass({ isActive }: { isActive: boolean }) {
  return cn(
    "relative flex flex-1 flex-col items-center justify-center gap-1 text-[10px] font-medium",
    isActive ? "text-accent" : "text-muted"
  );
}
export function BottomNav() {
  const { wishlist } = useStore();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur-lg md:hidden"
      aria-label="Bottom navigation"
    >
      <div className="mx-auto flex h-16 max-w-lg items-stretch">
        {BOTTOM.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={bottomClass}
          >
            <Icon className="h-5 w-5" />
            {label}
            {to === "/wishlist" && wishlist.length > 0 && (
              <span className="absolute right-[22%] top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[9px] font-bold text-black">
                {wishlist.length}
              </span>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

