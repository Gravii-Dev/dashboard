import type { OverviewSummary } from "@/types/api";
import { wrap, delay } from "./helpers";

const OVERVIEW_DATA: OverviewSummary = {
  deployedAssets: {
    stables: {
      total: "$2,847",
      segments: [
        { label: "USDC", percentage: 50, colorKey: "chart-1" },
        { label: "USDT", percentage: 30, colorKey: "chart-2" },
        { label: "DAI", percentage: 14, colorKey: "chart-3" },
        { label: "Others", percentage: 6, colorKey: "chart-4" },
      ],
    },
    tokens: {
      total: "$1,923",
      segments: [
        { label: "ETH", percentage: 40, colorKey: "chart-5" },
        { label: "BNB", percentage: 30, colorKey: "chart-6" },
        { label: "LINK", percentage: 20, colorKey: "chart-1" },
        { label: "Others", percentage: 10, colorKey: "chart-3" },
      ],
    },
  },
  availableAssets: {
    stables: {
      total: "$1,124",
      segments: [
        { label: "USDC", percentage: 45, colorKey: "chart-2" },
        { label: "USDT", percentage: 30, colorKey: "chart-4" },
        { label: "DAI", percentage: 16, colorKey: "chart-1" },
        { label: "Others", percentage: 9, colorKey: "chart-6" },
      ],
    },
    tokens: {
      total: "$682",
      segments: [
        { label: "ETH", percentage: 40, colorKey: "chart-3" },
        { label: "BNB", percentage: 25, colorKey: "chart-5" },
        { label: "MATIC", percentage: 20, colorKey: "chart-2" },
        { label: "Others", percentage: 15, colorKey: "chart-4" },
      ],
    },
  },
  chainDistribution: {
    deployed: [
      {
        chain: "eth", label: "Ethereum", userCount: 188, percentage: 38,
        breakdown: [
          { type: "stables", percentage: 55 },
          { type: "native", percentage: 30 },
          { type: "others", percentage: 15 },
        ],
      },
      {
        chain: "bsc", label: "BSC", userCount: 188, percentage: 38,
        breakdown: [
          { type: "stables", percentage: 50 },
          { type: "native", percentage: 35 },
          { type: "others", percentage: 15 },
        ],
      },
      {
        chain: "base", label: "Base", userCount: 189, percentage: 38,
        breakdown: [
          { type: "stables", percentage: 45 },
          { type: "native", percentage: 35 },
          { type: "others", percentage: 20 },
        ],
      },
    ],
    available: [
      {
        chain: "eth", label: "Ethereum", userCount: 188, percentage: 38,
        breakdown: [
          { type: "stables", percentage: 50 },
          { type: "native", percentage: 30 },
          { type: "others", percentage: 20 },
        ],
      },
      {
        chain: "bsc", label: "BSC", userCount: 188, percentage: 38,
        breakdown: [
          { type: "stables", percentage: 48 },
          { type: "native", percentage: 32 },
          { type: "others", percentage: 20 },
        ],
      },
      {
        chain: "base", label: "Base", userCount: 189, percentage: 38,
        breakdown: [
          { type: "stables", percentage: 42 },
          { type: "native", percentage: 38 },
          { type: "others", percentage: 20 },
        ],
      },
    ],
  },
  kpis: {
    avgMonthlyTradingVolume: 12010,
    avgMonthlyTxCount: 72,
    avgMonthlyPaymentAmount: 2327,
    avgMonthlyPaymentCount: 32,
    activeWallets7d: 301012,
    activeTraders7d: 12010,
    activeProtocolUsers: 8001,
    crossChainUsers: 1777,
  },
  insights: {
    topProtocols: ["Pendle Finance", "Pendle Finance", "Curve"],
    topFundingSources: ["Binance", "OKX", "Bybit"],
    netNftWorth: 12772030,
    sybilRate: 37,
  },
};

export async function mockGetOverviewSummary() {
  await delay();
  return wrap(OVERVIEW_DATA);
}
