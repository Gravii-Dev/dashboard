"use client";

import { useState } from "react";
import { PageHeaderPlain } from "@/components/dashboard/PageHeader";
import { Card, CardTitle } from "@/components/dashboard/Card";
import { InfoTooltip } from "@/components/dashboard/InfoTooltip";
import {
  ANALYTICS_CHAINS,
  GROUP_DATA,
  GROUP_LABELS,
  type AnalyticsGroupKey,
} from "@/lib/analytics-data";

export default function AnalyticsPage() {
  const [chain, setChain] = useState("All");
  const [group, setGroup] = useState<AnalyticsGroupKey>("top5");
  const d = GROUP_DATA[group];

  return (
    <>
      <PageHeaderPlain title="User Analytics" />

      <div className="chain-tabs">
        {ANALYTICS_CHAINS.map((c) => (
          <span
            key={c}
            role="button"
            tabIndex={0}
            className={`chain-tab ${chain === c ? "active" : ""}`}
            onClick={() => setChain(c)}
            onKeyDown={(e) => e.key === "Enter" && setChain(c)}
          >
            {c}
          </span>
        ))}
      </div>

      <div className="grid-4" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
        <Card><CardTitle glow>Total Users</CardTitle><div className="kpi-value glow a-val" style={{ fontSize: 26 }}>301,012</div></Card>
        <Card><CardTitle glow>Avg Stablecoin Portfolio</CardTitle><div className="kpi-value glow a-val" style={{ fontSize: 26 }}>$3,820</div></Card>
        <Card><CardTitle glow>Avg Native Token Portfolio</CardTitle><div className="kpi-value glow a-val" style={{ fontSize: 26 }}>$2,940</div></Card>
        <Card><CardTitle glow>Avg Other Tokens Portfolio</CardTitle><div className="kpi-value glow a-val" style={{ fontSize: 26 }}>$1,670</div></Card>
        <Card><CardTitle glow>Avg Idle Value (TIV) <InfoTooltip title="Total Idle Value" body="Average assets sitting in wallet without active deployment." /></CardTitle><div className="kpi-value glow a-val" style={{ fontSize: 26 }}>$4,280</div></Card>
      </div>

      <div className="group-bar">
        <div className="group-pills">
          {(Object.keys(GROUP_DATA) as AnalyticsGroupKey[]).map((k) => (
            <span
              key={k}
              role="button"
              tabIndex={0}
              className={`gpill ${group === k ? "active" : ""}`}
              onClick={() => setGroup(k)}
              onKeyDown={(e) => e.key === "Enter" && setGroup(k)}
              data-group={k}
            >
              {GROUP_LABELS[k]}
            </span>
          ))}
        </div>
        <div className="group-summary">{GROUP_LABELS[group]} · {d.users.toLocaleString()} users · Avg Portfolio {d.portfolio}</div>
      </div>

      <div className="grid-2-half">
        <div className="card">
          <div className="card-title glow-sm">Asset Allocation</div>
          <div className="donut-wrapper">
            <div className="donut-container" style={{ width: 120, height: 120 }}>
              <svg className="donut-svg" width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="48" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="14" />
                <circle cx="60" cy="60" r="48" fill="none" stroke="var(--chart-1)" strokeWidth="14" strokeDasharray="135.7 301.6" strokeDashoffset="0" />
                <circle cx="60" cy="60" r="48" fill="none" stroke="var(--chart-5)" strokeWidth="14" strokeDasharray="105.6 301.6" strokeDashoffset="-135.7" />
                <circle cx="60" cy="60" r="48" fill="none" stroke="var(--chart-6)" strokeWidth="14" strokeDasharray="60.3 301.6" strokeDashoffset="-241.3" />
              </svg>
              <div className="donut-center"><div className="donut-center-label">Split</div><div className="donut-center-value glow-sm" style={{ fontSize: 14 }}>{d.portfolio}</div></div>
            </div>
            <div className="donut-legend">
              <div className="legend-item"><span className="legend-dot" style={{ background: "var(--chart-1)" }}></span>Stables<span className="legend-value">45%</span></div>
              <div className="legend-item"><span className="legend-dot" style={{ background: "var(--chart-5)" }}></span>Native<span className="legend-value">35%</span></div>
              <div className="legend-item"><span className="legend-dot" style={{ background: "var(--chart-6)" }}></span>Others<span className="legend-value">20%</span></div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-title glow-sm">Funding Sources</div>
          <div className="donut-wrapper">
            <div className="donut-container" style={{ width: 120, height: 120 }}>
              <svg className="donut-svg" width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="48" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="14" />
                <circle cx="60" cy="60" r="48" fill="none" stroke="var(--chart-2)" strokeWidth="14" strokeDasharray="165.9 301.6" strokeDashoffset="0" />
                <circle cx="60" cy="60" r="48" fill="none" stroke="var(--chart-3)" strokeWidth="14" strokeDasharray="90.5 301.6" strokeDashoffset="-165.9" />
                <circle cx="60" cy="60" r="48" fill="none" stroke="var(--chart-4)" strokeWidth="14" strokeDasharray="45.2 301.6" strokeDashoffset="-256.4" />
              </svg>
              <div className="donut-center"><div className="donut-center-label">Source</div><div className="donut-center-value glow-sm" style={{ fontSize: 14 }}>Top 3</div></div>
            </div>
            <div className="donut-legend">
              <div className="legend-item"><span className="legend-dot" style={{ background: "var(--chart-2)" }}></span>CEX<span className="legend-value">55%</span></div>
              <div className="legend-item"><span className="legend-dot" style={{ background: "var(--chart-3)" }}></span>Bridge<span className="legend-value">30%</span></div>
              <div className="legend-item"><span className="legend-dot" style={{ background: "var(--chart-4)" }}></span>Wallet<span className="legend-value">15%</span></div>
            </div>
          </div>
          <div className="kpi-tags" style={{ marginTop: 12, justifyContent: "center" }}><span className="kpi-tag">Binance</span><span className="kpi-tag">OKX</span><span className="kpi-tag">Bybit</span></div>
        </div>
      </div>

      <div className="grid-2-half">
        <div className="card">
          <div className="card-title glow-sm">DeFi Engagement</div>
          <div className="quad-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div className="quad-item"><div className="quad-label">Avg DeFi TVL</div><div className="quad-value">{d.defiTvl}</div></div>
            <div className="quad-item"><div className="quad-label">Unclaimed Rewards</div><div className="quad-value">{d.rewards}</div></div>
          </div>
          <div style={{ marginTop: 12 }}>
            <div className="quad-label" style={{ marginBottom: 6 }}>DeFi Category Split</div>
            <div className="analytics-bar-label" style={{ fontSize: 10 }}><span>LP <b>35%</b></span><span>Lending <b>28%</b></span><span>Staking <b>25%</b></span><span>Vault <b>12%</b></span></div>
            <div className="bar-track" style={{ height: 20, marginTop: 4 }}>
              <div className="bar-segment" style={{ width: "35%", background: "var(--chart-1)" }}></div>
              <div className="bar-segment" style={{ width: "28%", background: "var(--chart-2)" }}></div>
              <div className="bar-segment" style={{ width: "25%", background: "var(--chart-3)" }}></div>
              <div className="bar-segment" style={{ width: "12%", background: "var(--chart-5)" }}></div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-title glow-sm">NFT Holdings</div>
          <div className="quad-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div className="quad-item"><div className="quad-label">Avg NFT Count</div><div className="quad-value">{d.nftCount}</div></div>
            <div className="quad-item"><div className="quad-label">Avg Portfolio Value</div><div className="quad-value">{d.nftVal}</div></div>
          </div>
          <div style={{ marginTop: 12 }}>
            <div className="quad-label" style={{ marginBottom: 6 }}>Top Collections</div>
            <div className="kpi-tags"><span className="kpi-tag">BAYC</span><span className="kpi-tag">Azuki</span><span className="kpi-tag">Pudgy Penguins</span></div>
          </div>
        </div>
      </div>

      <div className="grid-2-half">
        <div className="card">
          <div className="card-title glow-sm">Gas Spending</div>
          <div className="triple-grid">
            <div className="quad-item"><div className="quad-label">Avg Total Gas</div><div className="quad-value">{d.gasTotal}</div></div>
            <div className="quad-item"><div className="quad-label">Avg 30d Gas</div><div className="quad-value">{d.gas30}</div></div>
            <div className="quad-item"><div className="quad-label">Avg Gas/Tx</div><div className="quad-value">{d.gasTx}</div></div>
          </div>
        </div>
        <div className="card">
          <div className="card-title glow-sm">Transfer Patterns</div>
          <div className="triple-grid">
            <div className="quad-item"><div className="quad-label">Avg Inflow <span style={{ color: "var(--accent-teal)" }}>▲</span></div><div className="quad-value">{d.txIn}</div></div>
            <div className="quad-item"><div className="quad-label">Avg Outflow <span style={{ color: "var(--accent-red)" }}>▼</span></div><div className="quad-value">{d.txOut}</div></div>
            <div className="quad-item"><div className="quad-label">Unique Counterparts</div><div className="quad-value">{d.counterparts}</div></div>
          </div>
        </div>
      </div>

      <div className="grid-2-half">
        <div className="card">
          <div className="card-title glow-sm">Trading Summary</div>
          <div className="quad-grid">
            <div className="quad-item"><div className="quad-label">Avg Lifetime Vol</div><div className="quad-value">{d.ltVol}</div></div>
            <div className="quad-item"><div className="quad-label">Avg 30d Vol</div><div className="quad-value">{d.vol30}</div></div>
            <div className="quad-item"><div className="quad-label">Avg Trade Size</div><div className="quad-value">{d.tradeSize}</div></div>
            <div className="quad-item"><div className="quad-label">Avg Swaps (30d)</div><div className="quad-value">{d.swaps}</div></div>
          </div>
        </div>
        <div className="card">
          <div className="card-title glow-sm">Most Used DEX Protocols</div>
          <div className="rank-list">
            <div className="rank-item"><span className="rank-name">Pendle Finance</span><div className="rank-bar-track"><div className="rank-bar" style={{ width: "72%", background: "var(--chart-1)" }}></div></div><span className="rank-val">72%</span></div>
            <div className="rank-item"><span className="rank-name">Pendle Finance</span><div className="rank-bar-track"><div className="rank-bar" style={{ width: "48%", background: "var(--chart-2)" }}></div></div><span className="rank-val">48%</span></div>
            <div className="rank-item"><span className="rank-name">PancakeSwap</span><div className="rank-bar-track"><div className="rank-bar" style={{ width: "35%", background: "var(--chart-3)" }}></div></div><span className="rank-val">35%</span></div>
            <div className="rank-item"><span className="rank-name">Curve</span><div className="rank-bar-track"><div className="rank-bar" style={{ width: "22%", background: "var(--chart-5)" }}></div></div><span className="rank-val">22%</span></div>
            <div className="rank-item"><span className="rank-name">SushiSwap</span><div className="rank-bar-track"><div className="rank-bar" style={{ width: "15%", background: "var(--chart-6)" }}></div></div><span className="rank-val">15%</span></div>
          </div>
        </div>
      </div>

      <div className="grid-2-half">
        <div className="card">
          <div className="card-title glow-sm">Wallet Type Distribution <span className="info-icon">ⓘ<div className="info-tooltip"><strong>Wallet classification based on chain activity:</strong><br /><strong>Fresh</strong> — Recently created, no significant on-chain activity<br /><strong>Kaia Only</strong> — Active exclusively on Kaia chain<br /><strong>EVM Only</strong> — Active on a single EVM chain<br /><strong>Multi-chain</strong> — Active across 2 or more chains</div></span></div>
          <div className="analytics-bar-label"><span>Fresh <b>{d.wFresh}%</b></span><span>Kaia Only <b>{d.wKaia}%</b></span><span>EVM Only <b>{d.wEvm}%</b></span><span>Multi-chain <b>{d.wMulti}%</b></span></div>
          <div className="bar-track" style={{ height: 24, marginTop: 8 }}>
            <div className="bar-segment" style={{ width: `${d.wFresh}%`, background: "var(--chart-4)" }}></div>
            <div className="bar-segment" style={{ width: `${d.wKaia}%`, background: "var(--chart-3)" }}></div>
            <div className="bar-segment" style={{ width: `${d.wEvm}%`, background: "var(--chart-1)" }}></div>
            <div className="bar-segment" style={{ width: `${d.wMulti}%`, background: "var(--chart-2)" }}></div>
          </div>
        </div>
        <div className="card">
          <div className="card-title glow-sm">Spending Tier Distribution</div>
          <div className="analytics-bar-label"><span>Whale <b>{d.sWhale}%</b></span><span>High <b>{d.sHigh}%</b></span><span>Med <b>{d.sMed}%</b></span><span>Low <b>{d.sLow}%</b></span><span>Inactive <b>{d.sInact}%</b></span></div>
          <div className="bar-track" style={{ height: 24, marginTop: 8 }}>
            <div className="bar-segment" style={{ width: `${d.sWhale}%`, background: "var(--accent-amber)" }}></div>
            <div className="bar-segment" style={{ width: `${d.sHigh}%`, background: "var(--accent-orange)" }}></div>
            <div className="bar-segment" style={{ width: `${d.sMed}%`, background: "var(--chart-1)" }}></div>
            <div className="bar-segment" style={{ width: `${d.sLow}%`, background: "var(--chart-2)" }}></div>
            <div className="bar-segment" style={{ width: `${d.sInact}%`, background: "var(--text-muted)" }}></div>
          </div>
        </div>
      </div>

      <div className="grid-2-half">
        <div className="card">
          <div className="card-title glow-sm">Activity Profile</div>
          <div className="quad-grid">
            <div className="quad-item"><div className="quad-label">Avg Tx/Week</div><div className="quad-value">{d.txWeek}</div></div>
            <div className="quad-item"><div className="quad-label">Most Active Hour</div><div className="quad-value">{d.activeHr}</div></div>
            <div className="quad-item"><div className="quad-label">Most Active Day</div><div className="quad-value">{d.activeDay}</div></div>
            <div className="quad-item"><div className="quad-label">Avg Wallet Age</div><div className="quad-value">{d.walletAge}</div></div>
          </div>
        </div>
        <div className="card">
          <div className="card-title glow-sm">User Activity Status</div>
          <div className="analytics-bar-label"><span>Active 7d <b>{d.act7}%</b></span><span>Active 30d <b>{d.act30}%</b></span><span>Active 90d <b>{d.act90}%</b></span><span>Inactive 90d+ <b>{d.inact}%</b></span></div>
          <div className="bar-track" style={{ height: 24, marginTop: 8 }}>
            <div className="bar-segment" style={{ width: `${d.act7}%`, background: "var(--accent-teal)" }}></div>
            <div className="bar-segment" style={{ width: `${d.act30}%`, background: "var(--chart-1)" }}></div>
            <div className="bar-segment" style={{ width: `${d.act90}%`, background: "var(--accent-amber)" }}></div>
            <div className="bar-segment" style={{ width: `${d.inact}%`, background: "var(--accent-red)" }}></div>
          </div>
          <div className="bar-legend" style={{ marginTop: 8 }}>
            <span className="bar-legend-item"><span className="bar-legend-dot" style={{ background: "var(--accent-teal)" }}></span>5,724 users</span>
            <span className="bar-legend-item"><span className="bar-legend-dot" style={{ background: "var(--chart-1)" }}></span>3,913 users</span>
            <span className="bar-legend-item"><span className="bar-legend-dot" style={{ background: "var(--accent-amber)" }}></span>2,559 users</span>
            <span className="bar-legend-item"><span className="bar-legend-dot" style={{ background: "var(--accent-red)" }}></span>2,860 users</span>
          </div>
        </div>
      </div>
    </>
  );
}
