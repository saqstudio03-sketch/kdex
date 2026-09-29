import { useEffect, useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ImageOff, Maximize2, ExternalLink } from "lucide-react";
import type { ScreenshotItem } from "@/types";
import { Artwork } from "@/components/Artwork";

interface GalleryProps {
  seeds?: string[];
  items?: ScreenshotItem[];
  title: string;
}

interface NormalizedScreenshot {
  id: number | string;
  thumbnail: string;
  full: string;
}

/**
 * Screenshot gallery with responsive grid, thumbnail previews,
 * and high-resolution lightbox with keyboard navigation.
 */
export function Gallery({ seeds = [], items = [], title }: GalleryProps) {
  const [open, setOpen] = useState<number | null>(null);

  // Normalize into standard array of { thumbnail, full }
  const screenshots: NormalizedScreenshot[] = useMemo(() => {
    if (items && items.length > 0) {
      return items.map((it) => ({
        id: it.id,
        thumbnail: it.thumbnail,
        full: it.full,
      }));
    }
    return seeds.map((s, i) => ({
      id: i,
      thumbnail: s,
      full: s,
    }));
  }, [items, seeds]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight")
        setOpen((i) => ((i ?? 0) + 1) % screenshots.length);
      if (e.key === "ArrowLeft")
        setOpen((i) => ((i ?? 0) - 1 + screenshots.length) % screenshots.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, screenshots.length]);

  if (!screenshots.length) {
    return (
      <div className="grid h-40 place-items-center rounded-xl border border-dashed border-line text-muted">
        <div className="flex items-center gap-2">
          <ImageOff className="h-5 w-5 text-muted/60" />
          <span className="text-sm">No screenshots available</span>
        </div>
      </div>
    );
  }

  const current = open !== null ? screenshots[open] : null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {screenshots.map((s, i) => (
          <button
            key={s.id + "-" + i}
            onClick={() => setOpen(i)}
            className="group relative aspect-video w-full overflow-hidden rounded-lg border border-line bg-surface transition-all duration-300 hover:border-accent/60 hover:shadow-lg hover:shadow-accent/5 focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label={`Open screenshot ${i + 1}`}
          >
            {s.thumbnail.startsWith("http") ? (
              <img
                src={s.thumbnail}
                alt={`${title} screenshot ${i + 1}`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <Artwork
                seed={s.thumbnail}
                variant="shot"
                alt={`${title} screenshot ${i + 1}`}
                className="h-full w-full transition-transform duration-500 group-hover:scale-105"
              />
            )}

            {/* Hover overlay with zoom hint */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[1px] transition-opacity duration-200 group-hover:opacity-100">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-black shadow-md">
                <Maximize2 className="h-4 w-4" />
              </span>
            </div>

            <span className="absolute bottom-2 left-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur-sm">
              #{i + 1}
            </span>
          </button>
        ))}
      </div>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {open !== null && current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[95] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
            onClick={() => setOpen(null)}
          >
            {/* Top Toolbar */}
            <div className="absolute top-4 inset-x-4 flex items-center justify-between text-white z-20 pointer-events-none">
              <span className="text-xs font-medium text-muted bg-card/80 px-3 py-1.5 rounded-full border border-line backdrop-blur-md pointer-events-auto">
                {title} • {open + 1} of {screenshots.length}
              </span>

              <div className="flex items-center gap-2 pointer-events-auto">
                {current.full.startsWith("http") && (
                  <a
                    href={current.full}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid h-10 w-10 place-items-center rounded-full border border-line bg-card/80 text-white transition-colors hover:text-accent hover:border-accent/40"
                    title="Open full resolution in new tab"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                <button
                  onClick={() => setOpen(null)}
                  aria-label="Close gallery"
                  className="grid h-10 w-10 place-items-center rounded-full border border-line bg-card/80 text-white transition-colors hover:text-accent hover:border-accent/40"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Previous Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen((i) => ((i ?? 0) - 1 + screenshots.length) % screenshots.length);
              }}
              aria-label="Previous screenshot"
              className="absolute left-4 z-10 grid h-12 w-12 place-items-center rounded-full border border-line bg-card/80 text-white transition-all hover:scale-105 hover:bg-card hover:text-accent"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Main Screenshot Container */}
            <div
              className="relative max-h-[85vh] max-w-6xl w-full flex items-center justify-center overflow-hidden rounded-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {current.full.startsWith("http") ? (
                <img
                  src={current.full}
                  alt={`${title} screenshot ${open + 1}`}
                  className="max-h-[85vh] w-auto max-w-full rounded-xl object-contain shadow-2xl border border-line"
                />
              ) : (
                <Artwork
                  seed={current.full}
                  variant="wide"
                  alt={`${title} screenshot ${open + 1}`}
                  eager
                  className="h-auto w-full rounded-xl"
                />
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen((i) => ((i ?? 0) + 1) % screenshots.length);
              }}
              aria-label="Next screenshot"
              className="absolute right-4 z-10 grid h-12 w-12 place-items-center rounded-full border border-line bg-card/80 text-white transition-all hover:scale-105 hover:bg-card hover:text-accent"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
