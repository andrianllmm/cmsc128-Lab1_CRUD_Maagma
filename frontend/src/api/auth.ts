import { apiFetch } from "@/lib/api";
import type { RegisterInput } from "@/schemas/auth";
import type { User } from "@/types/users";

export const register = (data: RegisterInput): Promise<User> => {
  return apiFetch<User>("auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
};
