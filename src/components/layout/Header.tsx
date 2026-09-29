import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  Tag,
  ChevronDown,
  LayoutGrid,
  Sparkles,
  ArrowRight,
  Layers,
  Flame,
} from "lucide-react";
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

const FORMAT_CATEGORIES = [
  { label: "All Games", to: "/games", desc: "Browse full base game titles", icon: "🎮" },
  { label: "DLCs & Expansions", to: "/games?type=DLC", desc: "Story expansions & packs", icon: "📦" },
  { label: "Gift Cards", to: "/games?type=Gift%20Card", desc: "Instant digital store credit", icon: "💳" },
  { label: "Subscriptions", to: "/games?type=Subscription", desc: "KDex Play+ gaming pass", icon: "👑" },
];

const DISCOVER = [
  { to: "/?tab=trending", label: "Trending" },
  { to: "/pre-orders", label: "Pre-orders" },
  { to: "/upcoming", label: "Upcoming" },
  { to: "/deals", label: "Deals" },
];

export function Header({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { cartCount, wishlist, setSearchOpen, setCartOpen } = useStore();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setSearchOpen(false);
    setCategoriesOpen(false);
  }, [location.pathname, setSearchOpen]);

  // Click outside to close categories dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (categoriesRef.current && !categoriesRef.current.contains(e.target as Node)) {
        setCategoriesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLink = ({ isActive }: { isActive: boolean }) =>
    cn(
      "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors focus-ring",
      isActive ? "text-accent bg-white/5" : "text-muted hover:bg-white/5 hover:text-white"
    );

  const isCategoryActive =
    location.pathname.startsWith("/genre") ||
    location.pathname.startsWith("/category") ||
    location.pathname === "/games";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "border-line/60 bg-black/70 shadow-card backdrop-blur-xl"
          : "border-white/10 bg-black/40 shadow-sm backdrop-blur-md"
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1920px] items-center gap-3 px-4 sm:px-6 md:h-[72px] md:gap-5 md:px-8 lg:px-12 xl:px-16">
        <button
          onClick={onOpenMenu}
          aria-label="Open navigation menu"
          className="focus-ring grid h-9 w-9 place-items-center rounded-xl text-white md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link to="/" className="group flex items-center gap-2.5" aria-label="KDex home">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent font-display text-lg font-bold text-black transition-transform group-hover:rotate-6">
            K
          </span>
          <span className="hidden font-display text-lg font-bold tracking-tight text-white sm:block">
            KDEX<span className="text-accent">.</span>
            <span className="ml-1 text-xs font-medium uppercase tracking-[0.2em] text-muted">
              Games
            </span>
          </span>
        </Link>

        {/* Categories Dropdown & Navigation */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main Navigation">
          {/* Categories Dropdown Button */}
          <div className="relative" ref={categoriesRef}>
            <button
              onClick={() => setCategoriesOpen((prev) => !prev)}
              aria-expanded={categoriesOpen}
              className={cn(
                "group flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors focus-ring",
                categoriesOpen || isCategoryActive
                  ? "bg-accent/15 text-accent"
                  : "text-muted hover:bg-white/5 hover:text-white"
              )}
            >
              <LayoutGrid className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span>Categories</span>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-200",
                  categoriesOpen ? "rotate-180 text-accent" : "text-muted group-hover:text-white"
                )}
              />
            </button>

            {/* Dropdown Menu Panel */}
            {categoriesOpen && (
              <div className="absolute left-0 top-full mt-2.5 w-[640px] overflow-hidden rounded-2xl border border-white/20 bg-black p-5 shadow-[0_25px_60px_rgba(0,0,0,0.95)] animate-in fade-in zoom-in-95 duration-150 z-50">
                <div className="grid grid-cols-12 gap-5">
                  {/* Genres / Themes (Left Column) */}
                  <div className="col-span-7 border-r border-white/10 pr-5">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-white/70">
                        Browse by Genre
                      </span>
                      <Link
                        to="/games"
                        onClick={() => setCategoriesOpen(false)}
                        className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
                      >
                        All genres <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      {GENRES.map((g) => (
                        <Link
                          key={g}
                          to={`/genre/${g.toLowerCase()}`}
                          onClick={() => setCategoriesOpen(false)}
                          className={cn(
                            "flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-all",
                            location.pathname === `/genre/${g.toLowerCase()}`
                              ? "bg-accent text-black font-semibold shadow-sm"
                              : "text-white/90 bg-white/[0.03] border border-white/[0.05] hover:bg-white/15 hover:border-white/20 hover:text-white"
                          )}
                        >
                          <span className="text-sm">{GENRE_ICONS[g]}</span>
                          <span className="truncate">{g}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Catalog Types & Collections (Right Column) */}
                  <div className="col-span-5 flex flex-col justify-between">
                    <div>
                      <span className="mb-3 block text-xs font-bold uppercase tracking-wider text-white/70">
                        Format & Collections
                      </span>
                      <div className="space-y-1.5">
                        {FORMAT_CATEGORIES.map((item) => (
                          <Link
                            key={item.label}
                            to={item.to}
                            onClick={() => setCategoriesOpen(false)}
                            className="group block rounded-xl p-2.5 transition-all bg-white/[0.03] border border-white/[0.05] hover:bg-white/15 hover:border-white/20"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{item.icon}</span>
                              <span className="text-xs font-semibold text-white group-hover:text-accent">
                                {item.label}
                              </span>
                            </div>
                            <p className="mt-0.5 text-[11px] text-white/70">
                              {item.desc}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <Link
                      to="/deals"
                      onClick={() => setCategoriesOpen(false)}
                      className="mt-3 flex items-center justify-between rounded-xl border border-accent/40 bg-accent/20 p-2.5 text-xs font-medium text-accent transition-all hover:bg-accent/30"
                    >
                      <span className="flex items-center gap-1.5 font-bold text-accent">
                        <Flame className="h-4 w-4" /> Daily Flash Deals
                      </span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {DISCOVER.map((item) => (
            <NavLink key={item.label} to={item.to} className={navLink}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden h-6 w-px bg-line lg:block" />

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Platforms">
          {PLATFORMS.map((p) => (
            <NavLink key={p} to={`/platform/${p.toLowerCase()}`} className={navLink}>
              {p}
            </NavLink>
          ))}
        </nav>

        <div className="flex-1" />

        <button
          onClick={() => setSearchOpen(true)}
          className="focus-ring group hidden h-10 flex-1 items-center gap-2.5 rounded-full border border-line bg-card px-4 text-left text-sm text-muted transition-all hover:border-accent/40 hover:text-white md:flex xl:max-w-xs"
          aria-label="Open search"
        >
          <Search className="h-4 w-4 transition-colors group-hover:text-accent" />
          <span className="truncate">Search games, DLC, gift cards…</span>
        </button>

        <button
          onClick={() => setSearchOpen(true)}
          aria-label="Search"
          className="focus-ring grid h-9 w-9 place-items-center rounded-full text-white md:hidden"
        >
          <Search className="h-5 w-5" />
        </button>

        <Link
          to="/wishlist"
          aria-label="Wishlist"
          className="focus-ring relative hidden h-10 w-10 place-items-center rounded-full text-muted transition-colors hover:bg-white/5 hover:text-white sm:grid"
        >
          <Heart className="h-5 w-5" />
          {wishlist.length > 0 && (
            <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-black">
              {wishlist.length}
            </span>
          )}
        </Link>

        <button
          onClick={() => setCartOpen(true)}
          aria-label="Open cart"
          className="focus-ring relative grid h-10 w-10 place-items-center rounded-full text-muted transition-colors hover:bg-white/5 hover:text-white"
        >
          <ShoppingBag className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-black">
              {cartCount}
            </span>
          )}
        </button>

        <Link
          to={user ? "/account" : "/login"}
          className="focus-ring hidden h-10 items-center gap-2 rounded-full border border-line bg-card px-4 text-sm font-medium text-white transition-all hover:border-accent/50 sm:flex"
        >
          <User className="h-4 w-4 text-accent" />
          <span className="hidden md:block">
            {user ? user.displayName.split(" ")[0] : "Sign in"}
          </span>
        </Link>

        <Link
          to="/deals"
          className="focus-ring hidden h-10 items-center gap-1.5 rounded-full bg-accent px-4 text-sm font-semibold text-black shadow-accent transition-all hover:bg-accent-hover lg:flex"
        >
          <Tag className="h-4 w-4" />
          Grab Deals
        </Link>
      </div>
    </header>
  );
}
