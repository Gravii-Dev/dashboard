import { useQuery } from "@tanstack/react-query";
import { apiClient, USE_MOCK } from "@/lib/api";
import { mockGetLabels, mockGetLabelsFilter } from "@/lib/mock";
import type { LabelsListData, LabelsFilterResult, LabelsFilterParams } from "@/types/api";

export function useLabels() {
  return useQuery<LabelsListData>({
    queryKey: ["labels"],
    queryFn: async () => {
      if (USE_MOCK) {
        const res = await mockGetLabels();
        return res.data;
      }
      return apiClient.get<LabelsListData>("/labels");
    },
  });
}

export function useLabelsFilter(params: LabelsFilterParams | null) {
  return useQuery<LabelsFilterResult>({
    queryKey: ["labels", "filter", params],
    enabled: params !== null,
    queryFn: async () => {
      if (USE_MOCK) {
        const res = await mockGetLabelsFilter(params!);
        return res.data;
      }
      if (params!.mode === "behavior") {
        return apiClient.get<LabelsFilterResult>("/labels/filter", {
          mode: "behavior",
          labelIds: (params as { labelIds?: number[] }).labelIds,
          chains: (params as { chains?: string[] }).chains,
          assets: (params as { assets?: string[] }).assets,
        });
      }
      return apiClient.get<LabelsFilterResult>("/labels/filter", {
        mode: "value",
        chains: (params as { chains?: string[] }).chains,
        assets: (params as { assets?: string[] }).assets,
        holdingRanges: (params as { holdingRanges?: string[] }).holdingRanges,
        paymentRanges: (params as { paymentRanges?: string[] }).paymentRanges,
        tradingRanges: (params as { tradingRanges?: string[] }).tradingRanges,
        tivRanges: (params as { tivRanges?: string[] }).tivRanges,
      });
    },
  });
}
