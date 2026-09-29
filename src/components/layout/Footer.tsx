import { Link } from "react-router-dom";

const COLUMNS = [
  {
    title: "Store",
    links: [
      ["All Games", "/games"],
      ["Deals", "/deals"],
      ["Pre-orders", "/pre-orders"],
      ["Upcoming", "/upcoming"],
      ["Gift Cards", "/games?type=Gift%20Card"],
    ],
  },
  {
    title: "Platforms",
    links: [
      ["PC Games", "/platform/pc"],
      ["PlayStation", "/platform/playstation"],
      ["Xbox", "/platform/xbox"],
      ["Nintendo", "/platform/nintendo"],
    ],
  },
  {
    title: "Account",
    links: [
      ["Sign in", "/login"],
      ["Register", "/register"],
      ["My Orders", "/account/orders"],
      ["Game Library", "/account/library"],
      ["Wishlist", "/wishlist"],
    ],
  },
  {
    title: "Support",
    links: [
      ["Support Centre", "/account/support"],
      ["Refund Policy", "/support"],
      ["Activation Help", "/support"],
      ["Contact Us", "/support"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-surface">
      <div className="mx-auto w-full max-w-[1920px] px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent font-display text-lg font-bold text-black">
                K
              </span>
              <span className="font-display text-lg font-bold">
                KDEX<span className="text-accent">.</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              A premium digital game store for PC, PlayStation, Xbox and Nintendo.
              Instant activation keys, daily deals and support that actually replies.
            </p>
            <p className="mt-4 text-xs text-muted/70">
              Currency: INR ₹ • Languages: English / हिन्दी / മലയാളം (architecture is
              modular — more coming)
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map(([label, to]) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-muted transition-colors hover:text-accent"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} KDex Games. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
