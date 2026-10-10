<div align="center">

# 🛒 বাজার দর · BazarDor

**আজকের বাজারের দাম এক নজরে** — daily Bangladeshi market prices with price changes and bazar-wise details.

</div>

## About

BazarDor shows today's prices of everyday essentials (rice, lentils, oil, vegetables, fish, meat, eggs, spices) in Bengali.
Visitors can browse prices and trends; signed-in users can open each product to compare min / max / average prices across different bazars.

## Tech stack

| Purpose | Technology |
| --- | --- |
| Framework | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS 4 + daisyUI 5 |
| Auth | BetterAuth (email/password, Google, GitHub) |
| Database | MongoDB |
| Notifications | react-hot-toast |
| Data | `https://api.api-store.workers.dev/api/bazardor` |

## Key features

1. **Live price ticker & trends** – an infinite marquee plus ▲/▼ percentage badges on every product.
2. **Top movers** – the six biggest price risers and fallers of the day on the home page.
3. **Category pages with sorting** – sort by price (low→high / high→low), correct for Bengali numerals.
4. **Protected product details** – bazar-wise min / max / average price table, available after login.
5. **Complete auth flow** – sign up, sign in, Google/GitHub login, profile page and name update, with toasts and skeleton loaders.

## Getting started

```bash
npm install
cp .env.example .env     # then fill in the values
npm run dev
```

Open <http://localhost:3000>.

### Environment variables

| Variable | Description |
| --- | --- |
| `BAZARDOR_API_URL` | Price API endpoint (pre-filled) |
| `MONGODB_URI`, `MONGODB_DB` | MongoDB connection string and database name |
| `BETTER_AUTH_SECRET` | Random secret (`openssl rand -base64 32`) |
| `BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL` | Site URL (`http://localhost:3000` locally, your Vercel URL in production) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Callback: `{URL}/api/auth/callback/google` |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | Callback: `{URL}/api/auth/callback/github` |

A social provider is enabled automatically once both of its keys are set.

## Project structure

```
src/
├─ app/          routes (home, category/[slug], product/[slug], signin, signup, profile, api/auth)
├─ components/   UI pieces (Header, PriceTicker, ProductCard, forms …)
└─ lib/          auth, MongoDB, API mapping (products.ts), Bengali formatting (format.ts)
```

## Deploying to Vercel

Add all environment variables in the project settings and set `BETTER_AUTH_URL` / `NEXT_PUBLIC_APP_URL` to the deployed URL.
All pages are rendered on the server, so reloading `/category/…` or `/product/…` never gives a hard 404.
