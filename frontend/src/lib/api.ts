import { API_URL } from "@/config";

const OFFLINE_MESSAGE =
  "Can't reach the server. Check your connection and try again.";
const SERVER_ERROR_MESSAGE = "Something went wrong on our end. Try again.";

/**
 * Error thrown for non-2xx API responses, or with status 0 when the server can't be reached.
 * */
export class ApiError extends Error {
  status: number;
  // Per-field messages from the API's validation, e.g. `{ currentPassword: ["..."] }`
  fieldErrors: Record<string, string[]>;

  constructor(
    status: number,
    message: string,
    fieldErrors: Record<string, string[]> = {},
  ) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
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

  let res: Response;
  try {
    res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      // Send the session cookie to the API
      credentials: "include",
      ...options,
    });
  } catch {
    // The browser's own message (e.g. "Failed to fetch") doesn't tell users what to do
    throw new ApiError(0, OFFLINE_MESSAGE);
  }

  if (!res.ok) {
    // Server errors don't carry a message users can act on
    if (res.status >= 500) throw new ApiError(res.status, SERVER_ERROR_MESSAGE);

    const body = await res.json().catch(() => null);
    const message =
      typeof body?.message === "string" ? body.message : res.statusText;
    const fieldErrors =
      body?.errors && typeof body.errors === "object" ? body.errors : {};
    throw new ApiError(res.status, message, fieldErrors);
  }

  // No body to parse
  if (res.status === 204) return undefined as T;

  return res.json();
}
