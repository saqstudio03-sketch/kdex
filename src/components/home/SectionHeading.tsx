import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function SectionHeading({
  title,
  subtitle,
  to,
  linkLabel = "View all",
  children,
}: {
  title: string;
  subtitle?: string;
  to?: string;
  linkLabel?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <span className="h-6 w-1 rounded-full bg-accent" aria-hidden />
          <h2 className="font-display text-xl font-bold text-white md:text-2xl">{title}</h2>
          {children}
        </div>
        {subtitle && <p className="mt-1.5 pl-4 text-sm text-muted">{subtitle}</p>}
      </div>
      {to && (
        <Link
          to={to}
          className="group hidden shrink-0 items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-accent sm:flex"
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
