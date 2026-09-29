import type { Coupon } from "@/types";

/**
 * Demo coupons. Validation happens in checkout logic (backend in production —
 * see functions/src/coupon.ts stub in README). Never trust client-side totals.
 */
export const coupons: Coupon[] = [
  {
    code: "WELCOME10",
    type: "percentage",
    value: 10,
    minOrder: 499,
    maxDiscount: 300,
    expiresAt: "2027-12-31",
    usageLimit: 10000,
    used: 1243,
    perUserLimit: 1,
  },
  {
    code: "FESTIVE20",
    type: "percentage",
    value: 20,
    minOrder: 1499,
    maxDiscount: 800,
    expiresAt: "2027-01-31",
    usageLimit: 5000,
    used: 3120,
    perUserLimit: 1,
  },
  {
    code: "FLAT150",
    type: "fixed",
    value: 150,
    minOrder: 999,
    maxDiscount: 150,
    expiresAt: "2027-06-30",
    usageLimit: 2000,
    used: 411,
    perUserLimit: 3,
  },
  {
    code: "KDEX25",
    type: "percentage",
    value: 25,
    minOrder: 2499,
    maxDiscount: 1200,
    expiresAt: "2027-03-31",
    usageLimit: 1000,
    used: 987,
    perUserLimit: 1,
  },
  {
    code: "NEXORA25",
    type: "percentage",
    value: 25,
    minOrder: 2499,
    maxDiscount: 1200,
    expiresAt: "2027-03-31",
    usageLimit: 1000,
    used: 987,
    perUserLimit: 1,
  },
];

export type CouponResult =
  | { ok: true; amount: number }
  | { ok: false; reason: string };

/** Pure validation function — mirrored server-side in production. */
export function validateCoupon(
  code: string,
  subtotal: number
): CouponResult {
  const c = coupons.find((x) => x.code === code.trim().toUpperCase());
  if (!c) return { ok: false, reason: "Invalid coupon code." };
  if (new Date(c.expiresAt).getTime() < Date.now())
    return { ok: false, reason: "This coupon has expired." };
  if (c.used >= c.usageLimit)
    return { ok: false, reason: "This coupon has reached its usage limit." };
  if (subtotal < c.minOrder)
    return {
      ok: false,
      reason: `Minimum order of ₹${c.minOrder.toLocaleString("en-IN")} required.`,
    };
  const amount =
    c.type === "percentage"
      ? Math.min(Math.round((subtotal * c.value) / 100), c.maxDiscount)
      : Math.min(c.value, c.maxDiscount);
  return { ok: true, amount };
}
