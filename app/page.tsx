"use client";

import Link from "next/link";
import Card from "@/components/Card/Card";
import DonutChart from "@/components/DonutChart/DonutChart";
import { SkeletonGrid } from "@/components/Skeleton/Skeleton";
import ErrorState from "@/components/ErrorState/ErrorState";
import { useOverviewSummary } from "@/lib/queries/overview";
import type { ChainBreakdown, DonutData } from "@/types/api";

function DonutSection({ title, data, tooltip }: { title: string; data: DonutData; tooltip?: React.ReactNode }) {
  return (
    <Card title={title} infoTooltip={tooltip}>
      <DonutChart
        segments={data.segments.map((seg) => ({
          colorVar: `--${seg.colorKey}`,
          percentage: seg.percentage,
          label: seg.label,
        }))}
        totalValue={<>{data.total.replace("$", "")}<sup>$</sup></>}
        totalLabel="Total"
      />
    </Card>
  );
}

const AVAILABLE_TOOLTIP = (
  <>
    <strong>Available Assets</strong> — Assets held by your connected users
    without active deployment. Not staked, lent, or providing liquidity.
  </>
);

const CHAIN_BADGE_MAP: Record<string, string> = {
  eth: "ethereum",
  bsc: "bsc",
  base: "base",
};

const CHAIN_COLORS_DEPLOYED = ["--chart-1", "--chart-2", "--chart-6"];
const CHAIN_COLORS_AVAILABLE = ["--chart-3", "--chart-5", "--chart-6"];

function BarSection({ chain, colorSet }: { chain: ChainBreakdown; colorSet: string[] }) {
  const badge = CHAIN_BADGE_MAP[chain.chain] ?? chain.chain;
  return (
    <div className="bar-section">
      <div className="bar-header">
        <span className={`chain-badge ${badge}`}>{chain.label}</span>
        <span className="bar-meta">{chain.userCount} users · {chain.percentage}%</span>
      </div>
      <div className="bar-track">
        {chain.breakdown.map((b, i) => (
          <div
            key={b.type}
            className="bar-segment"
            style={{ width: `${b.percentage}%`, background: `var(${colorSet[i] ?? colorSet[0]})` }}
          >
            <span className="bar-segment-label">{b.type === "stables" ? "Stables" : b.type === "native" ? "Native" : "Other"}</span>
          </div>
        ))}
      </div>
      <div className="bar-legend">
        {chain.breakdown.map((b, i) => (
          <span key={b.type} className="bar-legend-item">
            <span className="bar-legend-dot" style={{ background: `var(${colorSet[i] ?? colorSet[0]})` }} />
            {b.type === "stables" ? "Stables" : b.type === "native" ? "Native" : "Other"} {b.percentage}%
          </span>
        ))}
      </div>
    </div>
  );
}

export default function OverviewPage() {
  const { data, isLoading, isError, refetch } = useOverviewSummary();

  if (isLoading) {
    return (
      <div className="page active" id="page-overview">
        <div className="main-header">
          <h1 className="main-title glow">Gravii Dashboard</h1>
        </div>
        <SkeletonGrid count={4} />
        <SkeletonGrid count={2} columns={2} tall />
        <SkeletonGrid count={4} />
        <SkeletonGrid count={4} />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="page active" id="page-overview">
        <div className="main-header">
          <h1 className="main-title glow">Gravii Dashboard</h1>
        </div>
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  const { deployedAssets, availableAssets, chainDistribution, kpis, insights } = data;

  return (
    <div className="page active" id="page-overview">
      <div className="main-header">
        <h1 className="main-title glow">Gravii Dashboard</h1>
        <Link href="/campaigns">
          <button className="header-cta">Create your campaigns</button>
        </Link>
      </div>

      <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "14px", letterSpacing: "0.3px" }}>
        Your Connected Users — Asset Overview
      </div>

      <div className="grid-4">
        <DonutSection title="Deployed — Stables" data={deployedAssets.stables} />
        <DonutSection title="Deployed — Tokens" data={deployedAssets.tokens} />
        <DonutSection title="Available — Stables" data={availableAssets.stables} tooltip={AVAILABLE_TOOLTIP} />
        <DonutSection title="Available — Tokens" data={availableAssets.tokens} tooltip={AVAILABLE_TOOLTIP} />
      </div>

      <div className="grid-2-half">
        <div className="card">
          <div className="card-title glow-sm">Deployed by Chain — Top 3</div>
          {chainDistribution.deployed.map((c) => (
            <BarSection key={c.chain} chain={c} colorSet={CHAIN_COLORS_DEPLOYED} />
          ))}
        </div>
        <div className="card">
          <div className="card-title glow-sm">Available by Chain — Top 3</div>
          {chainDistribution.available.map((c) => (
            <BarSection key={c.chain} chain={c} colorSet={CHAIN_COLORS_AVAILABLE} />
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "12px", textAlign: "right" }}>
        <Link href="/analytics" className="analytics-link">Want deeper insights? → Go to User Analytics</Link>
      </div>

      <div className="grid-4">
        <div className="card">
          <div className="card-title glow-sm">Avg. Monthly Trading Volume<br />(Per wallet)</div>
          <div className="kpi-value glow">${kpis.avgMonthlyTradingVolume.toLocaleString()}</div>
        </div>
        <div className="card">
          <div className="card-title glow-sm">Avg. Monthly Tx Count</div>
          <div className="kpi-value glow">{kpis.avgMonthlyTxCount}</div>
        </div>
        <div className="card">
          <div className="card-title glow-sm">Avg. Monthly Payment Amount</div>
          <div className="kpi-value glow">${kpis.avgMonthlyPaymentAmount.toLocaleString()}</div>
        </div>
        <div className="card">
          <div className="card-title glow-sm">Avg. Monthly Payment Count</div>
          <div className="kpi-value glow">{kpis.avgMonthlyPaymentCount}</div>
        </div>
      </div>

      <div className="grid-4">
        <div className="card">
          <div className="card-title glow-sm">Active wallets (7d)</div>
          <div className="kpi-value glow">{kpis.activeWallets7d.toLocaleString()}</div>
        </div>
        <div className="card">
          <div className="card-title glow-sm">Active traders (7d)</div>
          <div className="kpi-value glow">{kpis.activeTraders7d.toLocaleString()}</div>
        </div>
        <div className="card">
          <div className="card-title glow-sm">Active Protocol Users</div>
          <div className="kpi-value glow">{kpis.activeProtocolUsers.toLocaleString()}</div>
        </div>
        <div className="card">
          <div className="card-title glow-sm">Cross-chain Users</div>
          <div className="kpi-value glow">{kpis.crossChainUsers.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid-4">
        <div className="card">
          <div className="card-title glow-sm">Top 3 Interacted Protocols</div>
          <div className="kpi-tags">
            {insights.topProtocols.map((p, i) => (
              <span key={i} className="kpi-tag">{p}</span>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-title glow-sm">Top 3 Funding Sources</div>
          <div className="kpi-tags">
            {insights.topFundingSources.map((s, i) => (
              <span key={i} className="kpi-tag">{s}</span>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-title glow-sm">Net NFT Worth (Total)</div>
          <div className="kpi-value glow">${insights.netNftWorth.toLocaleString()}</div>
        </div>
        <div className="card">
          <div className="card-title glow-sm">Sybil rate</div>
          <div className="kpi-value glow">{insights.sybilRate}%</div>
        </div>
      </div>
    </div>
  );
}
