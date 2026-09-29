export type Platform = "PC" | "PlayStation" | "Xbox" | "Nintendo";

export type ProductType =
  | "Game"
  | "DLC"
  | "Expansion"
  | "Gift Card"
  | "Subscription";

export type GameMode =
  | "Single Player"
  | "Multiplayer"
  | "Co-op"
  | "Online PVP"
  | "Local Co-op";

export type Availability = "in_stock" | "out_of_stock" | "preorder";

export interface SystemRequirements {
  minimum: { os: string; cpu: string; ram: string; gpu: string; storage: string };
  recommended: { os: string; cpu: string; ram: string; gpu: string; storage: string };
}

export interface GameFaq {
  q: string;
  a: string;
}

export interface ScreenshotItem {
  id: number;
  thumbnail: string;
  full: string;
}

export interface TrailerMedia {
  id?: number;
  name?: string;
  poster: string;
  videoUrl?: string | null; // mp4 or hls
  mp4Url?: string | null;
  hlsUrl?: string | null;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  developer: string;
  publisher: string;
  genre: string;
  genres: string[];
  platform: Platform;
  /** Storefront the key activates on (Steam, Epic, PSN, ...) */
  activationPlatform: string;
  region: string;
  productType: ProductType;
  releaseDate: string; // ISO date
  price: number; // INR, original
  salePrice: number; // INR, current effective price
  imageSeed: string;
  rating: number; // 0-5
  reviewCount: number;
  modes: GameMode[];
  features: string[]; // Controller Support, Steam Deck, VR, Achievements
  languages: string[];
  tags: string[];
  availability: Availability;
  stock: number;
  featured?: boolean;
  trending?: boolean;
  bestsellerRank?: number;
  screenshots: string[]; // URLs or procedural art seeds
  screenshotItems?: ScreenshotItem[]; // rich screenshots with thumbnail and 1080p full
  trailer?: TrailerMedia;
  trailerPlaceholder?: boolean;
  steamAppId?: number;
  systemRequirements?: SystemRequirements;
  faq?: GameFaq[];
}

export interface Review {
  id: string;
  productId: string;
  productTitle: string;
  user: string;
  rating: number;
  title: string;
  comment: string;
  date: string; // ISO
  verified: boolean;
  status: "pending" | "approved" | "rejected";
}

export interface Deal {
  id: string;
  productId: string;
  kind: "Daily Deal" | "Flash Sale" | "Weekend Deal" | "Featured Deal";
  label: string;
  discountPercent: number;
  /** ISO datetime — countdown is computed from this, never hardcoded */
  endsAt: string;
  maxQuantity: number;
  sold: number;
  active: boolean;
}

export interface Preorder {
  productId: string;
  releaseDate: string;
  bonus: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  imageSeed: string;
}

export interface Coupon {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrder: number;
  maxDiscount: number;
  expiresAt: string;
  usageLimit: number;
  used: number;
  perUserLimit: number;
}

export interface CartItem {
  productId: string;
  qty: number;
}

export interface OrderLine {
  productId: string;
  title: string;
  platform: Platform;
  unitPrice: number;
  qty: number;
}

export type OrderStatus = "pending" | "paid" | "fulfilled" | "failed" | "refunded";

export interface DemoKey {
  productId: string;
  key: string;
  status: "available" | "reserved" | "sold";
}

export interface Order {
  id: string;
  createdAt: string;
  email: string;
  items: OrderLine[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  tax: number;
  total: number;
  paymentStatus: "unpaid" | "paid" | "failed";
  paymentMethod: string;
  fulfillmentStatus: "pending" | "fulfilled" | "demo";
  status: OrderStatus;
  keys: DemoKey[];
  demo: boolean;
}

export interface SupportTicket {
  id: string;
  subject: string;
  orderId: string;
  category:
    | "Payment"
    | "Order"
    | "Activation Key"
    | "Refund"
    | "Technical"
    | "Other";
  message: string;
  status: "open" | "answered" | "closed";
  createdAt: string;
  reply?: string;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
  provider: "password" | "google" | "demo";
}
