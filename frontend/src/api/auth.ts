import { apiFetch, ApiError } from "@/lib/api";
import type { RegisterInput, LoginInput } from "@/schemas/auth";
import type { User } from "@/types/users";

export const register = (data: RegisterInput): Promise<User> => {
  return apiFetch<User>("auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const login = (data: LoginInput): Promise<User> => {
  return apiFetch<User>("auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

/**
 * Gets the logged-in user.
 * Resolves to `null` when not logged in.
 * */
export const getMe = async (): Promise<User | null> => {
  try {
    return await apiFetch<User>("auth/me");
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return null;
    throw err;
  }
};
