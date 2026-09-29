/* ---------------------------------------------------------------------------
 * NEXORA GAMES — Cloud Functions (reference implementation, not yet deployed)
 *
 * These functions are the server-side half of the store's money and
 * entitlement flow. They are intentionally NOT in the frontend bundle: the
 * Razorpay key secret, the digital-key collection and the order status all live
 * here so a tampered client can never mint a key or mark an order paid.
 *
 * Local development:  cd functions && npm i && npm run serve   (emulators)
 * Production:         cd functions && npm run deploy
 * Secrets:            firebase functions:secrets:set RAZORPAY_KEY_ID
 *                     firebase functions:secrets:set RAZORPAY_KEY_SECRET
 * ------------------------------------------------------------------------- */
import { onCall, HttpsError, CallableRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { logger } from "firebase-functions";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue, Transaction } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import Razorpay from "razorpay";
import { createHmac, timingSafeEqual } from "crypto";

initializeApp();
const db = getFirestore();

const RAZORPAY_KEY_ID = defineSecret("RAZORPAY_KEY_ID");
const RAZORPAY_KEY_SECRET = defineSecret("RAZORPAY_KEY_SECRET");
const CALL_OPTS = { secrets: [RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET] };

/** Product types that are delivered as an activation key. */
const KEYED_TYPES = new Set(["Game", "DLC", "Expansion", "Gift Card", "Subscription"]);

function requireAuth(req: CallableRequest): string {
  if (!req.auth) throw new HttpsError("unauthenticated", "Sign in required.");
  return req.auth.uid;
}

function requireAdmin(req: CallableRequest) {
  if (!req.auth?.token?.admin) {
    throw new HttpsError("permission-denied", "Admin claim required.");
  }
}

function razorpay() {
  return new Razorpay({
    key_id: RAZORPAY_KEY_ID.value(),
    key_secret: RAZORPAY_KEY_SECRET.value(),
  });
}

/** Razorpay expects the smallest currency unit (paise for INR). */
const toPaise = (rupees: number) => Math.round(rupees * 100);

/* ---------------------------------------------------------------------------
 * 1. createPaymentOrder — client asks the server for a Razorpay order.
 *    The amount is recomputed from Firestore prices; the client's total is only
 *    used as a cross-check, never as the source of truth.
 * ------------------------------------------------------------------------- */
export const createPaymentOrder = onCall(CALL_OPTS, async (req) => {
  const uid = requireAuth(req);
  const { items, couponCode } = (req.data ?? {}) as {
    items?: { productId: string; qty: number }[];
    couponCode?: string;
  };

  if (!items?.length) throw new HttpsError("invalid-argument", "Cart is empty.");

  const priced = await priceCart(items, couponCode, uid);

  const rzpOrder = await razorpay().orders.create({
    amount: toPaise(priced.total),
    currency: "INR",
    receipt: `nx_${Date.now()}`,
    notes: { userId: uid, couponCode: couponCode ?? "" },
  });

  // Order is persisted as unpaid: the webhook / verify call promotes it to paid.
  const ref = db.collection("orders").doc();
  await ref.set({
    ...priced,
    userId: uid,
    id: ref.id,
    email: req.auth?.token?.email ?? "",
    paymentMethod: "razorpay",
    paymentStatus: "unpaid",
    fulfillmentStatus: "pending",
    status: "pending",
    razorpayOrderId: rzpOrder.id,
    keys: [],
    demo: false,
    createdAt: FieldValue.serverTimestamp(),
  });

  return {
    orderDocId: ref.id,
    razorpayOrderId: rzpOrder.id,
    keyId: RAZORPAY_KEY_ID.value(), // publishable key only
    amount: rzpOrder.amount,
    currency: "INR",
  };
});

/* ---------------------------------------------------------------------------
 * Shared pricing: recomputed server-side so a modified client total is ignored.
 * Mirrors src/lib/pricing.ts on the storefront.
 * ------------------------------------------------------------------------- */
async function priceCart(
  items: { productId: string; qty: number }[],
  couponCode: string | undefined,
  uid: string
) {
  const snap = await db.getAll(...items.map((i) => db.collection("products").doc(i.productId)));
  const lines = snap.map((doc, idx) => {
    if (!doc.exists) throw new HttpsError("not-found", `Unknown product ${items[idx].productId}`);
    const p = doc.data()!;
    const qty = Math.max(1, Math.min(10, Math.floor(items[idx].qty)));
    const unitPrice = Number(p.salePrice ?? p.price ?? 0);
    return {
      productId: doc.id,
      title: String(p.title),
      platform: String(p.platform),
      unitPrice,
      qty,
      // Keyed SKUs (Game/DLC/Expansion/Gift Card/Subscription) must have stock.
      requiresKey: KEYED_TYPES.has(String(p.productType)),
    };
  });

  const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.qty, 0);

  let discount = 0;
  let appliedCoupon: string | undefined;
  if (couponCode) {
    const cSnap = await db.collection("coupons").doc(couponCode.toUpperCase()).get();
    if (cSnap.exists) {
      const c = cSnap.data()!;
      const expires = new Date(c.expiresAt).getTime();
      const exhausted = c.used >= c.usageLimit;
      if (expires > Date.now() && !exhausted && subtotal >= Number(c.minOrder ?? 0)) {
        const raw =
          c.type === "percentage" ? (subtotal * Number(c.value)) / 100 : Number(c.value);
        discount = Math.min(raw, Number(c.maxDiscount ?? raw));
        appliedCoupon = cSnap.id;
      }
    }
  }

  const taxable = Math.max(0, subtotal - discount);
  const tax = Math.round(taxable * 0.18); // 18% GST
  return {
    items: lines,
    subtotal,
    discount,
    couponCode: appliedCoupon,
    tax,
    total: taxable + tax,
  };
}

