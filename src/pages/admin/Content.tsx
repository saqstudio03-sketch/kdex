import { useState } from "react";
import { Newspaper, LayoutGrid } from "lucide-react";
import { articles } from "@/data/articles";
import { formatDate } from "@/lib/utils";
import { usePageSeo } from "@/hooks/usePageSeo";
import { Artwork } from "@/components/Artwork";
import { Badge } from "@/components/ui/Badge";

const SECTIONS = [
  { id: "hero", label: "Hero carousel", enabled: true },
  { id: "trending", label: "Trending Games", enabled: true },
  { id: "deals", label: "Daily Deals", enabled: true },
  { id: "preorders", label: "Pre-orders", enabled: true },
  { id: "calendar", label: "Release Calendar", enabled: true },
  { id: "bestsellers", label: "Bestsellers", enabled: true },
  { id: "platforms", label: "Browse by Platform", enabled: true },
  { id: "genres", label: "Browse by Genre", enabled: true },
  { id: "reviews", label: "Game Reviews", enabled: true },
  { id: "news", label: "News / Articles", enabled: true },
];

/** Homepage section manager + news article list. */
export default function AdminContent() {
  usePageSeo({ title: "Homepage & News — KDex Admin", canonicalPath: "/admin/content" });
  const [sections, setSections] = useState(SECTIONS);

  return (
    <div className="space-y-6">
      <section>
        <h1 className="font-display text-xl font-bold">Homepage sections</h1>
        <p className="text-sm text-muted">
          Toggle which sections render on the storefront homepage (maps to{" "}
          <code className="text-accent">homepageSections</code>).
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((s) => (
            <label
              key={s.id}
              className="flex cursor-pointer items-center justify-between rounded-xl border border-line bg-card p-4"
            >
              <span className="flex items-center gap-2 text-sm font-medium">
                <LayoutGrid className="h-4 w-4 text-accent" /> {s.label}
              </span>
              <input
                type="checkbox"
                checked={s.enabled}
                onChange={(e) =>
                  setSections((list) =>
                    list.map((x) => (x.id === s.id ? { ...x, enabled: e.target.checked } : x))
                  )
                }
                className="h-5 w-5 accent-accent"
              />
            </label>
          ))}
        </div>
      </section>

      <section>
        <h2 className="flex items-center gap-2 font-display text-lg font-bold">
          <Newspaper className="h-5 w-5 text-accent" /> News articles
        </h2>
        <div className="mt-3 space-y-3">
          {articles.map((a) => (
            <article key={a.id} className="flex items-center gap-4 rounded-xl border border-line bg-card p-3">
              <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-surface">
                <Artwork seed={a.imageSeed} alt={a.title} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <Badge tone="accent">{a.category}</Badge>
                  <span className="text-xs text-muted">{formatDate(a.date)}</span>
                </div>
                <p className="line-clamp-1 text-sm font-semibold">{a.title}</p>
                <p className="line-clamp-1 text-xs text-muted">{a.excerpt}</p>
              </div>
              <span className="hidden font-mono text-xs text-muted sm:block">/{a.slug}</span>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
