import type { Product } from "@/types";
import { PRICE_BANDS, type SortId } from "@/data/catalog";
import { discountPercent, daysUntil } from "./utils";
import { relevance } from "@/data/products";

export interface Filters {
  price: string[];
  release: string[];
  platform: string[];
  type: string[];
  genre: string[];
  mode: string[];
  feature: string[];
  language: string[];
}

export const emptyFilters: Filters = {
  price: [],
  release: [],
  platform: [],
  type: [],
  genre: [],
  mode: [],
  feature: [],
  language: [],
};

export function activeFilterCount(f: Filters): number {
  return Object.values(f).reduce((n, arr) => n + arr.length, 0);
}

export function applyFilters(
  items: Product[],
  f: Filters,
  sort: SortId,
  term?: string
): Product[] {
  let out = items;

  if (term) {
    const t = term.toLowerCase();
    out = out.filter((p) =>
      [p.title, p.developer, p.publisher, p.genre, p.platform, ...p.tags]
        .join(" ")
        .toLowerCase()
        .includes(t)
    );
  }

  if (f.platform.length) out = out.filter((p) => f.platform.includes(p.platform));
  if (f.type.length) out = out.filter((p) => f.type.includes(p.productType));
  if (f.genre.length)
    out = out.filter((p) => p.genres.some((g) => f.genre.includes(g)));
  if (f.mode.length) out = out.filter((p) => p.modes.some((m) => f.mode.includes(m)));
  if (f.feature.length)
    out = out.filter((p) => f.feature.some((x) => p.features.includes(x)));
  if (f.language.length)
    out = out.filter((p) => f.language.some((l) => p.languages.includes(l)));

  if (f.price.length) {
    out = out.filter((p) =>
      f.price.some((id) => {
        const band = PRICE_BANDS.find((b) => b.id === id);
        return band && p.salePrice >= band.min && p.salePrice <= band.max;
      })
    );
  }

  if (f.release.length) {
    out = out.filter((p) => {
      const days = daysUntil(p.releaseDate);
      return f.release.some((id) =>
        id === "past" ? days <= 0 : days > 0 && days <= Number(id)
      );
    });
  }

  const sorted = [...out];
  switch (sort) {
    case "bestsellers":
      sorted.sort((a, b) => (a.bestsellerRank ?? 99) - (b.bestsellerRank ?? 99));
      break;
    case "discount":
      sorted.sort(
        (a, b) =>
          discountPercent(b.price, b.salePrice) - discountPercent(a.price, a.salePrice)
      );
      break;
    case "price-asc":
      sorted.sort((a, b) => a.salePrice - b.salePrice);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.salePrice - a.salePrice);
      break;
    case "newest":
      sorted.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
      break;
    case "rating":
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    default:
      sorted.sort((a, b) => relevance(b) - relevance(a));
  }
  return sorted;
}
