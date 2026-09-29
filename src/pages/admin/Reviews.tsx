import { useState } from "react";
import { Check, X, Star } from "lucide-react";
import { reviews as seed } from "@/data/reviews";
import { formatDate } from "@/lib/utils";
import { useStore } from "@/context/StoreContext";
import { usePageSeo } from "@/hooks/usePageSeo";
import { Rating } from "@/components/ui/Rating";
import { Badge } from "@/components/ui/Badge";

type Status = "pending" | "approved" | "rejected";

export default function AdminReviews() {
  usePageSeo({ title: "Reviews — Nexora Admin", canonicalPath: "/admin/reviews" });
  const { toast } = useStore();
  const [status, setStatus] = useState<Record<string, Status>>(
    () => Object.fromEntries(seed.map((r) => [r.id, r.status]))
  );
  const [filter, setFilter] = useState<Status | "all">("all");

  const rows = seed.filter((r) => filter === "all" || status[r.id] === filter);

  function set(id: string, next: Status) {
    setStatus((s) => ({ ...s, [id]: next }));
    toast(`Review ${next}`, next === "rejected" ? "info" : "success");
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold">Reviews</h1>
          <p className="text-sm text-muted">Moderation queue — only verified purchases appear.</p>
        </div>
        <div className="flex gap-2">
          {(["all", "pending", "approved", "rejected"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition ${
                filter === f ? "bg-accent text-black" : "bg-card text-muted hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {rows.length === 0 && (
          <p className="rounded-xl border border-dashed border-line bg-card p-6 text-sm text-muted">
            No {filter} reviews right now.
          </p>
        )}
        {rows.map((r) => {
          const st = status[r.id];
          return (
            <article key={r.id} className="rounded-xl border border-line bg-card p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">{r.user}</span>
                <Rating value={r.rating} />
                {r.verified && <Badge tone="success">Verified purchase</Badge>}
                <Badge tone={st === "approved" ? "success" : st === "pending" ? "warning" : "danger"}>
                  {st}
                </Badge>
                <span className="ml-auto text-xs text-muted">{formatDate(r.date)}</span>
              </div>
              <p className="mt-1 text-sm font-medium text-white">
                {r.title} <span className="font-normal text-muted">— {r.productTitle}</span>
              </p>
              <p className="mt-1 text-sm text-muted">{r.comment}</p>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => set(r.id, "approved")}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-success/40 bg-success/10 px-3 py-1.5 text-xs font-semibold text-success hover:bg-success/20"
                >
                  <Check className="h-3.5 w-3.5" /> Approve
                </button>
                <button
                  onClick={() => set(r.id, "rejected")}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-danger/40 bg-danger/10 px-3 py-1.5 text-xs font-semibold text-danger hover:bg-danger/20"
                >
                  <X className="h-3.5 w-3.5" /> Reject
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <p className="flex items-center gap-2 text-xs text-muted">
        <Star className="h-3.5 w-3.5 text-accent" /> Approvals write to{" "}
        <code className="text-accent">reviews.status</code> in Firestore; the storefront only
        queries approved documents.
      </p>
    </div>
  );
}
