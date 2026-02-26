"use client";

import { useState, useMemo, useRef } from "react";
import s from "./page.module.css";
import FilterPills from "@/components/FilterPills/FilterPills";
import SegTabs from "@/components/SegTabs/SegTabs";
import { SkeletonGrid } from "@/components/Skeleton/Skeleton";
import ErrorState from "@/components/ErrorState/ErrorState";
import { useToast } from "@/components/Toast/ToastProvider";
import {
  cx,
  CHAIN_PILL_DATA,
  ASSET_PILL_DATA,
  type PillItem,
} from "@/lib/utils";
import {
  SEGMENT_LABELS,
  SYBIL_PREVIEWS,
  PERC_RANGE_MAP,
  TIV_MAP,
} from "./data";
import { useCampaigns, useCreateCampaign } from "@/lib/queries/campaigns";
import type { CampaignStatus, Chain, SybilTolerance, CampaignTargeting, CampaignDetails } from "@/types/api";

const PERC_BY_ITEMS: PillItem[] = [
  { key: "all", label: "All" },
  { key: "portfolio", label: "Portfolio Value" },
  { key: "trading", label: "Trading Volume" },
  { key: "txfreq", label: "Tx Frequency" },
  { key: "age", label: "Wallet Age" },
];

const PERC_RANGE_ITEMS: PillItem[] = [
  { key: "all", label: "All Users" },
  { key: "5", label: "Top 5%" },
  { key: "10", label: "Top 10%" },
  { key: "20", label: "Top 20%" },
  { key: "50", label: "Top 50%" },
];

const TIV_ITEMS: PillItem[] = [
  { key: "all", label: "All" },
  { key: "1k", label: "Avail > $1K" },
  { key: "10k", label: "Avail > $10K" },
  { key: "50k", label: "Avail > $50K" },
  { key: "100k", label: "Avail > $100K" },
];

function chainKeysToLabels(keys: Set<string>): string {
  if (keys.size === 0) return "All Chains";
  return Array.from(keys)
    .map((k) => CHAIN_PILL_DATA.find((p) => p.key === k)?.label ?? k)
    .join(", ");
}

