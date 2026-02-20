"use client";

import { useState, useMemo } from "react";
import { PageHeaderPlain } from "@/components/dashboard/PageHeader";
import { Card, CardTitle } from "@/components/dashboard/Card";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { RiskBadge } from "@/components/dashboard/RiskBadge";
import { ChainBadge } from "@/components/dashboard/ChainBadge";
import { ClusterCard } from "@/components/dashboard/ClusterCard";
import { FLAGGED_ROWS, RISK_CLUSTERS, FLAGGED_CHAINS } from "@/lib/risk-data";

export default function RiskPage() {
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  const rows = useMemo(() => {
    let r = [...FLAGGED_ROWS];
    if (riskFilter !== "all") r = r.filter((row) => row.risk === riskFilter);
    r.sort((a, b) => (sortBy === "newest" ? a.time - b.time : b.time - a.time));
    return r;
  }, [riskFilter, sortBy]);

  return (
    <>
      <PageHeaderPlain title="Risk Analysis" />

      <div className="risk-grid-top">
        <div className="risk-left">
          <Card>
            <CardTitle glow>Risk Level Distribution</CardTitle>
            <div className="donut-wrapper">
              <div className="donut-container" style={{ width: 140, height: 140 }}>
                <svg className="donut-svg" width="140" height="140" viewBox="0 0 140 140">
                  <circle cx="70" cy="70" r="56" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="16" />
                  <circle cx="70" cy="70" r="56" fill="none" stroke="var(--accent-red)" strokeWidth="16" strokeDasharray="80.9 351.9" strokeDashoffset="0" />
                  <circle cx="70" cy="70" r="56" fill="none" stroke="var(--accent-orange)" strokeWidth="16" strokeDasharray="119.6 351.9" strokeDashoffset="-80.9" />
                  <circle cx="70" cy="70" r="56" fill="none" stroke="var(--accent-amber)" strokeWidth="16" strokeDasharray="98.5 351.9" strokeDashoffset="-200.5" />
                  <circle cx="70" cy="70" r="56" fill="none" stroke="var(--accent-teal)" strokeWidth="16" strokeDasharray="52.8 351.9" strokeDashoffset="-299" />
                </svg>
                <div className="donut-center">
                  <div className="donut-center-value glow-sm" style={{ fontSize: 22 }}>19%</div>
                  <div className="donut-center-label">At Risk</div>
                </div>
              </div>
              <div className="donut-legend" style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
                <div className="legend-item"><span className="legend-dot" style={{ background: "var(--accent-red)" }} />Critical<span className="legend-value">538 · 23%</span></div>
                <div className="legend-item"><span className="legend-dot" style={{ background: "var(--accent-orange)" }} />High<span className="legend-value">796 · 34%</span></div>
                <div className="legend-item"><span className="legend-dot" style={{ background: "var(--accent-amber)" }} />Medium<span className="legend-value">655 · 28%</span></div>
                <div className="legend-item"><span className="legend-dot" style={{ background: "var(--accent-teal)" }} />Low<span className="legend-value">351 · 15%</span></div>
              </div>
            </div>
          </Card>
          <div className="risk-mini-kpis">
            <KpiCard title="Total Analyzed" value="2,340" cardClassName="mini-kpi" valueStyle={{ fontSize: 24 }} />
            <KpiCard title="Flagged Rate" value="19%" cardClassName="mini-kpi" valueStyle={{ fontSize: 24 }} />
            <KpiCard title="Avg Entropy" value="0.15" cardClassName="mini-kpi" valueStyle={{ fontSize: 24 }} />
          </div>
          <Card>
            <CardTitle glow>Top Flagged Chains</CardTitle>
            {FLAGGED_CHAINS.map((row) => (
              <div key={row.chain} className="flagged-chain">
                <div className="flagged-chain-header">
                  <ChainBadge label={row.chain} variant={row.chainVariant} />
                  <span className="bar-meta">{row.pct}%</span>
                </div>
                <div className="bar-track" style={{ height: 20 }}>
                  <div className="bar-segment" style={{ width: `${row.pct}%`, background: row.color, borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </Card>
        </div>
        <div className="risk-right">
          <Card className="risk-right-card" style={{ height: "100%" }}>
            <CardTitle glow>Sybil Clusters Detected</CardTitle>
            <div className="cluster-stack">
              {RISK_CLUSTERS.map((cluster) => (
                <ClusterCard key={cluster.id} data={cluster} />
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Card style={{ marginTop: 20 }}>
        <div className="table-header">
          <CardTitle glow style={{ marginBottom: 0 }}>Recently Flagged Wallets</CardTitle>
          <div className="table-filters">
            <select className="table-filter" value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}>
              <option value="all">All Levels</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
            </select>
            <select className="table-filter" value={sortBy} onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
        <table className="flagged-table">
          <thead>
            <tr><th>Wallet Address</th><th>Risk Level</th><th>Cluster</th><th>Flagged</th><th>Action</th></tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                <td className="mono">{row.addr}</td>
                <td><RiskBadge label={row.risk} variant={row.risk} /></td>
                <td>{row.cluster}</td>
                <td>{row.time} hours ago</td>
                <td><button type="button" className="btn-block">Block</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
