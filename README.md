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

1. Connect repo: `https://github.com/EllinesTech/Ellines-Tech-Website.git`
2. Build command: `npm run build`
3. Output directory: `dist`
4. Custom domain: `tech.ellines.co.ke`

SPA routing is handled via `public/_redirects`.

## Brand

- Site name: **Ellines Tech**
- Domain: `tech.ellines.co.ke`
- Logos: `public/logos/` (sourced from `/Logo`)

## License

Proprietary — © Ellines Tech
