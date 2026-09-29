import { Check } from "lucide-react";

export const STEP_LABELS = ["Customer", "Review", "Payment", "Confirmation"] as const;

/** Progress indicator for the multi-step checkout. */
export function Stepper({ step }: { step: number }) {
  return (
    <ol className="mb-8 flex items-center gap-2" aria-label="Checkout progress">
      {STEP_LABELS.map((s, i) => (
        <li key={s} className="flex flex-1 items-center gap-2">
          <span
            className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border text-xs font-bold ${
              i <= step ? "border-accent bg-accent text-black" : "border-line bg-card text-muted"
            }`}
          >
            {i < step ? <Check className="h-4 w-4" /> : i + 1}
          </span>
          <span
            className={`hidden text-xs font-medium sm:block ${
              i <= step ? "text-white" : "text-muted"
            }`}
          >
            {s}
          </span>
          {i < STEP_LABELS.length - 1 && <span className="h-px flex-1 bg-line" />}
        </li>
      ))}
    </ol>
  );
}
