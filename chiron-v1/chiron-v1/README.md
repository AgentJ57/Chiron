# Chiron — Setup & Deployment Guide

## Project Structure

```
chiron-v1/
├── server.js          ← Express server + Mailchimp endpoint
├── package.json
├── vite.config.js
├── render.yaml        ← One-click Render config
├── index.html         ← PWA entry point
├── public/
│   ├── manifest.json  ← PWA manifest
│   ├── sw.js          ← Service worker
│   └── icons/         ← Add your app icons here (see below)
└── src/
    ├── main.jsx
    └── App.jsx        ← Full Chiron application
```

---

## Before You Deploy

### 1. Add App Icons

Create a `/public/icons/` folder and add:
- `icon-192.png` — 192×192px
- `icon-512.png` — 512×512px
- `favicon.svg` — Simple SVG favicon

**Quick option:** Use [Favicon.io](https://favicon.io) to generate all sizes from text or an image.

Use the gold `#C9A84C` on dark `#0C0B09` background — matches the brand.

### 2. Get Your Mailchimp Credentials

1. Log into Mailchimp
2. **API Key:** Account → Extras → API Keys → Create A Key
3. **List ID (Audience ID):** Audience → All Contacts → Settings → Audience name and defaults → Audience ID
4. Note the datacenter suffix in your API key (e.g., `xxxxxxxx-us21` → datacenter is `us21`)

### 3. Add a Booking Link

In `App.jsx`, search for `Book a Strategy Call →` and replace the button's `onClick` with:
```jsx
onClick={() => window.open('YOUR_CALENDLY_OR_BOOKING_URL', '_blank')}
```

### 4. Wire Up Stripe (Phase 3)

In `App.jsx`, the `purchaseModule()` and `purchaseBundle()` functions currently simulate purchases.
Replace with Stripe Checkout or Payment Links when ready.

---

## Deploy to Render

### Option A — render.yaml (recommended)
1. Push this entire folder to a GitHub repo
2. Go to [render.com](https://render.com) → New → Blueprint
3. Connect your GitHub repo
4. Render reads `render.yaml` automatically

### Option B — Manual
1. Push to GitHub
2. Render → New Web Service → Connect repo
3. **Build Command:** `npm install && npm run build`
4. **Start Command:** `node server.js`
5. **Environment:** Node

### Set Environment Variables in Render Dashboard
| Variable | Value |
|----------|-------|
| `MAILCHIMP_API_KEY` | Your full Mailchimp API key |
| `MAILCHIMP_LIST_ID` | Your Mailchimp Audience ID |
| `STRIPE_SECRET_KEY` | From Stripe Dashboard → Developers → API Keys |
| `STRIPE_WEBHOOK_SECRET` | From Stripe Dashboard → Webhooks (optional for V1) |
| `BASE_URL` | Your Render URL e.g. `https://chiron.onrender.com` |
| `NODE_ENV` | `production` |

### Stripe Setup (5 minutes)
1. Create a [Stripe account](https://stripe.com) if you don't have one
2. Go to Developers → API Keys → copy your **Secret key** (starts with `sk_live_` or `sk_test_` for testing)
3. Add `STRIPE_SECRET_KEY` to Render env vars
4. Add `BASE_URL` as your Render deployment URL (needed for success/cancel redirects)
5. **Test first:** Use `sk_test_` key and Stripe's test card `4242 4242 4242 4242` before going live

---

## Local Development

```bash
npm install

# Terminal 1 — Express server
node server.js

# Terminal 2 — Vite dev server (proxies /api to Express)
npm run dev
```

The Vite proxy in `vite.config.js` routes `/api` calls to `localhost:3000` during development.

---

## What's Simulated (Needs Real Integration)

| Feature | Status | What to do |
|---------|--------|------------|
| Email capture | ✅ Live (Mailchimp) | Done |
| Module purchases | 🔲 Simulated | Add Stripe |
| Phil chat | ✅ Live (Anthropic API) | Done |
| Booking CTA | 🔲 Placeholder | Add Calendly URL |

---

## Phase Checklist

- [x] Phase 1 — All 6 modules written
- [x] Phase 2 — Mailchimp email capture
- [x] Phase 2b — PWA manifest, service worker, install prompt
- [x] Phase 3 — Stripe payments (module + bundle)
- [ ] Phase 4 — Mobile polish + meta tags
- [ ] Phase 5 — Deploy + custom domain

## Stripe Test Cards

| Card | Result |
|------|--------|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 9995` | Decline |

Use any future expiry date and any 3-digit CVC.
