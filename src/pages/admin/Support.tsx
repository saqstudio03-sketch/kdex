import { useState } from "react";
import { Send, LifeBuoy } from "lucide-react";
import { useOrders } from "@/context/OrdersContext";
import { formatDate, sanitizeText } from "@/lib/utils";
import { usePageSeo } from "@/hooks/usePageSeo";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function AdminSupport() {
  usePageSeo({ title: "Support — KDex Admin", canonicalPath: "/admin/support" });
  const { tickets, respondTicket } = useOrders();
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-xl font-bold">Support</h1>
        <p className="text-sm text-muted">
          {tickets.length} ticket{tickets.length === 1 ? "" : "s"} • replies notify the customer
          in production
        </p>
      </div>

      {tickets.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line bg-card p-8 text-sm text-muted">
          No tickets yet — customer tickets from Account → Support land here.
        </p>
      ) : (
        <div className="space-y-4">
          {tickets.map((t) => (
            <article key={t.id} className="rounded-xl border border-line bg-card p-5">
              <div className="flex flex-wrap items-center gap-2">
                <LifeBuoy className="h-4 w-4 text-accent" />
                <span className="font-semibold">{t.subject}</span>
                <Badge tone="muted">{t.category}</Badge>
                <Badge tone={t.status === "answered" ? "success" : "warning"}>{t.status}</Badge>
                <span className="ml-auto text-xs text-muted">{formatDate(t.createdAt)}</span>
              </div>
              <p className="mt-2 text-sm text-muted">{t.message}</p>
              {t.orderId && <p className="mt-1 text-xs text-muted">Order: {t.orderId}</p>}

              {t.reply ? (
                <div className="mt-3 rounded-lg border border-accent/30 bg-accent-soft p-3 text-sm">
                  <p className="mb-1 text-xs font-semibold uppercase text-accent">Reply sent</p>
                  {t.reply}
                </div>
              ) : (
                <div className="mt-3 flex gap-2">
                  <input
                    value={drafts[t.id] ?? ""}
                    onChange={(e) => setDrafts({ ...drafts, [t.id]: e.target.value })}
                    placeholder="Write a reply…"
                    className="h-10 flex-1 rounded-lg border border-line bg-surface px-3 text-sm outline-none focus:border-accent/60"
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      const text = sanitizeText(drafts[t.id] ?? "");
                      if (!text) return;
                      respondTicket(t.id, text);
                      setDrafts({ ...drafts, [t.id]: "" });
                    }}
                  >
                    <Send className="h-3.5 w-3.5" /> Reply
                  </Button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
