# NEXORA GAMES — Premium Digital Game Store

A full-stack digital game storefront (Instant-Gaming-style functionality, 100% original
brand, artwork and data) built with **React + TypeScript + Vite + Tailwind CSS**.

> **DEMO MODE NOTICE** — Firebase, Razorpay and email delivery are **not configured** in
> this environment. Auth, payments and digital-key fulfilment are simulated locally and
> are clearly labelled **DEMO** throughout the UI. No real charges are made and no real
> activation keys are issued. Every integration point is architected so production
> credentials can be dropped in without UI changes (see “Going live” below).

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production bundle (code-split)
npm run preview    # serve the built bundle
```

Optional: `cp .env.example .env` and fill in Firebase / Razorpay public values.

---

## What's implemented (frontend-complete on demo data)

| Area | Status |
| --- | --- |
| Homepage (hero carousel, trending, daily deals + live countdown, pre-orders, release calendar, bestsellers, platforms, genres, reviews, news) | ✅ |
| Catalog `/games` — 8 filter groups, 7 sort options, removable chips, mobile filter drawer, load-more pagination | ✅ |
| Product page — cinematic header, tabbed content, screenshot lightbox, trailer placeholder, min/rec system requirements, FAQ, related products, JSON-LD | ✅ |
| Product cards — hover elevation, artwork zoom, quick-add, wishlist heart animation | ✅ |
| Slide-out cart + cart page (subtotal / discount / coupon / GST / total) with persistence | ✅ |
| Wishlist with price-drop highlighting | ✅ |
| 4-step checkout (customer → review → payment → confirmation), **demo** payment | ✅ |
| Digital key delivery: demo fulfilment → **View key / Copy key** + redemption instructions in `/account/library` | ✅ |
| Auth: register, login, Google (demo), forgot password, verification, logout, settings | ✅ |
| Account dashboard: profile, orders, library, reviews, coupons, support tickets, settings | ✅ |
| Support centre: FAQs + ticket categories with admin replies | ✅ |
| Search: overlay (recent/popular/categories/autocomplete) + full search page grouped by product type | ✅ |
| Admin `/admin`: dashboard charts, products CRUD, orders, key inventory + bulk import, coupons, deals, review moderation, support inbox, homepage/news, settings | ✅ |
| SEO: dynamic titles, descriptions, Open Graph, canonical URLs, product JSON-LD, breadcrumbs | ✅ |
| Responsive 360→1920px: bottom nav, hamburger drawer, filter drawer, rails, touch targets | ✅ |
| Framer Motion: transitions, drawers, carousels, skeletons, toasts, `prefers-reduced-motion` | ✅ |
| Empty / loading / error / success states on every major flow | ✅ |

**Demo data:** 33 fictional games + DLC / expansion / gift-card / subscription SKUs,
12 genres, 4 platforms, 10 live deals, 8 pre-orders, 12 reviews, 5 articles, 4 coupons.
All artwork is **procedurally generated original SVG** (`src/lib/artwork.ts`) — no
copyrighted assets are used anywhere.

---

## Tech stack

- **Frontend:** React 18, TypeScript (strict), Vite 5, Tailwind CSS 3, Framer Motion, Lucide
- **State:** React Context (auth / store / orders) + module store for coupons; localStorage persistence
- **Backend (architected, not configured):** Firebase Auth, Firestore, Storage, Cloud Functions
- **Payments (architected, not configured):** Razorpay (INR), abstraction ready for Stripe/PayPal
- **Deployment:** Firebase Hosting (`dist/`), routes code-split with `React.lazy`

UI primitives follow shadcn/ui conventions but are hand-rolled (Button, Badge, Rating,
Skeleton, EmptyState, Toaster) to avoid pulling CLI dependencies not in the lockfile.

---

## Project structure

```
src/
├── components/
│   ├── layout/      Header, Footer, Layout, MobileNav, SearchOverlay, CartDrawer…
│   ├── ui/          Button, Badge, Rating, Skeleton, EmptyState, Toaster
│   ├── product/     ProductCard, ProductRail
│   ├── home/        HeroCarousel, DealsSection, PreorderSection, ReleaseCalendar…
│   ├── catalog/     FilterPanel, FilterDrawer, ActiveChips
│   ├── detail/      DetailHero, Gallery(lightbox), SpecsTable, ReviewsBlock, FAQ…
│   ├── checkout/    Stepper, StepsA/B, CheckoutSummary
│   ├── auth/        AuthCard
│   └── admin/       ProductForm
├── pages/           One file per route (storefront, account/, admin/, auth/)
├── context/         AuthContext · StoreContext · OrdersContext
├── data/            products (6 modules), deals, reviews, articles, coupons, catalog
├── hooks/           useCountdown · usePageSeo · useCoupon
├── lib/             artwork (procedural SVG), pricing, filtering, structured (JSON-LD),
│                    firebase (config detection), storage, utils
├── types.ts         Shared domain model
├── functions/
│   └── src/index.ts Cloud Functions: payment order, signature verification,
│                    atomic key allocation, staff claims, email hook
firestore.rules      Firestore security rules (reference implementation)
firestore.indexes.json  Composite indexes the queries above require
firebase.json        Hosting (SPA rewrite + asset caching), rules, functions
```

---

## Going live (production architecture)

### 1. Firebase
1. Create a project; enable **Auth** (Email/Password + Google), **Firestore**, **Storage**, **Functions**.
2. Copy `.env.example` → `.env`, fill the public web config (`VITE_FIREBASE_*`).
3. `npm i firebase` and uncomment the init block in `src/lib/firebase.ts`
   (`isFirebaseConfigured` flips to `true`, demo banners disappear).
4. Deploy `firestore.rules` (`firebase deploy --only firestore:rules`).

### 2. Payments (Razorpay, modular for Stripe/PayPal)
Flow implemented in `OrdersContext.placeOrder` as a **simulation** of the real one:

```
Client → Cloud Function createPaymentOrder (Razorpay orders.create, amount in paise)
       ← order_id + VITE_RAZORPAY_KEY_ID (publishable only)
