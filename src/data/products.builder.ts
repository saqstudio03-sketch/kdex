import type { Platform, Product, ProductType, SystemRequirements } from "@/types";
import { slugify } from "@/lib/utils";

/** ISO date n days from now — keeps the release calendar always fresh. */
export function inDays(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export const DEFAULT_SYSREQ: SystemRequirements = {
  minimum: {
    os: "Windows 10 64-bit",
    cpu: "Intel Core i5-8400 / AMD Ryzen 5 2600",
    ram: "8 GB",
    gpu: "GTX 1060 6GB / RX 580",
    storage: "60 GB SSD",
  },
  recommended: {
    os: "Windows 11 64-bit",
    cpu: "Intel Core i7-12700 / AMD Ryzen 7 5800X",
    ram: "16 GB",
    gpu: "RTX 3070 / RX 6800",
    storage: "60 GB NVMe SSD",
  },
};

export const DEFAULT_FAQ = [
  {
    q: "How do I receive my activation key?",
    a: "After payment verification your key appears instantly in Account → Game Library, and is also sent to your registered email.",
  },
  {
    q: "Which region is this key valid in?",
    a: "Unless stated otherwise, all keys activate in India (IN) and work nationwide.",
  },
  {
    q: "Can I get a refund?",
    a: "Unused keys are refundable within 48 hours of purchase. Contact support with your order ID.",
  },
];

const ACTIVATION: Record<Platform, string> = {
  PC: "Steam",
  PlayStation: "PlayStation Store",
  Xbox: "Microsoft Store",
  Nintendo: "Nintendo eShop",
};

type NewProduct = Partial<Product> &
  Pick<
    Product,
    | "id"
    | "title"
    | "tagline"
    | "description"
    | "developer"
    | "publisher"
    | "genre"
    | "platform"
    | "price"
    | "salePrice"
    | "releaseDate"
    | "rating"
    | "reviewCount"
    | "availability"
  >;

import gameMediaData from "./gameMedia.json";

const gameMedia = gameMediaData as unknown as Record<
  string,
  {
    appId?: number;
    title?: string;
    trailer?: {
      id?: number;
      name?: string;
      poster: string;
      videoUrl?: string | null;
      mp4Url?: string | null;
      hlsUrl?: string | null;
    } | null;
    screenshots?: {
      id: number;
      thumbnail: string;
      full: string;
    }[];
  }
>;

export function make(p: NewProduct): Product {
  const baseSlug = slugify(p.title);
  const slug = p.slug ?? baseSlug;
  const imageSeed = p.imageSeed ?? baseSlug;
  const media = gameMedia[p.id];
  const screenshotItems = media?.screenshots?.length ? media.screenshots : undefined;
  const screenshots = screenshotItems?.length
    ? screenshotItems.map((s) => s.full)
    : (p.screenshots ?? [`${slug}-s1`, `${slug}-s2`, `${slug}-s3`, `${slug}-s4`]);
  const trailer = media?.trailer ?? undefined;
  const trailerPlaceholder = !trailer?.videoUrl;
  const steamAppId = media?.appId;

  return {
    slug,
    imageSeed,
    productType: "Game" as ProductType,
    genres: [p.genre],
    activationPlatform: ACTIVATION[p.platform],
    region: "India (IN)",
    modes: ["Single Player"],
    features: ["Achievements"],
    languages: ["English", "Hindi"],
    tags: [],
    stock: 240,
    screenshots,
    screenshotItems,
    trailer,
    trailerPlaceholder: p.trailerPlaceholder ?? trailerPlaceholder,
    steamAppId,
    systemRequirements: p.platform === "PC" ? DEFAULT_SYSREQ : undefined,
    faq: DEFAULT_FAQ,
    ...p,
  };
}
