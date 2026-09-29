import { useEffect, useState, useRef, type MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Play, ShoppingBag, Star, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import type { Product } from "@/types";
import { formatINR, discountPercent, cn } from "@/lib/utils";
import { useStore } from "@/context/StoreContext";
import { Artwork } from "@/components/Artwork";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LOCAL_COVERS } from "@/lib/gameImages";
import { getGameTitleStyle } from "@/lib/gameTypography";

const INTERVAL = 7000;

function getHeroImage(p: Product): string {
  if (LOCAL_COVERS[p.imageSeed]) return LOCAL_COVERS[p.imageSeed];
  if (LOCAL_COVERS[p.slug]) return LOCAL_COVERS[p.slug];
  if (p.trailer?.poster) return p.trailer.poster;
  if (p.screenshotItems && p.screenshotItems.length > 0) return p.screenshotItems[0].full;
  if (p.screenshots && p.screenshots.length > 0 && p.screenshots[0].startsWith("http")) return p.screenshots[0];
  return p.imageSeed;
}

/** Fullscreen cinematic hero carousel with interactive parallax and motion effects. */
export function HeroCarousel({ slides }: { slides: Product[] }) {
  const [index, setIndex] = useState(0);
  const { addToCart, setCartOpen, toast } = useStore();
  const navigate = useNavigate();
  const active = slides[index];

  // Mouse Parallax coordinates for 3D depth on desktop
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 120 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  const artX = useTransform(smoothX, [-0.5, 0.5], [14, -14]);
  const artY = useTransform(smoothY, [-0.5, 0.5], [10, -10]);

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Preload all hero slide images
  useEffect(() => {
    slides.forEach((s) => {
      const url = getHeroImage(s);
      if (url && typeof Image !== "undefined") {
        const img = new Image();
        img.src = url;
      }
    });
  }, [slides]);

  // Autoplay timer
  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), INTERVAL);
    return () => clearInterval(t);
  }, [slides.length, index]);

  const off = discountPercent(active.price, active.salePrice);
  const heroImage = getHeroImage(active);
  const titleStyle = getGameTitleStyle(active);

  const scrollToContent = () => {
    const nextSection = document.getElementById("trust-strip") || document.getElementById("trending");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative -mt-16 h-screen min-h-[620px] w-full overflow-hidden bg-bg md:-mt-[72px]"
      aria-label="Featured games"
    >
      {/* Background Artwork - Subtle Ken Burns scale & mouse parallax */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ x: artX, y: artY }}
          className="absolute inset-[-14px]"
        >
          <Artwork
            seed={heroImage}
            variant="wide"
            alt={active.title}
            eager
            className="h-full w-full"
            imgClassName="object-cover object-center md:object-right"
          />
        </motion.div>
      </AnimatePresence>

      {/* Cinematic Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-bg/95 via-bg/80 to-transparent md:via-bg/50" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/50 via-black/20 to-transparent" />

      {/* Hero Content with Staggered Entrance Animations */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1920px] flex-col justify-center px-6 pt-16 sm:px-10 md:px-16 md:pt-[72px] lg:px-20 xl:px-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } },
              exit: { opacity: 0, y: -15, transition: { duration: 0.25 } },
            }}
            className="max-w-2xl lg:max-w-3xl"
          >
            {/* Badges */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
              className="mb-4 flex flex-wrap items-center gap-2"
            >
              <Badge tone="accent">{active.platform}</Badge>
              <Badge tone="dark">{active.genre}</Badge>
              {off > 0 && <Badge tone="dark">Save {off}%</Badge>}
            </motion.div>

            {/* Official Brand Game Title */}
            <motion.h1
              key={`title-${active.id}`}
              variants={{
                hidden: { opacity: 0, y: 22 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
              }}
              style={{ fontFamily: titleStyle.fontFamily, ...titleStyle.style }}
              className={cn("leading-[1.08] transition-all duration-300", titleStyle.className)}
            >
              {active.title}
            </motion.h1>

            {/* Metadata */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
              className="mt-3 flex items-center gap-3 text-sm text-muted"
            >
              <span className="flex items-center gap-1.5 font-medium text-white">
                <Star className="h-4 w-4 fill-warning text-warning" />
                {active.rating.toFixed(1)}
                <span className="text-muted/60">
                  ({active.reviewCount.toLocaleString("en-IN")})
                </span>
              </span>
              <span>•</span>
              <span>{active.developer}</span>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
              className="mt-4 line-clamp-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base"
            >
              {active.tagline} {active.description.slice(0, 140)}…
            </motion.p>

            {/* Price Tag */}
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: { type: "spring", stiffness: 350, damping: 20 },
                },
              }}
              className="mt-6 flex flex-wrap items-baseline gap-3"
            >
              <span className="font-display text-3xl font-bold text-accent sm:text-4xl md:text-5xl">
                {formatINR(active.salePrice)}
              </span>
              {off > 0 && (
                <span className="text-lg text-muted line-through md:text-xl">
                  {formatINR(active.price)}
                </span>
              )}
              {off > 0 && (
                <span className="rounded-md bg-accent px-2 py-0.5 text-sm font-bold text-black md:text-base">
                  -{off}%
                </span>
              )}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
              className="mt-7 flex flex-wrap items-center gap-3"
            >
              <Button
                size="lg"
                className="h-12 rounded-2xl px-7 text-base shadow-accent transition-transform hover:scale-105 active:scale-95"
                onClick={() => {
                  addToCart(active.id);
                  toast("Added to cart", "success");
                  setCartOpen(true);
                }}
              >
                <ShoppingBag className="h-5 w-5" /> Buy Now
              </Button>
              <Link to={`/game/${active.slug}`}>
                <Button size="lg" variant="outline" className="h-12 rounded-2xl px-6 text-base hover:scale-105 active:scale-95">
                  <Play className="h-5 w-5" /> View Game
                </Button>
              </Link>
              <Button
                size="lg"
                variant="ghost"
                onClick={() => navigate("/deals")}
                className="hidden rounded-2xl text-white sm:inline-flex hover:text-accent"
              >
                All Deals
              </Button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Hover Arrow Controls */}
      <button
        onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
        aria-label="Previous slide"
        className="focus-ring absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 place-items-center rounded-full border border-line bg-bg/80 p-3 text-white shadow-lift backdrop-blur-md transition-all hover:scale-110 hover:border-accent hover:bg-bg hover:text-accent group-hover:opacity-100 opacity-0 md:grid md:left-8"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={() => setIndex((i) => (i + 1) % slides.length)}
        aria-label="Next slide"
        className="focus-ring absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 place-items-center rounded-full border border-line bg-bg/80 p-3 text-white shadow-lift backdrop-blur-md transition-all hover:scale-110 hover:border-accent hover:bg-bg hover:text-accent group-hover:opacity-100 opacity-0 md:grid md:right-8"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Floating Scroll Indicator */}
      <motion.button
        onClick={scrollToContent}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{
          opacity: { delay: 0.8, duration: 0.5 },
          y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
        }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden flex-col items-center gap-1 text-xs text-muted/70 transition-colors hover:text-accent md:flex"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em]">Scroll Down</span>
        <ChevronDown className="h-4 w-4" />
      </motion.button>

      {/* Slide Navigation Dots with Active Progress Fill */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2 md:bottom-8 md:right-16">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={cn(
              "relative h-2 overflow-hidden rounded-full transition-all duration-300",
              i === index ? "w-10 bg-white/20" : "w-3 bg-white/25 hover:bg-white/50"
            )}
          >
            {i === index && (
              <motion.div
                key={`progress-${index}`}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: INTERVAL / 1000, ease: "linear" }}
                className="absolute inset-0 rounded-full bg-accent"
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
