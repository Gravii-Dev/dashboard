import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient, USE_MOCK } from "@/lib/api";
import {
  mockGetCampaigns,
  mockGetCampaign,
  mockCreateCampaign,
  mockEstimateReach,
} from "@/lib/mock";
import type {
  CampaignListItem,
  CampaignStatus,
  Campaign,
  CreateCampaignRequest,
  CreateCampaignResult,
  EstimateReachRequest,
  EstimateReachResult,
} from "@/types/api";

export function useCampaigns(status?: CampaignStatus | "all") {
  return useQuery<CampaignListItem[]>({
    queryKey: ["campaigns", status],
    queryFn: async () => {
      if (USE_MOCK) {
        const res = await mockGetCampaigns(status);
        return res.data;
      }
      return apiClient.get<CampaignListItem[]>("/campaigns", { status });
    },
  });
}

export function useCampaign(id: number | null) {
  return useQuery<Campaign>({
    queryKey: ["campaigns", id],
    enabled: id !== null,
    queryFn: async () => {
      if (USE_MOCK) {
        const res = await mockGetCampaign(id!);
        return res.data;
      }
      return apiClient.get<Campaign>(`/campaigns/${id}`);
    },
  });
}

export function useCreateCampaign() {
  return useMutation<CreateCampaignResult, Error, CreateCampaignRequest>({
    mutationFn: async (req) => {
      if (USE_MOCK) {
        const res = await mockCreateCampaign(req);
        return res.data;
      }
      return apiClient.post<CreateCampaignResult>("/campaigns", req);
    },
  });
}

export function useEstimateReach() {
  return useMutation<EstimateReachResult, Error, EstimateReachRequest>({
    mutationFn: async (req) => {
      if (USE_MOCK) {
        const res = await mockEstimateReach(req);
        return res.data;
      }
      return apiClient.post<EstimateReachResult>(
        "/campaigns/estimate-reach",
        req,
      );
    },
  });
}
