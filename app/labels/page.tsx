"use client";

import { useState, useMemo } from "react";
import {
  labels,
  TOTAL_USERS,
  CHAIN_COLORS,
  CHAIN_PILL_DATA,
  ASSET_PILL_DATA,
  type ChainKey,
} from "./data";
import { cx } from "@/lib/utils";
import s from "./page.module.css";
import FilterPills from "@/components/FilterPills/FilterPills";
import SegTabs from "@/components/SegTabs/SegTabs";
import RankList from "@/components/RankList/RankList";
import SummaryGrid from "@/components/SummaryGrid/SummaryGrid";

const HOLD_PILL_DATA = [
  { key: "all", label: "All" },
  { key: "u1k", label: "< $1K" },
  { key: "1k10k", label: "$1K–$10K" },
  { key: "10k50k", label: "$10K–$50K" },
  { key: "50kp", label: "$50K+" },
];

const PAY_PILL_DATA = [
  { key: "all", label: "All" },
  { key: "u500", label: "< $500" },
  { key: "500_5k", label: "$500–$5K" },
  { key: "5k20k", label: "$5K–$20K" },
  { key: "20kp", label: "$20K+" },
];

const TRADE_PILL_DATA = [
  { key: "all", label: "All" },
  { key: "u1k", label: "< $1K" },
  { key: "1k10k", label: "$1K–$10K" },
  { key: "10k100k", label: "$10K–$100K" },
  { key: "100kp", label: "$100K+" },
];

const TIV_PILL_DATA = [
  { key: "all", label: "All" },
  { key: "1k", label: "Avail > $1K" },
  { key: "10k", label: "Avail > $10K" },
  { key: "50k", label: "Avail > $50K" },
  { key: "100k", label: "Avail > $100K" },
];

