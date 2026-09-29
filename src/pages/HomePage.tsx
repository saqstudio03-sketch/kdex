import { Zap, ShieldCheck, KeyRound, Headphones } from "lucide-react";
import { products, byId, trendingProducts, featuredProducts } from "@/data/products";
import { usePageSeo } from "@/hooks/usePageSeo";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { SectionHeading } from "@/components/home/SectionHeading";
import { ProductRail } from "@/components/product/ProductRail";
import { ProductCard } from "@/components/product/ProductCard";
import { DealsSection } from "@/components/home/DealsSection";
import { PreorderSection } from "@/components/home/PreorderSection";
import { ReleaseCalendar } from "@/components/home/ReleaseCalendar";
import { Bestsellers } from "@/components/home/Bestsellers";
import { BrowsePlatforms, BrowseGenres } from "@/components/home/BrowseSections";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";

const TRUST = [
  { Icon: Zap, title: "Instant delivery", desc: "Keys in seconds after payment" },
  { Icon: ShieldCheck, title: "Secure checkout", desc: "Verified server-side payments" },
  { Icon: KeyRound, title: "Official keys", desc: "Legitimate sourced activations" },
  { Icon: Headphones, title: "24/7 support", desc: "Real humans, fast replies" },
];

export default function HomePage() {
  usePageSeo({
    title: "KDex Games — Premium Digital Game Store",
    description:
      "Discover PC, PlayStation, Xbox and Nintendo games. Daily deals, pre-orders and instant digital key delivery.",
    canonicalPath: "/",
  });

  const heroSlides = featuredProducts.length ? featuredProducts.slice(0, 6) : products.slice(0, 4);
  const trending = trendingProducts.slice(0, 8);

  return (
    <>
      <HeroCarousel slides={heroSlides.length ? heroSlides : [byId("g01")!]} />

      {/* Trust strip with staggered item reveal */}
      <section id="trust-strip" className="border-y border-line bg-surface/90 backdrop-blur-sm" aria-label="Why shop at KDex">
        <StaggerContainer
          staggerDelay={0.08}
          className="mx-auto grid w-full max-w-[1920px] grid-cols-2 gap-3.5 px-4 py-6 sm:gap-5 sm:px-6 md:grid-cols-4 md:px-8 lg:px-12 xl:px-16"
        >
          {TRUST.map(({ Icon, title, desc }) => (
            <StaggerItem
              key={title}
              className="group flex items-center gap-3.5 rounded-xl border border-white/5 bg-white/[0.02] p-3.5 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06] hover:shadow-card"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-white shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:border-white/30 group-hover:bg-white/10">
                <Icon className="h-5 w-5 text-white" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold tracking-tight text-white">{title}</p>
                <p className="truncate text-xs font-normal text-white/80">{desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Trending Games with ScrollReveal */}
      <ScrollReveal duration={0.6} y={32}>
        <section id="trending" className="mx-auto w-full max-w-[1920px] px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <SectionHeading
            title="Trending Games"
            subtitle="What the store floor is buzzing about right now."
            to="/games?sort=bestsellers"
          />
          <ProductRail>
            {trending.map((p, i) => (
              <ProductCard key={p.id} product={p} eager={i < 4} />
            ))}
          </ProductRail>
        </section>
      </ScrollReveal>

      {/* Deals Section */}
      <ScrollReveal duration={0.6} y={32}>
        <DealsSection />
      </ScrollReveal>

      {/* Pre-order Section */}
      <ScrollReveal duration={0.6} y={32}>
        <PreorderSection />
      </ScrollReveal>

      {/* Release Calendar */}
      <ScrollReveal duration={0.6} y={32}>
        <ReleaseCalendar />
      </ScrollReveal>

      {/* Bestsellers Grid */}
      <ScrollReveal duration={0.6} y={32}>
        <Bestsellers />
      </ScrollReveal>

      {/* Platforms */}
      <ScrollReveal duration={0.6} y={32}>
        <BrowsePlatforms />
      </ScrollReveal>

      {/* Genres */}
      <ScrollReveal duration={0.6} y={32}>
        <BrowseGenres />
      </ScrollReveal>

      {/* Customer Reviews */}
      <ScrollReveal duration={0.6} y={32}>
        <ReviewsSection />
      </ScrollReveal>
    </>
  );
}
