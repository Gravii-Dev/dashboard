"use client";

import { useState, useMemo } from "react";
import { PageHeaderPlain } from "@/components/dashboard/PageHeader";
import { SegTabs } from "@/components/dashboard/SegTabs";
import { LABELS, CHAIN_COLORS, CHAIN_KEYS, TOTAL_USERS } from "@/lib/labels-data";

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
          <div className="card filter-bar">
            <div className="filter-section">
              <div className="filter-group">
                <div className="filter-label">Chains</div>
                <div className="filter-pills">
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
              <div className="filter-group">
                <div className="filter-label">Assets</div>
                <div className="filter-pills">
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
            <div className="filter-summary">
              <span className="summary-highlight">{selectedLabels.size || "All"} labels</span> · <span className="summary-highlight">{selectedChains.size ? `${selectedChains.size} chains` : "All chains"}</span> · <span className="summary-highlight">{computedUsers.toLocaleString()} users</span>
            </div>
          </div>

          <div className="label-grid-header">Click segments to filter ↓</div>
          <div className="label-grid">
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
                  className={`label-card ${sel ? "selected" : ""}`}
                  onClick={() => toggleLabel(l.id)}
                  onKeyDown={(e) => e.key === "Enter" && toggleLabel(l.id)}
                >
                  <div className="label-card-top">
                    <div className="label-card-left">
                      <div className="label-checkbox">{sel ? "✓" : ""}</div>
                      <span className="label-card-name">{l.name}</span>
                    </div>
                    <span className="label-card-count">{displayUsers.toLocaleString()}</span>
                  </div>
                  <div className="label-card-pct">{displayPct}% of total</div>
                  <div className="label-chain-bar">{chainBar}</div>
                  <div className="label-threshold">{l.threshold}</div>
                </div>
              );
            })}
          </div>

          <div className={`summary-section ${selectedLabels.size > 0 || selectedChains.size > 0 ? "has-filter" : ""}`}>
            <div className="summary-label">Filtered Results <span className="selected-pills">{filteredLabels.filter((l) => selectedLabels.has(l.id)).map((l) => <span key={l.id} className="selected-pill">{l.name}</span>)}</span></div>
            <div className={`summary-grid ${selectedLabels.size > 0 || selectedChains.size > 0 ? "has-filter" : ""}`}>
              <div className="card">
                <div className="card-title glow-sm">Filtered Users</div>
                <div className="kpi-value glow" id="sumUsers" style={{ fontSize: 28 }}>{computedUsers.toLocaleString()}</div>
              </div>
              <div className="card">
                <div className="card-title glow-sm">Avg Balance</div>
                <div className="kpi-value glow" id="sumBalance" style={{ fontSize: 28 }}>${avgBal.toLocaleString()}</div>
              </div>
              <div className="card">
                <div className="card-title glow-sm">Avg Tx Frequency</div>
                <div className="kpi-value glow" id="sumTxFreq" style={{ fontSize: 28 }}>{avgTxFreq}/mo</div>
              </div>
              <div className="card">
                <div className="card-title glow-sm">Retention Rate (30d)</div>
                <div className="kpi-value glow" id="sumRetention" style={{ fontSize: 28 }}>{avgRetention}%</div>
              </div>
            </div>
          </div>
        </>
      )}

      {segTab === "value" && (
        <div className="card filter-bar">
          <div className="filter-section">
            <div className="filter-group"><div className="filter-label">Chains</div><div className="filter-pills">
              {CHAIN_PILLS.map((p) => <span key={p.val} className={`fpill ${p.val === "all" ? "active" : ""}`} data-vchain={p.val}>{p.label}</span>)}
            </div></div>
            <div className="filter-group"><div className="filter-label">Asset Type</div><div className="filter-pills">
              {ASSET_PILLS.map((p) => <span key={p.val} className={`fpill ${p.val === "all" ? "active" : ""}`} data-vasset={p.val}>{p.label}</span>)}
            </div></div>
          </div>
          <div className="filter-summary" id="valFilterSummary"><span className="summary-highlight">All filters</span> · <span className="summary-highlight">301,012 users</span></div>
        </div>
      )}
    </>
  );
}
