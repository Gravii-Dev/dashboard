"use client";

import { useState, useMemo } from "react";
import { PageHeaderPlain } from "@/components/dashboard/PageHeader";
import { SegTabs } from "@/components/dashboard/SegTabs";
import { InfoTooltip } from "@/components/dashboard/InfoTooltip";
import { LABELS, CHAIN_COLORS, CHAIN_KEYS, TOTAL_USERS } from "@/lib/labels-data";
import { cn } from "@/lib/utils";
import styles from "./LabelsPage.module.css";

const CHAIN_PILLS = [{ val: "all", label: "All" }, { val: "eth", label: "ETH" }, { val: "base", label: "Base" }, { val: "arb", label: "Arbitrum" }, { val: "bsc", label: "BSC" }, { val: "poly", label: "Polygon" }, { val: "avax", label: "Avalanche" }, { val: "hl", label: "Hyperliquid" }, { val: "kaia", label: "Kaia" }, { val: "sol", label: "Solana" }];
const ASSET_PILLS = [{ val: "all", label: "All" }, { val: "stables", label: "Stables" }, { val: "native", label: "Native" }, { val: "others", label: "Others" }];

const HOLD_PILLS = [{ val: "all", label: "All" }, { val: "u1k", label: "< $1K" }, { val: "1k10k", label: "$1K–$10K" }, { val: "10k50k", label: "$10K–$50K" }, { val: "50kp", label: "$50K+" }];
const PAY_PILLS = [{ val: "all", label: "All" }, { val: "u500", label: "< $500" }, { val: "500_5k", label: "$500–$5K" }, { val: "5k20k", label: "$5K–$20K" }, { val: "20kp", label: "$20K+" }];
const TRADE_PILLS = [{ val: "all", label: "All" }, { val: "u1k", label: "< $1K" }, { val: "1k10k", label: "$1K–$10K" }, { val: "10k100k", label: "$10K–$100K" }, { val: "100kp", label: "$100K+" }];
const TIV_PILLS = [{ val: "all", label: "All" }, { val: "1k", label: "TIV > $1K" }, { val: "10k", label: "TIV > $10K" }, { val: "50k", label: "TIV > $50K" }, { val: "100k", label: "TIV > $100K" }];

const LABEL_SEG_TABS = [
  { id: "behavior" as const, label: "By Behavior" },
  { id: "value" as const, label: "By Value" },
];

type ValueFilterKey = "vchain" | "vasset" | "hold" | "pay" | "trade" | "tiv";

