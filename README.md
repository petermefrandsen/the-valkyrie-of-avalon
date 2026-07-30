# The Valkyrie of Avalon - Artisan E-Commerce Webshop

A custom e-commerce webshop built for **The Valkyrie of Avalon** independent craft business using **Next.js (App Router)** and **Stripe**.

---

## 🌟 Key Features

- **Stripe Single Source of Truth**: Products, pricing, photos, and stock levels synced dynamically from Stripe API. No monthly platform fees (Shopify/WooCommerce).
- **Automated Webhook Inventory Sync**: Orders placed through Stripe Hosted Checkout trigger webhook order processing (`/api/webhook`), automatically decrementing product metadata stock counts.
- **Location-Based Worldwide Shipping**: Stripe Checkout configured with address collection and country-specific shipping rates.
- **Client-Side Basket**: Persisted in `localStorage` with batch stock limit capping and slide-over basket drawer.
- **Light & Dark Theme Switcher**: Styled with the official Valkyrie dragon medallion emblem logo and high-contrast color design system.
- **Mobile Responsive**: Responsive across all screen sizes (phones, tablets, desktop).

---

## 🛠️ Environments & Deployments

- **Production (`main` branch)**: Connected to Stripe Live Production Keys.
- **Staging (`staging` branch)**: Connected to Stripe Test Keys for safe preview testing.

---

## 🚀 Getting Started

### 1. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 2. Connect Your Stripe Account
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Add your Stripe API Keys from your [Stripe Dashboard](https://dashboard.stripe.com):
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
