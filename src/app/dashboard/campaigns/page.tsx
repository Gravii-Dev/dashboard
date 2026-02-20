"use client";

import { useState } from "react";
import { LABELS } from "@/lib/labels-data";

const CAMPAIGNS = [
  { partner: "Pendle Finance", name: "Yield Booster", type: "Yield Boost", status: "live" as const, target: "15,050 users", dates: "Jan 30 – Mar 1, 2026" },
  { partner: "Pendle Finance", name: "Lending Cashback", type: "Cashback", status: "live" as const, target: "42,150 users", dates: "Feb 1 – Apr 30, 2026" },
  { partner: "Pendle Finance", name: "Early Access V4", type: "Early Access", status: "ended" as const, target: "8,200 users", dates: "Nov 1 – Dec 31, 2025" },
  { partner: "Pendle Finance", name: "Fee Discount Program", type: "Fee Discount", status: "draft" as const, target: "— users", dates: "Not scheduled" },
];

const CAMPAIGN_TYPES = ["Airdrop", "Yield Boost", "Cashback", "Staking Reward", "Fee Discount", "Referral Bonus", "Loyalty Reward", "Early Access", "Custom"];
const CTA_OPTIONS = ["Join Campaign", "Learn More", "Claim Now", "Opt In", "Boost Now", "Get Started", "Apply Now", "Custom"];
const CHAIN_PILLS = ["All", "ETH", "Base", "Arbitrum", "BSC", "Polygon", "Avalanche", "Hyperliquid", "Kaia", "Solana"];

