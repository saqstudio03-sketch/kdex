import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Rating({
  value,
  count,
  size = "sm",
  className,
}: {
  value: number;
  count?: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const star = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5" aria-label={`Rated ${value} out of 5`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={cn(
              star,
              i <= Math.round(value)
                ? "fill-warning text-warning"
                : "fill-line/60 text-line"
            )}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-muted">
        {value > 0 ? value.toFixed(1) : "—"}
        {typeof count === "number" && (
          <span className="text-muted/60"> ({count.toLocaleString("en-IN")})</span>
        )}
      </span>
    </div>
  );
}
