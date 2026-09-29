import { useMemo, useState } from "react";
import { BadgeCheck, PenLine } from "lucide-react";
import type { Product, Review } from "@/types";
import { formatDate, sanitizeText } from "@/lib/utils";
import { reviews as allReviews } from "@/data/reviews";
import { useOrders } from "@/context/OrdersContext";
import { useAuth } from "@/context/AuthContext";
import { Rating } from "@/components/ui/Rating";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

/** Product reviews + verified-purchaser review form. */
export function ReviewsBlock({ product }: { product: Product }) {
  const { orders } = useOrders();
  const { user } = useAuth();
  const [pending, setPending] = useState<Review | null>(null);
  const [form, setForm] = useState({ rating: 5, title: "", comment: "" });
  const [error, setError] = useState<string | null>(null);

  const purchased = useMemo(
    () =>
      orders.some(
        (o) => o.status === "fulfilled" && o.items.some((i) => i.productId === product.id)
      ),
    [orders, product.id]
  );

  const list = [
    ...allReviews.filter((r) => r.productId === product.id && r.status === "approved"),
    ...(pending ? [pending] : []),
  ];
  const avg = list.length ? list.reduce((s, r) => s + r.rating, 0) / list.length : product.rating;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return setError("Sign in to submit a review.");
    if (!purchased) return setError("Only verified purchasers can review this product.");
    if (form.comment.trim().length < 10)
      return setError("Please write at least 10 characters.");
    setError(null);
    setPending({
      id: `local_${Date.now()}`,
      productId: product.id,
      productTitle: product.title,
      user: user.displayName,
      rating: form.rating,
      title: sanitizeText(form.title) || "Review",
      comment: sanitizeText(form.comment),
      date: new Date().toISOString().slice(0, 10),
      verified: true,
      status: "pending",
    });
    setForm({ rating: 5, title: "", comment: "" });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-line bg-card p-4">
        <p className="font-display text-4xl font-bold text-accent">{avg.toFixed(1)}</p>
        <div>
          <Rating value={avg} size="md" />
          <p className="mt-1 text-sm text-muted">
            {(product.reviewCount + (pending ? 1 : 0)).toLocaleString("en-IN")} ratings
          </p>
        </div>
        <span className="ml-auto text-xs font-medium text-success">✓ Verified reviews only</span>
      </div>

      {list.length === 0 ? (
        <EmptyState title="No reviews yet" description="Be the first after purchasing." />
      ) : (
        <ul className="space-y-3">
          {list.map((r) => (
            <li key={r.id} className="rounded-xl border border-line bg-card p-4">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="font-semibold text-white">{r.user}</span>
                <Rating value={r.rating} />
                {r.verified && (
                  <span className="inline-flex items-center gap-1 rounded bg-success/12 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-success">
                    <BadgeCheck className="h-3 w-3" /> Verified
                  </span>
                )}
                {r.status === "pending" && (
                  <span className="rounded bg-warning/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-warning">
                    Awaiting moderation
                  </span>
                )}
                <span className="ml-auto text-xs text-muted">{formatDate(r.date)}</span>
              </div>
              <p className="text-sm font-medium text-white">{r.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{r.comment}</p>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={submit} className="rounded-xl border border-line bg-card p-5">
        <h4 className="mb-4 flex items-center gap-2 font-display text-base font-bold">
          <PenLine className="h-4 w-4 text-accent" /> Write a review
        </h4>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted">Your rating:</span>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setForm((f) => ({ ...f, rating: n }))}
              className={`h-8 w-8 rounded-lg border text-sm font-semibold transition ${
                form.rating === n
                  ? "border-accent bg-accent text-black"
                  : "border-line bg-surface text-muted hover:border-accent/50"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <input
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder="Review title"
          className="mb-3 h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm text-white outline-none focus:border-accent/60"
        />
        <textarea
          value={form.comment}
          onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
          rows={3}
          placeholder="What did you like or dislike?"
          className="mb-3 w-full rounded-lg border border-line bg-surface p-3 text-sm text-white outline-none focus:border-accent/60"
        />
        {error && <p className="mb-2 text-sm text-danger">{error}</p>}
        <Button type="submit">Submit review</Button>
        {!purchased && (
          <p className="mt-2 text-xs text-muted">
            {user ? "Only verified purchasers can submit reviews." : "Sign in first."}
          </p>
        )}
      </form>
    </div>
  );
}
