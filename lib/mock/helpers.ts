import type { ApiResponse, PaginatedResponse } from "@/types/api";

let counter = 0;

export function wrap<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    meta: {
      requestId: `mock_${++counter}`,
      timestamp: new Date().toISOString(),
    },
  };
}

export function wrapPaginated<T>(
  items: T[],
  page: number,
  limit: number,
): PaginatedResponse<T> {
  const start = (page - 1) * limit;
  const sliced = items.slice(start, start + limit);
  return {
    success: true,
    data: sliced,
    pagination: {
      page,
      limit,
      total: items.length,
      totalPages: Math.ceil(items.length / limit),
    },
    meta: {
      requestId: `mock_${++counter}`,
      timestamp: new Date().toISOString(),
    },
  };
}

export function delay(ms = 200): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
