/* ---------------------------------------------------------------------------
 * Firebase bootstrap.
 *
 * This module detects whether real Firebase credentials are present in the
 * environment. In this development environment NO credentials are configured,
 * so the app runs in DEMO MODE: auth, orders and key fulfilment are simulated
 * locally and clearly labelled as demo throughout the UI.
 *
 * To go live:
 *   1. Create a Firebase project, enable Auth (Email/Password + Google),
 *      Firestore, Storage and Functions.
 *   2. Fill .env (copy of .env.example) with the public web config values.
 *   3. `npm i firebase` and uncomment the init block below.
 *   4. Deploy firestore.rules / functions (see README) — NEVER ship admin
 *      credentials or Razorpay secrets in this bundle.
 * ------------------------------------------------------------------------- */

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
);

export const isDemoMode = !isFirebaseConfigured;

export const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID as string | undefined;

/* Example of the real init (kept unshipped until credentials exist):
 *
 * import { initializeApp } from "firebase/app";
 * import { getAuth } from "firebase/auth";
 * import { getFirestore } from "firebase/firestore";
 * export const app = initializeApp(firebaseConfig);
 * export const auth = getAuth(app);
 * export const db = getFirestore(app);
 */
