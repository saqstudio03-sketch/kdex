import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "accent" | "success" | "muted" | "danger" | "warning" | "dark";

const tones: Record<Tone, string> = {
  accent: "bg-accent text-black",
  success: "bg-success/15 text-success border border-success/30",
  muted: "bg-white/8 text-muted border border-line",
  danger: "bg-danger/15 text-danger border border-danger/30",
  warning: "bg-warning/15 text-warning border border-warning/30",
  dark: "bg-black/70 text-white backdrop-blur-sm border border-white/10",
};

export function Badge({
  children,
  tone = "muted",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function DiscountBadge({ percent, className }: { percent: number; className?: string }) {
  if (!percent) return null;
  return (
    <Badge tone="accent" className={cn("rounded-md px-2 py-1 text-xs font-bold", className)}>
      -{percent}%
    </Badge>
  );
}
