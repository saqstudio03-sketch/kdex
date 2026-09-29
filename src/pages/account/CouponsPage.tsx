import { useState } from "react";
import { Ticket, Copy, Check } from "lucide-react";
import { coupons } from "@/data/coupons";
import { useStore } from "@/context/StoreContext";
import { usePageSeo } from "@/hooks/usePageSeo";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export default function CouponsPage() {
  usePageSeo({ title: "Coupons — KDex Games", canonicalPath: "/account/coupons" });
  const { toast } = useStore();
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      toast(`Coupon ${code} copied`, "success");
      setTimeout(() => setCopied(null), 1800);
    } catch {
      toast("Clipboard unavailable", "error");
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-lg font-bold">Available coupons</h2>
        <p className="mt-1 text-sm text-muted">
          Apply these at checkout — validation happens server-side in production.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {coupons.map((c) => {
          const expired = new Date(c.expiresAt).getTime() < Date.now();
          const nearlyGone = c.used / c.usageLimit > 0.9;
          return (
            <article
              key={c.code}
              className={`relative overflow-hidden rounded-xl border bg-card p-5 ${
                expired ? "border-line opacity-60" : "border-accent/40"
              }`}
            >
              <div className="absolute -right-6 top-3 rotate-45 bg-accent px-8 py-0.5 text-[10px] font-bold uppercase text-black">
                {c.type === "percentage" ? `${c.value}% off` : `₹${c.value} off`}
              </div>

              <div className="flex items-center gap-2">
                <Ticket className="h-4 w-4 text-accent" />
                <code className="font-display text-lg font-bold tracking-wider">{c.code}</code>
              </div>

              <p className="mt-2 text-sm text-muted">
                Min. order ₹{c.minOrder.toLocaleString("en-IN")} • max discount ₹
                {c.maxDiscount.toLocaleString("en-IN")}
              </p>
              <p className="mt-1 text-xs text-muted">
                Valid till {formatDate(c.expiresAt)} • per-user limit {c.perUserLimit}×
              </p>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex gap-2">
                  <Badge tone={expired ? "danger" : "success"}>
                    {expired ? "Expired" : "Active"}
                  </Badge>
                  {nearlyGone && !expired && <Badge tone="warning">Almost gone</Badge>}
                </div>
                <button
                  onClick={() => copy(c.code)}
                  disabled={expired}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-white transition hover:border-accent/50 disabled:opacity-40"
                >
                  {copied === c.code ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied === c.code ? "Copied" : "Copy code"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
