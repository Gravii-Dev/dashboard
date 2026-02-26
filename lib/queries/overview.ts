import { useQuery } from "@tanstack/react-query";
import { apiClient, USE_MOCK } from "@/lib/api";
import { mockGetOverviewSummary } from "@/lib/mock";
import type { OverviewSummary } from "@/types/api";

export function useOverviewSummary() {
  return useQuery<OverviewSummary>({
    queryKey: ["overview", "summary"],
    queryFn: async () => {
      if (USE_MOCK) {
        const res = await mockGetOverviewSummary();
        return res.data;
      }
      return apiClient.get<OverviewSummary>("/overview/summary");
    },
  });
}