export default function CampaignsPage() {
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "live" | "ended">("all");
  const [campType, setCampType] = useState(CAMPAIGN_TYPES[0]);
  const [customType, setCustomType] = useState("");
  const [ctaSelect, setCtaSelect] = useState(CTA_OPTIONS[0]);
  const [customCta, setCustomCta] = useState("");
  const [campTab, setCampTab] = useState<"cbehavior" | "cvalue">("cbehavior");
  const [accessToggle, setAccessToggle] = useState(true);

  const filtered = statusFilter === "all" ? CAMPAIGNS : CAMPAIGNS.filter((c) => c.status === statusFilter);

  return (
    <>
      <div className="main-header">
        <h1 className="main-title glow">Campaign Launch Manager</h1>
      </div>

      <div className="camp-list-header">
        <span className="camp-list-title">Your Campaigns</span>
        <div className="camp-filters">
          {(["all", "draft", "live", "ended"] as const).map((s) => (
            <span
              key={s}
              role="button"
              tabIndex={0}
              className={`fpill ${statusFilter === s ? "active" : ""}`}
              onClick={() => setStatusFilter(s)}
              onKeyDown={(e) => e.key === "Enter" && setStatusFilter(s)}
              data-cstatus={s}
            >
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </span>
          ))}
        </div>
      </div>

      <div className="camp-cards">
        {filtered.map((c, i) => (
          <div key={i} className="camp-card" data-status={c.status}>
            <div className="camp-card-top">
              <div><div className="camp-partner">{c.partner}</div><div className="camp-name">{c.name}</div></div>
              <div className="camp-badges">
                <span className="camp-type-badge">{c.type}</span>
                <span className={`camp-status-badge ${c.status}`}>{c.status}</span>
              </div>
            </div>
            <div className="camp-card-meta">
              <span>Target: {c.target}</span><span>{c.dates}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="camp-list-header" style={{ marginTop: 28 }}>
        <span className="camp-list-title">Create New Campaign</span>
      </div>
      <div className="camp-form-wrapper">
        <div className="camp-step">
          <div className="camp-step-header"><span className="step-num">1</span> Basic Info</div>
          <div className="camp-form-grid">
            <div className="camp-field">
              <label className="camp-label">Partner Name</label>
              <input type="text" className="camp-input" placeholder="e.g. Pendle Finance" />
            </div>
            <div className="camp-field">
              <label className="camp-label">Campaign Name</label>
              <input type="text" className="camp-input" placeholder="e.g. Yield Booster" />
            </div>
            <div className="camp-field">
              <label className="camp-label">Campaign Type</label>
              <select className="camp-select" value={campType} onChange={(e) => setCampType(e.target.value)}>
                {CAMPAIGN_TYPES.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            {campType === "Custom" && (
              <div className="camp-field">
                <label className="camp-label">Custom Type Name</label>
                <input type="text" className="camp-input" placeholder="Enter custom type" value={customType} onChange={(e) => setCustomType(e.target.value)} />
              </div>
            )}
          </div>
          <div className="camp-field" style={{ marginTop: 12 }}>
            <label className="camp-label">Description</label>
            <textarea className="camp-textarea" placeholder="Describe the campaign benefits for users..." />
          </div>
        </div>

        <div className="camp-step">
          <div className="camp-step-header"><span className="step-num">2</span> Target Audience</div>
          <div className="seg-tabs" style={{ marginBottom: 14 }}>
            <span role="button" tabIndex={0} className={`seg-tab ${campTab === "cbehavior" ? "active" : ""}`} onClick={() => setCampTab("cbehavior")} data-ctab="cbehavior">By Behavior</span>
            <span role="button" tabIndex={0} className={`seg-tab ${campTab === "cvalue" ? "active" : ""}`} onClick={() => setCampTab("cvalue")} data-ctab="cvalue">By Value</span>
          </div>
          <div className="camp-or-note">Select one or both tabs (OR condition)</div>
          <div className={`cseg-panel ${campTab === "cbehavior" ? "active" : ""}`} id="cseg-cbehavior">
            <div className="camp-field">
              <label className="camp-label">Segments</label>
              <div className="filter-pills camp-pills">
                {LABELS.map((l) => <span key={l.id} className="fpill" data-cseg-id={l.id}>{l.name}</span>)}
              </div>
            </div>
            <div className="camp-field" style={{ marginTop: 10 }}>
              <label className="camp-label">Chains</label>
              <div className="filter-pills">
                {CHAIN_PILLS.map((c) => <span key={c} className="fpill" data-cc={c.toLowerCase()}>{c}</span>)}
              </div>
            </div>
          </div>
          <div className={`cseg-panel ${campTab === "cvalue" ? "active" : ""}`} id="cseg-cvalue">
              <div className="camp-field">
                <label className="camp-label">Percentile By</label>
                <div className="filter-pills">
                  <span className="fpill active">All</span><span className="fpill">Portfolio Value</span><span className="fpill">Trading Volume</span><span className="fpill">Tx Frequency</span><span className="fpill">Wallet Age</span>
                </div>
              </div>
              <div className="camp-field" style={{ marginTop: 10 }}>
              <label className="camp-label">Chains</label>
              <div className="filter-pills">
                {CHAIN_PILLS.map((c) => <span key={c} className="fpill" data-cc2={c.toLowerCase()}>{c}</span>)}
              </div>
            </div>
          </div>
          <div className="camp-form-grid" style={{ marginTop: 14 }}>
            <div className="camp-field">
              <label className="camp-label">Sybil Risk Tolerance</label>
              <select className="camp-select" defaultValue="moderate">
                <option value="strict">Strict — Low risk only</option>
                <option value="moderate">Moderate — Medium and below</option>
                <option value="relaxed">Relaxed — High and below</option>
              </select>
            </div>
            <div className="camp-field">
              <label className="camp-label">Estimated Reach</label>
              <div className="camp-reach">~45,200 users</div>
            </div>
          </div>
        </div>

        <div className="camp-step">
          <div className="camp-step-header"><span className="step-num">3</span> Campaign Details</div>
          <div className="camp-form-grid">
            <div className="camp-field">
              <label className="camp-label">Start Date</label>
              <input type="date" className="camp-input" />
            </div>
            <div className="camp-field">
              <label className="camp-label">End Date</label>
              <input type="date" className="camp-input" />
            </div>
            <div className="camp-field">
              <label className="camp-label">Partner Link URL</label>
              <input type="text" className="camp-input" placeholder="https://partner.com/campaign" />
            </div>
            <div className="camp-field">
              <label className="camp-label">CTA Button Label</label>
              <select className="camp-select" value={ctaSelect} onChange={(e) => setCtaSelect(e.target.value)}>
                {CTA_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            {ctaSelect === "Custom" && (
              <div className="camp-field">
                <label className="camp-label">Custom CTA Text</label>
                <input type="text" className="camp-input" placeholder="Enter button text" value={customCta} onChange={(e) => setCustomCta(e.target.value)} />
              </div>
            )}
          </div>
          <div className="camp-elig" style={{ marginTop: 14 }}>
            <label className="camp-label">Eligibility Summary <span style={{ fontSize: 10, color: "var(--text-muted)" }}>(visible to partners only)</span></label>
            <div className="camp-elig-box">DEX Traders · Top 5% · Ethereum · Moderate Sybil</div>
          </div>
          <div className="camp-toggle-row" style={{ marginTop: 12 }}>
            <label className="camp-label">Access Control (API filtering)</label>
            <div className="camp-toggle">
              <input type="checkbox" id="accessToggle" checked={accessToggle} onChange={(e) => setAccessToggle(e.target.checked)} />
              <label htmlFor="accessToggle" className="toggle-label"><span className="toggle-inner"></span></label>
            </div>
          </div>
        </div>

        <div className="camp-submit">
          <button type="button" className="camp-btn draft">Save as Draft</button>
          <button type="button" className="camp-btn launch">Launch Campaign</button>
        </div>
      </div>
    </>
  );
}
