"use client";

import { useState, useMemo } from "react";
import { PageHeaderPlain } from "@/components/dashboard/PageHeader";
import { SegTabs } from "@/components/dashboard/SegTabs";
import { LABELS, CHAIN_COLORS, CHAIN_KEYS, TOTAL_USERS } from "@/lib/labels-data";
import { cn } from "@/lib/utils";
import styles from "./LabelsPage.module.css";

const CHAIN_PILLS = [{ val: "all", label: "All" }, { val: "eth", label: "ETH" }, { val: "base", label: "Base" }, { val: "arb", label: "Arbitrum" }, { val: "bsc", label: "BSC" }, { val: "poly", label: "Polygon" }, { val: "avax", label: "Avalanche" }, { val: "hl", label: "Hyperliquid" }, { val: "kaia", label: "Kaia" }, { val: "sol", label: "Solana" }];
const ASSET_PILLS = [{ val: "all", label: "All" }, { val: "stables", label: "Stables" }, { val: "native", label: "Native" }, { val: "others", label: "Others" }];

const LABEL_SEG_TABS = [
  { id: "behavior" as const, label: "By Behavior" },
  { id: "value" as const, label: "By Value" },
];

export default function LabelsPage() {
  const [segTab, setSegTab] = useState<"behavior" | "value">("behavior");
  const [selectedLabels, setSelectedLabels] = useState<Set<number>>(new Set());
  const [selectedChains, setSelectedChains] = useState<Set<string>>(new Set());
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());

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
        <div className={styles.filterBar}>
          <div className={styles.filterSection}>
            <div className={styles.filterGroup}><div className={styles.filterLabel}>Chains</div><div className={styles.filterPills}>
              {CHAIN_PILLS.map((p) => <span key={p.val} className={`fpill ${p.val === "all" ? "active" : ""}`} data-vchain={p.val}>{p.label}</span>)}
            </div></div>
            <div className={styles.filterGroup}><div className={styles.filterLabel}>Asset Type</div><div className={styles.filterPills}>
              {ASSET_PILLS.map((p) => <span key={p.val} className={`fpill ${p.val === "all" ? "active" : ""}`} data-vasset={p.val}>{p.label}</span>)}
            </div></div>
          </div>
          <div className={styles.filterSummary} id="valFilterSummary"><span className={styles.summaryHighlight}>All filters</span> · <span className={styles.summaryHighlight}>301,012 users</span></div>
        </div>
      )}
    </>
  );
}
