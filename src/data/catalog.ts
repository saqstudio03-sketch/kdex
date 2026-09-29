import type { GameMode, Platform, ProductType } from "@/types";

export const PLATFORMS: Platform[] = ["PC", "PlayStation", "Xbox", "Nintendo"];

export const PLATFORM_META: Record<
  Platform,
  { label: string; activation: string; blurb: string; hue: string }
> = {
  PC: {
    label: "PC",
    activation: "Steam / Epic",
    blurb: "Steam & Epic keys, unlocked framerates and full mod support.",
    hue: "from-sky-500/80 to-indigo-600/80",
  },
  PlayStation: {
    label: "PlayStation",
    activation: "PlayStation Store",
    blurb: "PS5 & PS4 titles with day-one support and DualSense features.",
    hue: "from-blue-600/80 to-cyan-400/70",
  },
  Xbox: {
    label: "Xbox",
    activation: "Microsoft Store",
    blurb: "Xbox Series X|S, One titles and Game Pass-eligible releases.",
    hue: "from-emerald-500/80 to-lime-400/70",
  },
  Nintendo: {
    label: "Nintendo",
    activation: "Nintendo eShop",
    blurb: "Switch exclusives, co-op classics and family favourites.",
    hue: "from-red-500/80 to-amber-400/70",
  },
};

export const GENRES = [
  "Action",
  "Adventure",
  "RPG",
  "FPS",
  "Racing",
  "Sports",
  "Strategy",
  "Simulation",
  "Horror",
  "Indie",
  "Multiplayer",
  "Survival",
] as const;

export const GENRE_ICON_KEY: Record<string, string> = {
  Action: "swords",
  Adventure: "compass",
  RPG: "shield",
  FPS: "crosshair",
  Racing: "flag",
  Sports: "trophy",
  Strategy: "chess",
  Simulation: "settings",
  Horror: "ghost",
  Indie: "sparkles",
  Multiplayer: "users",
  Survival: "tent",
};

export const PRODUCT_TYPES: ProductType[] = [
  "Game",
  "DLC",
  "Expansion",
  "Gift Card",
  "Subscription",
];

export const GAME_MODES: GameMode[] = [
  "Single Player",
  "Multiplayer",
  "Co-op",
  "Online PVP",
  "Local Co-op",
];

export const FEATURES = [
  "Controller Support",
  "Steam Deck",
  "VR",
  "Achievements",
];

export const LANGUAGES = [
  "English",
  "Hindi",
  "Malayalam",
  "Tamil",
  "French",
  "German",
  "Japanese",
  "Spanish",
];

export const PRICE_BANDS = [
  { id: "u500", label: "Under ₹500", min: 0, max: 499 },
  { id: "500-1000", label: "₹500 – ₹1,000", min: 500, max: 1000 },
  { id: "1000-2000", label: "₹1,000 – ₹2,000", min: 1000, max: 2000 },
  { id: "2000+", label: "₹2,000+", min: 2000, max: Infinity },
];

export const RELEASE_WINDOWS = [
  { id: "7", label: "Next 7 days" },
  { id: "30", label: "Next 30 days" },
  { id: "90", label: "Next 3 months" },
  { id: "past", label: "Out now" },
];

export const SORT_OPTIONS = [
  { id: "recommended", label: "Recommended" },
  { id: "bestsellers", label: "Bestsellers" },
  { id: "discount", label: "Biggest Discount" },
  { id: "price-asc", label: "Price: Low → High" },
  { id: "price-desc", label: "Price: High → Low" },
  { id: "newest", label: "Newest" },
  { id: "rating", label: "Best Rated" },
] as const;

export type SortId = (typeof SORT_OPTIONS)[number]["id"];
