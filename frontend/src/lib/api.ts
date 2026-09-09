import { API_URL } from "@/config";

/**
 * Error thrown for non-2xx API responses.
 * */
export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/**
 * Thin fetch wrapper.
 * Resolves `path` against the API base URL, sends/parses JSON, and throws `ApiError` on non-2xx responses.
 * */
export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const url = new URL(path, API_URL);

  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(res.status, body?.message ?? res.statusText);
  }

  return res.json();
}
