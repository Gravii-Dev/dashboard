import { z } from "zod";
import { defineTool } from "@tambo-ai/react";
import { apiClient, USE_MOCK } from "@/lib/api";
import {
  mockGetOverviewSummary,
  mockGetGroupStats,
  mockGetDexProtocols,
  mockGetLabels,
  mockGetRiskOverview,
  mockGetRiskClusters,
  mockGetRiskWallets,
  mockGetCampaigns,
} from "@/lib/mock";
import type { Chain, UserGroup, RiskLevel, CampaignStatus } from "@/types/api";

export const tamboTools = [
  defineTool({
    name: "getOverviewSummary",
    description:
      "Fetches the main dashboard summary including deployed/available assets, chain distribution, KPIs (trading volume, tx count, payment), activity metrics, and insights (top protocols, funding sources, NFT worth, sybil rate).",
    tool: async () => {
      if (USE_MOCK) {
        const res = await mockGetOverviewSummary();
        return res.data;
      }
      return apiClient.get("/overview/summary");
    },
    inputSchema: z.object({}),
    outputSchema: z.object({}).passthrough(),
  }),

  defineTool({
    name: "getGroupStats",
    description:
      "Fetches analytics for a specific user group (top5, top20, top50, bottom50) on a chain. Returns asset allocation, portfolio, trading, DeFi, NFT, gas, transfer, activity, and distribution stats.",
    tool: async ({ chain, group }) => {
      if (USE_MOCK) {
        const res = await mockGetGroupStats(chain as Chain | "all", group as UserGroup);
        return res.data;
      }
      return apiClient.get("/analytics/group-stats", { chain, group });
    },
    inputSchema: z.object({
      chain: z.string().default("all").describe("Chain filter: all, eth, base, arb, bsc, poly, avax, hl, kaia, sol"),
      group: z.string().default("top5").describe("User group: top5, top20, top50, bottom50"),
    }),
    outputSchema: z.object({}).passthrough(),
  }),

  defineTool({
    name: "getDexProtocols",
    description: "Fetches the top DEX protocols ranked by usage percentage.",
    tool: async () => {
      if (USE_MOCK) {
        const res = await mockGetDexProtocols();
        return res.data;
      }
      return apiClient.get("/analytics/dex-protocols");
    },
    inputSchema: z.object({}),
    outputSchema: z.array(z.object({ rank: z.number(), name: z.string(), percentage: z.number() })),
  }),

  defineTool({
    name: "getLabels",
    description:
      "Fetches the list of user segment labels with their user counts, percentages, chain breakdowns, and thresholds.",
    tool: async () => {
      if (USE_MOCK) {
        const res = await mockGetLabels();
        return res.data;
      }
      return apiClient.get("/labels");
    },
    inputSchema: z.object({}),
    outputSchema: z.object({}).passthrough(),
  }),

  defineTool({
    name: "getRiskOverview",
    description:
      "Fetches risk analysis overview including risk level distribution, total analyzed wallets, flagged rate, average entropy, and top flagged chains.",
    tool: async () => {
      if (USE_MOCK) {
        const res = await mockGetRiskOverview();
        return res.data;
      }
      return apiClient.get("/risk/overview");
    },
    inputSchema: z.object({}),
    outputSchema: z.object({}).passthrough(),
  }),

  defineTool({
    name: "getRiskClusters",
    description: "Fetches detected Sybil clusters with risk levels, wallet counts, detection reasons, and entropy scores.",
    tool: async () => {
      if (USE_MOCK) {
        const res = await mockGetRiskClusters();
        return res.data;
      }
      return apiClient.get("/risk/clusters");
    },
    inputSchema: z.object({}),
    outputSchema: z.array(z.object({}).passthrough()),
  }),

  defineTool({
    name: "getRiskWallets",
    description: "Fetches recently flagged wallets with risk levels and cluster assignments. Can filter by risk level and sort order.",
    tool: async ({ riskLevel, sortBy }) => {
      if (USE_MOCK) {
        const res = await mockGetRiskWallets({ riskLevel: riskLevel as RiskLevel | "all", sortBy });
        return res.data;
      }
      return apiClient.get("/risk/wallets", { riskLevel, sortBy });
    },
    inputSchema: z.object({
      riskLevel: z.enum(["all", "critical", "high", "medium", "low"]).default("all"),
      sortBy: z.enum(["newest", "oldest"]).default("newest"),
    }),
    outputSchema: z.array(z.object({}).passthrough()),
  }),

  defineTool({
    name: "getCampaigns",
    description: "Fetches the list of campaigns. Can filter by status (all, draft, live, ended).",
    tool: async ({ status }) => {
      if (USE_MOCK) {
        const res = await mockGetCampaigns(status === "all" ? undefined : status as CampaignStatus);
        return res.data;
      }
      return apiClient.get("/campaigns", { status });
    },
    inputSchema: z.object({
      status: z.enum(["all", "draft", "live", "ended"]).default("all"),
    }),
    outputSchema: z.array(z.object({}).passthrough()),
  }),
];
