import type {
  RiskOverview,
  SybilCluster,
  RiskWallet,
  RiskWalletsParams,
  BlockWalletResult,
} from "@/types/api";
import { wrap, wrapPaginated, delay } from "./helpers";

const RISK_OVERVIEW: RiskOverview = {
  distribution: [
    { level: "critical", count: 538, percentage: 23 },
    { level: "high", count: 796, percentage: 34 },
    { level: "medium", count: 655, percentage: 28 },
    { level: "low", count: 351, percentage: 15 },
  ],
  stats: { totalAnalyzed: 2340, flaggedRate: 19, avgEntropy: 0.15 },
  topFlaggedChains: [
    { chain: "eth", label: "Ethereum", percentage: 42 },
    { chain: "bsc", label: "BSC", percentage: 35 },
    { chain: "base", label: "Base", percentage: 23 },
  ],
};

const CLUSTERS: SybilCluster[] = [
  {
    id: "cluster-1", name: "Cluster #1", riskLevel: "critical",
    walletCount: 247,
    detectionReasons: ["Shared Funding Source", "Identical Transaction Timing"],
    entropy: 0.08,
  },
  {
    id: "cluster-2", name: "Cluster #2", riskLevel: "high",
    walletCount: 183,
    detectionReasons: ["Cross-contract Coordination", "Similar Gas Price Patterns"],
    entropy: 0.14,
  },
  {
    id: "cluster-3", name: "Cluster #3", riskLevel: "medium",
    walletCount: 129,
    detectionReasons: ["Circular Transfer Loops", "Low Portfolio Diversity"],
    entropy: 0.24,
  },
];

const WALLETS: RiskWallet[] = [
  { address: "0x742d...3f8a", fullAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595913f8a", riskLevel: "critical", cluster: "Cluster #1", flaggedAt: "2026-02-26T08:00:00Z", flaggedAgo: "2 hours ago", isBlocked: false },
  { address: "0x8c91...5a2b", fullAddress: "0x8c9135Dd7745D1632926a4c944Cd0e8696024a2b", riskLevel: "critical", cluster: "Cluster #1", flaggedAt: "2026-02-26T07:00:00Z", flaggedAgo: "3 hours ago", isBlocked: false },
  { address: "0x3e4f...7d9c", fullAddress: "0x3e4f46Ee8856E2743937b5d844De9e8797135d9c", riskLevel: "high", cluster: "Cluster #2", flaggedAt: "2026-02-26T05:00:00Z", flaggedAgo: "5 hours ago", isBlocked: false },
  { address: "0xa7b2...4e6f", fullAddress: "0xa7b247Ff9967F3843948c6e955Ef1e9908246e6f", riskLevel: "high", cluster: "Cluster #2", flaggedAt: "2026-02-26T02:00:00Z", flaggedAgo: "8 hours ago", isBlocked: false },
  { address: "0x5d8c...2a1b", fullAddress: "0x5d8c68Aa0978G4954059d7f066Gf2fa09357261b", riskLevel: "medium", cluster: "Cluster #3", flaggedAt: "2026-02-25T22:00:00Z", flaggedAgo: "12 hours ago", isBlocked: false },
];

export async function mockGetRiskOverview() {
  await delay();
  return wrap(RISK_OVERVIEW);
}

export async function mockGetRiskClusters() {
  await delay();
  return wrap(CLUSTERS);
}

export async function mockGetRiskWallets(params?: RiskWalletsParams) {
  await delay();
  let items = [...WALLETS];

  if (params?.riskLevel && params.riskLevel !== "all") {
    items = items.filter((w) => w.riskLevel === params.riskLevel);
  }

  if (params?.sortBy === "oldest") {
    items.reverse();
  }

  return wrapPaginated(items, params?.page ?? 1, params?.limit ?? 20);
}

export async function mockBlockWallet(
  address: string,
  reason?: string,
) {
  await delay(400);
  const result: BlockWalletResult = {
    address,
    blockedAt: new Date().toISOString(),
    reason: reason ?? "Blocked via dashboard",
  };
  return wrap(result);
}
