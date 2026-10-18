import { apiFetch, ApiError } from "@/lib/api";
import type {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "@/schemas/auth";
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

export const logout = (): Promise<void> => {
  return apiFetch<void>("auth/logout", { method: "POST" });
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

export const forgotPassword = (data: ForgotPasswordInput): Promise<void> => {
  return apiFetch<void>("auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const resetPassword = (
  token: string,
  { newPassword }: ResetPasswordInput,
): Promise<void> => {
  return apiFetch<void>("auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, newPassword }),
  });
};
