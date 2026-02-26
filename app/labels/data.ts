import {
  CHAIN_COLORS,
  CHAIN_PILL_DATA,
  ASSET_PILL_DATA,
  type ChainKey,
} from "@/lib/utils";

export { CHAIN_COLORS, CHAIN_PILL_DATA, ASSET_PILL_DATA, type ChainKey };

export const TOTAL_USERS = 301012;

export const labels = [
  { id: 1, name: "DeFi Stakers (Stables)", users: 18420, pct: 6.1, threshold: "≥ $10,000 staked", chains: { eth: 40, base: 20, arb: 15, bsc: 10, poly: 5, avax: 4, hl: 2, kaia: 2, sol: 2 }, avgBal: 14200, txFreq: 22, retention: 78 },
  { id: 2, name: "DeFi Stakers (Native)", users: 15330, pct: 5.1, threshold: "≥ $10,000 staked", chains: { eth: 45, base: 18, arb: 12, bsc: 10, poly: 5, avax: 4, hl: 2, kaia: 2, sol: 2 }, avgBal: 18400, txFreq: 19, retention: 74 },
  { id: 3, name: "DeFi Stakers (Others)", users: 9210, pct: 3.1, threshold: "≥ $5,000 staked", chains: { eth: 35, base: 22, arb: 18, bsc: 8, poly: 7, avax: 4, hl: 2, kaia: 2, sol: 2 }, avgBal: 8300, txFreq: 15, retention: 68 },
  { id: 4, name: "DEX Traders", users: 42150, pct: 14.0, threshold: "≥ 50 tx/month", chains: { eth: 30, base: 25, arb: 20, bsc: 8, poly: 5, avax: 3, hl: 5, kaia: 2, sol: 2 }, avgBal: 6200, txFreq: 72, retention: 85 },
  { id: 5, name: "Liquidity Providers", users: 12080, pct: 4.0, threshold: "≥ $10,000 LP", chains: { eth: 42, base: 20, arb: 15, bsc: 10, poly: 5, avax: 3, hl: 2, kaia: 1, sol: 2 }, avgBal: 22100, txFreq: 18, retention: 71 },
  { id: 6, name: "Long-term Holders", users: 67200, pct: 22.3, threshold: "≥ 30 days held", chains: { eth: 38, base: 15, arb: 12, bsc: 12, poly: 8, avax: 5, hl: 2, kaia: 4, sol: 4 }, avgBal: 5100, txFreq: 4, retention: 62 },
  { id: 7, name: "Stablecoin Spenders", users: 38900, pct: 12.9, threshold: "≥ $1,000/month", chains: { eth: 35, base: 22, arb: 10, bsc: 12, poly: 8, avax: 3, hl: 2, kaia: 4, sol: 4 }, avgBal: 3800, txFreq: 34, retention: 79 },
  { id: 8, name: "Stablecoin Whales", users: 4210, pct: 1.4, threshold: "≥ $50,000 balance", chains: { eth: 55, base: 12, arb: 8, bsc: 10, poly: 5, avax: 4, hl: 2, kaia: 2, sol: 2 }, avgBal: 142000, txFreq: 28, retention: 88 },
  { id: 9, name: "Native Token Whales", users: 3890, pct: 1.3, threshold: "≥ $50,000 balance", chains: { eth: 50, base: 15, arb: 10, bsc: 8, poly: 5, avax: 5, hl: 3, kaia: 2, sol: 2 }, avgBal: 168000, txFreq: 22, retention: 82 },
  { id: 10, name: "NFT Whales", users: 2150, pct: 0.7, threshold: "≥ $50,000 portfolio", chains: { eth: 60, base: 15, arb: 5, bsc: 5, poly: 5, avax: 2, hl: 1, kaia: 3, sol: 4 }, avgBal: 94000, txFreq: 12, retention: 76 },
  { id: 11, name: "Paper Hands", users: 28700, pct: 9.5, threshold: "≤ 7 days avg hold", chains: { eth: 28, base: 25, arb: 18, bsc: 10, poly: 7, avax: 4, hl: 3, kaia: 3, sol: 2 }, avgBal: 1800, txFreq: 48, retention: 54 },
  { id: 12, name: "Cherry Pickers", users: 8430, pct: 2.8, threshold: "≥ 80% sold within 24h", chains: { eth: 32, base: 28, arb: 20, bsc: 8, poly: 5, avax: 3, hl: 2, kaia: 1, sol: 1 }, avgBal: 2400, txFreq: 38, retention: 42 },
  { id: 13, name: "High Frequency Wallets", users: 19800, pct: 6.6, threshold: "≥ 100 tx/month", chains: { eth: 30, base: 25, arb: 18, bsc: 10, poly: 5, avax: 3, hl: 5, kaia: 2, sol: 2 }, avgBal: 7800, txFreq: 142, retention: 91 },
  { id: 14, name: "Sybil", users: 5620, pct: 1.9, threshold: "Flagged by Risk module", chains: { eth: 35, base: 30, arb: 15, bsc: 8, poly: 5, avax: 3, hl: 1, kaia: 2, sol: 1 }, avgBal: 820, txFreq: 88, retention: 67 },
  { id: 15, name: "Bridge Users", users: 34500, pct: 11.5, threshold: "≥ 1 bridge tx/30d", chains: { eth: 30, base: 25, arb: 20, bsc: 8, poly: 7, avax: 4, hl: 2, kaia: 2, sol: 2 }, avgBal: 5600, txFreq: 26, retention: 73 },
  { id: 16, name: "Airdrop Hunters", users: 11200, pct: 3.7, threshold: "≥ 3 protocols/90d", chains: { eth: 28, base: 30, arb: 22, bsc: 5, poly: 5, avax: 4, hl: 3, kaia: 1, sol: 2 }, avgBal: 1200, txFreq: 52, retention: 58 },
  { id: 17, name: "Dormant Wallets", users: 45100, pct: 15.0, threshold: "≥ 90 days inactive", chains: { eth: 40, base: 12, arb: 10, bsc: 15, poly: 8, avax: 5, hl: 1, kaia: 5, sol: 4 }, avgBal: 2200, txFreq: 0, retention: 0 },
  { id: 18, name: "New Wallets", users: 22300, pct: 7.4, threshold: "≤ 30 days old", chains: { eth: 25, base: 30, arb: 18, bsc: 8, poly: 7, avax: 4, hl: 3, kaia: 3, sol: 2 }, avgBal: 980, txFreq: 14, retention: 64 },
  { id: 19, name: "Governance Participants", users: 6700, pct: 2.2, threshold: "≥ 1 vote/90d", chains: { eth: 50, base: 15, arb: 15, bsc: 5, poly: 5, avax: 4, hl: 2, kaia: 2, sol: 2 }, avgBal: 18200, txFreq: 16, retention: 81 },
  { id: 20, name: "Rapid Growth Wallets", users: 7800, pct: 2.6, threshold: "≥ 500% balance growth/30d (min $100)", chains: { eth: 30, base: 28, arb: 18, bsc: 8, poly: 5, avax: 4, hl: 3, kaia: 2, sol: 2 }, avgBal: 4100, txFreq: 32, retention: 72 },
];
