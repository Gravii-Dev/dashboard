import type {
  ApiResponse,
  ApiErrorResponse,
  PaginatedResponse,
} from "@/types/api";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").trim().replace(/\/$/, "");
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true" || API_URL.length === 0;

export class ApiError extends Error {
  code: string;
  status: number;
  details?: { field: string; message: string }[];

  constructor(status: number, body: ApiErrorResponse) {
    super(body.error.message);
    this.name = "ApiError";
    this.code = body.error.code;
    this.status = status;
    this.details = body.error.details;
  }
}

let getAuthToken: (() => Promise<string | null>) | null = null;

export function setAuthTokenProvider(fn: () => Promise<string | null>) {
  getAuthToken = fn;
}

async function buildHeaders(): Promise<HeadersInit> {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (getAuthToken) {
    const token = await getAuthToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

function qs(params?: object): string {
  if (!params) return "";
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null,
  );
  if (entries.length === 0) return "";
  const sp = new URLSearchParams();
  for (const [k, v] of entries) {
    if (Array.isArray(v)) {
      for (const item of v) sp.append(k, String(item));
    } else {
      sp.set(k, String(v));
    }
  }
  return `?${sp.toString()}`;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  if (!API_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not configured. Set NEXT_PUBLIC_USE_MOCK=true or provide an API URL.",
    );
  }

  const headers = await buildHeaders();
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json();

  if (!res.ok || json.success === false) {
    throw new ApiError(res.status, json as ApiErrorResponse);
  }

  return (json as ApiResponse<T>).data;
}

async function requestPaginated<T>(
  path: string,
  params?: object,
): Promise<{ items: T[]; total: number }> {
  if (!API_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not configured. Set NEXT_PUBLIC_USE_MOCK=true or provide an API URL.",
    );
  }

  const headers = await buildHeaders();
  const res = await fetch(`${API_URL}${path}${qs(params)}`, {
    method: "GET",
    headers,
  });

  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new ApiError(res.status, json as ApiErrorResponse);
  }

  const paginated = json as PaginatedResponse<T>;
  return {
    items: paginated.data,
    total: paginated.pagination.total,
  };
}

export const apiClient = {
  get<T>(path: string, params?: object): Promise<T> {
    return request<T>("GET", `${path}${qs(params)}`);
  },

  getPaginated<T>(
    path: string,
    params?: object,
  ): Promise<{ items: T[]; total: number }> {
    return requestPaginated<T>(path, params);
  },

  post<T>(path: string, body?: unknown): Promise<T> {
    return request<T>("POST", path, body);
  },

  put<T>(path: string, body?: unknown): Promise<T> {
    return request<T>("PUT", path, body);
  },

  delete<T>(path: string): Promise<T> {
    return request<T>("DELETE", path);
  },
};

export { USE_MOCK };
