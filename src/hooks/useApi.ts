"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, apiClient } from "@/lib/api-client";

/**
 * Fetch JSON from the dashboard API with TanStack Query.
 * Use when you have a real API base (NEXT_PUBLIC_API_BASE or same-origin routes).
 *
 * @example
 * const { data, isLoading, error } = useApiQuery('/api/overview');
 * const { data } = useApiQuery(['campaigns', id], () => api(\`/api/campaigns/\${id}\`));
 */
export function useApiQuery<T = unknown>(
  queryKey: string | [string, ...unknown[]],
  pathOrFn?: string | (() => Promise<T>),
  options?: { enabled?: boolean; staleTime?: number }
) {
  const keyArray = Array.isArray(queryKey) ? queryKey : [queryKey];
  const queryFn =
    typeof pathOrFn === "function"
      ? pathOrFn
      : () => api<T>(typeof pathOrFn === "string" ? pathOrFn : (keyArray[0] as string));

  return useQuery({
    queryKey: keyArray,
    queryFn,
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime ?? 60 * 1000,
  });
}

/**
 * POST to the dashboard API with TanStack Query mutation.
 * Invalidates a query key on success (optional).
 */
export function useApiPost<T = unknown, TVariables = unknown>(
  path: string,
  options?: { invalidateKeys?: (string | string[])[] }
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: TVariables) => apiClient.post<T>(path, body),
    onSuccess: () => {
      options?.invalidateKeys?.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: Array.isArray(key) ? key : [key] })
      );
    },
  });
}
