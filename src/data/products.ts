import type { Product } from "@/types";
import { part1 } from "./products.part1";
import { part2 } from "./products.part2";
import { part3 } from "./products.part3";
import { part4 } from "./products.part4";
import { part5 } from "./products.part5";
import { part6 } from "./products.part6";

/** Full catalog with popular PC, PlayStation, Xbox & Pre-order games */
export const products: Product[] = [
  ...part1,
  ...part2,
  ...part3,
  ...part4,
  ...part5,
  ...part6,
];

export function bySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function byId(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

/** Featured Hero Carousel priority: GTA VI, Forza Horizon 5, Cyberpunk 2077, Elden Ring, Red Dead Redemption 2, God of War */
const HERO_PRIORITY = ["pre-01", "pc-08", "pc-01", "pc-05", "pc-02", "ps-01"];
export const featuredProducts: Product[] = HERO_PRIORITY
  .map(byId)
  .filter((p): p is Product => Boolean(p));

/** Trending Priority: GTA V, Cyberpunk 2077, Red Dead Redemption 2, Elden Ring, Hogwarts Legacy */
const TRENDING_PRIORITY = [
  "pc-04", // GTA V
  "pc-01", // Cyberpunk 2077
  "pc-02", // Red Dead Redemption 2
  "pc-05", // Elden Ring
  "pc-03", // Hogwarts Legacy
  "pc-07", // Black Myth: Wukong
  "ps-02", // Spider-Man 2
  "ps-01", // God of War Ragnarök
  "pc-08", // Forza Horizon 5
  "pc-06", // Baldur's Gate 3
];
export const trendingProducts: Product[] = [
  ...TRENDING_PRIORITY.map(byId).filter((p): p is Product => Boolean(p)),
  ...products.filter((p) => p.trending && !TRENDING_PRIORITY.includes(p.id)),
];

/** Bestseller Priority: GTA V, Minecraft, Forza Horizon 5, God of War Ragnarök, Spider-Man 2 */
export const bestsellerProducts = [...products]
  .filter((p) => p.bestsellerRank)
  .sort((a, b) => (a.bestsellerRank ?? 99) - (b.bestsellerRank ?? 99));

/** Pre-orders Priority: GTA VI, Marvel's Wolverine, Modern Warfare 4, 007 First Light, EA Sports FC 27 */
const PREORDER_PRIORITY = [
  "pre-01", // GTA VI
  "pre-03", // Marvel's Wolverine
  "pre-04", // Modern Warfare 4
  "pre-05", // 007 First Light
  "pre-09", // EA Sports FC 27
  "pre-02", // Forza Horizon 6
  "pre-06", // ACE COMBAT 8
  "pre-07", // Star Wars: Galactic Racer
  "pre-08", // Star Wars Zero Company
  "pre-10", // The Blood of Dawnwalker
  "pre-11", // Marvel Tōkon
];
export const preorderProducts: Product[] = [
  ...PREORDER_PRIORITY.map(byId).filter((p): p is Product => Boolean(p)),
  ...products.filter((p) => p.availability === "preorder" && !PREORDER_PRIORITY.includes(p.id)),
];

export const upcomingProducts = [...products]
  .filter((p) => new Date(p.releaseDate).getTime() > Date.now())
  .sort((a, b) => a.releaseDate.localeCompare(b.releaseDate));

export const inStockProducts = products.filter(
  (p) => p.availability === "in_stock"
);

/** Simple relevance score used by search + "recommended" sorting. */
export function relevance(p: Product): number {
  return (
    p.rating * 20 +
    Math.log10(Math.max(p.reviewCount, 1)) * 8 +
    (p.bestsellerRank ? 15 - p.bestsellerRank : 0) +
    (p.trending ? 10 : 0) +
    (p.featured ? 12 : 0)
  );
}
