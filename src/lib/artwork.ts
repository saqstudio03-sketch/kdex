import { hashCode } from "./utils";

/**
 * Procedural artwork generator.
 *
 * Every product image is an ORIGINAL SVG generated from a seed string — no
 * copyrighted game artwork is used. In production these seeds are replaced by
 * Firebase Storage URLs for licensed key art; the component API stays the same.
 */

const PALETTES: [string, string, string][] = [
  ["#1B0F2B", "#E5A800", "#7C3AED"],
  ["#04121F", "#0EA5E9", "#22D3EE"],
  ["#1A0508", "#E11D48", "#F59E0B"],
  ["#05140F", "#10B981", "#84CC16"],
  ["#0A0F1E", "#3B82F6", "#A855F7"],
  ["#140B04", "#F97316", "#FACC15"],
  ["#0B1220", "#64748B", "#E2E8F0"],
  ["#12061F", "#D946EF", "#38BDF8"],
  ["#01110D", "#2DD4BF", "#F43F5E"],
  ["#100418", "#8B5CF6", "#EC4899"],
];

function pick(seed: string) {
  const h = hashCode(seed);
  const [bg, a, b] = PALETTES[h % PALETTES.length];
  return { bg, a, b, h };
}

function svg(inner: string, bg: string, w: number, h: number): string {
  const doc = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>
<defs>
<linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
<stop offset='0' stop-color='${bg}'/><stop offset='1' stop-color='#05060A'/>
</linearGradient>
<radialGradient id='v' cx='0.5' cy='0.42' r='0.75'>
<stop offset='0.55' stop-color='#000' stop-opacity='0'/><stop offset='1' stop-color='#000' stop-opacity='0.55'/>
</radialGradient>
<filter id='blur'><feGaussianBlur stdDeviation='${Math.round(w / 26)}'/></filter>
</defs>
<rect width='${w}' height='${h}' fill='url(#g)'/>
${inner}
<rect width='${w}' height='${h}' fill='url(#v)'/>
</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(doc)}`;
}

function composition(seed: string, w: number, h: number): string {
  const { a, b, h: hash } = pick(seed);
  const shapes: string[] = [];
  const kind = hash % 5;

  // ambient glow orbs
  for (let i = 0; i < 3; i++) {
    const cx = ((hash >> (i * 3)) % 100) / 100;
    const cy = ((hash >> (i * 5)) % 80) / 100 + 0.1;
    const r = (0.22 + ((hash >> i) % 20) / 100) * w;
    shapes.push(
      `<circle cx='${cx * w}' cy='${cy * h}' r='${r}' fill='${i % 2 ? a : b}' opacity='0.34' filter='url(#blur)'/>`
    );
  }

  if (kind === 0) {
    // diagonal light streaks
    for (let i = 0; i < 5; i++) {
      const x = ((hash + i * 173) % 100) / 100;
      shapes.push(
        `<rect x='${x * w}' y='${-h * 0.2}' width='${2 + (i % 3) * 3}' height='${h * 1.4}' fill='${i % 2 ? a : b}' opacity='0.16' transform='rotate(18 ${x * w} ${h / 2})'/>`
      );
    }
  } else if (kind === 1) {
    // polygonal mountains
    const base = h * 0.72;
    shapes.push(
      `<path d='M0 ${base} L${w * 0.3} ${h * 0.32} L${w * 0.55} ${base} Z' fill='${a}' opacity='0.5'/>`,
      `<path d='M${w * 0.4} ${base} L${w * 0.72} ${h * 0.24} L${w} ${base} Z' fill='${b}' opacity='0.4'/>`,
      `<rect y='${base}' width='${w}' height='${h - base}' fill='#05060A' opacity='0.55'/>`
    );
  } else if (kind === 2) {
    // perspective grid
    for (let i = 0; i <= 9; i++) {
      const y = h * 0.55 + (i * i * h) / 64;
      shapes.push(
        `<line x1='0' y1='${y}' x2='${w}' y2='${y}' stroke='${a}' stroke-width='1.2' opacity='${0.4 - i * 0.035}'/>`
      );
    }
    for (let i = -6; i <= 6; i++) {
      shapes.push(
        `<line x1='${w / 2 + i * w * 0.16}' y1='${h * 0.55}' x2='${w / 2 + i * w * 0.9}' y2='${h}' stroke='${b}' stroke-width='1' opacity='0.22'/>`
      );
    }
    shapes.push(`<circle cx='${w / 2}' cy='${h * 0.4}' r='${w * 0.14}' fill='${b}' opacity='0.5' filter='url(#blur)'/>`);
  } else if (kind === 3) {
    // shattered shards
    for (let i = 0; i < 6; i++) {
      const x = ((hash * (i + 1)) % 90) / 100;
      const y = ((hash >> i) % 70) / 100;
      const s = (0.14 + ((hash >> (i + 2)) % 16) / 100) * w;
      shapes.push(
        `<polygon points='${x * w},${y * h} ${(x * w) + s},${(y * h) + s * 0.3} ${(x * w) + s * 0.4},${(y * h) + s}' fill='${i % 2 ? a : b}' opacity='0.4' transform='rotate(${(hash + i * 29) % 360} ${x * w} ${y * h})'/>`
      );
    }
  } else {
    // horizon + sun
    const hy = h * 0.62;
    shapes.push(
      `<circle cx='${w * 0.62}' cy='${hy * 0.72}' r='${w * 0.17}' fill='${b}' opacity='0.85'/>`,
      `<rect y='${hy}' width='${w}' height='${h - hy}' fill='#05060A' opacity='0.65'/>`,
      `<rect y='${hy - 2}' width='${w}' height='2' fill='${a}' opacity='0.7'/>`
    );
    for (let i = 1; i <= 4; i++) {
      shapes.push(
        `<rect y='${hy + i * (h - hy) / 5}' width='${w}' height='1.5' fill='${a}' opacity='${0.3 - i * 0.05}'/>`
      );
    }
  }

  // fine scanline texture
  shapes.push(
    `<g opacity='0.05'>${Array.from({ length: Math.floor(h / 6) })
      .map((_, i) => `<rect y='${i * 6}' width='${w}' height='1' fill='#fff'/>`)
      .join("")}</g>`
  );

  return shapes.join("");
}

/** Wide cinematic artwork (hero, banners, detail header). */
export function artWide(seed: string): string {
  return svg(composition(seed, 1600, 900), pick(seed).bg, 1600, 900);
}

/** Portrait cover art (product cards). */
export function artCover(seed: string): string {
  return svg(composition(seed, 600, 800), pick(seed).bg, 600, 800);
}

/** 16:10 artwork for articles / screenshots. */
export function artShot(seed: string, w = 800, h = 500): string {
  return svg(composition(seed, w, h), pick(seed).bg, w, h);
}
