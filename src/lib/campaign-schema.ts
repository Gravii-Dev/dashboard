import { z } from "zod";

export const campaignFormSchema = z.object({
  partnerName: z.string().min(1, "Partner name is required").max(120),
  campaignName: z.string().min(1, "Campaign name is required").max(120),
  campaignType: z.string().min(1, "Select a type"),
  description: z.string().max(2000).optional(),
  sybilTolerance: z.enum(["strict", "moderate", "relaxed"]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  partnerLinkUrl: z.string().max(500).optional(),
  ctaLabel: z.string().min(1),
  accessControl: z.boolean(),
});

export type CampaignFormValues = z.infer<typeof campaignFormSchema>;
