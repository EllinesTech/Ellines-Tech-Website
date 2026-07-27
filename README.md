# Ellines Tech Website 

Official digital headquarters for **Ellines Tech** — live at [tech.ellines.co.ke](https://tech.ellines.co.ke).

## Tech Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- React Router 7
- Framer Motion

## Local Development

Port **5174** (5173 is reserved for Ellines Haven).

Frontend-only (no CMS / `/api`):

```bash
npm install
npm run dev
```

**Full stack** (static site + Pages Functions + local KV for CMS):

```bash
npm run build
npm run preview:full
```

Open [http://localhost:5174](http://localhost:5174). This serves `dist` and `/api/cms` together via Wrangler with local KV (`ET_STORE`). Chat AI uses the built-in fallback locally unless Workers AI is bound in the Cloudflare dashboard.

**Vite HMR + CMS API** (two processes — Vite proxies `/api` → `:8788`):

```bash
npm run build          # once (or after API/functions changes)
npm run dev:stack      # or: terminal A `npm run dev:api`, terminal B `npm run dev`
```

| Script | What it does |
|--------|----------------|
| `dev` | Vite only on `:5174` |
| `dev:api` | Wrangler Functions + KV on `:8788` (needs `dist`) |
| `dev:stack` | Build, then API + Vite together |
| `preview` | Vite preview only (proxies `/api` if `dev:api` is up) |
| `preview:full` | Recommended local preview — Wrangler on `:5174` with CMS |
| `dev:full` | `build` + `preview:full` |

Production: bind Workers AI as `AI` in the Pages project dashboard if you want live `/api/ai` (optional — fallback replies work without it).

## Build

```bash
npm run build
npm run preview:full
```

## Cloudflare Pages

Project: `ellines-tech-website` (Direct Upload). Pushes to `main` deploy via GitHub Actions (`.github/workflows/deploy-pages.yml`) — no manual Wrangler required once secrets are set.

**GitHub Actions secrets (repo → Settings → Secrets and variables → Actions):**

| Secret | Purpose |
|--------|---------|
| `CLOUDFLARE_API_TOKEN` | API token with **Cloudflare Pages — Edit** |
| `CLOUDFLARE_ACCOUNT_ID` | Account id from the Cloudflare dashboard |
| `VITE_GA_MEASUREMENT_ID` | Optional GA4 id (`G-…`) — baked into the client build |
| `VITE_GOOGLE_SITE_VERIFICATION` | Optional Search Console meta verification content |
| `VITE_BOOKING_URL` | Optional Cal.com / Calendly URL (else WhatsApp booking) |
| `VITE_SENTRY_DSN` | Optional Sentry browser DSN |

**Pages production env vars** (dashboard → Settings → Environment variables; see `.env.example`):

- Required: `ADMIN_API_KEY`
- Email: `RESEND_API_KEY` (optional `RESEND_FROM`)
- Paystack: `PAYSTACK_SECRET_KEY` (optional `PAYSTACK_WEBHOOK_SECRET`, `PAYSTACK_HUB_ORIGIN`)
- Notify: `LEADS_NOTIFY_EMAIL` / `ORDERS_NOTIFY_EMAIL` (`tech@ellines.co.ke`), `CAREERS_NOTIFY_EMAIL`

Custom domains: `ellines.co.ke`, `www.ellines.co.ke`, `tech.ellines.co.ke`. SPA routing: `public/_redirects`.

**After deploy — Search / local trust (ops):**

1. [Google Search Console](https://search.google.com/search-console) → add `https://tech.ellines.co.ke` → HTML tag verification → put the content value in `VITE_GOOGLE_SITE_VERIFICATION` → redeploy → submit `sitemap.xml`
2. [Google Analytics](https://analytics.google.com) → create GA4 property → put Measurement ID in `VITE_GA_MEASUREMENT_ID` → redeploy
3. [Google Business Profile](https://business.google.com) → claim Nyeri (and Nairobi if applicable) with `tech.ellines.co.ke` + `info@ellines.co.ke`

**Optional later — native Git connect (dashboard OAuth only):** Workers & Pages → `ellines-tech-website` → Settings → Builds → Connect to Git → `EllinesTech/Ellines-Tech-Website` → branch `main`, build `npm run build`, output `dist`. Then disable the Actions workflow to avoid double deploys. (API cannot attach Git to an existing Direct Upload project.)

## Brand

- Site name: **Ellines Tech**
- Domain: `tech.ellines.co.ke`
- Logos: `public/logos/` (sourced from `/Logo`)

## License

Proprietary — © Ellines Tech
