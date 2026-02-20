/**
 * Dashboard API client. Base URL from env.
 * Use with TanStack Query or direct fetch.
 */
const getBaseUrl = () => {
  if (typeof window !== "undefined") return "";
  return process.env.NEXT_PUBLIC_API_BASE ?? "";
};

export async function api<T = unknown>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const base = getBaseUrl();
  const url = path.startsWith("http") ? path : `${base}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const err = new Error(res.statusText || "API request failed");
    (err as Error & { status: number }).status = res.status;
    throw err;
  }
  return res.json() as Promise<T>;
}

export const apiClient = { get: <T>(path: string) => api<T>(path), post: <T>(path: string, body: unknown) => api<T>(path, { method: "POST", body: JSON.stringify(body) }) };
