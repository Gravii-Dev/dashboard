export const CAMPAIGNS = [
  {
    id: 1,
    partner: "Pendle Finance",
    name: "Yield Booster",
    type: "Yield Boost",
    status: "live",
    target: "Target: 15,050 users",
    date: "Jan 30 – Mar 1, 2026",
  },
  {
    id: 2,
    partner: "Pendle Finance",
    name: "Lending Cashback",
    type: "Cashback",
    status: "live",
    target: "Target: 42,150 users",
    date: "Feb 1 – Apr 30, 2026",
  },
  {
    id: 3,
    partner: "Pendle Finance",
    name: "Early Access V4",
    type: "Early Access",
    status: "ended",
    target: "Target: 8,200 users",
    date: "Nov 1 – Dec 31, 2025",
  },
  {
    id: 4,
    partner: "Pendle Finance",
    name: "Fee Discount Program",
    type: "Fee Discount",
    status: "draft",
    target: "Target: — users",
    date: "Not scheduled",
  },
];

export const SEGMENT_LABELS = [
  "DeFi Stakers (Stables)",
  "DeFi Stakers (Native)",
  "DeFi Stakers (Others)",
  "DEX Traders",
  "Liquidity Providers",
  "Long-term Holders",
  "Stablecoin Spenders",
  "Stablecoin Whales",
  "Native Token Whales",
  "NFT Whales",
  "Paper Hands",
  "Cherry Pickers",
  "High Frequency Wallets",
  "Sybil",
  "Bridge Users",
  "Airdrop Hunters",
  "Dormant Wallets",
  "New Wallets",
  "Governance Participants",
  "Rapid Growth Wallets",
];

export const SYBIL_PREVIEWS: Record<string, string> = {
  strict: "~12,400 users filtered out",
  moderate: "~5,200 users filtered out",
  relaxed: "~1,800 users filtered out",
};

export const PERC_RANGE_MAP: Record<string, number> = {
  "5": 0.05,
  "10": 0.1,
  "20": 0.2,
  "50": 0.5,
};

export const TIV_MAP: Record<string, number> = {
  "1k": 0.6,
  "10k": 0.35,
  "50k": 0.15,
  "100k": 0.06,
};