export default function LabelsPage() {
  const [segTab, setSegTab] = useState<"behavior" | "value">("behavior");
  const [selectedLabels, setSelectedLabels] = useState<Set<number>>(new Set());
  const [selectedChains, setSelectedChains] = useState<Set<string>>(new Set());
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
  const [valueFilters, setValueFilters] = useState<Record<ValueFilterKey, string>>({
    vchain: "all", vasset: "all", hold: "all", pay: "all", trade: "all", tiv: "all",
  });

  const filteredLabels = useMemo(() => {
    return LABELS.filter((l) => selectedLabels.size === 0 || selectedLabels.has(l.id));
  }, [selectedLabels]);

  const computedUsers = useMemo(() => {
    if (selectedLabels.size === 0) return TOTAL_USERS;
    let total = 0;
    filteredLabels.forEach((l) => {
      let u = l.users;
      if (selectedChains.size > 0) {
        let chainPct = 0;
        selectedChains.forEach((c) => { chainPct += l.chains[c] ?? 0; });
        u = Math.round((u * chainPct) / 100);
      }
      total += u;
    });
    if (selectedLabels.size > 1) total = Math.round(total * (1 - 0.08 * (selectedLabels.size - 1)));
    return Math.max(total, 0);
  }, [filteredLabels, selectedLabels.size, selectedChains]);

  const avgBal = useMemo(() => {
    if (selectedLabels.size === 0) return 4230;
    let sum = 0;
    filteredLabels.forEach((l) => { if (selectedLabels.has(l.id)) sum += l.avgBal; });
    return Math.round(sum / selectedLabels.size);
  }, [filteredLabels, selectedLabels]);

  const avgTxFreq = useMemo(() => {
    if (selectedLabels.size === 0) return 38;
    let sum = 0;
    filteredLabels.forEach((l) => { if (selectedLabels.has(l.id)) sum += l.txFreq; });
    return Math.round(sum / selectedLabels.size);
  }, [filteredLabels, selectedLabels]);

  const avgRetention = useMemo(() => {
    if (selectedLabels.size === 0) return 72;
    let sum = 0;
    filteredLabels.forEach((l) => { if (selectedLabels.has(l.id)) sum += l.retention; });
    return Math.round(sum / selectedLabels.size);
  }, [filteredLabels, selectedLabels]);

  const toggleLabel = (id: number) => {
    setSelectedLabels((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const togglePill = (set: "chains" | "assets", val: string) => {
    if (set === "chains") {
      setSelectedChains((prev) => {
        if (val === "all") return new Set();
        const next = new Set(prev);
        if (next.has(val)) next.delete(val);
        else next.add(val);
        return next;
      });
    } else {
      setSelectedAssets((prev) => {
        if (val === "all") return new Set();
        const next = new Set(prev);
        if (next.has(val)) next.delete(val);
        else next.add(val);
        return next;
      });
    }
  };

  const isChainActive = (val: string) => val === "all" ? selectedChains.size === 0 : selectedChains.has(val);
  const isAssetActive = (val: string) => val === "all" ? selectedAssets.size === 0 : selectedAssets.has(val);

  const setValueFilter = (key: ValueFilterKey, val: string) => {
    setValueFilters((prev) => {
      if (val === "all") return { ...prev, [key]: "all" };
      const next = prev[key] === val ? "all" : val;
      return { ...prev, [key]: next };
    });
  };
  const isValueFilterActive = (key: ValueFilterKey, val: string) => valueFilters[key] === val;

  const valueActiveCount = useMemo(() => {
    return (["vchain", "vasset", "hold", "pay", "trade", "tiv"] as const).filter(
      (k) => valueFilters[k] !== "all"
    ).length;
  }, [valueFilters]);

  const valueFilteredUsers = useMemo(() => {
    const factor = valueActiveCount > 0 ? Math.max(0.1, 1 - valueActiveCount * 0.22) : 1;
    return Math.round(TOTAL_USERS * factor);
  }, [valueActiveCount]);

  const valuePortfolio = useMemo(() => {
    const factor = valueActiveCount > 0 ? Math.max(0.1, 1 - valueActiveCount * 0.22) : 1;
    return Math.round(8430 * (0.5 + 0.5 * factor));
  }, [valueActiveCount]);

  const valuePayment = useMemo(() => {
    const factor = valueActiveCount > 0 ? Math.max(0.1, 1 - valueActiveCount * 0.22) : 1;
    return Math.round(2327 * (0.5 + 0.5 * factor));
  }, [valueActiveCount]);

  const valueTrading = useMemo(() => {
    const factor = valueActiveCount > 0 ? Math.max(0.1, 1 - valueActiveCount * 0.22) : 1;
    return Math.round(47200 * (0.5 + 0.5 * factor));
  }, [valueActiveCount]);

  return (
    <>
      <PageHeaderPlain title="User Segments" />

      <SegTabs tabs={LABEL_SEG_TABS} activeId={segTab} onChange={setSegTab} />

      {segTab === "behavior" && (
        <>
          <div className={styles.filterBar}>
            <div className={styles.filterSection}>
              <div className={styles.filterGroup}>
                <div className={styles.filterLabel}>Chains</div>
                <div className={styles.filterPills}>
                  {CHAIN_PILLS.map((p) => (
                    <span
                      key={p.val}
                      role="button"
                      tabIndex={0}
                      className={`fpill ${isChainActive(p.val) ? "active" : ""}`}
                      onClick={() => togglePill("chains", p.val)}
                      onKeyDown={(e) => e.key === "Enter" && togglePill("chains", p.val)}
                      data-chain={p.val}
                    >
                      {p.label}
                    </span>
                  ))}
                </div>
              </div>
              <div className={styles.filterGroup}>
                <div className={styles.filterLabel}>Assets</div>
                <div className={styles.filterPills}>
                  {ASSET_PILLS.map((p) => (
                    <span
                      key={p.val}
                      role="button"
                      tabIndex={0}
                      className={`fpill ${isAssetActive(p.val) ? "active" : ""}`}
                      onClick={() => togglePill("assets", p.val)}
                      onKeyDown={(e) => e.key === "Enter" && togglePill("assets", p.val)}
                      data-asset={p.val}
                    >
                      {p.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.filterSummary}>
              <span className={styles.summaryHighlight}>{selectedLabels.size || "All"} labels</span> · <span className={styles.summaryHighlight}>{selectedChains.size ? `${selectedChains.size} chains` : "All chains"}</span> · <span className={styles.summaryHighlight}>{computedUsers.toLocaleString()} users</span>
            </div>
          </div>

          <div className={styles.labelGridHeader}>Click segments to filter ↓</div>
          <div className={styles.labelGrid}>
            {LABELS.map((l) => {
              let displayUsers = l.users;
              if (selectedChains.size > 0) {
                let chainPct = 0;
                selectedChains.forEach((c) => { chainPct += l.chains[c] ?? 0; });
                displayUsers = Math.round((l.users * chainPct) / 100);
              }
              const displayPct = ((displayUsers / TOTAL_USERS) * 100).toFixed(1);
              const chainBar = CHAIN_KEYS.map((c) => (
                <div key={c} style={{ width: `${l.chains[c] ?? 0}%`, height: "100%", background: CHAIN_COLORS[c] ?? "#555" }} />
              ));
              const sel = selectedLabels.has(l.id);
              return (
                <div
                  key={l.id}
                  role="button"
                  tabIndex={0}
                  className={cn(styles.labelCard, sel && styles.selected)}
                  onClick={() => toggleLabel(l.id)}
                  onKeyDown={(e) => e.key === "Enter" && toggleLabel(l.id)}
                >
                  <div className={styles.labelCardTop}>
                    <div className={styles.labelCardLeft}>
                      <div className={styles.labelCheckbox}>{sel ? "✓" : ""}</div>
                      <span className={styles.labelCardName}>{l.name}</span>
                    </div>
                    <span className={styles.labelCardCount}>{displayUsers.toLocaleString()}</span>
                  </div>
                  <div className={styles.labelCardPct}>{displayPct}% of total</div>
                  <div className={styles.labelChainBar}>{chainBar}</div>
                  <div className={styles.labelThreshold}>{l.threshold}</div>
                </div>
              );
            })}
          </div>

          <div className={cn(styles.summarySection, (selectedLabels.size > 0 || selectedChains.size > 0) && styles.summarySectionHasFilter)}>
            <div className={styles.summaryLabel}>Filtered Results <span className={styles.selectedPills}>{filteredLabels.filter((l) => selectedLabels.has(l.id)).map((l) => <span key={l.id} className={styles.selectedPill}>{l.name}</span>)}</span></div>
            <div className={cn(styles.summaryGrid, (selectedLabels.size > 0 || selectedChains.size > 0) && styles.summaryGridHasFilter)}>
              <div className={styles.summaryCard}>
                <div className={cn(styles.summaryCardTitle, "glow-sm")}>Filtered Users</div>
                <div className={cn(styles.summaryKpiValue, "glow")} id="sumUsers">{computedUsers.toLocaleString()}</div>
              </div>
              <div className={styles.summaryCard}>
                <div className={cn(styles.summaryCardTitle, "glow-sm")}>Avg Balance</div>
                <div className={cn(styles.summaryKpiValue, "glow")} id="sumBalance">${avgBal.toLocaleString()}</div>
              </div>
              <div className={styles.summaryCard}>
                <div className={cn(styles.summaryCardTitle, "glow-sm")}>Avg Tx Frequency</div>
                <div className={cn(styles.summaryKpiValue, "glow")} id="sumTxFreq">{avgTxFreq}/mo</div>
              </div>
              <div className={styles.summaryCard}>
                <div className={cn(styles.summaryCardTitle, "glow-sm")}>Retention Rate (30d)</div>
                <div className={cn(styles.summaryKpiValue, "glow")} id="sumRetention">{avgRetention}%</div>
              </div>
            </div>
          </div>
        </>
      )}

      {segTab === "value" && (
        <>
          <div className={cn(styles.filterBar, styles.filterBarValue)}>
            <div className={styles.filterSection}>
              <div className={styles.filterGroup}>
                <div className={styles.filterLabel}>Chains</div>
                <div className={styles.filterPills}>
                  {CHAIN_PILLS.map((p) => (
                    <span
                      key={p.val}
                      role="button"
                      tabIndex={0}
                      className={cn("fpill", isValueFilterActive("vchain", p.val) && "active")}
                      onClick={() => setValueFilter("vchain", p.val)}
                      onKeyDown={(e) => e.key === "Enter" && setValueFilter("vchain", p.val)}
                    >
                      {p.label}
                    </span>
                  ))}
                </div>
              </div>
              <div className={styles.filterGroup}>
                <div className={styles.filterLabel}>
                  Asset Type
                  <span className={styles.assetTypeHint}>Holdings & Payment</span>
                </div>
                <div className={styles.filterPills}>
                  {ASSET_PILLS.map((p) => (
                    <span
                      key={p.val}
                      role="button"
                      tabIndex={0}
                      className={cn("fpill", isValueFilterActive("vasset", p.val) && "active")}
                      onClick={() => setValueFilter("vasset", p.val)}
                      onKeyDown={(e) => e.key === "Enter" && setValueFilter("vasset", p.val)}
                    >
                      {p.label}
                    </span>
                  ))}
                </div>
              </div>
              <div className={styles.filterGroup}>
                <div className={styles.filterLabel}>Holdings</div>
                <div className={styles.filterPills}>
                  {HOLD_PILLS.map((p) => (
                    <span
                      key={p.val}
                      role="button"
                      tabIndex={0}
                      className={cn("fpill", isValueFilterActive("hold", p.val) && "active")}
                      onClick={() => setValueFilter("hold", p.val)}
                      onKeyDown={(e) => e.key === "Enter" && setValueFilter("hold", p.val)}
                    >
                      {p.label}
                    </span>
                  ))}
                </div>
              </div>
              <div className={styles.filterGroup}>
                <div className={styles.filterLabel}>Payment</div>
                <div className={styles.filterPills}>
                  {PAY_PILLS.map((p) => (
                    <span
                      key={p.val}
                      role="button"
                      tabIndex={0}
                      className={cn("fpill", isValueFilterActive("pay", p.val) && "active")}
                      onClick={() => setValueFilter("pay", p.val)}
                      onKeyDown={(e) => e.key === "Enter" && setValueFilter("pay", p.val)}
                    >
                      {p.label}
                    </span>
                  ))}
                </div>
              </div>
              <div className={styles.filterGroup}>
                <div className={styles.filterLabel}>Trading Vol</div>
                <div className={styles.filterPills}>
                  {TRADE_PILLS.map((p) => (
                    <span
                      key={p.val}
                      role="button"
                      tabIndex={0}
                      className={cn("fpill", isValueFilterActive("trade", p.val) && "active")}
                      onClick={() => setValueFilter("trade", p.val)}
                      onKeyDown={(e) => e.key === "Enter" && setValueFilter("trade", p.val)}
                    >
                      {p.label}
                    </span>
                  ))}
                </div>
              </div>
              <div className={styles.filterGroup}>
                <div className={styles.filterLabel}>
                  TIV Filter{" "}
                  <InfoTooltip
                    title="Total Idle Value"
                    body="Assets sitting in wallet without active deployment. Not staked, lent, or providing liquidity."
                  />
                </div>
                <div className={styles.filterPills}>
                  {TIV_PILLS.map((p) => (
                    <span
                      key={p.val}
                      role="button"
                      tabIndex={0}
                      className={cn("fpill", isValueFilterActive("tiv", p.val) && "active")}
                      onClick={() => setValueFilter("tiv", p.val)}
                      onKeyDown={(e) => e.key === "Enter" && setValueFilter("tiv", p.val)}
                    >
                      {p.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.filterSummary}>
              <span className={styles.summaryHighlight}>{valueActiveCount || "All"} filters</span> · <span className={styles.summaryHighlight}>{valueFilteredUsers.toLocaleString()} users</span>
            </div>
          </div>

          <div className={styles.valueSummarySection}>
            <div className={styles.valueSummaryLabel}>Filtered Results</div>
            <div className={styles.valueSummaryGrid}>
              <div className={styles.valueSummaryCard}>
                <div className={cn(styles.valueSummaryCardTitle, "glow-sm")}>Filtered Users</div>
                <div className={cn(styles.valueSummaryKpi, "glow")}>{valueFilteredUsers.toLocaleString()}</div>
              </div>
              <div className={styles.valueSummaryCard}>
                <div className={cn(styles.valueSummaryCardTitle, "glow-sm")}>Avg Portfolio</div>
                <div className={cn(styles.valueSummaryKpi, "glow")}>${valuePortfolio.toLocaleString()}</div>
              </div>
              <div className={styles.valueSummaryCard}>
                <div className={cn(styles.valueSummaryCardTitle, "glow-sm")}>Avg Monthly Payment</div>
                <div className={cn(styles.valueSummaryKpi, "glow")}>${valuePayment.toLocaleString()}</div>
              </div>
              <div className={styles.valueSummaryCard}>
                <div className={cn(styles.valueSummaryCardTitle, "glow-sm")}>Avg Trading Volume</div>
                <div className={cn(styles.valueSummaryKpi, "glow")}>${valueTrading.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className={cn("grid-2-half", styles.valueSection)}>
            <div className={styles.summaryCard}>
              <div className={cn(styles.valueCardTitle, "glow-sm")}>Holdings Distribution</div>
              <div className={styles.valueRankList}>
                {[
                  { name: "< $1K", pct: 42, color: "var(--chart-4)" },
                  { name: "$1K–$10K", pct: 30, color: "var(--chart-1)" },
                  { name: "$10K–$50K", pct: 18, color: "var(--chart-2)" },
                  { name: "$50K+", pct: 10, color: "var(--accent-amber)" },
                ].map((r) => (
                  <div key={r.name} className={styles.valueRankItem}>
                    <span className={styles.valueRankName}>{r.name}</span>
                    <div className={styles.valueRankBarTrack}>
                      <div className={styles.valueRankBar} style={{ width: `${r.pct}%`, background: r.color }} />
                    </div>
                    <span className={styles.valueRankVal}>{r.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.summaryCard}>
              <div className={cn(styles.valueCardTitle, "glow-sm")}>Trading Volume Distribution</div>
              <div className={styles.valueRankList}>
                {[
                  { name: "< $1K", pct: 35, color: "var(--chart-4)" },
                  { name: "$1K–$10K", pct: 28, color: "var(--chart-1)" },
                  { name: "$10K–$100K", pct: 24, color: "var(--chart-2)" },
                  { name: "$100K+", pct: 13, color: "var(--accent-amber)" },
                ].map((r) => (
                  <div key={r.name} className={styles.valueRankItem}>
                    <span className={styles.valueRankName}>{r.name}</span>
                    <div className={styles.valueRankBarTrack}>
                      <div className={styles.valueRankBar} style={{ width: `${r.pct}%`, background: r.color }} />
                    </div>
                    <span className={styles.valueRankVal}>{r.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={cn("grid-2-half", styles.valueSection)}>
            <div className={styles.summaryCard}>
              <div className={cn(styles.valueCardTitle, "glow-sm")}>Top Chains</div>
              <div className={styles.valueRankList}>
                {[
                  { name: "Ethereum", pct: 38, color: "#627eea" },
                  { name: "Base", pct: 22, color: "#0052ff" },
                  { name: "Arbitrum", pct: 16, color: "#28a0f0" },
                ].map((r) => (
                  <div key={r.name} className={styles.valueRankItem}>
                    <span className={styles.valueRankName}>{r.name}</span>
                    <div className={styles.valueRankBarTrack}>
                      <div className={styles.valueRankBar} style={{ width: `${r.pct}%`, background: r.color }} />
                    </div>
                    <span className={styles.valueRankVal}>{r.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.summaryCard}>
              <div className={cn(styles.valueCardTitle, "glow-sm")}>Top Segment Overlap</div>
              <div className={styles.valueRankList}>
                {[
                  { name: "Long-term Holders", pct: 62, color: "var(--chart-1)" },
                  { name: "DEX Traders", pct: 48, color: "var(--chart-2)" },
                  { name: "Stablecoin Spenders", pct: 35, color: "var(--chart-3)" },
                ].map((r) => (
                  <div key={r.name} className={styles.valueRankItem}>
                    <span className={styles.valueRankName}>{r.name}</span>
                    <div className={styles.valueRankBarTrack}>
                      <div className={styles.valueRankBar} style={{ width: `${r.pct}%`, background: r.color }} />
                    </div>
                    <span className={styles.valueRankVal}>{r.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
