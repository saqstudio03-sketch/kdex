import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { byId } from "@/data/products";
import { formatINR, discountPercent } from "@/lib/utils";
import { Artwork } from "@/components/Artwork";

/** Single cart line: artwork, title, platform, qty stepper, price, remove. */
export function CartLineItem({ productId, qty }: { productId: string; qty: number }) {
  const { setQty, removeFromCart } = useStore();
  const p = byId(productId);
  if (!p) return null;

  return (
    <div className="flex gap-3 rounded-xl border border-line bg-card p-3">
      <Link
        to={`/game/${p.slug}`}
        className="h-20 w-14 shrink-0 overflow-hidden rounded-lg bg-bg"
      >
        <Artwork seed={p.imageSeed} alt={p.title} />
      </Link>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">{p.title}</p>
        <p className="text-[11px] uppercase tracking-wide text-muted">
          {p.platform} • {p.activationPlatform}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQty(productId, qty - 1)}
              className="grid h-6 w-6 place-items-center rounded border border-line text-muted hover:text-white"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-4 text-center text-sm">{qty}</span>
            <button
              onClick={() => setQty(productId, qty + 1)}
              className="grid h-6 w-6 place-items-center rounded border border-line text-muted hover:text-white"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-accent">{formatINR(p.salePrice * qty)}</p>
            {discountPercent(p.price, p.salePrice) > 0 && (
              <p className="text-[11px] text-muted line-through">
                {formatINR(p.price * qty)}
              </p>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={() => removeFromCart(productId)}
        aria-label={`Remove ${p.title}`}
        className="self-start text-muted transition-colors hover:text-danger"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
