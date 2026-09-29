import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { artCover, artShot, artWide } from "@/lib/artwork";
import { getGameImageUrl, LOCAL_COVERS } from "@/lib/gameImages";

type Variant = "cover" | "wide" | "shot";

const GEN: Record<Variant, (seed: string) => string> = {
  cover: artCover,
  wide: artWide,
  shot: (s) => artShot(s),
};

function resolveArtworkUrl(seed: string, variant: Variant = "cover"): string {
  if (!seed) return GEN[variant]("default");

  // 1. Direct match in local covers
  if (LOCAL_COVERS[seed]) return LOCAL_COVERS[seed];

  // 2. Cleaned platform suffixes (e.g. 'god-of-war-ragnarok-pc' -> 'god-of-war-ragnarok')
  const cleaned = seed.toLowerCase().replace(/-(pc|ps5|xbox)$/, "");
  if (LOCAL_COVERS[cleaned]) return LOCAL_COVERS[cleaned];

  // 3. Direct URL or root-relative path
  if (seed.startsWith("http://") || seed.startsWith("https://") || seed.startsWith("/")) {
    return seed;
  }

  // 4. Registry lookup or procedural SVG generator
  return getGameImageUrl(seed, variant) || GEN[variant](seed);
}

/**
 * Renders high-resolution gaming artwork for a seed with robust procedural fallback.
 * Fixes cached-image race conditions so images NEVER stay invisible/blank.
 */
export function Artwork({
  seed,
  variant = "cover",
  alt,
  className,
  imgClassName,
  eager = false,
}: {
  seed: string;
  variant?: Variant;
  alt: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
}) {
  const initialUrl = resolveArtworkUrl(seed, variant);
  const proceduralFallback = GEN[variant](seed);

  const [currentSrc, setCurrentSrc] = useState(initialUrl);
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const nextUrl = resolveArtworkUrl(seed, variant);
    setCurrentSrc(nextUrl);

    // If image is already complete in browser cache, immediately show it
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    } else {
      setLoaded(false);
    }

    // Fallback timer: prevents permanent opacity-0 if browser dropped the onLoad event
    const timer = setTimeout(() => {
      if (imgRef.current && (imgRef.current.complete || imgRef.current.naturalWidth > 0)) {
        setLoaded(true);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [seed, variant]);

  return (
    <div className={cn("relative overflow-hidden bg-surface", className)}>
      <img
        ref={(el) => {
          imgRef.current = el;
          if (el && el.complete && el.naturalWidth > 0 && !loaded) {
            setLoaded(true);
          }
        }}
        src={currentSrc}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        {...(eager ? { fetchPriority: "high" } : {})}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => {
          // If photographic image failed to load, gracefully fall back to procedural SVG
          if (currentSrc !== proceduralFallback) {
            setCurrentSrc(proceduralFallback);
            setLoaded(true);
          }
        }}
        className={cn(
          "h-full w-full object-cover transition-opacity duration-200",
          imgClassName,
          loaded ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
}