export default function LabelsPage() {
  const [activeTab, setActiveTab] = useState<"behavior" | "value">("behavior");

  const [selectedLabels, setSelectedLabels] = useState<Set<number>>(new Set());
  const [selectedChains, setSelectedChains] = useState<Set<string>>(new Set());
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());

  const [valChains, setValChains] = useState<Set<string>>(new Set());
  const [valAssets, setValAssets] = useState<Set<string>>(new Set());
  const [valHold, setValHold] = useState<Set<string>>(new Set());
  const [valPay, setValPay] = useState<Set<string>>(new Set());
  const [valTrade, setValTrade] = useState<Set<string>>(new Set());
  const [valTiv, setValTiv] = useState<Set<string>>(new Set());

  function toggleLabel(id: number) {
    setSelectedLabels((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function getDisplayUsers(label: (typeof labels)[0]): number {
    if (selectedChains.size === 0) return label.users;
    let chainPct = 0;
    selectedChains.forEach((c) => {
      chainPct += label.chains[c as ChainKey] || 0;
    });
    return Math.round((label.users * chainPct) / 100);
  }

  const filteredUsers = useMemo(() => {
    if (selectedLabels.size === 0) return TOTAL_USERS;
    let total = 0;
    labels.forEach((l) => {
      if (!selectedLabels.has(l.id)) return;
      let u = l.users;
      if (selectedChains.size > 0) {
        let chainPct = 0;
        selectedChains.forEach((c) => {
          chainPct += l.chains[c as ChainKey] || 0;
        });
        u = Math.round((u * chainPct) / 100);
      }
      total += u;
    });
    if (selectedLabels.size > 1) {
      total = Math.round(total * (1 - 0.08 * (selectedLabels.size - 1)));
    }
    return Math.max(total, 0);
  }, [selectedLabels, selectedChains]);

  const { avgBal, txFreq, retention } = useMemo(() => {
    if (selectedLabels.size === 0)
      return { avgBal: 4230, txFreq: 38, retention: 72 };
    let sumBal = 0,
      sumTx = 0,
      sumRet = 0;
    labels.forEach((l) => {
      if (selectedLabels.has(l.id)) {
        sumBal += l.avgBal;
        sumTx += l.txFreq;
        sumRet += l.retention;
      }
    });
    const count = selectedLabels.size;
    return {
      avgBal: Math.round(sumBal / count),
      txFreq: Math.round(sumTx / count),
      retention: Math.round(sumRet / count),
    };
  }, [selectedLabels]);

  const hasFilter = selectedLabels.size > 0 || selectedChains.size > 0;

  const summaryCardStyle = hasFilter
    ? {
        fontSize: "28px",
        background: "rgba(168,120,255,0.05)",
        borderColor: "rgba(168,120,255,0.3)",
      }
    : {};

  const valActiveCount =
    valChains.size +
    valAssets.size +
    valHold.size +
    valPay.size +
    valTrade.size +
    valTiv.size;
  const valFactor =
    valActiveCount > 0 ? Math.max(0.1, 1 - valActiveCount * 0.22) : 1;
  const valFilteredUsers = Math.round(301012 * valFactor);
  const valAvgPortfolio =
    valActiveCount > 0 ? Math.round(8430 * (0.5 + valFactor * 0.5)) : 8430;
  const valAvgPayment =
    valActiveCount > 0 ? Math.round(2327 * (0.5 + valFactor * 0.5)) : 2327;
  const valAvgTrading =
    valActiveCount > 0 ? Math.round(47200 * (0.5 + valFactor * 0.5)) : 47200;

  return (
    <div className="page active" id="page-labels">
      <div className="main-header">
        <h1 className="main-title glow">User Segments</h1>
      </div>

      <SegTabs
        tabs={[
          { key: "behavior", label: "By Behavior" },
          { key: "value", label: "By Value" },
        ]}
        activeTab={activeTab}
        onTabChange={(key) => setActiveTab(key as "behavior" | "value")}
      />

      {/* TAB 1: By Behavior */}
      <div
        className={`seg-panel ${activeTab === "behavior" ? "active" : ""}`}
        id="seg-behavior"
      >
        <div className="card filter-bar">
          <div className="filter-section">
            <div className="filter-group">
              <div className="filter-label">Chains</div>
              <div className="filter-pills">
                <FilterPills
                  items={CHAIN_PILL_DATA}
                  activeSet={selectedChains}
                  onChange={setSelectedChains}
                />
              </div>
            </div>
            <div className="filter-group">
              <div className="filter-label">Assets</div>
              <div className="filter-pills">
                <FilterPills
                  items={ASSET_PILL_DATA}
                  activeSet={selectedAssets}
                  onChange={setSelectedAssets}
                />
              </div>
            </div>
          </div>
          <div className="filter-summary">
            <span className="summary-highlight">
              {selectedLabels.size || "All"} labels
            </span>
            {" · "}
            <span className="summary-highlight">
              {selectedChains.size ? `${selectedChains.size} chains` : "All chains"}
            </span>
            {" · "}
            <span className="summary-highlight">
              {filteredUsers.toLocaleString()} users
            </span>
          </div>
        </div>

        <div className={s.labelGridHeader}>Click segments to filter ↓</div>
        <div className={s.labelGrid} id="labelGrid">
          {labels.map((l) => {
            const sel = selectedLabels.has(l.id);
            const displayUsers = getDisplayUsers(l);
            const displayPct = ((displayUsers / TOTAL_USERS) * 100).toFixed(1);
            return (
              <div
                key={l.id}
                className={cx(s.labelCard, sel && s.selected)}
                onClick={() => toggleLabel(l.id)}
              >
                <div className={s.labelCardTop}>
                  <div className={s.labelCardLeft}>
                    <div className={s.labelCheckbox}>{sel ? "✓" : ""}</div>
                    <span className={s.labelCardName}>{l.name}</span>
                  </div>
                  <span className={s.labelCardCount}>
                    {displayUsers.toLocaleString()}
                  </span>
                </div>
                <div className={s.labelCardPct}>{displayPct}% of total</div>
                <div className={s.labelChainBar}>
                  {Object.entries(l.chains).map(([c, v]) => (
                    <div
                      key={c}
                      style={{
                        width: `${v}%`,
                        height: "100%",
                        background: CHAIN_COLORS[c] || "#555",
                      }}
                    />
                  ))}
                </div>
                <div className={s.labelThreshold}>{l.threshold}</div>
              </div>
            );
          })}
        </div>

        <div className={s.summarySection}>
          <div className={s.summaryLabel}>
            Filtered Results{" "}
            <span className={s.selectedPills} id="selectedPills">
              {labels
                .filter((l) => selectedLabels.has(l.id))
                .map((l) => (
                  <span key={l.id} className={s.selectedPill}>
                    {l.name}
                  </span>
                ))}
            </span>
          </div>
          <SummaryGrid
            items={[
              {
                title: "Filtered Users",
                value: filteredUsers.toLocaleString(),
              },
              {
                title: "Avg Balance",
                value: `$${avgBal.toLocaleString()}`,
              },
              {
                title: "Avg Tx Frequency",
                value: `${txFreq}/mo`,
              },
              {
                title: "Retention Rate (30d)",
                value: `${retention}%`,
              },
            ]}
            hasFilter={hasFilter}
            cardStyle={summaryCardStyle as React.CSSProperties}
            className={cx(s.summaryGrid, hasFilter && s.hasFilter)}
          />
        </div>
      </div>

      {/* TAB 2: By Value */}
      <div
        className={`seg-panel ${activeTab === "value" ? "active" : ""}`}
        id="seg-value"
      >
        <div className="card filter-bar">
          <div className="filter-section">
            <div className="filter-group">
              <div className="filter-label">Chains</div>
              <div className="filter-pills">
                <FilterPills
                  items={CHAIN_PILL_DATA}
                  activeSet={valChains}
                  onChange={setValChains}
                />
              </div>
            </div>
            <div className="filter-group">
              <div className="filter-label">
                Asset Type{" "}
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: 400,
                    color: "var(--text-muted)",
                    display: "block",
                  }}
                >
                  Holdings &amp; Payment
                </span>
              </div>
              <div className="filter-pills">
                <FilterPills
                  items={ASSET_PILL_DATA}
                  activeSet={valAssets}
                  onChange={setValAssets}
                />
              </div>
            </div>
            <div className="filter-group">
              <div className="filter-label">Holdings</div>
              <div className="filter-pills">
                <FilterPills
                  items={HOLD_PILL_DATA}
                  activeSet={valHold}
                  onChange={setValHold}
                />
              </div>
            </div>
            <div className="filter-group">
              <div className="filter-label">Payment</div>
              <div className="filter-pills">
                <FilterPills
                  items={PAY_PILL_DATA}
                  activeSet={valPay}
                  onChange={setValPay}
                />
              </div>
            </div>
            <div className="filter-group">
              <div className="filter-label">Trading Vol</div>
              <div className="filter-pills">
                <FilterPills
                  items={TRADE_PILL_DATA}
                  activeSet={valTrade}
                  onChange={setValTrade}
                />
              </div>
            </div>
            <div className="filter-group">
              <div className="filter-label">
                Available Value Filter{" "}
                <span className="info-icon">
                  ⓘ
                  <div className="info-tooltip">
                    <strong>Available Assets</strong> — Assets held by your
                    connected users without active deployment. Not staked, lent,
                    or providing liquidity.
                  </div>
                </span>
              </div>
              <div className="filter-pills">
                <FilterPills
                  items={TIV_PILL_DATA}
                  activeSet={valTiv}
                  onChange={setValTiv}
                />
              </div>
            </div>
          </div>
          <div className="filter-summary">
            <span className="summary-highlight">
              {valActiveCount || "All"} filters
            </span>
            {" · "}
            <span className="summary-highlight">
              {valFilteredUsers.toLocaleString()} users
            </span>
          </div>
        </div>

        <div className={s.summarySection} style={{ marginTop: "16px" }}>
          <div className={s.summaryLabel}>Filtered Results</div>
          <SummaryGrid
            items={[
              {
                title: "Filtered Users",
                value: valFilteredUsers.toLocaleString(),
              },
              {
                title: "Avg Portfolio",
                value: `$${valAvgPortfolio.toLocaleString()}`,
              },
              {
                title: "Avg Monthly Payment",
                value: `$${valAvgPayment.toLocaleString()}`,
              },
              {
                title: "Avg Trading Volume",
                value: `$${valAvgTrading.toLocaleString()}`,
              },
            ]}
            hasFilter={valActiveCount > 0}
            cardStyle={
              valActiveCount > 0
                ? {
                    background: "rgba(168,120,255,0.05)",
                    borderColor: "rgba(168,120,255,0.3)",
                  }
                : undefined
            }
            className={cx(s.summaryGrid, valActiveCount > 0 && s.hasFilter)}
          />
        </div>

        <div className="grid-2-half" style={{ marginTop: "16px" }}>
          <div className="card">
            <div className="card-title glow-sm">Holdings Distribution</div>
            <RankList
              items={[
                { name: "< $1K", value: 42, color: "var(--chart-4)" },
                { name: "$1K–$10K", value: 30, color: "var(--chart-1)" },
                { name: "$10K–$50K", value: 18, color: "var(--chart-2)" },
                { name: "$50K+", value: 10, color: "var(--accent-amber)" },
              ]}
            />
          </div>
          <div className="card">
            <div className="card-title glow-sm">Trading Volume Distribution</div>
            <RankList
              items={[
                { name: "< $1K", value: 35, color: "var(--chart-4)" },
                { name: "$1K–$10K", value: 28, color: "var(--chart-1)" },
                { name: "$10K–$100K", value: 24, color: "var(--chart-2)" },
                { name: "$100K+", value: 13, color: "var(--accent-amber)" },
              ]}
            />
          </div>
        </div>

        <div className="grid-2-half" style={{ marginTop: "16px" }}>
          <div className="card">
            <div className="card-title glow-sm">Top Chains</div>
            <RankList
              items={[
                { name: "Ethereum", value: 38, color: "#627eea" },
                { name: "Base", value: 22, color: "#0052ff" },
                { name: "Arbitrum", value: 16, color: "#28a0f0" },
              ]}
            />
          </div>
          <div className="card">
            <div className="card-title glow-sm">Top Segment Overlap</div>
            <RankList
              items={[
                {
                  name: "Long-term Holders",
                  value: 62,
                  color: "var(--chart-1)",
                },
                { name: "DEX Traders", value: 48, color: "var(--chart-2)" },
                {
                  name: "Stablecoin Spenders",
                  value: 35,
                  color: "var(--chart-3)",
                },
              ]}
            />
          </div>
        </div>
      </div>

      <div style={{ marginTop: "20px", textAlign: "right" }}>
        <span className="analytics-link" style={{ cursor: "default" }}>
          These segments can be used as targeting criteria in Campaign Launch
          Manager
        </span>
      </div>
    </div>
  );
}
