import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, USE_MOCK } from "@/lib/api";
import {
  mockGetRiskOverview,
  mockGetRiskClusters,
  mockGetRiskWallets,
  mockBlockWallet,
} from "@/lib/mock";
import type {
  RiskOverview,
  SybilCluster,
  RiskWallet,
  RiskWalletsParams,
  BlockWalletResult,
} from "@/types/api";

export function useRiskOverview() {
  return useQuery<RiskOverview>({
    queryKey: ["risk", "overview"],
    queryFn: async () => {
      if (USE_MOCK) {
        const res = await mockGetRiskOverview();
        return res.data;
      }
      return apiClient.get<RiskOverview>("/risk/overview");
    },
  });
}

export function useRiskClusters() {
  return useQuery<SybilCluster[]>({
    queryKey: ["risk", "clusters"],
    queryFn: async () => {
      if (USE_MOCK) {
        const res = await mockGetRiskClusters();
        return res.data;
      }
      return apiClient.get<SybilCluster[]>("/risk/clusters");
    },
  });
}

export function useRiskWallets(params?: RiskWalletsParams) {
  return useQuery<{ items: RiskWallet[]; total: number }>({
    queryKey: ["risk", "wallets", params],
    queryFn: async () => {
      if (USE_MOCK) {
        const res = await mockGetRiskWallets(params);
        return { items: res.data, total: res.pagination.total };
      }
      return apiClient.getPaginated<RiskWallet>("/risk/wallets", params);
    },
  });
}

export function useBlockWallet() {
  const qc = useQueryClient();

  return useMutation<BlockWalletResult, Error, { address: string; reason?: string }>({
    mutationFn: async ({ address, reason }) => {
      if (USE_MOCK) {
        const res = await mockBlockWallet(address, reason);
        return res.data;
      }
      return apiClient.post<BlockWalletResult>(
        `/risk/wallets/${encodeURIComponent(address)}/block`,
        { reason },
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["risk", "wallets"] });
    },
  });
}
