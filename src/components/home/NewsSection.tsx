import { Link } from "react-router-dom";
import { ArrowRight, Newspaper } from "lucide-react";
import { articles } from "@/data/articles";
import { formatDate } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";
import { Artwork } from "@/components/Artwork";
import { Badge } from "@/components/ui/Badge";

/** Gaming news / editorial cards. */
export function NewsSection() {
  const [lead, ...rest] = articles;
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-12 md:px-6">
      <SectionHeading title="News & Guides" subtitle="Industry stories, interviews and buying advice." />

      <div className="grid gap-4 md:grid-cols-3">
        <Link
          to={`/news/${lead.slug}`}
          className="group relative col-span-1 overflow-hidden rounded-2xl border border-line bg-card md:col-span-2 md:min-h-[320px]"
        >
          <div className="absolute inset-0">
            <Artwork
              seed={lead.imageSeed}
              variant="wide"
              alt={lead.title}
              className="transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="relative flex h-full flex-col justify-end p-6">
            <div className="mb-2 flex items-center gap-2">
              <Badge tone="accent">{lead.category}</Badge>
              <span className="text-xs text-white/70">{formatDate(lead.date)}</span>
            </div>
            <h3 className="font-display text-xl font-bold text-white md:text-2xl">
              {lead.title}
            </h3>
            <p className="mt-2 line-clamp-2 max-w-2xl text-sm text-white/70">{lead.excerpt}</p>
          </div>
        </Link>

        <div className="grid gap-4">
          {rest.slice(0, 3).map((a) => (
            <Link
              key={a.id}
              to={`/news/${a.slug}`}
              className="group flex gap-4 rounded-xl border border-line bg-card p-3 transition-colors hover:border-accent/40"
            >
              <div className="h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-surface">
                <Artwork seed={a.imageSeed} alt={a.title} />
              </div>
              <div className="min-w-0">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-accent">
                    {a.category}
                  </span>
                  <span className="text-[10px] text-muted">{formatDate(a.date)}</span>
                </div>
                <p className="line-clamp-2 text-sm font-semibold text-white group-hover:text-accent">
                  {a.title}
                </p>
              </div>
            </Link>
          ))}
          <Link
            to="/news"
            className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-line py-3 text-sm font-medium text-muted transition-colors hover:border-accent/50 hover:text-accent"
          >
            <Newspaper className="h-4 w-4" /> All articles <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
