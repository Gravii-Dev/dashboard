"use client";

import { useState, useMemo } from "react";
import { PageHeaderPlain } from "@/components/dashboard/PageHeader";
import { Card, CardTitle } from "@/components/dashboard/Card";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ClusterCard } from "@/components/dashboard/ClusterCard";
import { RiskDonutChart } from "@/components/dashboard/RiskDonutChart";
import { RiskFlaggedChains } from "@/components/dashboard/RiskFlaggedChains";
import { FlaggedWalletsTable } from "@/components/dashboard/FlaggedWalletsTable";
import { FLAGGED_ROWS, RISK_CLUSTERS, FLAGGED_CHAINS } from "@/lib/risk-data";
import pageStyles from "./RiskPage.module.css";

const DONUT_SEGMENTS = [
  { color: "var(--accent-red)", count: 538, label: "Critical", pct: 23 },
  { color: "var(--accent-orange)", count: 796, label: "High", pct: 34 },
  { color: "var(--accent-amber)", count: 655, label: "Medium", pct: 28 },
  { color: "var(--accent-teal)", count: 351, label: "Low", pct: 15 },
];

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

      <div className={pageStyles.gridTop}>
        <div className={pageStyles.left}>
          <Card>
            <CardTitle glow>Risk Level Distribution</CardTitle>
            <RiskDonutChart
              centerValue="19%"
              centerLabel="At Risk"
              segments={DONUT_SEGMENTS}
            />
          </Card>
          <div className={pageStyles.miniKpis}>
            <KpiCard title="Total Analyzed" value="2,340" cardClassName={pageStyles.miniKpi} valueStyle={{ fontSize: 24 }} />
            <KpiCard title="Flagged Rate" value="19%" cardClassName={pageStyles.miniKpi} valueStyle={{ fontSize: 24 }} />
            <KpiCard title="Avg Entropy" value="0.15" cardClassName={pageStyles.miniKpi} valueStyle={{ fontSize: 24 }} />
          </div>
          <Card>
            <CardTitle glow>Top Flagged Chains</CardTitle>
            <RiskFlaggedChains rows={FLAGGED_CHAINS} />
          </Card>
        </div>
        <div className={pageStyles.right}>
          <Card className={pageStyles.rightCard} style={{ height: "100%" }}>
            <CardTitle glow>Sybil Clusters Detected</CardTitle>
            <div className={pageStyles.clusterStack}>
              {RISK_CLUSTERS.map((cluster) => (
                <ClusterCard key={cluster.id} data={cluster} />
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Card style={{ marginTop: 20 }}>
        <FlaggedWalletsTable
          title={<CardTitle glow style={{ marginBottom: 0 }}>Recently Flagged Wallets</CardTitle>}
          rows={rows}
          riskFilter={riskFilter}
          sortBy={sortBy}
          onRiskFilterChange={setRiskFilter}
          onSortByChange={setSortBy}
        />
      </Card>
    </>
  );
}
