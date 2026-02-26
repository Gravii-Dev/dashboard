import { useQuery } from "@tanstack/react-query";
import { apiClient, USE_MOCK } from "@/lib/api";
import { mockGetGroupStats, mockGetDexProtocols } from "@/lib/mock";
import type { GroupStats, DexProtocol, UserGroup, Chain } from "@/types/api";

export function useGroupStats(
  chain: Chain | "all" = "all",
  group: UserGroup = "top5",
) {
  return useQuery<GroupStats>({
    queryKey: ["analytics", "group-stats", chain, group],
    queryFn: async () => {
      if (USE_MOCK) {
        const res = await mockGetGroupStats(chain, group);
        return res.data;
      }
      return apiClient.get<GroupStats>("/analytics/group-stats", {
        chain,
        group,
      });
    },
  });
}

export function useDexProtocols(
  chain: Chain | "all" = "all",
  group: UserGroup = "top5",
) {
  return useQuery<DexProtocol[]>({
    queryKey: ["analytics", "dex-protocols", chain, group],
    queryFn: async () => {
      if (USE_MOCK) {
        const res = await mockGetDexProtocols();
        return res.data;
      }
      return apiClient.get<DexProtocol[]>("/analytics/dex-protocols", {
        chain,
        group,
      });
    },
  });
}
