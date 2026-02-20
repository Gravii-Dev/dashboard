"use client";

import { useState } from "react";
import { LABELS } from "@/lib/labels-data";
import { cn } from "@/lib/utils";
import styles from "./CampaignForm.module.css";

type CampTab = "cbehavior" | "cvalue";

const CAMPAIGN_TYPES = ["Airdrop", "Yield Boost", "Cashback", "Staking Reward", "Fee Discount", "Referral Bonus", "Loyalty Reward", "Early Access", "Custom"];
const CTA_OPTIONS = ["Join Campaign", "Learn More", "Claim Now", "Opt In", "Boost Now", "Get Started", "Apply Now", "Custom"];
const CHAIN_PILLS = ["All", "ETH", "Base", "Arbitrum", "BSC", "Polygon", "Avalanche", "Hyperliquid", "Kaia", "Solana"];

export function CampaignForm() {
  const [campTab, setCampTab] = useState<CampTab>("cbehavior");
  return (
    <div className={styles.wrapper}>
      <div className={styles.step}>
        <div className={styles.stepHeader}><span className={styles.stepNum}>1</span> Basic Info</div>
        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label className={styles.label}>Partner Name</label>
            <input type="text" className={styles.input} placeholder="e.g. Pendle Finance" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Campaign Name</label>
            <input type="text" className={styles.input} placeholder="e.g. Yield Booster" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Campaign Type</label>
            <select className={styles.select}>
              {CAMPAIGN_TYPES.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>
        <div className={cn(styles.field, styles.fieldBlock)}>
          <label className={styles.label}>Description</label>
          <textarea className={styles.textarea} placeholder="Describe the campaign benefits for users..." />
        </div>
      </div>

      <div className={styles.step}>
        <div className={styles.stepHeader}><span className={styles.stepNum}>2</span> Target Audience</div>
        <div className={styles.segTabs}>
          <span role="button" tabIndex={0} className={cn(styles.segTab, campTab === "cbehavior" && styles.active)} onClick={() => setCampTab("cbehavior")} onKeyDown={(e) => e.key === "Enter" && setCampTab("cbehavior")} data-ctab="cbehavior">By Behavior</span>
          <span role="button" tabIndex={0} className={cn(styles.segTab, campTab === "cvalue" && styles.active)} onClick={() => setCampTab("cvalue")} onKeyDown={(e) => e.key === "Enter" && setCampTab("cvalue")} data-ctab="cvalue">By Value</span>
        </div>
        <div className={styles.orNote}>Select one or both tabs (OR condition)</div>
        <div className={cn(styles.panel, campTab === "cbehavior" && styles.active)} id="cseg-cbehavior">
          <div className={styles.field}>
            <label className={styles.label}>Segments</label>
            <div className={styles.filterPills}>
              {LABELS.map((l) => <span key={l.id} className="fpill" data-cseg-id={l.id}>{l.name}</span>)}
            </div>
          </div>
          <div className={cn(styles.field, styles.fieldBlock)}>
            <label className={styles.label}>Chains</label>
            <div className={styles.filterPills}>
              {CHAIN_PILLS.map((c) => <span key={c} className="fpill" data-cc={c.toLowerCase()}>{c}</span>)}
            </div>
          </div>
        </div>
        <div className={cn(styles.panel, campTab === "cvalue" && styles.active)} id="cseg-cvalue">
          <div className={styles.field}>
            <label className={styles.label}>Percentile By</label>
            <div className={styles.filterPills}>
              <span className="fpill active">All</span>
              <span className="fpill">Portfolio Value</span>
              <span className="fpill">Trading Volume</span>
              <span className="fpill">Tx Frequency</span>
              <span className="fpill">Wallet Age</span>
            </div>
          </div>
          <div className={cn(styles.field, styles.fieldBlock)}>
            <label className={styles.label}>Chains</label>
            <div className={styles.filterPills}>
              {CHAIN_PILLS.map((c) => <span key={c} className="fpill" data-cc2={c.toLowerCase()}>{c}</span>)}
            </div>
          </div>
        </div>
        <div className={styles.formGrid} style={{ marginTop: 14 }}>
          <div className={styles.field}>
            <label className={styles.label}>Sybil Risk Tolerance</label>
            <select className={styles.select} defaultValue="moderate">
              <option value="strict">Strict — Low risk only</option>
              <option value="moderate">Moderate — Medium and below</option>
              <option value="relaxed">Relaxed — High and below</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Estimated Reach</label>
            <div className={styles.reach}>~45,200 users</div>
          </div>
        </div>
      </div>

      <div className={styles.step}>
        <div className={styles.stepHeader}><span className={styles.stepNum}>3</span> Campaign Details</div>
        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label className={styles.label}>Start Date</label>
            <input type="date" className={styles.input} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>End Date</label>
            <input type="date" className={styles.input} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Partner Link URL</label>
            <input type="text" className={styles.input} placeholder="https://partner.com/campaign" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>CTA Button Label</label>
            <select className={styles.select}>
              {CTA_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>
        <div className={styles.elig}>
          <label className={styles.label}>
            Eligibility Summary <span className={styles.mutedSpan}>(visible to partners only)</span>
          </label>
          <div className={styles.eligBox}>DEX Traders · Top 5% · Ethereum · Moderate Sybil</div>
        </div>
        <div className={styles.toggleRow}>
          <label className={styles.label}>Access Control (API filtering)</label>
          <div className={styles.toggle}>
            <input type="checkbox" id="accessToggle" defaultChecked />
            <label htmlFor="accessToggle" className={styles.toggleLabel}><span className={styles.toggleInner} /></label>
          </div>
        </div>
      </div>

      <div className={styles.submit}>
        <button type="button" className={cn(styles.btn, styles.btnDraft)}>Save as Draft</button>
        <button type="button" className={cn(styles.btn, styles.btnLaunch)}>Launch Campaign</button>
      </div>
    </div>
  );
}
