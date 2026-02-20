# Gravii Dashboard (Next.js)

This project is the Next.js App Router port of the original single-file HTML dashboard.

**Language:** All documentation and in-app copy are in English. Use English only for new text, comments, and docs.

## Getting started

Package manager: **Bun**

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000); you will be redirected to `/dashboard`.

## Routes

- **`/`** → redirects to `/dashboard`
- **`/dashboard`** — Overview (TVL/TIV donuts, value-by-chain bar charts, KPI cards)
- **`/dashboard/analytics`** — User Analytics (chain tabs, group metrics)
- **`/dashboard/labels`** — User Segments (By Behavior / By Value, label filters & summary)
- **`/dashboard/risk`** — Risk & Sybil (risk donut, clusters, flagged table)
- **`/dashboard/campaigns`** — Campaign Launch Manager (campaign list + create form)

## Tech stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Original design kept (CSS variables and classes live in `src/app/globals.css`)

## Key files

| Path | Description |
|------|-------------|
| `src/app/layout.tsx` | Root layout, Outfit / Space Mono fonts |
| `src/app/dashboard/layout.tsx` | Sidebar + main content area |
| `src/components/dashboard/Sidebar.tsx` | Navigation sidebar (client) |
| `src/components/dashboard/DonutCard.tsx` | Donut chart card component |
| `src/lib/labels-data.ts` | User Segments label data |

The original single-page “page switching” (via `data-page` toggles) is now route-based; the sidebar uses `next/link` and `usePathname()` for the active state.
