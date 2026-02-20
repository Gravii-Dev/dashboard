# Data Pipelines for Gravii Dashboard

"Data pipeline" is the standard term for the path data takes from **sources → ingestion/processing → storage → API → UI**. Below is what each part of the dashboard needs and where that data typically comes from.

---

## 1. Overview

| Data shown | Pipeline (source → processing → API → UI) |
|------------|-------------------------------------------|
| **TVL (Stables / Tokens)** | On-chain balances or internal portfolio DB → aggregate by asset type (stables vs tokens) → API (e.g. `GET /overview/tvl`) → donut charts |
| **TIV (Stables / Tokens)** | Same as TVL but "idle" only (exclude staked/lent/LP) → aggregate → API (e.g. `GET /overview/tiv`) → donuts |
| **Value by chain (TVL/TIV)** | Balances by chain (Ethereum, BSC, Base, etc.) + asset breakdown → aggregate per chain → API → bar sections |
| **Avg monthly trading volume, tx count, payment amount/count** | Transaction/payment events → aggregate per wallet (e.g. 30d) → API (e.g. `GET /overview/kpis`) → KPI cards |
| **Active wallets (7d), traders, protocol users, cross-chain** | Activity events (wallets, txs, protocols, chains) → count/unique → API → KPI cards |
| **Top 3 protocols, funding sources** | Protocol attribution + funding source (CEX/bridge/etc.) → rank/top-N → API → tag lists |
| **Net NFT worth, Sybil rate** | NFT valuation service + risk engine output → sum + rate → API → KPI cards |

**Typical stack:** Chain indexers / internal DB → aggregation jobs or real-time queries → REST or tRPC → dashboard.

---

## 2. Risk & Sybil

| Data shown | Pipeline |
|------------|----------|
| **Risk level distribution (donut)** | Risk/Sybil engine scoring → count by level (critical/high/medium/low) → API (e.g. `GET /risk/summary`) → donut |
| **Total analyzed, flagged rate, avg entropy** | Same engine → aggregates → API → mini KPIs |
| **Top flagged chains** | Risk scores by chain → % or count per chain → API → bar list |
| **Sybil clusters** | Cluster detection (graph/similarity) → cluster list + metadata → API (e.g. `GET /risk/clusters`) → cluster cards |
| **Flagged wallets table** | Flagged wallet list + risk level, cluster, time → API (e.g. `GET /risk/flagged`) with filters/sort → table |

**Typical stack:** Risk/Sybil engine (batch or streaming) → DB or cache → API → dashboard; optional real-time updates.

---

## 3. User Segments (Labels)

| Data shown | Pipeline |
|------------|----------|
| **Segment list (name, users, %, threshold, chains, avgBal, txFreq, retention)** | Segment definitions (rules) + user/behavior DB → compute membership and aggregates per segment → API (e.g. `GET /segments` or `GET /labels`) → label cards |
| **Filtered results (chains, assets, selected labels)** | Same segments + filters → recompute counts and aggregates (or pre-aggregated views) → API (e.g. `GET /segments?chains=...&labels=...`) → summary cards and counts |

**Typical stack:** User/event DB + segment rules → batch or real-time segment assignment → aggregation → API → UI (filters applied in API or client).

---

## 4. User Analytics

| Data shown | Pipeline |
|------------|----------|
| **Total users, avg portfolios (stables, native, other), avg TIV** | User/portfolio DB → aggregates (and optionally by chain) → API (e.g. `GET /analytics/summary`) → top KPI row |
| **Group metrics (Top 5%, 5–20%, etc.)** | Percentile or cohort definition → aggregate metrics per group (portfolio, DeFi, NFT, gas, trading, activity) → API (e.g. `GET /analytics/cohorts` or by group) → group pills + all metric cards |
| **Chain filter** | Same data keyed by chain or filter applied in API → API (e.g. `GET /analytics?chain=eth`) → chain tabs |

**Typical stack:** User/portfolio/transaction DB → cohort/percentile logic → aggregation (batch or query) → API → dashboard.

---

## 5. Campaigns

| Data shown | Pipeline |
|------------|----------|
| **Campaign list (partner, name, type, status, target, dates)** | Campaigns DB or CMS → API (e.g. `GET /campaigns`) → campaign cards |
| **Create/update campaign** | Form submit → API (e.g. `POST /campaigns`, `PATCH /campaigns/:id`) → campaigns service → DB → list refresh |
| **Estimated reach** | Target segments + audience size service → API (e.g. `POST /campaigns/estimate-reach` or embedded in create) → "Estimated reach" in form |

**Typical stack:** Campaigns API + DB; optionally audience/segment service for reach estimates.

---

## Summary (one-line per area)

| Area | Pipeline in one line |
|------|----------------------|
| **Overview** | Balances + txs + activity + risk/NFT outputs → aggregates → API → donuts, bars, KPIs |
| **Risk** | Risk/Sybil engine → counts, clusters, flagged list → API → donut, clusters, table |
| **Labels** | Segment rules + user DB → segment membership + aggregates → API → cards + filters |
| **Analytics** | User/portfolio/tx DB → cohort aggregates → API → summary + group metrics |
| **Campaigns** | Campaigns DB + optional audience service → CRUD API → list + form |

Yes, **"data pipeline"** is the right, widely used term for this end-to-end data flow (from sources to the UI).
