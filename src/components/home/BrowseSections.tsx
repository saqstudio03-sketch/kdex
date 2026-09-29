import { Link } from "react-router-dom";
import { Monitor, Gamepad2, Joystick, Dices } from "lucide-react";
import { PLATFORMS, PLATFORM_META, GENRES } from "@/data/catalog";
import { SectionHeading } from "./SectionHeading";

const PLATFORM_ICON = {
  PC: Monitor,
  PlayStation: Gamepad2,
  Xbox: Joystick,
  Nintendo: Dices,
} as const;

/** Large platform cards + genre grid (browse-by discovery). */
export function BrowsePlatforms() {
  return (
    <section className="mx-auto w-full max-w-[1920px] px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <SectionHeading title="Browse by Platform" subtitle="Pick your battlefield." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PLATFORMS.map((p) => {
          const meta = PLATFORM_META[p];
          const Icon = PLATFORM_ICON[p];
          return (
            <Link
              key={p}
              to={`/platform/${p.toLowerCase()}`}
              className={`group relative overflow-hidden rounded-2xl border border-line bg-gradient-to-br ${meta.hue} p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift`}
            >
              <div className="absolute inset-0 bg-black/45 transition-opacity duration-300 group-hover:opacity-30" />
              <div className="relative">
                <Icon className="mb-10 h-10 w-10 text-white/90 transition-transform duration-300 group-hover:scale-110" />
                <h3 className="font-display text-xl font-bold text-white">{meta.label}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-white/75">{meta.blurb}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-white/60">
                  Activates on {meta.activation} →
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

const GENRE_ICONS: Record<string, string> = {
  Action: "⚔", Adventure: "🧭", RPG: "🛡", FPS: "🎯", Racing: "🏁", Sports: "🏆",
  Strategy: "♟", Simulation: "⚙", Horror: "👻", Indie: "✦", Multiplayer: "👥", Survival: "⛺",
};

export function BrowseGenres() {
  return (
    <section className="mx-auto w-full max-w-[1920px] px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <SectionHeading title="Browse by Genre" subtitle="Twelve ways to lose an evening." />
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {GENRES.map((g) => (
          <Link
            key={g}
            to={`/genre/${g.toLowerCase()}`}
            className="group flex flex-col items-center gap-2 rounded-xl border border-line bg-card px-3 py-5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/50 hover:bg-surface"
          >
            <span className="text-2xl transition-transform duration-200 group-hover:scale-110">
              {GENRE_ICONS[g]}
            </span>
            <span className="text-sm font-medium text-white">{g}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
