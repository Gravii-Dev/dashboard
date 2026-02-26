"use client";

import { useState } from "react";
import DonutChart from "@/components/DonutChart/DonutChart";
import { SkeletonGrid, SkeletonTable } from "@/components/Skeleton/Skeleton";
import ErrorState from "@/components/ErrorState/ErrorState";
import { cx } from "@/lib/utils";
import { useToast } from "@/components/Toast/ToastProvider";
import {
  useRiskOverview,
  useRiskClusters,
  useRiskWallets,
  useBlockWallet,
} from "@/lib/queries/risk";
import type { RiskLevel } from "@/types/api";
import s from "./page.module.css";

const RISK_COLORS: Record<string, string> = {
  critical: "--accent-red",
  high: "--accent-orange",
  medium: "--accent-amber",
  low: "--accent-teal",
};

const CHAIN_BADGE_MAP: Record<string, { cls: string; label: string }> = {
  eth: { cls: "ethereum", label: "Ethereum" },
  bsc: { cls: "bsc", label: "BSC" },
  base: { cls: "base", label: "Base" },
};

export default function RiskPage() {
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "all">("all");
  const [sortFilter, setSortFilter] = useState<"newest" | "oldest">("newest");
  const [blockTarget, setBlockTarget] = useState<string | null>(null);

  const toast = useToast();
  const { data: overview, isLoading: overviewLoading, isError: overviewError, refetch: refetchOverview } = useRiskOverview();
  const { data: clusters } = useRiskClusters();
  const { data: walletsData, isLoading: walletsLoading, refetch: refetchWallets } = useRiskWallets({
    riskLevel: riskFilter,
    sortBy: sortFilter,
  });
  const blockMutation = useBlockWallet();

  const getRiskBadgeClass = (risk: string) => {
    if (risk === "critical") return cx(s.riskBadge, s.critical);
    if (risk === "high") return cx(s.riskBadge, s.high);
    if (risk === "medium") return cx(s.riskBadge, s.medium);
    return cx(s.riskBadge, s.low);
  };

  const handleBlock = (address: string) => {
    setBlockTarget(address);
  };

  const confirmBlock = () => {
    if (!blockTarget) return;
    blockMutation.mutate(
      { address: blockTarget, reason: "Manual block from dashboard" },
      {
        onSuccess: () => {
          toast.success(`Wallet ${blockTarget} has been blocked.`);
          setBlockTarget(null);
          refetchWallets();
        },
        onError: () => {
          toast.error("Failed to block wallet. Please try again.");
          setBlockTarget(null);
        },
      },
    );
  };

  if (overviewLoading) {
    return (
      <div className={`page active ${s.riskRoot}`} id="page-risk">
        <div className="main-header">
          <h1 className="main-title glow">Risk & Sybil</h1>
        </div>
        <SkeletonGrid count={2} columns={2} tall />
        <SkeletonGrid count={1} columns={2} tall />
      </div>
    );
  }

  if (overviewError || !overview) {
    return (
      <div className={`page active ${s.riskRoot}`} id="page-risk">
        <div className="main-header">
          <h1 className="main-title glow">Risk & Sybil</h1>
        </div>
        <ErrorState onRetry={() => refetchOverview()} />
      </div>
    );
  }

  const wallets = walletsData?.items ?? [];

  return (
    <div className={`page active ${s.riskRoot}`} id="page-risk">
      <div className="main-header">
        <h1 className="main-title glow">Risk & Sybil</h1>
      </div>

      <div className={s.riskGridTop}>
        <div className={s.riskLeft}>
          <div className="card">
            <div className="card-title glow-sm">Risk Level Distribution</div>
            <DonutChart
              segments={overview.distribution.map((d) => ({
                colorVar: RISK_COLORS[d.level] ?? "--text-muted",
                percentage: d.percentage,
                label: d.level.charAt(0).toUpperCase() + d.level.slice(1),
                legendValue: `${d.count} · ${d.percentage}%`,
              }))}
              totalValue={<span style={{ fontSize: "22px" }}>{overview.stats.flaggedRate}%</span>}
              totalLabel="At Risk"
              size={140}
              radius={56}
              strokeWidth={16}
              legendStyle={{ flexDirection: "row", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}
            />
          </div>

          <div className={s.riskMiniKpis}>
            <div className={cx("card", s.miniKpi)}>
              <div className="card-title glow-sm">Total Analyzed</div>
              <div className="kpi-value glow" style={{ fontSize: "24px" }}>{overview.stats.totalAnalyzed.toLocaleString()}</div>
            </div>
            <div className={cx("card", s.miniKpi)}>
              <div className="card-title glow-sm">Flagged Rate</div>
              <div className="kpi-value glow" style={{ fontSize: "24px" }}>{overview.stats.flaggedRate}%</div>
            </div>
            <div className={cx("card", s.miniKpi)}>
              <div className="card-title glow-sm">Avg Entropy</div>
              <div className="kpi-value glow" style={{ fontSize: "24px" }}>{overview.stats.avgEntropy}</div>
            </div>
          </div>

          <div className="card">
            <div className="card-title glow-sm">Top Flagged Chains</div>
            {overview.topFlaggedChains.map((fc) => {
              const badge = CHAIN_BADGE_MAP[fc.chain] ?? { cls: fc.chain, label: fc.label };
              const color = fc.percentage > 35 ? "var(--accent-red)" : fc.percentage > 25 ? "var(--accent-orange)" : "var(--accent-amber)";
              return (
                <div key={fc.chain} className={s.flaggedChain}>
                  <div className={s.flaggedChainHeader}>
                    <span className={`chain-badge ${badge.cls}`}>{badge.label}</span>
                    <span className="bar-meta">{fc.percentage}%</span>
                  </div>
                  <div className="bar-track" style={{ height: "20px" }}>
                    <div className="bar-segment" style={{ width: `${fc.percentage}%`, background: color, borderRadius: "4px" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={s.riskRight}>
          <div className="card" style={{ height: "100%" }}>
            <div className="card-title glow-sm">Sybil Clusters Detected</div>
            <div className={s.clusterStack}>
              {(clusters ?? []).map((cluster) => {
                const accentClass =
                  cluster.riskLevel === "critical" ? s.criticalAccent
                    : cluster.riskLevel === "high" ? s.highAccent
                    : s.mediumAccent;
                const entropyColor =
                  cluster.riskLevel === "critical" ? "var(--accent-red)"
                    : cluster.riskLevel === "high" ? "var(--accent-orange)"
                    : "var(--accent-amber)";
                return (
                  <div key={cluster.id} className={cx(s.clusterCard, accentClass)}>
                    <div className={s.clusterCardHeader}>
                      <div>
                        <span className={s.clusterName}>{cluster.name}</span>
                        <span className={getRiskBadgeClass(cluster.riskLevel)}>
                          {cluster.riskLevel.charAt(0).toUpperCase() + cluster.riskLevel.slice(1)} Risk
                        </span>
                      </div>
                      <div className={s.clusterWallets}>
                        <span className="kpi-value glow" style={{ fontSize: "22px" }}>{cluster.walletCount}</span>
                        <span className="bar-meta">wallets</span>
                      </div>
                    </div>
                    <div className={s.clusterCardBody}>
                      {cluster.detectionReasons.map((reason, i) => (
                        <div key={i} className={s.clusterDetail}>{reason}</div>
                      ))}
                      <div className={s.clusterDetail}>
                        Entropy: {cluster.entropy}{" "}
                        <span className={s.entropyBar}>
                          <span className={s.entropyFill} style={{ width: `${cluster.entropy * 100}%`, background: entropyColor }} />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className={cx("card", s.tableCard)}>
        <div className={s.tableHeader}>
          <div className="card-title glow-sm">Recently Flagged Wallets</div>
          <div className={s.tableFilters}>
            <select
              className={s.tableFilter}
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value as RiskLevel | "all")}
            >
              <option value="all">All Levels</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
            </select>
            <select
              className={s.tableFilter}
              value={sortFilter}
              onChange={(e) => setSortFilter(e.target.value as "newest" | "oldest")}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {walletsLoading ? (
          <SkeletonTable rows={5} />
        ) : (
          <div className={s.tableScroll}>
          <table className={s.flaggedTable}>
            <thead>
              <tr>
                <th>Wallet Address</th>
                <th>Risk Level</th>
                <th>Cluster</th>
                <th>Flagged</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {wallets.map((row) => (
                <tr key={row.address} data-risk={row.riskLevel}>
                  <td className={s.mono}>{row.address}</td>
                  <td>
                    <span className={getRiskBadgeClass(row.riskLevel)}>
                      {row.riskLevel.charAt(0).toUpperCase() + row.riskLevel.slice(1)}
                    </span>
                  </td>
                  <td>{row.cluster}</td>
                  <td>{row.flaggedAgo}</td>
                  <td>
                    {row.isBlocked ? (
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Blocked</span>
                    ) : (
                      <button className={s.btnBlock} onClick={() => handleBlock(row.address)}>
                        Block
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {/* Confirm Dialog */}
      {blockTarget && (
        <div className={s.overlay} onClick={() => setBlockTarget(null)}>
          <div className={s.dialog} onClick={(e) => e.stopPropagation()}>
            <div className={s.dialogTitle}>Block Wallet</div>
            <p className={s.dialogMessage}>
              Are you sure you want to block <strong>{blockTarget}</strong>? This action
              will exclude this wallet from all campaigns and analytics.
            </p>
            <div className={s.dialogActions}>
              <button className={s.dialogCancel} onClick={() => setBlockTarget(null)}>
                Cancel
              </button>
              <button
                className={s.dialogConfirm}
                onClick={confirmBlock}
                disabled={blockMutation.isPending}
              >
                {blockMutation.isPending ? "Blocking..." : "Confirm Block"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
