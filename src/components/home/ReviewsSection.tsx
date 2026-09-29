import { Link } from "react-router-dom";
import { BadgeCheck } from "lucide-react";
import { approvedReviews } from "@/data/reviews";
import { byId } from "@/data/products";
import { formatDate } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";
import { Rating } from "@/components/ui/Rating";

function initials(name: string) {
  return name.replace(/[._]/g, " ").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

/** Recent verified customer reviews. */
export function ReviewsSection() {
  const list = approvedReviews.slice(0, 6);
  return (
    <section className="mx-auto w-full max-w-[1920px] px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <SectionHeading
        title="What Players Say"
        subtitle="Reviews from verified purchases only."
        to="/games"
        linkLabel="Browse games"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((r) => {
          const p = byId(r.productId);
          return (
            <article
              key={r.id}
              className="flex flex-col gap-3 rounded-xl border border-line bg-card p-5 transition-colors hover:border-accent/40"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent/15 font-display text-sm font-bold text-accent">
                  {initials(r.user)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{r.user}</p>
                  <Rating value={r.rating} />
                </div>
                {r.verified && (
                  <span className="ml-auto inline-flex items-center gap-1 rounded-md bg-success/12 px-2 py-1 text-[10px] font-semibold uppercase text-success">
                    <BadgeCheck className="h-3.5 w-3.5" /> Verified
                  </span>
                )}
              </div>

              <p className="line-clamp-3 text-sm leading-relaxed text-muted">“{r.comment}”</p>

              <div className="mt-auto flex items-center justify-between border-t border-line pt-3 text-xs">
                {p ? (
                  <Link to={`/game/${p.slug}`} className="font-medium text-white hover:text-accent">
                    {r.productTitle}
                  </Link>
                ) : (
                  <span className="font-medium text-white">{r.productTitle}</span>
                )}
                <span className="text-muted">{formatDate(r.date)}</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
