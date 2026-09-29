import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { isFirebaseConfigured } from "@/lib/firebase";

/** Shared split-layout shell for login / register screens. */
export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-12 md:px-6 lg:grid-cols-2 lg:py-16">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden rounded-3xl border border-line bg-card p-10 lg:flex lg:flex-col lg:justify-between">
        <div className="nx-grid-bg absolute inset-0 opacity-30" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 20% 20%, rgba(255,92,53,0.25), transparent 55%), radial-gradient(circle at 80% 70%, rgba(124,58,237,0.25), transparent 55%)",
          }}
        />
        <Link to="/" className="relative flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent font-display text-xl font-bold text-black">
            K
          </span>
          <span className="font-display text-xl font-bold">
            KDEX<span className="text-accent">.</span>
          </span>
        </Link>
        <div className="relative">
          <h2 className="font-display text-3xl font-bold leading-tight">
            Your library,
            <br />
            <span className="text-accent">everywhere you play.</span>
          </h2>
          <ul className="mt-6 space-y-3 text-sm text-muted">
            <li>• Instant digital key delivery after payment</li>
            <li>• Track orders, keys and receipts in one place</li>
            <li>• Wishlist price-drop alerts and member coupons</li>
            <li>• Verified-purchaser reviews that actually mean something</li>
          </ul>
        </div>
        <p className="relative text-xs text-muted/70">
          © {new Date().getFullYear()} KDex Games (demo project)
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col justify-center">
        <h1 className="font-display text-2xl font-bold md:text-3xl">{title}</h1>
        <p className="mt-1.5 text-sm text-muted">{subtitle}</p>

        {!isFirebaseConfigured && (
          <p className="mt-4 rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-xs leading-relaxed text-warning">
            DEMO AUTH — Firebase is not configured in this environment, so accounts are
            simulated locally. Swap in Firebase Auth credentials to go live.
          </p>
        )}

        <div className="mt-6">{children}</div>
        <div className="mt-5 text-sm text-muted">{footer}</div>
      </div>
    </div>
  );
}
