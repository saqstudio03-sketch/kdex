import { Heart, ShieldCheck, KeyRound, RotateCcw, ShoppingBag } from "lucide-react";
import type { Product } from "@/types";
import { formatINR, discountPercent, formatDate } from "@/lib/utils";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/Button";

/** Pricing block + product metadata + purchase actions. */
export function PurchasePanel({ product }: { product: Product }) {
  const { addToCart, setCartOpen, toggleWishlist, isWished, toast } = useStore();
  const off = discountPercent(product.price, product.salePrice);
  const wished = isWished(product.id);
  const isPreorder = product.availability === "preorder";
  const out = product.availability === "out_of_stock";

  const meta: [string, string][] = [
    ["Developer", product.developer],
    ["Publisher", product.publisher],
    ["Release date", formatDate(product.releaseDate)],
    ["Genre", product.genres.join(", ") || product.genre],
    ["Platform", product.platform],
    ["Activation", product.activationPlatform],
    ["Region", product.region],
    ["Product type", product.productType],
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-line bg-card p-5 shadow-card">
        <div className="mb-4 flex flex-wrap items-baseline gap-3">
          <span className="font-display text-4xl font-bold text-accent">
            {formatINR(product.salePrice)}
          </span>
          {off > 0 && (
            <>
              <span className="text-lg text-muted line-through">{formatINR(product.price)}</span>
              <span className="rounded-md bg-accent px-2 py-0.5 text-sm font-bold text-black">
                -{off}%
              </span>
            </>
          )}
        </div>

        <div className="mb-4 flex items-center justify-between rounded-lg border border-line bg-surface px-3 py-2 text-xs">
          <span className="flex items-center gap-1.5 text-muted">
            <KeyRound className="h-3.5 w-3.5 text-accent" /> Digital key • {product.region}
          </span>
          <span className={out ? "text-danger" : "text-success"}>
            {out ? "Out of stock" : isPreorder ? "Pre-order" : `In stock (${product.stock})`}
          </span>
        </div>

        <div className="space-y-2.5">
          <Button
            size="lg"
            className="w-full"
            disabled={out}
            onClick={() => {
              addToCart(product.id);
              toast("Added to cart", "success");
              setCartOpen(true);
            }}
          >
            <ShoppingBag className="h-4 w-4" />
            {isPreorder ? "Pre-order Now" : "Buy Now"}
          </Button>
          <div className="flex gap-2.5">
            <Button
              variant="outline"
              className="flex-1"
              disabled={out}
              onClick={() => {
                addToCart(product.id);
                toast("Added to cart");
              }}
            >
              Add to Cart
            </Button>
            <Button
              variant={wished ? "primary" : "dark"}
              onClick={() => toggleWishlist(product.id)}
              aria-label="Toggle wishlist"
            >
              <Heart className={`h-4 w-4 ${wished ? "fill-black" : ""}`} />
            </Button>
          </div>
        </div>

        <ul className="mt-5 space-y-2 border-t border-line pt-4 text-xs text-muted">
          <li className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-success" /> 100% legitimate sourced keys
          </li>
          <li className="flex items-center gap-2">
            <KeyRound className="h-3.5 w-3.5 text-success" /> Instant email + in-account delivery
          </li>
          <li className="flex items-center gap-2">
            <RotateCcw className="h-3.5 w-3.5 text-success" /> Refund on unused keys within 48h
          </li>
        </ul>
      </div>

      <div className="rounded-2xl border border-line bg-card p-5">
        <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-muted">
          Product information
        </h3>
        <dl className="space-y-2.5 text-sm">
          {meta.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 border-b border-line/60 pb-2 last:border-0">
              <dt className="text-muted">{k}</dt>
              <dd className="text-right font-medium text-white">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-4 space-y-3">
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase text-muted">Languages</p>
            <div className="flex flex-wrap gap-1.5">
              {product.languages.map((l) => (
                <span key={l} className="rounded border border-line bg-surface px-2 py-0.5 text-[11px] text-white">
                  {l}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase text-muted">Game modes</p>
            <div className="flex flex-wrap gap-1.5">
              {product.modes.map((m) => (
                <span key={m} className="rounded border border-line bg-surface px-2 py-0.5 text-[11px] text-white">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
