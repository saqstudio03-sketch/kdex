import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { reviews } from "@/data/reviews";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrdersContext";
import { formatDate } from "@/lib/utils";
import { Rating } from "@/components/ui/Rating";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export default function ReviewsPage() {
  const { user } = useAuth();
  const { orders } = useOrders();

  const mine = reviews.filter(
    (r) => user && r.user === user.displayName
  );
  const purchasedTitles = new Set(orders.flatMap((o) => o.items.map((i) => i.productId)));
  const reviewable = [...purchasedTitles].filter(
    (id) => !mine.some((r) => r.productId === id)
  );

  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-4 font-display text-lg font-bold">My reviews</h2>
        {mine.length === 0 ? (
          <EmptyState
            title="You haven't reviewed anything yet"
            description="Reviews can only be written for games you've purchased — they're marked as verified."
          />
        ) : (
          <ul className="space-y-3">
            {mine.map((r) => (
              <li key={r.id} className="rounded-xl border border-line bg-card p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Link to={`/game/${r.productId}`} className="font-semibold hover:text-accent">
                    {r.productTitle}
                  </Link>
                  <Rating value={r.rating} />
                  <Badge tone={r.status === "approved" ? "success" : "warning"}>{r.status}</Badge>
                  <span className="ml-auto text-xs text-muted">{formatDate(r.date)}</span>
                </div>
                <p className="mt-2 text-sm text-muted">{r.comment}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-bold">Games you can review</h2>
        {reviewable.length === 0 ? (
          <p className="text-sm text-muted">
            {orders.length
              ? "You've reviewed every game you own — nice."
              : "Buy a game to unlock its review form."}
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {reviewable.map((id) => (
              <Link key={id} to={`/game/${id}`} className="text-sm">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-card px-3 py-2 text-accent hover:border-accent/50">
                  <Star className="h-3.5 w-3.5" /> Write a review
                </span>
              </Link>
            ))}
          </div>
        )}
        <div className="mt-4">
          <Link to="/account/orders">
            <Button variant="outline" size="sm">View my orders</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
