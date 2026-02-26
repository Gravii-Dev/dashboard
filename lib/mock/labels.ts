import type {
  LabelsListData,
  LabelsFilterResult,
  LabelsFilterParams,
  Label,
  Chain,
} from "@/types/api";
import {
  labels as rawLabels,
  TOTAL_USERS,
} from "@/app/labels/data";
import { wrap, delay } from "./helpers";

const labelsTyped: Label[] = rawLabels.map((l) => ({
  id: l.id,
  name: l.name,
  users: l.users,
  percentage: l.pct,
  threshold: l.threshold,
  chains: l.chains as Record<Chain, number>,
  avgBalance: l.avgBal,
  txFrequency: l.txFreq,
  retention30d: l.retention,
}));

const MOCK_DISTRIBUTIONS = {
  holdings: [
    { name: "Stablecoins", value: 42, color: "#6366f1" },
    { name: "Native", value: 28, color: "#22d3ee" },
    { name: "DeFi", value: 18, color: "#a855f7" },
    { name: "NFTs", value: 12, color: "#f59e0b" },
  ],
  tradingVolume: [
    { name: "DEX", value: 45, color: "#6366f1" },
    { name: "CEX", value: 30, color: "#22d3ee" },
    { name: "P2P", value: 15, color: "#a855f7" },
    { name: "Other", value: 10, color: "#f59e0b" },
  ],
  topChains: [
    { name: "Ethereum", value: 38, color: "#627eea" },
    { name: "Base", value: 22, color: "#0052ff" },
    { name: "Arbitrum", value: 18, color: "#28a0f0" },
    { name: "BSC", value: 12, color: "#f0b90b" },
    { name: "Other", value: 10, color: "#888" },
  ],
  segmentOverlap: [
    { name: "DEX + Staker", value: 34, color: "#6366f1" },
    { name: "Holder + LP", value: 28, color: "#22d3ee" },
    { name: "Bridge + DEX", value: 22, color: "#a855f7" },
    { name: "Other", value: 16, color: "#f59e0b" },
  ],
};

export async function mockGetLabels() {
  await delay();
  const data: LabelsListData = {
    totalUsers: TOTAL_USERS,
    labels: labelsTyped,
  };
  return wrap(data);
}

export async function mockGetLabelsFilter(params: LabelsFilterParams) {
  await delay();

  if (params.mode === "behavior") {
    const selectedIds = params.labelIds ?? labelsTyped.map((l) => l.id);
    const selected = labelsTyped.filter((l) => selectedIds.includes(l.id));
    const filteredUsers = selected.reduce((s, l) => s + l.users, 0);
    const result: LabelsFilterResult = {
      mode: "behavior",
      filteredUsers,
      filteredPercentage: +((filteredUsers / TOTAL_USERS) * 100).toFixed(1),
      summary: {
        totalSelectedLabels: selected.length,
        avgBalance: selected.length
          ? Math.round(selected.reduce((s, l) => s + l.avgBalance, 0) / selected.length)
          : 0,
        avgTxFrequency: selected.length
          ? Math.round(selected.reduce((s, l) => s + l.txFrequency, 0) / selected.length)
          : 0,
        avgRetention30d: selected.length
          ? Math.round(selected.reduce((s, l) => s + l.retention30d, 0) / selected.length)
          : 0,
      },
      distributions: MOCK_DISTRIBUTIONS,
    };
    return wrap(result);
  }

  const result: LabelsFilterResult = {
    mode: "value",
    filteredUsers: 42180,
    filteredPercentage: 14.0,
    summary: {
      avgPortfolioValue: 28400,
      avgMonthlyPayment: 4200,
      avgTradingVolume: 62000,
    },
    distributions: MOCK_DISTRIBUTIONS,
  };
  return wrap(result);
}
