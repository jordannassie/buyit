# Selli

**Sell anything in minutes.** Create one clean page for your product or offer, connect Stripe, and start getting paid.

---

## Tech Stack

- **Next.js 16** — App Router, TypeScript
- **Tailwind CSS** — utility-first styling
- **Supabase** — auth, database, file storage
- **Stripe** — payments, subscriptions, billing portal
- **Netlify** — hosting and deployment

---

## Setup Guide

### 1. Clone and install

```bash
git clone <your-repo-url>
cd buyit
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Open the **SQL Editor** and run the entire contents of `supabase/schema.sql`.
   - This creates all tables, RLS policies, triggers, storage buckets, and indexes.
3. In your Supabase project → **Settings → API**, copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`
4. In **Authentication → URL Configuration**, add your domain to **Redirect URLs**:
   - `http://localhost:3000/**` (local)
   - `https://your-site.netlify.app/**` (production)

### 3. Set up Stripe

#### 3a. Get API keys
1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Copy your **Secret key** → `STRIPE_SECRET_KEY`
3. Copy your **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

#### 3b. Create Selli subscription plans
1. In Stripe → **Products**, create two products:
   - **Selli Starter** — $19/month recurring → copy the Price ID → `STRIPE_STARTER_PRICE_ID`
   - **Selli Pro** — $49/month recurring → copy the Price ID → `STRIPE_PRO_PRICE_ID`
2. Set the same values for the `NEXT_PUBLIC_` versions (used for display only).

#### 3c. Set up Stripe webhook (manual step required)
1. In Stripe → **Developers → Webhooks**, click **Add endpoint**
2. Endpoint URL: `https://your-domain.netlify.app/api/webhooks/stripe`
3. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Copy the **Signing secret** → `STRIPE_WEBHOOK_SECRET`

> **Local development:** Use [Stripe CLI](https://stripe.com/docs/stripe-cli) to forward webhooks:
> ```bash
> stripe listen --forward-to localhost:3000/api/webhooks/stripe
> ```
> The CLI prints a webhook secret — use that for `STRIPE_WEBHOOK_SECRET` locally.

#### 3d. Enable Stripe Billing Portal
1. In Stripe → **Settings → Billing → Customer portal**, configure and save the portal settings.
   This is required for the "Manage Billing" button to work.

### 4. Configure environment variables

Copy `.env.example` to `.env.local` and fill in all values:

```bash
cp .env.example .env.local
```

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Netlify Deployment

### Automatic (from dashboard)
1. Push your code to GitHub.
2. Connect your GitHub repo in [Netlify](https://netlify.com).
3. Set all environment variables in **Site settings → Environment variables**.
4. Deploy. Netlify uses `netlify.toml` automatically.

### Manual (CLI)
```bash
netlify deploy --prod
```

### Required environment variables in Netlify
Set all variables from `.env.example` in your Netlify site dashboard under:
**Site configuration → Environment variables**

---

## Project Structure

```
src/
├── app/
│   ├── (marketing)/          # Public marketing pages
│   │   ├── page.tsx          # Homepage
│   │   ├── pricing/          # Pricing page
│   │   └── demo/             # Demo page
│   ├── (auth)/               # Auth pages (login, signup)
│   ├── dashboard/            # Protected seller dashboard
│   │   ├── products/         # Product list + builder
│   │   ├── orders/           # Orders table
│   │   ├── files/            # File delivery overview
│   │   ├── billing/          # Selli subscription management
│   │   └── settings/         # Seller settings
│   ├── p/[slug]/             # Public sell page
│   ├── success/              # Post-checkout success page
│   └── api/
│       ├── checkout/         # Stripe checkout session creation
│       ├── webhooks/stripe/  # Stripe webhook handler
│       ├── download/[token]/ # Secure file delivery
│       ├── billing-portal/   # Stripe billing portal
│       └── products/stripe/  # Create Stripe products/prices
├── components/
│   ├── ui/                   # Reusable base components
│   ├── marketing/            # Nav, footer
│   └── dashboard/            # Sidebar, product form
├── lib/
│   ├── supabase/             # Supabase client/server/middleware
│   ├── stripe.ts             # Stripe client + plan config
│   └── utils.ts              # Helpers
└── types/                    # TypeScript types
supabase/
└── schema.sql                # Full DB schema + RLS + storage
```

---

## How it works end-to-end

1. **Seller signs up** → Supabase creates account + profile row
2. **Seller creates product** → form uploads files to Supabase Storage, creates Stripe product/price, saves to `products` table
3. **Public sell page** `/p/[slug]` — fetches published product, shows buy button
4. **Buyer clicks buy** → `/api/checkout` creates Stripe Checkout Session → redirect to Stripe
5. **Stripe processes payment** → fires `checkout.session.completed` webhook
6. **Webhook** `/api/webhooks/stripe` → creates `orders` row + `downloads` row (if digital)
7. **Success page** `/success?session_id=...` → shows confirmation + download button
8. **Download** `/api/download/[token]` → validates token, generates signed Supabase Storage URL (60s), redirects

---

## Selli Plans

| Feature | Starter ($19/mo) | Pro ($49/mo) |
|---------|-----------------|--------------|
| Products | 1 | 5 |
| Custom sell page | ✓ | ✓ |
| Stripe checkout | ✓ | ✓ |
| File delivery | ✓ | ✓ |
| Order dashboard | ✓ | ✓ |
| Custom branding | — | ✓ |
| Priority support | — | ✓ |

---

## Key Notes

- Stripe takes its standard processing fee (~2.9% + 30¢). Selli keeps 0% of seller revenue.
- File download links expire after 24 hours for security.
- The `SUPABASE_SERVICE_ROLE_KEY` is server-only — never expose it to the client.
- Stripe webhook signature verification is required in production.
