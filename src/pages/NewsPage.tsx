import { useParams, Link } from "react-router-dom";
import { CalendarDays, ArrowLeft } from "lucide-react";
import { articles } from "@/data/articles";
import { formatDate } from "@/lib/utils";
import { usePageSeo } from "@/hooks/usePageSeo";
import { Artwork } from "@/components/Artwork";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

/** News index + article detail (same route family). */
export default function NewsPage() {
  const { slug } = useParams();
  const article = slug ? articles.find((a) => a.slug === slug) : undefined;

  usePageSeo({
    title: article ? `${article.title} — KDex Games` : "News & Guides — KDex Games",
    description: article?.excerpt ?? "Gaming news, guides, interviews and industry stories.",
    canonicalPath: slug ? `/news/${slug}` : "/news",
  });

  if (article)
    return (
      <article className="mx-auto max-w-3xl px-4 py-10 md:px-6">
        <Link to="/news" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent">
          <ArrowLeft className="h-4 w-4" /> All articles
        </Link>
        <Badge tone="accent">{article.category}</Badge>
        <h1 className="mt-3 font-display text-3xl font-bold leading-tight md:text-4xl">
          {article.title}
        </h1>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
          <CalendarDays className="h-4 w-4" /> {formatDate(article.date)}
        </p>
        <div className="mt-6 aspect-video overflow-hidden rounded-2xl border border-line">
          <Artwork seed={article.imageSeed} variant="wide" alt={article.title} eager />
        </div>
        <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-white/85">
          <p className="text-lg text-white">{article.excerpt}</p>
          <p>
            This is placeholder editorial content for the KDex Games storefront. In
            production, articles are authored in the admin dashboard, stored in the{" "}
            <code className="rounded bg-card px-1.5 py-0.5 text-accent">articles</code>{" "}
            collection and rendered from Firestore with SEO-friendly slugs.
          </p>
          <p>
            Writers can attach cover artwork, category tags and publication dates; the
            homepage news section automatically pulls the five most recent pieces.
          </p>
        </div>
      </article>
    );

  const [lead, ...rest] = articles;
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 md:px-6">
      <h1 className="font-display text-3xl font-bold">News & Guides</h1>
      <p className="mt-1.5 text-sm text-muted">
        Industry stories, buying guides and studio interviews.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {[lead, ...rest].map((a) => (
          <Link
            key={a.id}
            to={`/news/${a.slug}`}
            className="group overflow-hidden rounded-2xl border border-line bg-card transition-all hover:-translate-y-1 hover:border-accent/50 hover:shadow-lift"
          >
            <div className="aspect-video overflow-hidden">
              <Artwork
                seed={a.imageSeed}
                variant="shot"
                alt={a.title}
                className="transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <div className="mb-2 flex items-center gap-2">
                <Badge tone="accent">{a.category}</Badge>
                <span className="text-xs text-muted">{formatDate(a.date)}</span>
              </div>
              <h2 className="font-display text-lg font-bold group-hover:text-accent">{a.title}</h2>
              <p className="mt-1.5 line-clamp-2 text-sm text-muted">{a.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
