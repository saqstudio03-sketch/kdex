import { useRef, useState, useEffect, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Horizontal product rail with arrow controls (desktop) and native
 * touch scrolling (mobile).
 */
export function ProductRail({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const update = () => {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 640), behavior: "smooth" });
  };

  return (
    <div className="group/rail relative">
      <div
        ref={ref}
        onScroll={update}
        className={cn(
          "no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2",
          "[&>*]:w-[42%] [&>*]:shrink-0 sm:[&>*]:w-[28%] md:[&>*]:w-[20%] lg:[&>*]:w-[15.5%] xl:[&>*]:w-[13.5%] 2xl:[&>*]:w-[11.8%]",
          className
        )}
      >
        {children}
      </div>

      <RailButton side="left" visible={canLeft} onClick={() => scrollBy(-1)} />
      <RailButton side="right" visible={canRight} onClick={() => scrollBy(1)} />
    </div>
  );
}

function RailButton({
  side,
  visible,
  onClick,
}: {
  side: "left" | "right";
  visible: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={side === "left" ? "Scroll left" : "Scroll right"}
      className={cn(
        "focus-ring absolute top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-card/90 text-white shadow-lift backdrop-blur transition-all duration-200 hover:border-accent/60 hover:text-accent md:grid",
        side === "left" ? "-left-5" : "-right-5",
        visible ? "opacity-0 group-hover/rail:opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      {side === "left" ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
    </button>
  );
}
