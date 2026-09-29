import { useState } from "react";
import { LifeBuoy, Send } from "lucide-react";
import { useOrders } from "@/context/OrdersContext";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";
import { formatDate, sanitizeText } from "@/lib/utils";
import type { SupportTicket } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const CATEGORIES: SupportTicket["category"][] = [
  "Payment",
  "Order",
  "Activation Key",
  "Refund",
  "Technical",
  "Other",
];

export default function AccountSupportPage() {
  const { tickets, createTicket } = useOrders();
  const { user } = useAuth();
  const { toast } = useStore();
  const { orders } = useOrders();

  const [form, setForm] = useState({
    subject: "",
    orderId: "",
    category: "Order" as SupportTicket["category"],
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.subject.trim().length < 4 || form.message.trim().length < 10) {
      setError("Please add a subject (4+ chars) and a message (10+ chars).");
      return;
    }
    setError(null);
    setSending(true);
    try {
      await createTicket({
        subject: sanitizeText(form.subject),
        orderId: sanitizeText(form.orderId),
        category: form.category,
        message: sanitizeText(form.message),
      });
      toast("Ticket created — we'll reply here", "success");
      setForm({ subject: "", orderId: "", category: "Order", message: "" });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-xl border border-line bg-card p-5">
        <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
          <LifeBuoy className="h-5 w-5 text-accent" /> Create a ticket
        </h2>
        <form onSubmit={submit} className="space-y-3">
          <input
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            placeholder="Subject"
            className="h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm outline-none focus:border-accent/60"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as SupportTicket["category"] })}
              className="h-11 rounded-lg border border-line bg-surface px-3 text-sm outline-none focus:border-accent/60"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input
              value={form.orderId}
              onChange={(e) => setForm({ ...form, orderId: e.target.value })}
              placeholder="Order ID (optional)"
              list="order-ids"
              className="h-11 rounded-lg border border-line bg-surface px-3 text-sm outline-none focus:border-accent/60"
            />
            <datalist id="order-ids">
              {orders.map((o) => (
                <option key={o.id} value={o.id} />
              ))}
            </datalist>
          </div>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={4}
            placeholder="Describe the issue…"
            className="w-full rounded-lg border border-line bg-surface p-3 text-sm outline-none focus:border-accent/60"
          />
          <p className="text-[11px] text-muted">Attachments: configure Firebase Storage rules in production.</p>
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button type="submit" loading={sending}>
            <Send className="h-4 w-4" /> Submit ticket
          </Button>
        </form>
      </section>

      <section>
        <h2 className="mb-4 font-display text-lg font-bold">Your tickets</h2>
        {!user || tickets.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line bg-card p-6 text-sm text-muted">
            No tickets yet — {user ? "create one if you need help." : "sign in first."}
          </p>
        ) : (
          <ul className="space-y-3">
            {tickets.map((t) => (
              <li key={t.id} className="rounded-xl border border-line bg-card p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{t.subject}</span>
                  <Badge tone={t.status === "answered" ? "success" : "warning"}>{t.status}</Badge>
                  <span className="ml-auto text-xs text-muted">{formatDate(t.createdAt)}</span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  {t.category} {t.orderId && `• Order #${t.orderId}`}
                </p>
                <p className="mt-2 text-sm text-muted">{t.message}</p>
                {t.reply && (
                  <div className="mt-3 rounded-lg border border-accent/30 bg-accent-soft p-3 text-sm">
                    <p className="mb-1 text-xs font-semibold uppercase text-accent">Support replied</p>
                    {t.reply}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
