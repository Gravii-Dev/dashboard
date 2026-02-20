import type { RiskBadgeVariant } from "@/components/dashboard/RiskBadge";

export type FlaggedRow = {
  risk: RiskBadgeVariant;
  time: number;
  addr: string;
  cluster: string;
};

export const FLAGGED_ROWS: FlaggedRow[] = [
  { risk: "critical", time: 2, addr: "0x742d...3f8a", cluster: "Cluster #1" },
  { risk: "critical", time: 3, addr: "0x8c91...5a2b", cluster: "Cluster #1" },
  { risk: "high", time: 5, addr: "0x3e4f...7d9c", cluster: "Cluster #2" },
  { risk: "high", time: 8, addr: "0xa7b2...4e6f", cluster: "Cluster #2" },
  { risk: "medium", time: 12, addr: "0x5d8c...2a1b", cluster: "Cluster #3" },
];

export type ClusterCardData = {
  id: string;
  name: string;
  riskVariant: RiskBadgeVariant;
  riskLabel: string;
  wallets: number;
  details: string[];
  entropyPct: number;
  entropyColor: string;
};

export const RISK_CLUSTERS: ClusterCardData[] = [
  { id: "1", name: "Cluster #1", riskVariant: "critical", riskLabel: "Critical Risk", wallets: 247, details: ["Shared Funding Source", "Identical Transaction Timing"], entropyPct: 8, entropyColor: "var(--accent-red)" },
  { id: "2", name: "Cluster #2", riskVariant: "high", riskLabel: "High Risk", wallets: 183, details: ["Cross-contract Coordination", "Similar Gas Price Patterns"], entropyPct: 14, entropyColor: "var(--accent-orange)" },
  { id: "3", name: "Cluster #3", riskVariant: "medium", riskLabel: "Medium Risk", wallets: 129, details: ["Circular Transfer Loops", "Low Portfolio Diversity"], entropyPct: 24, entropyColor: "var(--accent-amber)" },
];

export type FlaggedChainRow = {
  chain: string;
  chainVariant: "ethereum" | "bsc" | "base";
  pct: number;
  color: string;
};

export const FLAGGED_CHAINS: FlaggedChainRow[] = [
  { chain: "Ethereum", chainVariant: "ethereum", pct: 42, color: "var(--accent-red)" },
  { chain: "BSC", chainVariant: "bsc", pct: 35, color: "var(--accent-orange)" },
  { chain: "Base", chainVariant: "base", pct: 23, color: "var(--accent-amber)" },
];
