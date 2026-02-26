import type { GroupStats, DexProtocol, UserGroup, Chain } from "@/types/api";
import { gd } from "@/app/analytics/data";
import { wrap, delay } from "./helpers";

function toGroupStats(
  group: UserGroup,
  chain: Chain | "all",
): GroupStats {
  const d = gd[group];
  return {
    group,
    chain,
    users: d.users,
    assetAllocation: { stablecoin: d.stbl, native: d.native, others: d.other },
    portfolio: { avgValue: d.portfolio, avgAvailableValue: d.tiv },
    trading: {
      lifetimeVolume: d.ltVol,
      volume30d: d.vol30,
      avgTradeSize: d.tradeSize,
      avgSwaps30d: d.swaps,
    },
    defi: { avgTvl: d.defiTvl, unclaimedRewards: d.rewards },
    nft: { avgCount: d.nftCount, avgPortfolioValue: d.nftVal },
    gas: { avgTotal: d.gasTotal, avg30d: d.gas30, avgPerTx: d.gasTx },
    transfers: {
      avgInflow: d.txIn,
      avgOutflow: d.txOut,
      uniqueCounterparts: d.counterparts,
    },
    activity: {
      avgTxPerWeek: d.txWeek,
      mostActiveHour: d.activeHr,
      mostActiveDay: d.activeDay,
      avgWalletAge: d.walletAge,
    },
    activityStatus: {
      active7d: d.act7,
      active30d: d.act30,
      active90d: d.act90,
      inactive90dPlus: d.inact,
    },
    walletDistribution: {
      fresh: d.wFresh,
      kaiaOnly: d.wKaia,
      evmOnly: d.wEvm,
      multiChain: d.wMulti,
    },
    spendingDistribution: {
      whale: d.sWhale,
      high: d.sHigh,
      medium: d.sMed,
      low: d.sLow,
      inactive: d.sInact,
    },
  };
}

const DEX_PROTOCOLS: DexProtocol[] = [
  { rank: 1, name: "Uniswap V3", percentage: 34 },
  { rank: 2, name: "PancakeSwap", percentage: 22 },
  { rank: 3, name: "Curve Finance", percentage: 18 },
  { rank: 4, name: "SushiSwap", percentage: 14 },
  { rank: 5, name: "Balancer", percentage: 12 },
];

export async function mockGetGroupStats(
  chain: Chain | "all" = "all",
  group: UserGroup = "top5",
) {
  await delay();
  return wrap(toGroupStats(group, chain));
}

export async function mockGetDexProtocols() {
  await delay();
  return wrap(DEX_PROTOCOLS);
}
