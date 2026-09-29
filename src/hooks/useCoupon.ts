import { useSyncExternalStore } from "react";
import { load, save } from "@/lib/storage";
import { validateCoupon } from "@/data/coupons";

/**
 * Shared coupon state (module store) so the cart drawer, cart page and
 * checkout always agree. Validation is mirrored server-side in production.
 */
export interface AppliedCoupon {
  code: string;
  amount: number;
}

let state: AppliedCoupon | null = load<AppliedCoupon | null>("coupon", null);
const listeners = new Set<() => void>();

function emit() {
  save("coupon", state);
  listeners.forEach((l) => l());
}

export function useCoupon(): AppliedCoupon | null {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state
  );
}

export function setCoupon(c: AppliedCoupon | null) {
  state = c;
  emit();
}

/** Returns an error message, or null on success. */
export function tryApplyCoupon(code: string, subtotal: number): string | null {
  const res = validateCoupon(code, subtotal);
  if (!res.ok) return res.reason;
  setCoupon({ code: code.trim().toUpperCase(), amount: res.amount });
  return null;
}
