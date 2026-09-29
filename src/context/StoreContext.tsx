import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "@/types";
import { load, save } from "@/lib/storage";

export interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

interface StoreCtx {
  cart: CartItem[];
  cartCount: number;
  addToCart: (productId: string, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWished: (productId: string) => boolean;
  toasts: Toast[];
  toast: (message: string, type?: Toast["type"]) => void;
  dismissToast: (id: number) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

const StoreContext = createContext<StoreCtx | null>(null);
let toastSeq = 0;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => load<CartItem[]>("cart", []));
  const [wishlist, setWishlist] = useState<string[]>(() => load<string[]>("wishlist", []));
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Persist between sessions
  useEffect(() => save("cart", cart), [cart]);
  useEffect(() => save("wishlist", wishlist), [wishlist]);

  const dismissToast = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: Toast["type"] = "success") => {
      const id = ++toastSeq;
      setToasts((t) => [...t, { id, message, type }]);
      setTimeout(() => dismissToast(id), 3600);
    },
    [dismissToast]
  );

  const addToCart = useCallback(
    (productId: string, qty = 1) => {
      setCart((c) => {
        const found = c.find((i) => i.productId === productId);
        if (found)
          return c.map((i) =>
            i.productId === productId ? { ...i, qty: Math.min(i.qty + qty, 10) } : i
          );
        return [...c, { productId, qty }];
      });
    },
    []
  );

  const removeFromCart = useCallback(
    (productId: string) => setCart((c) => c.filter((i) => i.productId !== productId)),
    []
  );

  const setQty = useCallback(
    (productId: string, qty: number) =>
      setCart((c) =>
        qty <= 0
          ? c.filter((i) => i.productId !== productId)
          : c.map((i) => (i.productId === productId ? { ...i, qty: Math.min(qty, 10) } : i))
      ),
    []
  );

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback(
    (productId: string) => {
      setWishlist((w) => {
        const has = w.includes(productId);
        toast(has ? "Removed from wishlist" : "Added to wishlist", "info");
        return has ? w.filter((x) => x !== productId) : [...w, productId];
      });
    },
    [toast]
  );

  const isWished = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

  const value = useMemo(
    () => ({
      cart,
      cartCount: cart.reduce((s, i) => s + i.qty, 0),
      addToCart,
      removeFromCart,
      setQty,
      clearCart,
      cartOpen,
      setCartOpen,
      wishlist,
      toggleWishlist,
      isWished,
      toasts,
      toast,
      dismissToast,
      searchOpen,
      setSearchOpen,
    }),
    [cart, addToCart, removeFromCart, setQty, clearCart, cartOpen, wishlist, toggleWishlist, isWished, toasts, toast, dismissToast, searchOpen]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreCtx {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
