import type {
  CampaignListItem,
  Campaign,
  CampaignStatus,
  CampaignType,
  CreateCampaignRequest,
  CreateCampaignResult,
  EstimateReachRequest,
  EstimateReachResult,
} from "@/types/api";
import { CAMPAIGNS } from "@/app/campaigns/data";
import { wrap, wrapPaginated, delay } from "./helpers";

const listItems: CampaignListItem[] = CAMPAIGNS.map((c) => ({
  id: c.id,
  partner: c.partner,
  name: c.name,
  type: c.type,
  status: c.status as CampaignStatus,
  targetUsers: parseInt(c.target.replace(/[^\d]/g, ""), 10) || 0,
  startDate: c.status === "draft" ? "" : c.date.split("–")[0]?.trim() ?? "",
  endDate: c.status === "draft" ? "" : c.date.split("–")[1]?.trim() ?? "",
  createdAt: "2026-01-25T10:00:00Z",
}));

export async function mockGetCampaigns(status?: CampaignStatus | "all") {
  await delay();
  const items =
    !status || status === "all"
      ? listItems
      : listItems.filter((c) => c.status === status);
  return wrapPaginated(items, 1, 20);
}

export async function mockGetCampaign(id: number) {
  await delay();
  const item = listItems.find((c) => c.id === id);
  if (!item) throw new Error("Campaign not found");

  const full: Campaign = {
    ...item,
    type: item.type as CampaignType,
    customType: undefined,
    description: "",
    targeting: {
      mode: "behavior",
      segments: [],
      chains: [],
      sybilTolerance: "moderate",
    },
    details: {
      startDate: item.startDate,
      endDate: item.endDate,
      partnerLinkUrl: "",
      ctaLabel: "Join Campaign",
      accessControl: true,
    },
    metrics: {
      targetUsers: item.targetUsers,
      estimatedReach: item.targetUsers,
      eligibilitySummary: "All Segments · All Chains · Moderate Sybil",
    },
    updatedAt: item.createdAt,
  };
  return wrap(full);
}

export async function mockCreateCampaign(req: CreateCampaignRequest) {
  await delay(400);
  const result: CreateCampaignResult = {
    id: Math.floor(Math.random() * 1000) + 10,
    status: req.action === "launch" ? "live" : "draft",
    createdAt: new Date().toISOString(),
  };
  return wrap(result);
}

export async function mockEstimateReach(req: EstimateReachRequest) {
  await delay(300);

  let base = 301012;
  if (req.mode === "behavior") {
    if (req.segments && req.segments.length > 0) {
      base = Math.min(base, req.segments.length * 18000);
    }
    if (req.chains && req.chains.length > 0) {
      base = Math.floor(base * 0.3 * req.chains.length);
    }
  } else {
    if (req.percentileRanges && req.percentileRanges.length > 0) {
      const factors: Record<string, number> = { "5": 0.05, "10": 0.1, "20": 0.2, "50": 0.5 };
      for (const r of req.percentileRanges) {
        if (factors[r]) base = Math.floor(base * factors[r]);
      }
    }
  }

  const sybilFactors: Record<string, number> = { strict: 0.82, moderate: 0.93, relaxed: 0.98 };
  base = Math.floor(base * (sybilFactors[req.sybilTolerance] ?? 0.93));
  base = Math.max(base, 820);
  base = Math.min(base, 301012);

  const sybilFiltered = Math.floor(base * 0.07);

  const result: EstimateReachResult = {
    estimatedReach: base,
    sybilFiltered,
    eligibilitySummary: `${req.mode === "behavior" ? (req.segments?.join(", ") || "All Segments") : "Value Filter"} · ${req.chains?.join(", ") || "All Chains"} · ${req.sybilTolerance} Sybil`,
  };
  return wrap(result);
}
