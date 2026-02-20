"use client";

import { useState } from "react";
import { CampaignCard } from "@/components/dashboard/CampaignCard";
import { CampaignForm } from "@/components/dashboard/CampaignForm";
import pageStyles from "./CampaignPage.module.css";

const CAMPAIGNS = [
  { partner: "Pendle Finance", name: "Yield Booster", type: "Yield Boost", status: "live" as const, target: "15,050 users", dates: "Jan 30 – Mar 1, 2026" },
  { partner: "Pendle Finance", name: "Lending Cashback", type: "Cashback", status: "live" as const, target: "42,150 users", dates: "Feb 1 – Apr 30, 2026" },
  { partner: "Pendle Finance", name: "Early Access V4", type: "Early Access", status: "ended" as const, target: "8,200 users", dates: "Nov 1 – Dec 31, 2025" },
  { partner: "Pendle Finance", name: "Fee Discount Program", type: "Fee Discount", status: "draft" as const, target: "— users", dates: "Not scheduled" },
];

export default function CampaignsPage() {
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "live" | "ended">("all");
  const filtered = statusFilter === "all" ? CAMPAIGNS : CAMPAIGNS.filter((c) => c.status === statusFilter);

  return (
    <>
      <div className="main-header">
        <h1 className="main-title glow">Campaign Launch Manager</h1>
      </div>

      <div className={pageStyles.listHeader}>
        <span className={pageStyles.listTitle}>Your Campaigns</span>
        <div className={pageStyles.filters}>
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

      <div className={pageStyles.cards}>
        {filtered.map((c, i) => (
          <CampaignCard key={i} campaign={c} />
        ))}
      </div>

      <div className={`${pageStyles.listHeader} ${pageStyles.listHeaderWithMargin}`}>
        <span className={pageStyles.listTitle}>Create New Campaign</span>
      </div>
      <CampaignForm />
    </>
  );
}