Client → Razorpay Checkout popup
       → Cloud Function verifyPayment:
            • HMAC-SHA256(order_id + "|" + razorpay_payment_id, KEY_SECRET) === signature
            • KEY_SECRET lives ONLY in Functions config — never in the bundle
```

Never trust the client's “payment succeeded” state — the storefront only marks an order
fulfilled after the backend verification callback.

### 3. Digital key fulfilment (never expose unused keys)
Reference implementation in `functions/src/index.ts`:

1. verify payment signature
2. `db.runTransaction`: read `digitalKeys` where `productId` + `status == "available"`,
   limit 1 → set `status: "reserved"`, `orderId`
3. update order → `fulfilled`, key → `sold`
4. `onCreate` trigger emails the key (SendGrid/Mailgun) — skipped in demo

Rules guarantee clients **cannot read** `digitalKeys` at all (see `firestore.rules`);
only the Function (Admin SDK) touches them, so two buyers can never receive the same key.

### 4. Admin authorization
Custom claims (`admin`, `manager`, `support`) set via the Admin API. Every admin
Cloud Function re-checks `context.auth.token.admin === true`. Client-side nav hiding is
cosmetic only — never a security boundary.

### 5. Email
Functions send purchase confirmations, verification and reset mails once an SMTP/API
provider is configured. Without it the app runs silently (demo labels shown).

---

## Localization & currency

- Currency: **INR ₹** via `Intl.NumberFormat('en-IN')` in `lib/utils.ts` — swap the
  formatter to add USD/EUR.
- Languages architected for **English / हिन्दी / മലയാളം** — the account settings language
  picker is live; translation dictionaries plug into it.

---

## Deployment (Firebase Hosting)

```bash
npm run build
firebase init hosting   # public dir: dist, SPA rewrite: yes
firebase deploy --only hosting,functions,firestore:rules
```

---

## Verification performed

- `tsc -p tsconfig.app.json --noEmit` → clean (strict mode)
- `npm run build` → succeeds; vendor / motion / per-route chunks split (initial JS ≈ 103 kB + vendor)
- Headless Edge smoke test of all 16 routes (`/`, `/games`, `/game/:slug`, `/deals`,
  `/pre-orders`, `/upcoming`, `/search`, `/wishlist`, `/cart`, `/checkout`, `/login`,
  `/register`, `/account`, `/admin`, `/news`, `/support`, 404) — every page renders its
  expected content with no missing sections and no page-level console errors.
- `functions/`: `npm i && npx tsc --noEmit -p tsconfig.json` → clean, against the real
  `firebase-admin` / `firebase-functions` / `razorpay` typings (server code is not part of
  the storefront bundle, so it is typechecked separately).
- Data integrity: 37 SKUs (33 Games + DLC / Expansion / Gift Card / Subscription),
  10 deals, 12 reviews, 5 articles, 4 coupons, 12 genres — all referenced product ids
  resolve against the catalog.

### Browser automation note
Google Chrome is not installed on this machine and the Chrome DevTools MCP server
requires it, so full click-through verification was done with headless Edge
(`msedge --headless=new --dump-dom`) instead. Deep interactive flows (add to cart,
coupon apply, checkout steps, key reveal) were verified by code review plus the
locally-persisted demo data model; add Chrome (or Edge's CDP endpoint) to run them
programmatically.


