# Gravii Dashboard — API Specification

> **Version**: 0.1.0 (Draft)
> **Last Updated**: 2026-02-26
> **Status**: Initial draft based on frontend mockup — subject to backend team review

---

## Table of Contents

1. [Common](#1-common)
2. [Overview API](#2-overview-api)
3. [Analytics API](#3-analytics-api)
4. [Labels API](#4-labels-api)
5. [Risk API](#5-risk-api)
6. [Campaigns API](#6-campaigns-api)
7. [Data Models Appendix](#7-data-models-appendix)

---

## 1. Common

### Base URL

```
https://api.gravii.io/v1
```

Development: `http://localhost:3001/api`

### Authentication

> **TBD** — Authentication method to be decided. Evaluating Clerk / Supabase Auth / NextAuth.
>
> All endpoints assume authenticated access only.
> Once finalized, the `Authorization` header format will be documented here.

### Standard Response Format

**Success Response**

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "requestId": "req_abc123",
    "timestamp": "2026-02-26T10:00:00Z"
  }
}
```

**Paginated Response** (for list queries)

```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  },
  "meta": { ... }
}
```

**Error Response**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid chain parameter",
    "details": [
      { "field": "chain", "message": "Must be one of: eth, base, arb, bsc, poly, avax, hl, kaia, sol" }
    ]
  },
  "meta": { ... }
}
```

### Error Codes

| HTTP Status | Code | Description |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Request parameter validation failed |
| 401 | `UNAUTHORIZED` | Authentication failed |
| 403 | `FORBIDDEN` | Insufficient permissions |
| 404 | `NOT_FOUND` | Resource not found |
| 429 | `RATE_LIMITED` | Rate limit exceeded |
| 500 | `INTERNAL_ERROR` | Internal server error |

### Enum Types

**Chain**

```
eth | base | arb | bsc | poly | avax | hl | kaia | sol
```

| Key | Label |
|---|---|
| `eth` | Ethereum |
| `base` | Base |
| `arb` | Arbitrum |
| `bsc` | BSC |
| `poly` | Polygon |
| `avax` | Avalanche |
| `hl` | Hyperliquid |
| `kaia` | Kaia |
| `sol` | Solana |

**AssetType**

```
stables | native | others
```

**RiskLevel**

```
critical | high | medium | low
```

**CampaignStatus**

```
draft | live | ended
```

**CampaignType**

```
Airdrop | Yield Boost | Cashback | Staking Reward | Fee Discount | Referral Bonus | Loyalty Reward | Early Access | Custom
```

**SybilTolerance**

```
strict | moderate | relaxed
```

**UserGroup** (Analytics percentile)

```
top5 | top20 | top50 | bottom50
```

| Key | Label | Range |
|---|---|---|
| `top5` | Top 5% | Upper 0–5% |
| `top20` | Top 5–20% | Upper 5–20% |
| `top50` | Top 20–50% | Upper 20–50% |
| `bottom50` | Bottom 50% | Lower 50% |

---

## 2. Overview API

Returns all summary data needed for the main dashboard page in a single endpoint.

### `GET /overview/summary`

Combines all dashboard sections into one response to minimize network requests.

**Query Parameters**: None

**Response**

```json
{
  "success": true,
  "data": {
    "deployedAssets": {
      "stables": {
        "total": "$2,847",
        "segments": [
          { "label": "USDC", "percentage": 50, "colorKey": "chart-1" },
          { "label": "USDT", "percentage": 30, "colorKey": "chart-2" },
          { "label": "DAI", "percentage": 14, "colorKey": "chart-3" },
          { "label": "Others", "percentage": 6, "colorKey": "chart-4" }
        ]
      },
      "tokens": {
        "total": "$1,923",
        "segments": [
          { "label": "ETH", "percentage": 40, "colorKey": "chart-5" },
          { "label": "BNB", "percentage": 30, "colorKey": "chart-6" },
          { "label": "LINK", "percentage": 20, "colorKey": "chart-1" },
          { "label": "Others", "percentage": 10, "colorKey": "chart-3" }
        ]
      }
    },
    "availableAssets": {
      "stables": {
        "total": "$1,124",
        "segments": [
          { "label": "USDC", "percentage": 45, "colorKey": "chart-2" },
          { "label": "USDT", "percentage": 30, "colorKey": "chart-4" },
          { "label": "DAI", "percentage": 16, "colorKey": "chart-1" },
          { "label": "Others", "percentage": 9, "colorKey": "chart-6" }
        ]
      },
      "tokens": {
        "total": "$682",
        "segments": [
          { "label": "ETH", "percentage": 40, "colorKey": "chart-3" },
          { "label": "BNB", "percentage": 25, "colorKey": "chart-5" },
          { "label": "MATIC", "percentage": 20, "colorKey": "chart-2" },
          { "label": "Others", "percentage": 15, "colorKey": "chart-4" }
        ]
      }
    },
    "chainDistribution": {
      "deployed": [
        {
          "chain": "eth",
          "label": "Ethereum",
          "userCount": 188,
          "percentage": 38,
          "breakdown": [
            { "type": "stables", "percentage": 55 },
            { "type": "native", "percentage": 30 },
            { "type": "others", "percentage": 15 }
          ]
        }
      ],
      "available": [
        {
          "chain": "eth",
          "label": "Ethereum",
          "userCount": 188,
          "percentage": 38,
          "breakdown": [
            { "type": "stables", "percentage": 50 },
            { "type": "native", "percentage": 30 },
            { "type": "others", "percentage": 20 }
          ]
        }
      ]
    },
    "kpis": {
      "avgMonthlyTradingVolume": 12010,
      "avgMonthlyTxCount": 72,
      "avgMonthlyPaymentAmount": 2327,
      "avgMonthlyPaymentCount": 32,
      "activeWallets7d": 301012,
      "activeTraders7d": 12010,
      "activeProtocolUsers": 8001,
      "crossChainUsers": 1777
    },
    "insights": {
      "topProtocols": ["Pendle Finance", "Pendle Finance", "Curve"],
      "topFundingSources": ["Binance", "OKX", "Bybit"],
      "netNftWorth": 12772030,
      "sybilRate": 37
    }
  }
}
```

---

## 3. Analytics API

User analytics page. Supports filtering by chain and user group.

### `GET /analytics/group-stats`

Returns detailed statistics for the specified chain and user group.

**Query Parameters**

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `chain` | Chain \| `all` | No | `all` | Chain filter |
| `group` | UserGroup | No | `top5` | User group |

**Response**

```json
{
  "success": true,
  "data": {
    "group": "top5",
    "chain": "all",
    "users": 15050,
    "assetAllocation": {
      "stablecoin": "$18,200",
      "native": "$14,800",
      "others": "$8,400"
    },
    "portfolio": {
      "avgValue": "$142,300",
      "avgAvailableValue": "$4,280"
    },
    "trading": {
      "lifetimeVolume": "$284,000",
      "volume30d": "$62,100",
      "avgTradeSize": "$4,200",
      "avgSwaps30d": 42
    },
    "defi": {
      "avgTvl": "$68,200",
      "unclaimedRewards": "$4,120"
    },
    "nft": {
      "avgCount": "12.4",
      "avgPortfolioValue": "$18,300"
    },
    "gas": {
      "avgTotal": "$1,840",
      "avg30d": "$312",
      "avgPerTx": "$4.80"
    },
    "transfers": {
      "avgInflow": "$86,400",
      "avgOutflow": "$71,200",
      "uniqueCounterparts": 47
    },
    "activity": {
      "avgTxPerWeek": "24.6",
      "mostActiveHour": "14:00 UTC",
      "mostActiveDay": "Tuesday",
      "avgWalletAge": "218 days"
    },
    "activityStatus": {
      "active7d": 38,
      "active30d": 26,
      "active90d": 17,
      "inactive90dPlus": 19
    },
    "walletDistribution": {
      "fresh": 8,
      "kaiaOnly": 5,
      "evmOnly": 42,
      "multiChain": 45
    },
    "spendingDistribution": {
      "whale": 12,
      "high": 28,
      "medium": 35,
      "low": 18,
      "inactive": 7
    }
  }
}
```

### `GET /analytics/dex-protocols`

Returns the most-used DEX protocol rankings.

**Query Parameters**

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `chain` | Chain \| `all` | No | `all` | Chain filter |
| `group` | UserGroup | No | `top5` | User group |
| `limit` | number | No | `5` | Number of items to return |

**Response**

```json
{
  "success": true,
  "data": [
    { "rank": 1, "name": "Uniswap V3", "percentage": 34 },
    { "rank": 2, "name": "PancakeSwap", "percentage": 22 },
    { "rank": 3, "name": "Curve Finance", "percentage": 18 },
    { "rank": 4, "name": "SushiSwap", "percentage": 14 },
    { "rank": 5, "name": "Balancer", "percentage": 12 }
  ]
}
```

---

## 4. Labels API

User segment (label) management. Supports two filtering modes: By Behavior and By Value.

### `GET /labels`

Returns all user segment labels.

**Query Parameters**: None

**Response**

```json
{
  "success": true,
  "data": {
    "totalUsers": 301012,
    "labels": [
      {
        "id": 1,
        "name": "DeFi Stakers (Stables)",
        "users": 18420,
        "percentage": 6.1,
        "threshold": "≥ $10,000 staked",
        "chains": {
          "eth": 40, "base": 20, "arb": 15, "bsc": 10,
          "poly": 5, "avax": 4, "hl": 2, "kaia": 2, "sol": 2
        },
        "avgBalance": 14200,
        "txFrequency": 22,
        "retention30d": 78
      }
    ]
  }
}
```

### `GET /labels/filter`

Returns aggregated user data based on selected filter conditions. Used for both By Behavior and By Value modes.

**Query Parameters — By Behavior mode**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `mode` | `behavior` | Yes | Filter mode |
| `labelIds` | number[] | No | Selected label IDs (all if omitted) |
| `chains` | Chain[] | No | Chain filter (all if omitted) |
| `assets` | AssetType[] | No | Asset type filter (all if omitted) |

**Query Parameters — By Value mode**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `mode` | `value` | Yes | Filter mode |
| `chains` | Chain[] | No | Chain filter |
| `assets` | AssetType[] | No | Asset type filter |
| `holdingRanges` | string[] | No | Holding ranges: `u1k`, `1k10k`, `10k50k`, `50kp` |
| `paymentRanges` | string[] | No | Payment ranges: `u500`, `500_5k`, `5k20k`, `20kp` |
| `tradingRanges` | string[] | No | Trading volume ranges: `u1k`, `1k10k`, `10k100k`, `100kp` |
| `tivRanges` | string[] | No | Available Value ranges: `1k`, `10k`, `50k`, `100k` |

**Response (Behavior mode)**

```json
{
  "success": true,
  "data": {
    "mode": "behavior",
    "filteredUsers": 75570,
    "filteredPercentage": 25.1,
    "summary": {
      "totalSelectedLabels": 3,
      "avgBalance": 12400,
      "avgTxFrequency": 26,
      "avgRetention30d": 73
    },
    "distributions": {
      "holdings": [
        { "name": "Stablecoins", "value": 42, "color": "#6366f1" },
        { "name": "Native", "value": 28, "color": "#22d3ee" },
        { "name": "DeFi", "value": 18, "color": "#a855f7" },
        { "name": "NFTs", "value": 12, "color": "#f59e0b" }
      ],
      "tradingVolume": [
        { "name": "DEX", "value": 45, "color": "#6366f1" },
        { "name": "CEX", "value": 30, "color": "#22d3ee" },
        { "name": "P2P", "value": 15, "color": "#a855f7" },
        { "name": "Other", "value": 10, "color": "#f59e0b" }
      ],
      "topChains": [
        { "name": "Ethereum", "value": 38, "color": "#627eea" },
        { "name": "Base", "value": 22, "color": "#0052ff" },
        { "name": "Arbitrum", "value": 18, "color": "#28a0f0" },
        { "name": "BSC", "value": 12, "color": "#f0b90b" },
        { "name": "Other", "value": 10, "color": "#888" }
      ],
      "segmentOverlap": [
        { "name": "DEX + Staker", "value": 34, "color": "#6366f1" },
        { "name": "Holder + LP", "value": 28, "color": "#22d3ee" },
        { "name": "Bridge + DEX", "value": 22, "color": "#a855f7" },
        { "name": "Other", "value": 16, "color": "#f59e0b" }
      ]
    }
  }
}
```

**Response (Value mode)**

```json
{
  "success": true,
  "data": {
    "mode": "value",
    "filteredUsers": 42180,
    "filteredPercentage": 14.0,
    "summary": {
      "avgPortfolioValue": 28400,
      "avgMonthlyPayment": 4200,
      "avgTradingVolume": 62000
    },
    "distributions": {
      "holdings": [ ... ],
      "tradingVolume": [ ... ],
      "topChains": [ ... ],
      "segmentOverlap": [ ... ]
    }
  }
}
```

---

## 5. Risk API

Risk analysis and Sybil detection endpoints.

### `GET /risk/overview`

Returns risk distribution statistics and key KPIs.

**Query Parameters**: None

**Response**

```json
{
  "success": true,
  "data": {
    "distribution": [
      { "level": "critical", "count": 538, "percentage": 23 },
      { "level": "high", "count": 796, "percentage": 34 },
      { "level": "medium", "count": 655, "percentage": 28 },
      { "level": "low", "count": 351, "percentage": 15 }
    ],
    "stats": {
      "totalAnalyzed": 2340,
      "flaggedRate": 19,
      "avgEntropy": 0.15
    },
    "topFlaggedChains": [
      { "chain": "eth", "label": "Ethereum", "percentage": 42 },
      { "chain": "bsc", "label": "BSC", "percentage": 35 },
      { "chain": "base", "label": "Base", "percentage": 23 }
    ]
  }
}
```

### `GET /risk/clusters`

Returns detected Sybil clusters.

**Query Parameters**

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `riskLevel` | RiskLevel | No | All | Risk level filter |

**Response**

```json
{
  "success": true,
  "data": [
    {
      "id": "cluster-1",
      "name": "Cluster #1",
      "riskLevel": "critical",
      "walletCount": 247,
      "detectionReasons": [
        "Shared Funding Source",
        "Identical Transaction Timing"
      ],
      "entropy": 0.08
    },
    {
      "id": "cluster-2",
      "name": "Cluster #2",
      "riskLevel": "high",
      "walletCount": 183,
      "detectionReasons": [
        "Cross-contract Coordination",
        "Similar Gas Price Patterns"
      ],
      "entropy": 0.14
    },
    {
      "id": "cluster-3",
      "name": "Cluster #3",
      "riskLevel": "medium",
      "walletCount": 129,
      "detectionReasons": [
        "Circular Transfer Loops",
        "Low Portfolio Diversity"
      ],
      "entropy": 0.24
    }
  ]
}
```

### `GET /risk/wallets`

Returns flagged wallets with pagination.

**Query Parameters**

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `riskLevel` | RiskLevel \| `all` | No | `all` | Risk level filter |
| `sortBy` | `newest` \| `oldest` | No | `newest` | Sort order |
| `page` | number | No | `1` | Page number |
| `limit` | number | No | `20` | Items per page |

**Response**

```json
{
  "success": true,
  "data": [
    {
      "address": "0x742d...3f8a",
      "fullAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595913f8a",
      "riskLevel": "critical",
      "cluster": "Cluster #1",
      "flaggedAt": "2026-02-26T08:00:00Z",
      "flaggedAgo": "2 hours ago",
      "isBlocked": false
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### `POST /risk/wallets/:address/block`

Blocks a specific wallet.

**Path Parameters**

| Parameter | Type | Description |
|---|---|---|
| `address` | string | Full wallet address |

**Request Body**

```json
{
  "reason": "Sybil cluster member — Cluster #1"
}
```

**Response**

```json
{
  "success": true,
  "data": {
    "address": "0x742d35Cc6634C0532925a3b844Bc9e7595913f8a",
    "blockedAt": "2026-02-26T10:30:00Z",
    "reason": "Sybil cluster member — Cluster #1"
  }
}
```

---

## 6. Campaigns API

Campaign CRUD and target reach estimation endpoints.

### `GET /campaigns`

Returns the campaign list.

**Query Parameters**

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `status` | CampaignStatus \| `all` | No | `all` | Status filter |
| `page` | number | No | `1` | Page number |
| `limit` | number | No | `20` | Items per page |

**Response**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "partner": "Pendle Finance",
      "name": "Yield Booster",
      "type": "Yield Boost",
      "status": "live",
      "targetUsers": 15050,
      "startDate": "2026-01-30",
      "endDate": "2026-03-01",
      "createdAt": "2026-01-25T10:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

### `GET /campaigns/:id`

Returns campaign details.

**Path Parameters**

| Parameter | Type | Description |
|---|---|---|
| `id` | number | Campaign ID |

**Response**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "partner": "Pendle Finance",
    "name": "Yield Booster",
    "type": "Yield Boost",
    "status": "live",
    "description": "Boost your yield with Pendle Finance",
    "targeting": {
      "mode": "behavior",
      "segments": ["DeFi Stakers (Stables)", "DEX Traders"],
      "chains": ["eth", "base"],
      "sybilTolerance": "moderate"
    },
    "details": {
      "startDate": "2026-01-30",
      "endDate": "2026-03-01",
      "partnerLinkUrl": "https://pendle.finance/campaign/yield-booster",
      "ctaLabel": "Boost Now",
      "accessControl": true
    },
    "metrics": {
      "targetUsers": 15050,
      "estimatedReach": 14200,
      "eligibilitySummary": "DeFi Stakers (Stables), DEX Traders · Ethereum, Base · Moderate Sybil"
    },
    "createdAt": "2026-01-25T10:00:00Z",
    "updatedAt": "2026-01-28T14:30:00Z"
  }
}
```

### `POST /campaigns`

Creates a new campaign (draft or live).

**Request Body**

```json
{
  "action": "draft",
  "partner": "Pendle Finance",
  "name": "Fee Discount Program",
  "type": "Fee Discount",
  "customType": null,
  "description": "Exclusive fee discounts for top traders",
  "targeting": {
    "mode": "behavior",
    "segments": ["DEX Traders", "High Frequency Wallets"],
    "chains": ["eth", "base", "arb"],
    "percentileBy": null,
    "assetTypes": null,
    "percentileRanges": null,
    "availableValueRanges": null,
    "sybilTolerance": "moderate"
  },
  "details": {
    "startDate": "2026-04-01",
    "endDate": "2026-06-30",
    "partnerLinkUrl": "https://pendle.finance/fee-discount",
    "ctaLabel": "Join Campaign",
    "customCta": null,
    "accessControl": true
  }
}
```

`action` field:
- `"draft"` — Save as draft (status = `draft`)
- `"launch"` — Launch immediately (status = `live`)

**By Value targeting example**

```json
{
  "targeting": {
    "mode": "value",
    "segments": null,
    "chains": ["eth", "base"],
    "percentileBy": ["portfolio", "trading"],
    "assetTypes": ["stables"],
    "percentileRanges": ["5", "10"],
    "availableValueRanges": ["10k", "50k"],
    "sybilTolerance": "strict"
  }
}
```

**Response**

```json
{
  "success": true,
  "data": {
    "id": 5,
    "status": "draft",
    "createdAt": "2026-02-26T10:00:00Z"
  }
}
```

### `PUT /campaigns/:id`

Updates an existing campaign. Only `draft` campaigns can be modified.

**Path Parameters**

| Parameter | Type | Description |
|---|---|---|
| `id` | number | Campaign ID |

**Request Body**: Same structure as `POST /campaigns` (partial updates supported)

**Response**

```json
{
  "success": true,
  "data": {
    "id": 5,
    "status": "draft",
    "updatedAt": "2026-02-26T11:00:00Z"
  }
}
```

### `DELETE /campaigns/:id`

Deletes a campaign. Only `draft` campaigns can be deleted.

**Path Parameters**

| Parameter | Type | Description |
|---|---|---|
| `id` | number | Campaign ID |

**Response**

```json
{
  "success": true,
  "data": {
    "id": 5,
    "deletedAt": "2026-02-26T12:00:00Z"
  }
}
```

### `POST /campaigns/estimate-reach`

Calculates estimated user reach based on targeting settings.
Called in real-time from the campaign creation form.

**Request Body**

```json
{
  "mode": "behavior",
  "segments": ["DEX Traders", "DeFi Stakers (Stables)"],
  "chains": ["eth", "base"],
  "sybilTolerance": "moderate"
}
```

Or By Value:

```json
{
  "mode": "value",
  "percentileBy": ["portfolio"],
  "assetTypes": ["stables"],
  "percentileRanges": ["5"],
  "availableValueRanges": ["10k"],
  "chains": ["eth"],
  "sybilTolerance": "strict"
}
```

**Response**

```json
{
  "success": true,
  "data": {
    "estimatedReach": 14200,
    "sybilFiltered": 5200,
    "eligibilitySummary": "DEX Traders, DeFi Stakers (Stables) · Ethereum, Base · Moderate Sybil"
  }
}
```

---

## 7. Data Models Appendix

Core data models based on frontend `data.ts` files.

### OverviewSummary

```typescript
interface OverviewSummary {
  deployedAssets: AssetCategory;
  availableAssets: AssetCategory;
  chainDistribution: {
    deployed: ChainBreakdown[];
    available: ChainBreakdown[];
  };
  kpis: OverviewKpis;
  insights: OverviewInsights;
}

interface AssetCategory {
  stables: DonutData;
  tokens: DonutData;
}

interface DonutData {
  total: string;
  segments: Array<{
    label: string;
    percentage: number;
    colorKey: string;
  }>;
}

interface ChainBreakdown {
  chain: Chain;
  label: string;
  userCount: number;
  percentage: number;
  breakdown: Array<{
    type: AssetType;
    percentage: number;
  }>;
}

interface OverviewKpis {
  avgMonthlyTradingVolume: number;
  avgMonthlyTxCount: number;
  avgMonthlyPaymentAmount: number;
  avgMonthlyPaymentCount: number;
  activeWallets7d: number;
  activeTraders7d: number;
  activeProtocolUsers: number;
  crossChainUsers: number;
}

interface OverviewInsights {
  topProtocols: string[];
  topFundingSources: string[];
  netNftWorth: number;
  sybilRate: number;
}
```

### GroupStats (Analytics)

```typescript
interface GroupStats {
  group: UserGroup;
  chain: Chain | "all";
  users: number;
  assetAllocation: {
    stablecoin: string;
    native: string;
    others: string;
  };
  portfolio: {
    avgValue: string;
    avgAvailableValue: string;
  };
  trading: {
    lifetimeVolume: string;
    volume30d: string;
    avgTradeSize: string;
    avgSwaps30d: number;
  };
  defi: {
    avgTvl: string;
    unclaimedRewards: string;
  };
  nft: {
    avgCount: string;
    avgPortfolioValue: string;
  };
  gas: {
    avgTotal: string;
    avg30d: string;
    avgPerTx: string;
  };
  transfers: {
    avgInflow: string;
    avgOutflow: string;
    uniqueCounterparts: number;
  };
  activity: {
    avgTxPerWeek: string;
    mostActiveHour: string;
    mostActiveDay: string;
    avgWalletAge: string;
  };
  activityStatus: {
    active7d: number;
    active30d: number;
    active90d: number;
    inactive90dPlus: number;
  };
  walletDistribution: {
    fresh: number;
    kaiaOnly: number;
    evmOnly: number;
    multiChain: number;
  };
  spendingDistribution: {
    whale: number;
    high: number;
    medium: number;
    low: number;
    inactive: number;
  };
}
```

### Label

```typescript
interface Label {
  id: number;
  name: string;
  users: number;
  percentage: number;
  threshold: string;
  chains: Record<Chain, number>;  // percentage per chain (sum = 100)
  avgBalance: number;
  txFrequency: number;            // per month
  retention30d: number;           // percentage
}
```

### RiskWallet

```typescript
interface RiskWallet {
  address: string;
  fullAddress: string;
  riskLevel: RiskLevel;
  cluster: string;
  flaggedAt: string;       // ISO 8601
  flaggedAgo: string;      // human-readable relative time
  isBlocked: boolean;
}
```

### SybilCluster

```typescript
interface SybilCluster {
  id: string;
  name: string;
  riskLevel: RiskLevel;
  walletCount: number;
  detectionReasons: string[];
  entropy: number;         // 0.0 – 1.0
}
```

### Campaign

```typescript
interface Campaign {
  id: number;
  partner: string;
  name: string;
  type: CampaignType;
  customType?: string;
  status: CampaignStatus;
  description: string;
  targeting: CampaignTargeting;
  details: CampaignDetails;
  metrics: CampaignMetrics;
  createdAt: string;       // ISO 8601
  updatedAt: string;
}

interface CampaignTargeting {
  mode: "behavior" | "value";
  // Behavior mode
  segments?: string[];
  // Value mode
  percentileBy?: string[];     // portfolio, trading, txfreq, age
  assetTypes?: AssetType[];
  percentileRanges?: string[]; // "5", "10", "20", "50"
  availableValueRanges?: string[]; // "1k", "10k", "50k", "100k"
  // Common
  chains: Chain[];
  sybilTolerance: SybilTolerance;
}

interface CampaignDetails {
  startDate: string;       // YYYY-MM-DD
  endDate: string;
  partnerLinkUrl: string;
  ctaLabel: string;
  customCta?: string;
  accessControl: boolean;
}

interface CampaignMetrics {
  targetUsers: number;
  estimatedReach: number;
  eligibilitySummary: string;
}
```

### Enum Types (TypeScript)

```typescript
type Chain = "eth" | "base" | "arb" | "bsc" | "poly" | "avax" | "hl" | "kaia" | "sol";
type AssetType = "stables" | "native" | "others";
type RiskLevel = "critical" | "high" | "medium" | "low";
type CampaignStatus = "draft" | "live" | "ended";
type CampaignType = "Airdrop" | "Yield Boost" | "Cashback" | "Staking Reward"
  | "Fee Discount" | "Referral Bonus" | "Loyalty Reward" | "Early Access" | "Custom";
type SybilTolerance = "strict" | "moderate" | "relaxed";
type UserGroup = "top5" | "top20" | "top50" | "bottom50";
```

---

## Endpoint Summary

| Method | Path | Description |
|---|---|---|
| `GET` | `/overview/summary` | Main dashboard summary |
| `GET` | `/analytics/group-stats` | User group statistics |
| `GET` | `/analytics/dex-protocols` | DEX protocol rankings |
| `GET` | `/labels` | Segment label list |
| `GET` | `/labels/filter` | Filter-based user query |
| `GET` | `/risk/overview` | Risk distribution + stats |
| `GET` | `/risk/clusters` | Sybil cluster list |
| `GET` | `/risk/wallets` | Flagged wallets (paginated) |
| `POST` | `/risk/wallets/:address/block` | Block wallet |
| `GET` | `/campaigns` | Campaign list |
| `GET` | `/campaigns/:id` | Campaign details |
| `POST` | `/campaigns` | Create campaign |
| `PUT` | `/campaigns/:id` | Update campaign |
| `DELETE` | `/campaigns/:id` | Delete campaign |
| `POST` | `/campaigns/estimate-reach` | Reach estimation |

**15 endpoints total** (GET 10 / POST 3 / PUT 1 / DELETE 1)