export default function CampaignsPage() {
  const [filter, setFilter] = useState<CampaignStatus | "all">("all");
  const [campTab, setCampTab] = useState("cbehavior");
  const [campType, setCampType] = useState("Airdrop");
  const [ctaSelect, setCtaSelect] = useState("Join Campaign");
  const [sybilSelect, setSybilSelect] = useState<SybilTolerance>("moderate");

  const [activeSegs, setActiveSegs] = useState<Set<string>>(new Set());
  const [behaviorChains, setBehaviorChains] = useState<Set<string>>(new Set());
  const [percBy, setPercBy] = useState<Set<string>>(new Set());
  const [campAsset, setCampAsset] = useState<Set<string>>(new Set());
  const [percRange, setPercRange] = useState<Set<string>>(new Set());
  const [campTiv, setCampTiv] = useState<Set<string>>(new Set());
  const [valueChains, setValueChains] = useState<Set<string>>(new Set());

  const partnerRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const customTypeRef = useRef<HTMLInputElement>(null);
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const customCtaRef = useRef<HTMLInputElement>(null);
  const accessRef = useRef<HTMLInputElement>(null);

  const toast = useToast();
  const { data: campaigns, isLoading, isError, refetch } = useCampaigns(filter === "all" ? undefined : filter);
  const createMutation = useCreateCampaign();

  function toggleSeg(label: string) {
    setActiveSegs((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }

  const estimatedReach = useMemo(() => {
    let base = 301012;

    if (campTab === "cbehavior") {
      if (activeSegs.size > 0) base = Math.min(base, activeSegs.size * 18000);
      if (behaviorChains.size > 0) base = Math.floor(base * 0.3 * behaviorChains.size);
    } else {
      percRange.forEach((val) => {
        const factor = PERC_RANGE_MAP[val];
        if (factor) base = Math.floor(base * factor);
      });
      campTiv.forEach((val) => {
        const factor = TIV_MAP[val];
        if (factor) base = Math.floor(base * factor);
      });
      if (valueChains.size > 0) base = Math.floor(base * 0.3 * valueChains.size);
    }

    if (sybilSelect === "strict") base = Math.floor(base * 0.82);
    else if (sybilSelect === "moderate") base = Math.floor(base * 0.93);
    else base = Math.floor(base * 0.98);

    return Math.max(Math.min(base, 301012), 820);
  }, [campTab, activeSegs, behaviorChains, percRange, campTiv, valueChains, sybilSelect]);

  const eligibilitySummary = useMemo(() => {
    const parts: string[] = [];
    const percLabels: Record<string, string> = { "5": "Top 5%", "10": "Top 10%", "20": "Top 20%", "50": "Top 50%" };
    const sybilLabels: Record<string, string> = { strict: "Strict Sybil", moderate: "Moderate Sybil", relaxed: "Relaxed Sybil" };

    if (campTab === "cbehavior") {
      if (activeSegs.size > 0) {
        const segList = Array.from(activeSegs).slice(0, 3).join(", ");
        parts.push(activeSegs.size > 3 ? segList + ` +${activeSegs.size - 3}` : segList);
      } else {
        parts.push("All Segments");
      }
      parts.push(chainKeysToLabels(behaviorChains));
    } else {
      if (percRange.size > 0) {
        parts.push(Array.from(percRange).map((v) => percLabels[v] ?? v).join(", "));
      } else {
        parts.push("All Users");
      }
      parts.push(chainKeysToLabels(valueChains));
    }
    parts.push(sybilLabels[sybilSelect] ?? "Moderate Sybil");
    return parts.join(" · ");
  }, [campTab, activeSegs, behaviorChains, percRange, valueChains, sybilSelect]);

  function buildRequest(action: "draft" | "launch") {
    const chains = campTab === "cbehavior"
      ? Array.from(behaviorChains) as Chain[]
      : Array.from(valueChains) as Chain[];

    const targeting: CampaignTargeting = {
      mode: campTab === "cbehavior" ? "behavior" : "value",
      segments: campTab === "cbehavior" ? Array.from(activeSegs) : undefined,
      percentileBy: campTab === "cvalue" ? Array.from(percBy) : undefined,
      assetTypes: campTab === "cvalue" ? Array.from(campAsset) as CampaignTargeting["assetTypes"] : undefined,
      percentileRanges: campTab === "cvalue" ? Array.from(percRange) : undefined,
      availableValueRanges: campTab === "cvalue" ? Array.from(campTiv) : undefined,
      chains,
      sybilTolerance: sybilSelect,
    };

    const details: CampaignDetails = {
      startDate: startRef.current?.value ?? "",
      endDate: endRef.current?.value ?? "",
      partnerLinkUrl: linkRef.current?.value ?? "",
      ctaLabel: ctaSelect === "Custom" ? (customCtaRef.current?.value ?? "Custom") : ctaSelect,
      accessControl: accessRef.current?.checked ?? true,
    };

    return {
      action,
      partner: partnerRef.current?.value ?? "",
      name: nameRef.current?.value ?? "",
      type: campType === "Custom" ? (customTypeRef.current?.value ?? "Custom") : campType,
      customType: campType === "Custom" ? (customTypeRef.current?.value ?? null) : null,
      description: descRef.current?.value ?? "",
      targeting,
      details,
    };
  }

  function handleSubmit(action: "draft" | "launch") {
    const req = buildRequest(action);
    if (!req.partner || !req.name) {
      toast.error("Partner name and campaign name are required.");
      return;
    }

    createMutation.mutate(req, {
      onSuccess: (result) => {
        toast.success(
          action === "launch"
            ? `Campaign "${req.name}" launched successfully! (ID: ${result.id})`
            : `Campaign "${req.name}" saved as draft. (ID: ${result.id})`,
        );
        refetch();
      },
      onError: () => {
        toast.error("Failed to create campaign. Please try again.");
      },
    });
  }

  return (
    <div className="page active" id="page-campaigns">
      <div className="main-header">
        <h1 className="main-title glow">Campaign Launch Manager</h1>
      </div>

      <div className={s.campListHeader}>
        <span className={s.campListTitle}>Your Campaigns</span>
        <div className={s.campFilters}>
          {(["all", "draft", "live", "ended"] as const).map((status) => (
            <span
              key={status}
              className={`fpill${filter === status ? " active" : ""}`}
              onClick={() => setFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          ))}
        </div>
      </div>

      {isLoading && <SkeletonGrid count={4} columns={2} />}
      {isError && <ErrorState onRetry={() => refetch()} />}

      {campaigns && (
        <div className={s.campCards} id="campCards">
          {campaigns.map((camp) => (
            <div key={camp.id} className={s.campCard} data-status={camp.status}>
              <div className={s.campCardTop}>
                <div>
                  <div className={s.campPartner}>{camp.partner}</div>
                  <div className={s.campName}>{camp.name}</div>
                </div>
                <div className={s.campBadges}>
                  <span className={s.campTypeBadge}>{camp.type}</span>
                  <span className={cx(s.campStatusBadge, s[camp.status as keyof typeof s])}>
                    {camp.status.charAt(0).toUpperCase() + camp.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className={s.campCardMeta}>
                <span>Target: {camp.targetUsers.toLocaleString()} users</span>
                <span>
                  {camp.startDate && camp.endDate
                    ? `${camp.startDate} – ${camp.endDate}`
                    : "Not scheduled"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={s.campListHeader} style={{ marginTop: 28 }}>
        <span className={s.campListTitle}>Create New Campaign</span>
      </div>
      <div className={s.campFormWrapper}>
        <div className={s.campStep}>
          <div className={s.campStepHeader}>
            <span className={s.stepNum}>1</span> Basic Info
          </div>
          <div className={s.campFormGrid}>
            <div className={s.campField}>
              <label className={s.campLabel}>Partner Name</label>
              <input ref={partnerRef} type="text" className={s.campInput} placeholder="e.g. Pendle Finance" />
            </div>
            <div className={s.campField}>
              <label className={s.campLabel}>Campaign Name</label>
              <input ref={nameRef} type="text" className={s.campInput} placeholder="e.g. Yield Booster" />
            </div>
            <div className={s.campField}>
              <label className={s.campLabel}>Campaign Type</label>
              <select className={s.campSelect} value={campType} onChange={(e) => setCampType(e.target.value)}>
                <option>Airdrop</option>
                <option>Yield Boost</option>
                <option>Cashback</option>
                <option>Staking Reward</option>
                <option>Fee Discount</option>
                <option>Referral Bonus</option>
                <option>Loyalty Reward</option>
                <option>Early Access</option>
                <option>Custom</option>
              </select>
            </div>
            <div className={s.campField} style={{ display: campType === "Custom" ? undefined : "none" }}>
              <label className={s.campLabel}>Custom Type Name</label>
              <input ref={customTypeRef} type="text" className={s.campInput} placeholder="Enter custom type" />
            </div>
          </div>
          <div className={s.campField} style={{ marginTop: 12 }}>
            <label className={s.campLabel}>Description</label>
            <textarea ref={descRef} className={s.campTextarea} placeholder="Describe the campaign benefits for users..." />
          </div>
        </div>

        <div className={s.campStep}>
          <div className={s.campStepHeader}>
            <span className={s.stepNum}>2</span> Target Audience
          </div>

          <SegTabs
            tabs={[
              { key: "cbehavior", label: "By Behavior" },
              { key: "cvalue", label: "By Value" },
            ]}
            activeTab={campTab}
            onTabChange={setCampTab}
            style={{ marginBottom: 14 }}
          />
          <div className={s.campOrNote}>Select one tab — By Behavior or By Value</div>

          <div className={cx(s.csegPanel, campTab === "cbehavior" && s.csegPanelActive)}>
            <div className={s.campField}>
              <label className={s.campLabel}>Segments</label>
              <div className={`filter-pills ${s.campPills}`}>
                {SEGMENT_LABELS.map((label) => (
                  <span key={label} className={`fpill${activeSegs.has(label) ? " active" : ""}`} onClick={() => toggleSeg(label)}>
                    {label}
                  </span>
                ))}
              </div>
            </div>
            <div className={s.campField} style={{ marginTop: 10 }}>
              <label className={s.campLabel}>Chains</label>
              <div className="filter-pills">
                <FilterPills items={CHAIN_PILL_DATA} activeSet={behaviorChains} onChange={setBehaviorChains} />
              </div>
            </div>
          </div>

          <div className={cx(s.csegPanel, campTab === "cvalue" && s.csegPanelActive)}>
            <div className={s.campField}>
              <label className={s.campLabel}>Percentile By</label>
              <div className="filter-pills">
                <FilterPills items={PERC_BY_ITEMS} activeSet={percBy} onChange={setPercBy} />
              </div>
            </div>
            <div className={s.campField} style={{ marginTop: 10 }}>
              <label className={s.campLabel}>Asset Type</label>
              <div className="filter-pills">
                <FilterPills items={ASSET_PILL_DATA} activeSet={campAsset} onChange={setCampAsset} />
              </div>
            </div>
            <div className={s.campField} style={{ marginTop: 10 }}>
              <label className={s.campLabel}>Percentile Range</label>
              <div className="filter-pills">
                <FilterPills items={PERC_RANGE_ITEMS} activeSet={percRange} onChange={setPercRange} />
              </div>
            </div>
            <div className={s.campField} style={{ marginTop: 10 }}>
              <label className={s.campLabel}>
                Available Value Filter{" "}
                <span className="info-icon">
                  ⓘ
                  <div className="info-tooltip">
                    <strong>Available Assets</strong> — Filter by assets not staked, lent, or providing liquidity. Combined as AND condition with above filters.
                  </div>
                </span>
              </label>
              <div className="filter-pills">
                <FilterPills items={TIV_ITEMS} activeSet={campTiv} onChange={setCampTiv} />
              </div>
            </div>
            <div className={s.campField} style={{ marginTop: 10 }}>
              <label className={s.campLabel}>Chains</label>
              <div className="filter-pills">
                <FilterPills items={CHAIN_PILL_DATA} activeSet={valueChains} onChange={setValueChains} />
              </div>
            </div>
          </div>

          <div className={s.campFormGrid} style={{ marginTop: 14 }}>
            <div className={s.campField}>
              <label className={s.campLabel}>Sybil Risk Tolerance</label>
              <select className={s.campSelect} value={sybilSelect} onChange={(e) => setSybilSelect(e.target.value as SybilTolerance)}>
                <option value="strict">Strict — Low risk only</option>
                <option value="moderate">Moderate — Medium and below</option>
                <option value="relaxed">Relaxed — High and below</option>
              </select>
              <div style={{ fontSize: 11, color: "var(--accent-amber)", marginTop: 6 }}>
                {SYBIL_PREVIEWS[sybilSelect]}
              </div>
            </div>
            <div className={s.campField}>
              <label className={s.campLabel}>Estimated Reach</label>
              <div className={s.campReach}>~{estimatedReach.toLocaleString()} users</div>
            </div>
          </div>
        </div>

        <div className={s.campStep}>
          <div className={s.campStepHeader}>
            <span className={s.stepNum}>3</span> Campaign Details
          </div>
          <div className={s.campFormGrid}>
            <div className={s.campField}>
              <label className={s.campLabel}>Start Date</label>
              <input ref={startRef} type="date" className={s.campInput} />
            </div>
            <div className={s.campField}>
              <label className={s.campLabel}>End Date</label>
              <input ref={endRef} type="date" className={s.campInput} />
            </div>
            <div className={s.campField}>
              <label className={s.campLabel}>Partner Link URL</label>
              <input ref={linkRef} type="text" className={s.campInput} placeholder="https://partner.com/campaign" />
            </div>
            <div className={s.campField}>
              <label className={s.campLabel}>CTA Button Label</label>
              <select className={s.campSelect} value={ctaSelect} onChange={(e) => setCtaSelect(e.target.value)}>
                <option>Join Campaign</option>
                <option>Learn More</option>
                <option>Claim Now</option>
                <option>Opt In</option>
                <option>Boost Now</option>
                <option>Get Started</option>
                <option>Apply Now</option>
                <option>Custom</option>
              </select>
            </div>
            <div className={s.campField} style={{ display: ctaSelect === "Custom" ? undefined : "none" }}>
              <label className={s.campLabel}>Custom CTA Text</label>
              <input ref={customCtaRef} type="text" className={s.campInput} placeholder="Enter button text" />
            </div>
          </div>

          <div className={s.campElig} style={{ marginTop: 14 }}>
            <label className={s.campLabel}>
              Eligibility Summary{" "}
              <span style={{ fontSize: 10, color: "var(--text-muted)" }}>(visible to partners only)</span>
            </label>
            <div className={s.campEligBox}>{eligibilitySummary}</div>
          </div>

          <div className={s.campToggleRow} style={{ marginTop: 12 }}>
            <label className={s.campLabel}>Access Control (API filtering)</label>
            <div className={s.campToggle}>
              <input ref={accessRef} type="checkbox" id="accessToggle" defaultChecked />
              <label htmlFor="accessToggle" className={s.toggleLabel}>
                <span className={s.toggleInner} />
              </label>
            </div>
          </div>
        </div>

        <div className={s.campSubmit}>
          <button
            className={cx(s.campBtn, s.campBtnDraft)}
            onClick={() => handleSubmit("draft")}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Saving..." : "Save as Draft"}
          </button>
          <button
            className={cx(s.campBtn, s.campBtnLaunch)}
            onClick={() => handleSubmit("launch")}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Launching..." : "Launch Campaign"}
          </button>
        </div>
      </div>
    </div>
  );
}
