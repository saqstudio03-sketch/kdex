import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileMenu, BottomNav } from "./MobileNav";
import { CartDrawer } from "./CartDrawer";
import { SearchOverlay } from "./SearchOverlay";
import { Toaster } from "@/components/ui/Toaster";
import { useStore } from "@/context/StoreContext";

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { setSearchOpen, searchOpen } = useStore();
  const location = useLocation();

  // "/" keyboard shortcut opens search (desktop)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  useEffect(() => {
    if (!searchOpen) window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname, searchOpen]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header onOpenMenu={() => setMenuOpen(true)} />

      <main className="flex-1 pb-16 md:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
      <BottomNav />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <CartDrawer />
      <SearchOverlay />
      <Toaster />
    </div>
  );
}
