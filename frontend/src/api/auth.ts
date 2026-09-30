import { apiFetch } from "@/lib/api";
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
