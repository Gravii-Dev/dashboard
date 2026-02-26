# Tambo AI Integration — Backend Requirements

> **Purpose**: This document describes what the backend team needs to support Tambo AI integration in the Gravii Dashboard.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [How Tambo Works](#2-how-tambo-works)
3. [Backend API Endpoints Required by Tambo](#3-backend-api-endpoints-required-by-tambo)
4. [Authentication Flow](#4-authentication-flow)
5. [Natural Language Query Examples](#5-natural-language-query-examples)
6. [Environment Variables](#6-environment-variables)
7. [What Backend Does NOT Need To Do](#7-what-backend-does-not-need-to-do)

---

## 1. Architecture Overview

Tambo is a **Generative UI SDK for React**. It lets users interact with the dashboard via natural language — the AI selects and renders the appropriate React components with real data.

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                    │
│                                                         │
│  ┌──────────┐    ┌──────────────┐    ┌──────────────┐   │
│  │ Bot      │───>│ Tambo React  │───>│ Registered   │   │
│  │ Widget   │    │ SDK          │    │ Components   │   │
│  │ (Chat)   │<───│ (useTambo)   │<───│ (DonutChart, │   │
│  └──────────┘    └──────┬───────┘    │  RankList…)  │   │
│                         │            └──────────────┘   │
│                         │                               │
│         ┌───────────────┼───────────────┐               │
│         │               │               │               │
│         ▼               ▼               ▼               │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │ Tambo      │  │ Tambo      │  │ Tambo      │        │
│  │ Tools      │  │ Tools      │  │ Tools      │        │
│  │ (fetch     │  │ (fetch     │  │ (fetch     │        │
│  │  overview) │  │  analytics)│  │  risk)     │        │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘        │
│        │               │               │               │
└────────┼───────────────┼───────────────┼───────────────┘
         │               │               │
         ▼               ▼               ▼
┌─────────────────────────────────────────────────────────┐
│                 Gravii Backend API                       │
│            (built by backend team)                       │
│                                                         │
│  GET /overview/summary                                  │
│  GET /analytics/group-stats?chain=eth&group=top5        │
│  GET /labels                                            │
│  GET /risk/overview                                     │
│  ...etc (see api-spec.md for full list)                 │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│              Tambo Cloud (hosted by Tambo)               │
│                                                         │
│  - LLM orchestration (OpenAI / Anthropic / Gemini)      │
│  - Conversation state management                        │
│  - Component selection logic                            │
│  - Streaming infrastructure                             │
└─────────────────────────────────────────────────────────┘
```

**Key point**: Tambo Cloud handles the AI/LLM layer. The backend team only needs to provide the same REST API endpoints documented in `api-spec.md`. No additional Tambo-specific endpoints are required.

---

## 2. How Tambo Works

### Frontend registers two things:

**A) Components** — React components with Zod schemas that the AI can render:

```typescript
// Example: AI can render a DonutChart in the chat
{
  name: "DonutChart",
  description: "Displays asset allocation as a donut chart",
  component: DonutChart,
  propsSchema: z.object({
    segments: z.array(z.object({
      label: z.string(),
      percentage: z.number(),
      colorKey: z.string(),
    })),
    totalValue: z.string(),
    totalLabel: z.string(),
  }),
}
```

**B) Tools** — Functions the AI can call to fetch data:

```typescript
// Example: AI calls this tool to get overview data
{
  name: "getOverviewSummary",
  description: "Fetches the main dashboard summary including assets, KPIs, and insights",
  tool: async () => {
    const res = await fetch(`${API_URL}/overview/summary`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },
  inputSchema: z.object({}),
  outputSchema: z.object({ ... }),
}
```

### Conversation flow:

1. User types: "Show me the risk distribution"
2. Tambo Cloud sends the message to the LLM
3. LLM decides to call `getRiskOverview` tool
4. Tool function calls `GET /risk/overview` on the Gravii backend
5. Backend returns JSON data
6. LLM decides to render `DonutChart` component with the risk data
7. Frontend renders the chart inside the chat

---

## 3. Backend API Endpoints Required by Tambo

Tambo tools will call the **same endpoints** defined in `api-spec.md`. No additional endpoints needed.

### Read-only tools (AI fetches data to display):

| Tool Name | Endpoint | When AI Uses It |
|---|---|---|
| `getOverviewSummary` | `GET /overview/summary` | User asks about overall stats, assets, KPIs |
| `getGroupStats` | `GET /analytics/group-stats` | User asks about specific user groups |
| `getDexProtocols` | `GET /analytics/dex-protocols` | User asks about DEX usage |
| `getLabels` | `GET /labels` | User asks about user segments |
| `getLabelsFilter` | `GET /labels/filter` | User asks to filter users by criteria |
| `getRiskOverview` | `GET /risk/overview` | User asks about risk distribution |
| `getRiskClusters` | `GET /risk/clusters` | User asks about Sybil clusters |
| `getRiskWallets` | `GET /risk/wallets` | User asks about flagged wallets |
| `getCampaigns` | `GET /campaigns` | User asks about campaign list |
| `getCampaignDetail` | `GET /campaigns/:id` | User asks about a specific campaign |

### Write tools (AI performs actions):

| Tool Name | Endpoint | When AI Uses It |
|---|---|---|
| `blockWallet` | `POST /risk/wallets/:address/block` | User says "block this wallet" |
| `createCampaign` | `POST /campaigns` | User describes a campaign in natural language |
| `estimateReach` | `POST /campaigns/estimate-reach` | User asks "how many users would this reach?" |

### API Requirements for Tambo compatibility:

1. **CORS**: Allow requests from the frontend origin (Tambo tools run client-side)
2. **JSON responses**: All endpoints must return the standard `{ success, data, meta }` format from `api-spec.md`
3. **Auth header**: Accept `Authorization: Bearer <firebase-id-token>` on all endpoints
4. **Error format**: Return the standard error format so the AI can relay errors to users

---

## 4. Authentication Flow

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐
│  User    │────>│ Firebase Auth │────>│ ID Token     │
│  Login   │     │ (Google etc) │     │ (JWT)        │
└──────────┘     └──────────────┘     └──────┬───────┘
                                             │
                    ┌────────────────────────┘
                    │
                    ▼
     ┌──────────────────────────┐
     │   Frontend passes token  │
     │   to two places:         │
     └──────┬───────────┬───────┘
            │           │
            ▼           ▼
     ┌────────────┐ ┌────────────────┐
     │ Tambo SDK  │ │ Direct API     │
     │ userToken  │ │ calls          │
     │ (for AI    │ │ (for pages     │
     │  threads)  │ │  without AI)   │
     └─────┬──────┘ └───────┬────────┘
           │                │
           ▼                ▼
     ┌────────────┐  ┌────────────┐
     │ Tambo      │  │ Gravii     │
     │ Cloud      │  │ Backend    │
     │ (user      │  │ (validates │
     │  isolation) │  │  token)    │
     └────────────┘  └────────────┘
```

### Backend responsibilities:

1. **Validate Firebase ID tokens** on every API request
2. Extract `uid` from the token to scope data to the authenticated user/organization
3. Return `401 UNAUTHORIZED` for invalid/expired tokens

### Tambo uses the same token:

```typescript
// Frontend passes Firebase token to Tambo for user isolation
<TamboProvider
  apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY}
  userToken={firebaseIdToken}
  components={components}
  tools={tools}
/>
```

This ensures each user's AI conversation threads are isolated.

---

## 5. Natural Language Query Examples

These show what users might type and which API endpoint gets called:

| User Input | Tool Called | API Endpoint |
|---|---|---|
| "Show me the dashboard summary" | `getOverviewSummary` | `GET /overview/summary` |
| "What does the Top 5% group look like on Ethereum?" | `getGroupStats` | `GET /analytics/group-stats?chain=eth&group=top5` |
| "Which DEX protocols are most used?" | `getDexProtocols` | `GET /analytics/dex-protocols` |
| "Show me all user segments" | `getLabels` | `GET /labels` |
| "Filter users with >$50k holdings on Ethereum" | `getLabelsFilter` | `GET /labels/filter?mode=value&holdingRanges=50kp&chains=eth` |
| "What's the risk distribution?" | `getRiskOverview` | `GET /risk/overview` |
| "Show Sybil clusters" | `getRiskClusters` | `GET /risk/clusters` |
| "Show flagged wallets sorted by newest" | `getRiskWallets` | `GET /risk/wallets?sortBy=newest` |
| "Block wallet 0x742d..." | `blockWallet` | `POST /risk/wallets/0x742d.../block` |
| "Create a yield boost campaign for top 5% DeFi stakers" | `createCampaign` | `POST /campaigns` |
| "How many users would a campaign targeting ETH whales reach?" | `estimateReach` | `POST /campaigns/estimate-reach` |
| "Show all live campaigns" | `getCampaigns` | `GET /campaigns?status=live` |

---

## 6. Environment Variables

### Frontend needs (managed by frontend team):

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_TAMBO_API_KEY` | Tambo Cloud API key (from tambo.co/dashboard) | `tmb_xxx...` |
| `NEXT_PUBLIC_API_URL` | Gravii backend base URL | `https://api.gravii.io/v1` |
| `NEXT_PUBLIC_USE_MOCK` | Use mock data instead of real API | `true` / `false` |
| `NEXT_PUBLIC_AUTH_ENABLED` | Enable/disable auth during development | `true` / `false` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase project API key | `AIza...` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | `gravii.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID | `gravii-prod` |

### Backend needs (managed by backend team):

| Variable | Description |
|---|---|
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Firebase Admin SDK credential for token verification |
| Database connection strings | As needed for your infrastructure |

### Tambo Cloud (managed via tambo.co dashboard):

| Setting | Description |
|---|---|
| LLM Provider | OpenAI / Anthropic / Gemini API key |
| Model | e.g. `gpt-4o`, `claude-sonnet-4-20250514` |
| System prompt | Custom instructions for the Gravii AI assistant |

---

## 7. What Backend Does NOT Need To Do

- **No Tambo server setup** — Tambo Cloud handles LLM orchestration, conversation storage, and streaming. The backend does not need to run any Tambo infrastructure.
- **No AI/LLM integration** — The backend never directly calls OpenAI/Anthropic. Tambo handles all LLM communication.
- **No WebSocket endpoints** — Tambo handles streaming between its cloud and the frontend.
- **No special Tambo endpoints** — Tambo tools call the exact same REST API endpoints that the dashboard pages use directly.

### Summary for backend team:

> Build the 15 endpoints in `api-spec.md` with Firebase Auth token validation and standard JSON responses. That's everything needed for both the dashboard UI and the Tambo AI chat feature.
