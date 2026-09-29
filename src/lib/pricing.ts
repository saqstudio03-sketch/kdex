import { discountPercent } from "./utils";

export interface PricedLine {
  price: number;
  salePrice: number;
  qty: number;
}

export interface Totals {
  subtotal: number; // sum of original prices
  itemDiscount: number; // sale-price savings
  couponDiscount: number;
  taxable: number; // subtotal - discounts
  tax: number; // GST contained in the payable amount (18%)
  total: number; // amount charged
  saved: number; // total customer saving
}

/** All cart maths lives here (mirrored by Cloud Functions in production). */
export function computeTotals(lines: PricedLine[], couponAmount = 0): Totals {
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const effective = lines.reduce((s, l) => s + l.salePrice * l.qty, 0);
  const itemDiscount = subtotal - effective;
  const clampedCoupon = Math.min(couponAmount, effective);
  const total = Math.max(effective - clampedCoupon, 0);
  const tax = Math.round((total * 18) / 118); // GST is inclusive in INR pricing
  return {
    subtotal,
    itemDiscount,
    couponDiscount: clampedCoupon,
    taxable: total,
    tax,
    total,
    saved: itemDiscount + clampedCoupon,
  };
}

export function lineSavings(price: number, salePrice: number, qty = 1): number {
  return (price - salePrice) * qty;
}

export { discountPercent };
