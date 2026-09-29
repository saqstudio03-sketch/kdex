import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { bySlug, products } from "@/data/products";
import { discountPercent } from "@/lib/utils";
import { usePageSeo } from "@/hooks/usePageSeo";
import { productJsonLd } from "@/lib/structured";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeading } from "@/components/home/SectionHeading";
import { PurchasePanel } from "@/components/detail/PurchasePanel";
import { DetailHero } from "@/components/detail/DetailHero";
import { Gallery } from "@/components/detail/Gallery";
import { SpecsTable } from "@/components/detail/SpecsTable";
import { FaqAccordion } from "@/components/detail/FaqAccordion";
import { TrailerPlaceholder } from "@/components/detail/TrailerPlaceholder";
import { ReviewsBlock } from "@/components/detail/ReviewsBlock";

const TABS = [
  "Overview",
  "Features",
  "Screenshots",
  "Trailer",
  "System Requirements",
  "Reviews",
  "FAQ",
] as const;

type Tab = (typeof TABS)[number];

export default function GameDetailPage() {
  const { slug } = useParams();
  const product = slug ? bySlug(slug) : undefined;
  const [tab, setTab] = useState<Tab>("Overview");

  usePageSeo({
    title: product ? `${product.title} — KDex Games` : "Product unavailable",
    description: product?.description.slice(0, 155),
    canonicalPath: `/game/${slug}`,
    ogType: "product",
    jsonLd: product ? productJsonLd(product) : undefined,
  });

  const related = useMemo(
    () =>
      product
        ? products
            .filter((p) => p.id !== product.id && p.genres.some((g) => product.genres.includes(g)))
            .slice(0, 6)
        : [],
    [product]
  );

  if (!product)
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState
          title="Product unavailable"
          description="This product may have been removed or the link is incorrect."
          action={
            <Link
              to="/games"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black"
            >
              Browse all games
            </Link>
          }
        />
      </div>
    );

  return (
    <article>
      <DetailHero product={product} />

      <div className="mx-auto grid w-full max-w-[1920px] gap-8 px-4 py-8 sm:px-6 md:px-8 lg:grid-cols-[1fr_380px] lg:px-12 xl:px-16">
        <div className="min-w-0">
          <div className="no-scrollbar -mx-1 mb-6 flex gap-1 overflow-x-auto border-b border-line">
            {TABS.map((t) => {
              if (t === "System Requirements" && !product.systemRequirements) return null;
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "relative shrink-0 px-3.5 py-3 text-sm font-medium transition-colors",
                    tab === t ? "text-accent" : "text-muted hover:text-white"
                  )}
                >
                  {t}
                  {tab === t && (
                    <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-accent" />
                  )}
                </button>
              );
            })}
          </div>

          {tab === "Overview" && (
            <div className="space-y-4">
              <p className="text-lg font-medium text-white">{product.tagline}</p>
              <p className="leading-relaxed text-muted">{product.description}</p>
            </div>
          )}

          {tab === "Features" && (
            <ul className="grid gap-3 sm:grid-cols-2">
              {[...product.features, ...product.tags.slice(0, 4)].map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2.5 rounded-lg border border-line bg-card p-3 text-sm"
                >
                  <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                  <span className="capitalize text-white">{f}</span>
                </li>
              ))}
            </ul>
          )}

          {tab === "Screenshots" && (
            <Gallery
              items={product.screenshotItems}
              seeds={product.screenshots}
              title={product.title}
            />
          )}
          {tab === "Trailer" && (
            <TrailerPlaceholder
              title={product.title}
              seed={product.imageSeed}
              trailer={product.trailer}
            />
          )}
          {tab === "System Requirements" && product.systemRequirements && (
            <SpecsTable spec={product.systemRequirements} />
          )}
          {tab === "Reviews" && <ReviewsBlock product={product} />}
          {tab === "FAQ" && <FaqAccordion items={product.faq ?? []} />}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <PurchasePanel product={product} />
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mx-auto w-full max-w-[1920px] px-4 pb-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <SectionHeading title="You may also like" to="/games" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
