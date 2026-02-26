"use client";

import { useState } from "react";
import { chains, groups } from "./data";
import s from "./page.module.css";
import Card from "@/components/Card/Card";
import DonutChart from "@/components/DonutChart/DonutChart";
import RankList from "@/components/RankList/RankList";
import { SkeletonGrid } from "@/components/Skeleton/Skeleton";
import ErrorState from "@/components/ErrorState/ErrorState";
import { cx } from "@/lib/utils";
import { useGroupStats, useDexProtocols } from "@/lib/queries/analytics";
import type { Chain, UserGroup } from "@/types/api";

export default function AnalyticsPage() {
  const [activeChain, setActiveChain] = useState<Chain | "all">("all");
  const [activeGroup, setActiveGroup] = useState<UserGroup>("top5");

  const { data: stats, isLoading, isError, refetch } = useGroupStats(activeChain, activeGroup);
  const { data: dexProtocols } = useDexProtocols(activeChain, activeGroup);

  const groupLabel = groups.find((g) => g.id === activeGroup)?.label ?? "";

  return (
    <div className="page active" id="page-analytics">
      <div className="main-header">
        <h1 className="main-title glow">User Analytics</h1>
      </div>

      <div className={s.chainTabs} id="chainTabs">
        {chains.map((c) => (
          <span
            key={c.id}
            className={cx(s.chainTab, activeChain === c.id && s.active)}
            onClick={() => setActiveChain(c.id as Chain | "all")}
          >
            {c.label}
          </span>
        ))}
      </div>

      {isLoading && <SkeletonGrid count={5} />}
      {isError && <ErrorState onRetry={() => refetch()} />}

      {stats && (
        <>
          <div className="grid-4" style={{ gridTemplateColumns: "repeat(5,1fr)" }}>
            <Card title="Total Users">
              <div className="kpi-value glow a-val" style={{ fontSize: "26px" }}>
                {stats.users.toLocaleString()}
              </div>
            </Card>
            <Card title="Avg Stablecoin Portfolio">
              <div className="kpi-value glow a-val" style={{ fontSize: "26px" }}>
                {stats.assetAllocation.stablecoin}
              </div>
            </Card>
            <Card title="Avg Native Token Portfolio">
              <div className="kpi-value glow a-val" style={{ fontSize: "26px" }}>
                {stats.assetAllocation.native}
              </div>
            </Card>
            <Card title="Avg Other Tokens Portfolio">
              <div className="kpi-value glow a-val" style={{ fontSize: "26px" }}>
                {stats.assetAllocation.others}
              </div>
            </Card>
            <Card
              title="Avg Available Value"
              infoTooltip={
                <>
                  <strong>Available Assets</strong> — Average assets held by your
                  connected users without active deployment.
                </>
              }
            >
              <div className="kpi-value glow a-val" style={{ fontSize: "26px" }}>
                {stats.portfolio.avgAvailableValue}
              </div>
            </Card>
          </div>

          <div className={s.groupBar}>
            <div className={s.groupPills} id="groupPills">
              {groups.map((g) => (
                <span
                  key={g.id}
                  className={cx(s.gpill, activeGroup === g.id && s.active)}
                  onClick={() => setActiveGroup(g.id as UserGroup)}
                >
                  {g.label}
                </span>
              ))}
            </div>
            <div className={s.groupSummary} id="groupSummary">
              {groupLabel} · {stats.users.toLocaleString()} users · Avg Portfolio{" "}
              {stats.portfolio.avgValue}
            </div>
          </div>

          <div className="grid-2-half">
            <Card title="Asset Allocation">
              <DonutChart
                segments={[
                  { colorVar: "--chart-1", percentage: 45, label: "Stables" },
                  { colorVar: "--chart-5", percentage: 35, label: "Native" },
                  { colorVar: "--chart-6", percentage: 20, label: "Others" },
                ]}
                totalValue={<span style={{ fontSize: "14px" }}>{stats.portfolio.avgValue}</span>}
                totalLabel="Split"
              />
            </Card>
            <Card title="Funding Sources">
              <DonutChart
                segments={[
                  { colorVar: "--chart-2", percentage: 55, label: "CEX" },
                  { colorVar: "--chart-3", percentage: 30, label: "Bridge" },
                  { colorVar: "--chart-4", percentage: 15, label: "Wallet" },
                ]}
                totalValue={<span style={{ fontSize: "14px" }}>Top 3</span>}
                totalLabel="Source"
              />
              <div className="kpi-tags" style={{ marginTop: "12px", justifyContent: "center" }}>
                <span className="kpi-tag">Binance</span>
                <span className="kpi-tag">OKX</span>
                <span className="kpi-tag">Bybit</span>
              </div>
            </Card>
          </div>

          <div className="grid-2-half">
            <Card title="DeFi Engagement">
              <div className={s.quadGrid} style={{ gridTemplateColumns: "1fr 1fr" }}>
                <div className={s.quadItem}>
                  <div className={s.quadLabel}>Avg DeFi TVL</div>
                  <div className={s.quadValue}>{stats.defi.avgTvl}</div>
                </div>
                <div className={s.quadItem}>
                  <div className={s.quadLabel}>Unclaimed Rewards</div>
                  <div className={s.quadValue}>{stats.defi.unclaimedRewards}</div>
                </div>
              </div>
              <div style={{ marginTop: "12px" }}>
                <div className={s.quadLabel} style={{ marginBottom: "6px" }}>DeFi Category Split</div>
                <div className={s.analyticsBarLabel} style={{ fontSize: "10px" }}>
                  <span>LP <b>35%</b></span>
                  <span>Lending <b>28%</b></span>
                  <span>Staking <b>25%</b></span>
                  <span>Vault <b>12%</b></span>
                </div>
                <div className="bar-track" style={{ height: "20px", marginTop: "4px" }}>
                  <div className="bar-segment" style={{ width: "35%", background: "var(--chart-1)" }} />
                  <div className="bar-segment" style={{ width: "28%", background: "var(--chart-2)" }} />
                  <div className="bar-segment" style={{ width: "25%", background: "var(--chart-3)" }} />
                  <div className="bar-segment" style={{ width: "12%", background: "var(--chart-5)" }} />
                </div>
              </div>
            </Card>
            <Card title="NFT Holdings">
              <div className={s.quadGrid} style={{ gridTemplateColumns: "1fr 1fr" }}>
                <div className={s.quadItem}>
                  <div className={s.quadLabel}>Avg NFT Count</div>
                  <div className={s.quadValue}>{stats.nft.avgCount}</div>
                </div>
                <div className={s.quadItem}>
                  <div className={s.quadLabel}>Avg Portfolio Value</div>
                  <div className={s.quadValue}>{stats.nft.avgPortfolioValue}</div>
                </div>
              </div>
              <div style={{ marginTop: "12px" }}>
                <div className={s.quadLabel} style={{ marginBottom: "6px" }}>Top Collections</div>
                <div className="kpi-tags">
                  <span className="kpi-tag">BAYC</span>
                  <span className="kpi-tag">Azuki</span>
                  <span className="kpi-tag">Pudgy Penguins</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid-2-half">
            <Card title="Gas Spending">
              <div className={s.tripleGrid}>
                <div className={s.quadItem}>
                  <div className={s.quadLabel}>Avg Total Gas</div>
                  <div className={s.quadValue}>{stats.gas.avgTotal}</div>
                </div>
                <div className={s.quadItem}>
                  <div className={s.quadLabel}>Avg 30d Gas</div>
                  <div className={s.quadValue}>{stats.gas.avg30d}</div>
                </div>
                <div className={s.quadItem}>
                  <div className={s.quadLabel}>Avg Gas/Tx</div>
                  <div className={s.quadValue}>{stats.gas.avgPerTx}</div>
                </div>
              </div>
            </Card>
            <Card title="Transfer Patterns">
              <div className={s.tripleGrid}>
                <div className={s.quadItem}>
                  <div className={s.quadLabel}>Avg Inflow <span style={{ color: "var(--accent-teal)" }}>▲</span></div>
                  <div className={s.quadValue}>{stats.transfers.avgInflow}</div>
                </div>
                <div className={s.quadItem}>
                  <div className={s.quadLabel}>Avg Outflow <span style={{ color: "var(--accent-red)" }}>▼</span></div>
                  <div className={s.quadValue}>{stats.transfers.avgOutflow}</div>
                </div>
                <div className={s.quadItem}>
                  <div className={s.quadLabel}>Unique Counterparts</div>
                  <div className={s.quadValue}>{stats.transfers.uniqueCounterparts}</div>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid-2-half">
            <Card title="Trading Summary">
              <div className={s.quadGrid}>
                <div className={s.quadItem}>
                  <div className={s.quadLabel}>Avg Lifetime Vol</div>
                  <div className={s.quadValue}>{stats.trading.lifetimeVolume}</div>
                </div>
                <div className={s.quadItem}>
                  <div className={s.quadLabel}>Avg 30d Vol</div>
                  <div className={s.quadValue}>{stats.trading.volume30d}</div>
                </div>
                <div className={s.quadItem}>
                  <div className={s.quadLabel}>Avg Trade Size</div>
                  <div className={s.quadValue}>{stats.trading.avgTradeSize}</div>
                </div>
                <div className={s.quadItem}>
                  <div className={s.quadLabel}>Avg Swaps (30d)</div>
                  <div className={s.quadValue}>{stats.trading.avgSwaps30d}</div>
                </div>
              </div>
            </Card>
            <Card title="Most Used DEX Protocols">
              <RankList
                items={
                  dexProtocols
                    ? dexProtocols.map((p, i) => ({
                        name: p.name,
                        value: p.percentage,
                        color: `var(--chart-${(i % 6) + 1})`,
                      }))
                    : [
                        { name: "Uniswap V3", value: 34, color: "var(--chart-1)" },
                        { name: "PancakeSwap", value: 22, color: "var(--chart-2)" },
                        { name: "Curve Finance", value: 18, color: "var(--chart-3)" },
                        { name: "SushiSwap", value: 14, color: "var(--chart-5)" },
                        { name: "Balancer", value: 12, color: "var(--chart-6)" },
                      ]
                }
              />
            </Card>
          </div>

          <div className="grid-2-half">
            <Card
              title="Wallet Type Distribution"
              infoTooltip={
                <>
                  <strong>Wallet classification based on chain activity:</strong>
                  <br /><strong>Fresh</strong> — Recently created, no significant on-chain activity
                  <br /><strong>Kaia Only</strong> — Active exclusively on Kaia chain
                  <br /><strong>EVM Only</strong> — Active on a single EVM chain
                  <br /><strong>Multi-chain</strong> — Active across 2 or more chains
                </>
              }
            >
              <div className={s.analyticsBarLabel}>
                <span>Fresh <b>{stats.walletDistribution.fresh}%</b></span>
                <span>Kaia Only <b>{stats.walletDistribution.kaiaOnly}%</b></span>
                <span>EVM Only <b>{stats.walletDistribution.evmOnly}%</b></span>
                <span>Multi-chain <b>{stats.walletDistribution.multiChain}%</b></span>
              </div>
              <div className="bar-track" style={{ height: "24px", marginTop: "8px" }}>
                <div className="bar-segment" style={{ width: `${stats.walletDistribution.fresh}%`, background: "var(--chart-4)" }} />
                <div className="bar-segment" style={{ width: `${stats.walletDistribution.kaiaOnly}%`, background: "var(--chart-3)" }} />
                <div className="bar-segment" style={{ width: `${stats.walletDistribution.evmOnly}%`, background: "var(--chart-1)" }} />
                <div className="bar-segment" style={{ width: `${stats.walletDistribution.multiChain}%`, background: "var(--chart-2)" }} />
              </div>
            </Card>
            <Card title="Spending Tier Distribution">
              <div className={s.analyticsBarLabel}>
                <span>Whale <b>{stats.spendingDistribution.whale}%</b></span>
                <span>High <b>{stats.spendingDistribution.high}%</b></span>
                <span>Med <b>{stats.spendingDistribution.medium}%</b></span>
                <span>Low <b>{stats.spendingDistribution.low}%</b></span>
                <span>Inactive <b>{stats.spendingDistribution.inactive}%</b></span>
              </div>
              <div className="bar-track" style={{ height: "24px", marginTop: "8px" }}>
                <div className="bar-segment" style={{ width: `${stats.spendingDistribution.whale}%`, background: "var(--accent-amber)" }} />
                <div className="bar-segment" style={{ width: `${stats.spendingDistribution.high}%`, background: "var(--accent-orange)" }} />
                <div className="bar-segment" style={{ width: `${stats.spendingDistribution.medium}%`, background: "var(--chart-1)" }} />
                <div className="bar-segment" style={{ width: `${stats.spendingDistribution.low}%`, background: "var(--chart-2)" }} />
                <div className="bar-segment" style={{ width: `${stats.spendingDistribution.inactive}%`, background: "var(--text-muted)" }} />
              </div>
            </Card>
          </div>

          <div className="grid-2-half">
            <Card title="Activity Profile">
              <div className={s.quadGrid}>
                <div className={s.quadItem}>
                  <div className={s.quadLabel}>Avg Tx/Week</div>
                  <div className={s.quadValue}>{stats.activity.avgTxPerWeek}</div>
                </div>
                <div className={s.quadItem}>
                  <div className={s.quadLabel}>Most Active Hour</div>
                  <div className={s.quadValue}>{stats.activity.mostActiveHour}</div>
                </div>
                <div className={s.quadItem}>
                  <div className={s.quadLabel}>Most Active Day</div>
                  <div className={s.quadValue}>{stats.activity.mostActiveDay}</div>
                </div>
                <div className={s.quadItem}>
                  <div className={s.quadLabel}>Avg Wallet Age</div>
                  <div className={s.quadValue}>{stats.activity.avgWalletAge}</div>
                </div>
              </div>
            </Card>
            <Card title="User Activity Status">
              <div className={s.analyticsBarLabel}>
                <span>Active 7d <b>{stats.activityStatus.active7d}%</b></span>
                <span>Active 30d <b>{stats.activityStatus.active30d}%</b></span>
                <span>Active 90d <b>{stats.activityStatus.active90d}%</b></span>
                <span>Inactive 90d+ <b>{stats.activityStatus.inactive90dPlus}%</b></span>
              </div>
              <div className="bar-track" style={{ height: "24px", marginTop: "8px" }}>
                <div className="bar-segment" style={{ width: `${stats.activityStatus.active7d}%`, background: "var(--accent-teal)" }} />
                <div className="bar-segment" style={{ width: `${stats.activityStatus.active30d}%`, background: "var(--chart-1)" }} />
                <div className="bar-segment" style={{ width: `${stats.activityStatus.active90d}%`, background: "var(--accent-amber)" }} />
                <div className="bar-segment" style={{ width: `${stats.activityStatus.inactive90dPlus}%`, background: "var(--accent-red)" }} />
              </div>
              <div className="bar-legend" style={{ marginTop: "8px" }}>
                <span className="bar-legend-item">
                  <span className="bar-legend-dot" style={{ background: "var(--accent-teal)" }} />
                  {Math.round((stats.users * stats.activityStatus.active7d) / 100).toLocaleString()} users
                </span>
                <span className="bar-legend-item">
                  <span className="bar-legend-dot" style={{ background: "var(--chart-1)" }} />
                  {Math.round((stats.users * stats.activityStatus.active30d) / 100).toLocaleString()} users
                </span>
                <span className="bar-legend-item">
                  <span className="bar-legend-dot" style={{ background: "var(--accent-amber)" }} />
                  {Math.round((stats.users * stats.activityStatus.active90d) / 100).toLocaleString()} users
                </span>
                <span className="bar-legend-item">
                  <span className="bar-legend-dot" style={{ background: "var(--accent-red)" }} />
                  {Math.round((stats.users * stats.activityStatus.inactive90dPlus) / 100).toLocaleString()} users
                </span>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
