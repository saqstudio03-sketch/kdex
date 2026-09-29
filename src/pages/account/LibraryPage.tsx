import { useState } from "react";
import { Link } from "react-router-dom";
import { KeyRound, Copy, Eye, Check } from "lucide-react";
import { byId } from "@/data/products";
import { useOrders } from "@/context/OrdersContext";
import { useStore } from "@/context/StoreContext";
import { formatINR, formatDate } from "@/lib/utils";
import { Artwork } from "@/components/Artwork";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function LibraryPage() {
  const { orders, revealKey, revealed } = useOrders();
  const { toast } = useStore();
  const [copied, setCopied] = useState<string | null>(null);

  const entries = orders.flatMap((o) =>
    o.keys.map((k) => ({ order: o, key: k }))
  );

  if (!entries.length)
    return (
      <EmptyState
        icon="orders"
        title="Your library is empty"
        description="Buy a game and its activation key will appear here instantly."
        action={
          <Link to="/games">
            <Button>Find a game</Button>
          </Link>
        }
      />
    );

  async function copy(orderId: string, productId: string, key: string) {
    try {
      await navigator.clipboard.writeText(key);
      setCopied(`${orderId}:${productId}`);
      toast("Key copied to clipboard", "success");
      setTimeout(() => setCopied(null), 2000);
    } catch {
      toast("Clipboard unavailable — select the key manually", "error");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-lg font-bold">Game Library</h2>
        <span className="rounded-lg border border-warning/40 bg-warning/10 px-2.5 py-1 text-[11px] font-semibold text-warning">
          DEMO KEYS — not real activations
        </span>
      </div>

      {entries.map(({ order, key }) => {
        const p = byId(key.productId);
        const id = `${order.id}:${key.productId}`;
        const isRevealed = revealed.includes(id);
        const isCopied = copied === id;
        if (!p) return null;

        return (
          <article key={id} className="rounded-xl border border-line bg-card p-4">
            <div className="flex gap-4">
              <Link
                to={`/game/${p.slug}`}
                className="h-24 w-16 shrink-0 overflow-hidden rounded-lg bg-surface"
              >
                <Artwork seed={p.imageSeed} alt={p.title} />
              </Link>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link to={`/game/${p.slug}`} className="font-semibold hover:text-accent">
                    {p.title}
                  </Link>
                  <Badge tone="muted">{p.platform}</Badge>
                  <Badge tone="success">Active • {p.region}</Badge>
                </div>
                <p className="mt-0.5 text-xs text-muted">
                  Purchased {formatDate(order.createdAt)} • Order #{order.id} •{" "}
                  {formatINR(key.status === "sold" ? p.salePrice : p.salePrice)}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <code className="rounded-lg border border-line bg-surface px-3 py-2 font-mono text-sm tracking-wider text-white">
                    {isRevealed ? key.key : `NX-••••-••••-••••-••••`}
                  </code>
                  {!isRevealed && (
                    <Button size="sm" variant="outline" onClick={() => revealKey(order.id, key.productId)}>
                      <Eye className="h-3.5 w-3.5" /> View key
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant={isCopied ? "primary" : "dark"}
                    onClick={() => copy(order.id, key.productId, key.key)}
                  >
                    {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {isCopied ? "Copied" : "Copy key"}
                  </Button>
                </div>

                <div className="mt-3 rounded-lg border border-line bg-surface p-3 text-xs text-muted">
                  <p className="mb-1 flex items-center gap-1.5 font-semibold text-white">
                    <KeyRound className="h-3.5 w-3.5 text-accent" /> How to redeem
                  </p>
                  1. Open {p.activationPlatform} and sign in. 2. Go to “Redeem code”. 3. Paste
                  your key and confirm. 4. The game appears in your {p.activationPlatform}{" "}
                  library.
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