/* ---------------------------------------------------------------------------
 * 2. Key allocation — the critical "two buyers must never get the same key" step.
 *    Runs inside a Firestore transaction: read an available key, reserve it,
 *    write it onto the order as sold. Concurrent buyers simply retry and take
 *    the next available key.
 * ------------------------------------------------------------------------- */
async function allocateKeys(
  tx: Transaction,
  orderId: string,
  lines: { productId: string; qty: number }[]
) {
  const issued: { productId: string; key: string; status: "sold" }[] = [];

  for (const line of lines) {
    for (let n = 0; n < line.qty; n++) {
      const q = db
        .collection("digitalKeys")
        .where("productId", "==", line.productId)
        .where("status", "==", "available")
        .limit(1);

      const available = await tx.get(q);
      if (available.empty) {
        throw new HttpsError(
          "failed-precondition",
          `Out of stock: ${line.productId}. A refund will be issued automatically.`
        );
      }

      const keyDoc = available.docs[0];
      tx.update(keyDoc.ref, { status: "sold", orderId, soldAt: FieldValue.serverTimestamp() });
      issued.push({ productId: line.productId, key: keyDoc.data().key, status: "sold" });
    }
  }

  return issued;
}

/* ---------------------------------------------------------------------------
 * 3. verifyRazorpayPayment — called by the client checkout handler after the
 *    Razorpay popup succeeds. Success is decided ONLY by the HMAC signature,
 *    never by the client's "payment done" flag.
 * ------------------------------------------------------------------------- */
export const verifyRazorpayPayment = onCall(CALL_OPTS, async (req) => {
  const uid = requireAuth(req);
  const { orderDocId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.data ?? {};

  if (!orderDocId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    throw new HttpsError("invalid-argument", "Missing payment verification fields.");
  }

  // Constant-time HMAC comparison: order_id + "|" + payment_id signed with the secret.
  const expected = createHmac("sha256", RAZORPAY_KEY_SECRET.value())
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(String(razorpaySignature), "hex");
  const valid = a.length === b.length && timingSafeEqual(a, b);

  const orderRef = db.collection("orders").doc(orderDocId);
  const orderSnap = await orderRef.get();
  if (!orderSnap.exists) throw new HttpsError("not-found", "Order not found.");

  const order = orderSnap.data()!;
  if (order.userId !== uid) throw new HttpsError("permission-denied", "Not your order.");

  if (!valid) {
    await orderRef.update({ paymentStatus: "failed", status: "failed" });
    throw new HttpsError("permission-denied", "Payment signature verification failed.");
  }

  // Idempotency: a retried callback must not hand out a second set of keys.
  if (order.paymentStatus === "paid") {
    return { status: "already-fulfilled", orderId: orderDocId };
  }

  const keys = await db.runTransaction(async (tx) => {
    const fresh = await tx.get(orderRef);
    const data = fresh.data()!;
    if (data.paymentStatus === "paid") return data.keys ?? [];

    const issued = await allocateKeys(
      tx,
      orderDocId,
      (data.items as { productId: string; qty: number }[]).map((i) => ({
        productId: i.productId,
        qty: i.qty ?? 1,
      }))
    );

    tx.update(orderRef, {
      paymentStatus: "paid",
      fulfillmentStatus: "fulfilled",
      status: "fulfilled",
      razorpayPaymentId,
      keys: issued,
      paidAt: FieldValue.serverTimestamp(),
    });

    if (data.couponCode) {
      tx.update(db.collection("coupons").doc(data.couponCode), { used: FieldValue.increment(1) });
    }

    return issued;
  });

  return { status: "fulfilled", orderId: orderDocId, keysDelivered: keys.length };
});

/* ---------------------------------------------------------------------------
 * 4. Order confirmation email (skipped in demo mode — no mail provider
 *    credentials are configured). Wire SendGrid / Mailgun / Mailchimp here.
 * ------------------------------------------------------------------------- */
async function sendKeyEmail(orderId: string) {
  const snap = await db.collection("orders").doc(orderId).get();
  const order = snap.data();
  logger.info("email:queued", { orderId, to: order?.email, keys: order?.keys?.length ?? 0 });
  // TODO(production): provider.send({ to, template: "keys-delivered", data: order })
}

export const onOrderFulfilled = onCall(CALL_OPTS, async (req) => {
  requireAdmin(req);
  const { orderId } = req.data ?? {};
  await sendKeyEmail(orderId);
  return { queued: true };
});

/* ---------------------------------------------------------------------------
 * 5. Admin claims — the ONLY way a user becomes admin. Server-side only.
 * ------------------------------------------------------------------------- */
export const setStaffRole = onCall(async (req) => {
  requireAdmin(req);
  const { uid, role } = req.data ?? {};
  if (!uid || !["admin", "manager", "support"].includes(role)) {
    throw new HttpsError("invalid-argument", "uid and a valid role are required.");
  }
  await getAuth().setCustomUserClaims(uid, { [role]: true });
  await getAuth().revokeRefreshTokens(uid); // forces claim refresh on next token
  return { uid, role };
});


