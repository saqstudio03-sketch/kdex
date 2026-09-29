import type { SystemRequirements } from "@/types";
import { Monitor, MonitorCog } from "lucide-react";

const LABELS: Record<string, [string, string]> = {
  os: ["OS", "operating system"],
  cpu: ["Processor", "cpu"],
  ram: ["RAM", "memory"],
  gpu: ["GPU", "graphics"],
  storage: ["Storage", "storage"],
};

function Column({
  spec,
  variant,
  title,
  Icon,
}: {
  spec: SystemRequirements["minimum"];
  variant: "min" | "rec";
  title: string;
  Icon: typeof Monitor;
}) {
  return (
    <div className="rounded-xl border border-line bg-card p-5">
      <h4 className="mb-4 flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-accent">
        <Icon className="h-4 w-4" /> {title}
      </h4>
      <dl className="space-y-3">
        {Object.entries(LABELS).map(([key, [label]]) => (
          <div key={key} className="grid grid-cols-[110px_1fr] gap-3 border-b border-line/60 pb-2 last:border-0">
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</dt>
            <dd className={`text-sm ${variant === "min" ? "text-white" : "text-white"}`}>
              {spec[key as keyof typeof spec]}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function SpecsTable({ spec }: { spec: SystemRequirements }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Column spec={spec.minimum} variant="min" title="Minimum" Icon={Monitor} />
      <Column spec={spec.recommended} variant="rec" title="Recommended" Icon={MonitorCog} />
    </div>
  );
}
