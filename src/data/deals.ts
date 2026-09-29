import type { Deal } from "@/types";
import { discountPercent } from "@/lib/utils";
import { byId } from "./products";

/** End-of-day timestamps computed from data — countdowns are never hardcoded. */
function endsOn(dayOffset: number, hour = 23, minute = 59): string {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function deal(
  id: string,
  productId: string,
  kind: Deal["kind"],
  label: string,
  endsAt: string,
  maxQuantity: number,
  sold: number
): Deal {
  return { id, productId, kind, label, discountPercent: 0, endsAt, maxQuantity, sold, active: true };
}

/**
 * Active deals matching the curated storefront specials:
 * ├── Hogwarts Legacy (55% off)
 * ├── Resident Evil 4 (45% off)
 * ├── GTA V (50% off)
 * ├── Forza Horizon 5 (45% off)
 * └── Mortal Kombat 1 (45% off)
 */
const raw: Deal[] = [
  deal("dl1", "pc-03", "Daily Deal", "Daily Mega Deal", endsOn(0, 23, 59), 800, 684), // Hogwarts Legacy (55%)
  deal("dl2", "pc-12", "Flash Sale", "Flash Sale", endsOn(0, 21, 30), 500, 421), // Resident Evil 4 (45%)
  deal("dl3", "pc-04", "Featured Deal", "Bestseller Deal", endsOn(1), 1200, 980), // GTA V (50%)
  deal("dl4", "pc-08", "Daily Deal", "Daily Deal", endsOn(1), 600, 415), // Forza Horizon 5 (45%)
  deal("dl5", "xb-10", "Weekend Deal", "Weekend Deal", endsOn(2), 500, 320), // Mortal Kombat 1 (45%)
  deal("dl6", "pc-02", "Daily Deal", "Publisher Spotlight", endsOn(2), 900, 712), // Red Dead Redemption 2 (40%)
  deal("dl7", "pc-13", "Featured Deal", "Editor's Pick", endsOn(3), 750, 560), // God of War Ragnarök (40%)
  deal("dl8", "xb-04", "Flash Sale", "Flash Sale", endsOn(3), 450, 289), // Halo Infinite (45%)
];

export const deals: Deal[] = raw
  .map((d) => {
    const p = byId(d.productId);
    if (!p) return d;
    return {
      ...d,
      discountPercent: discountPercent(p.price, p.salePrice),
      active: new Date(d.endsAt).getTime() > Date.now(),
    };
  })
  .filter((d) => d.active && d.discountPercent > 0);

export function dealFor(productId: string): Deal | undefined {
  return deals.find((d) => d.productId === productId);
}

/** The deal ending soonest — powers the homepage countdown section. */
export const nextDeal = [...deals].sort((a, b) =>
  a.endsAt.localeCompare(b.endsAt)
)[0];
