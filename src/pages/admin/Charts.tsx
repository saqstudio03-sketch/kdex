import type { LucideIcon } from "lucide-react";

/** Small stat card used across admin screens. */
export function Stat({
  label,
  value,
  sub,
  Icon,
  tone = "accent",
}: {
  label: string;
  value: string;
  sub?: string;
  Icon: LucideIcon;
  tone?: "accent" | "success" | "warning";
}) {
  const tones = { accent: "text-accent", success: "text-success", warning: "text-warning" };
  return (
    <div className="rounded-xl border border-line bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted">{label}</span>
        <Icon className={`h-4 w-4 ${tones[tone]}`} />
      </div>
      <p className="mt-2 font-display text-2xl font-bold">{value}</p>
      {sub && <p className="text-xs text-muted">{sub}</p>}
    </div>
  );
}

/** Dependency-free SVG line chart (revenue series). */
export function LineChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * 100},${100 - (v / max) * 90 - 5}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-40 w-full" aria-hidden>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        vectorEffect="non-scaling-stroke"
      />
      <polygon points={`0,100 ${pts} 100,100`} fill={color} opacity="0.12" />
    </svg>
  );
}

/** Dependency-free bar chart (orders series). */
export function Bars({ data, labels }: { data: number[]; labels: string[] }) {
  const max = Math.max(...data);
  return (
    <div className="flex h-40 items-end gap-1.5">
      {data.map((v, i) => (
        <div key={labels[i]} className="group flex flex-1 flex-col items-center gap-1">
          <div
            className="w-full rounded-t bg-accent/70 transition-all group-hover:bg-accent"
            style={{ height: `${(v / max) * 100}%` }}
            title={`${labels[i]}: ${v}`}
          />
          <span className="text-[9px] text-muted">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}
