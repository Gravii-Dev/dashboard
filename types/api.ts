// ─── Enums ────────────────────────────────────────────

export type Chain =
  | "eth"
  | "base"
  | "arb"
  | "bsc"
  | "poly"
  | "avax"
  | "hl"
  | "kaia"
  | "sol";

export type AssetType = "stables" | "native" | "others";

export type RiskLevel = "critical" | "high" | "medium" | "low";

export type CampaignStatus = "draft" | "live" | "ended";

export type CampaignType =
  | "Airdrop"
  | "Yield Boost"
  | "Cashback"
  | "Staking Reward"
  | "Fee Discount"
  | "Referral Bonus"
  | "Loyalty Reward"
  | "Early Access"
  | "Custom";

export type SybilTolerance = "strict" | "moderate" | "relaxed";

export type UserGroup = "top5" | "top20" | "top50" | "bottom50";

// ─── API Response Wrappers ────────────────────────────

export interface ApiMeta {
  requestId: string;
  timestamp: string;
}

export interface ApiResponse<T> {
  success: true;
  data: T;
  meta: ApiMeta;
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  meta: ApiMeta;
}

export interface ApiErrorDetail {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: ApiErrorDetail[];
  };
  meta: ApiMeta;
}

// ─── Overview ─────────────────────────────────────────

export interface DonutSegment {
  label: string;
  percentage: number;
  colorKey: string;
}

export interface DonutData {
  total: string;
  segments: DonutSegment[];
}

export interface AssetCategory {
  stables: DonutData;
  tokens: DonutData;
}

export interface ChainBreakdownItem {
  type: AssetType;
  percentage: number;
}

export interface ChainBreakdown {
  chain: Chain;
  label: string;
  userCount: number;
  percentage: number;
  breakdown: ChainBreakdownItem[];
}

export interface OverviewKpis {
  avgMonthlyTradingVolume: number;
  avgMonthlyTxCount: number;
  avgMonthlyPaymentAmount: number;
  avgMonthlyPaymentCount: number;
  activeWallets7d: number;
  activeTraders7d: number;
  activeProtocolUsers: number;
  crossChainUsers: number;
}

export interface OverviewInsights {
  topProtocols: string[];
  topFundingSources: string[];
  netNftWorth: number;
  sybilRate: number;
}

export interface OverviewSummary {
  deployedAssets: AssetCategory;
  availableAssets: AssetCategory;
  chainDistribution: {
    deployed: ChainBreakdown[];
    available: ChainBreakdown[];
  };
  kpis: OverviewKpis;
  insights: OverviewInsights;
}

// ─── Analytics ────────────────────────────────────────

export interface GroupStats {
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

export interface DexProtocol {
  rank: number;
  name: string;
  percentage: number;
}

// ─── Labels ───────────────────────────────────────────

export interface Label {
  id: number;
  name: string;
  users: number;
  percentage: number;
  threshold: string;
  chains: Record<Chain, number>;
  avgBalance: number;
  txFrequency: number;
  retention30d: number;
}

export interface LabelsListData {
  totalUsers: number;
  labels: Label[];
}

export interface DistributionItem {
  name: string;
  value: number;
  color: string;
}

export interface LabelsDistributions {
  holdings: DistributionItem[];
  tradingVolume: DistributionItem[];
  topChains: DistributionItem[];
  segmentOverlap: DistributionItem[];
}

export interface LabelsBehaviorFilterResult {
  mode: "behavior";
  filteredUsers: number;
  filteredPercentage: number;
  summary: {
    totalSelectedLabels: number;
    avgBalance: number;
    avgTxFrequency: number;
    avgRetention30d: number;
  };
  distributions: LabelsDistributions;
}

export interface LabelsValueFilterResult {
  mode: "value";
  filteredUsers: number;
  filteredPercentage: number;
  summary: {
    avgPortfolioValue: number;
    avgMonthlyPayment: number;
    avgTradingVolume: number;
  };
  distributions: LabelsDistributions;
}

export type LabelsFilterResult =
  | LabelsBehaviorFilterResult
  | LabelsValueFilterResult;

export interface LabelsBehaviorFilterParams {
  mode: "behavior";
  labelIds?: number[];
  chains?: Chain[];
  assets?: AssetType[];
}

export interface LabelsValueFilterParams {
  mode: "value";
  chains?: Chain[];
  assets?: AssetType[];
  holdingRanges?: string[];
  paymentRanges?: string[];
  tradingRanges?: string[];
  tivRanges?: string[];
}

export type LabelsFilterParams =
  | LabelsBehaviorFilterParams
  | LabelsValueFilterParams;

// ─── Risk ─────────────────────────────────────────────

export interface RiskDistributionItem {
  level: RiskLevel;
  count: number;
  percentage: number;
}

export interface RiskStats {
  totalAnalyzed: number;
  flaggedRate: number;
  avgEntropy: number;
}

export interface RiskFlaggedChain {
  chain: Chain;
  label: string;
  percentage: number;
}

export interface RiskOverview {
  distribution: RiskDistributionItem[];
  stats: RiskStats;
  topFlaggedChains: RiskFlaggedChain[];
}

export interface SybilCluster {
  id: string;
  name: string;
  riskLevel: RiskLevel;
  walletCount: number;
  detectionReasons: string[];
  entropy: number;
}

export interface RiskWallet {
  address: string;
  fullAddress: string;
  riskLevel: RiskLevel;
  cluster: string;
  flaggedAt: string;
  flaggedAgo: string;
  isBlocked: boolean;
}

export interface RiskWalletsParams {
  riskLevel?: RiskLevel | "all";
  sortBy?: "newest" | "oldest";
  page?: number;
  limit?: number;
}

export interface BlockWalletRequest {
  reason?: string;
}

export interface BlockWalletResult {
  address: string;
  blockedAt: string;
  reason: string;
}

// ─── Campaigns ────────────────────────────────────────

export interface CampaignTargeting {
  mode: "behavior" | "value";
  segments?: string[];
  percentileBy?: string[];
  assetTypes?: AssetType[];
  percentileRanges?: string[];
  availableValueRanges?: string[];
  chains: Chain[];
  sybilTolerance: SybilTolerance;
}

export interface CampaignDetails {
  startDate: string;
  endDate: string;
  partnerLinkUrl: string;
  ctaLabel: string;
  customCta?: string;
  accessControl: boolean;
}

export interface CampaignMetrics {
  targetUsers: number;
  estimatedReach: number;
  eligibilitySummary: string;
}

export interface Campaign {
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
  createdAt: string;
  updatedAt: string;
}

export interface CampaignListItem {
  id: number;
  partner: string;
  name: string;
  type: string;
  status: CampaignStatus;
  targetUsers: number;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface CreateCampaignRequest {
  action: "draft" | "launch";
  partner: string;
  name: string;
  type: string;
  customType?: string | null;
  description: string;
  targeting: CampaignTargeting;
  details: CampaignDetails;
}

export interface CreateCampaignResult {
  id: number;
  status: CampaignStatus;
  createdAt: string;
}

export interface EstimateReachRequest {
  mode: "behavior" | "value";
  segments?: string[];
  chains?: Chain[];
  percentileBy?: string[];
  assetTypes?: AssetType[];
  percentileRanges?: string[];
  availableValueRanges?: string[];
  sybilTolerance: SybilTolerance;
}

export interface EstimateReachResult {
  estimatedReach: number;
  sybilFiltered: number;
  eligibilitySummary: string;
}
