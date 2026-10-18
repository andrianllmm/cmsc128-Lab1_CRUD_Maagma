import { apiFetch } from "@/lib/api";
import type {
  UpdateProfileInput,
  UpdateEmailInput,
  UpdatePasswordInput,
} from "@/schemas/users";
import type { User } from "@/types/users";

export const updateProfile = (data: UpdateProfileInput): Promise<User> => {
  return apiFetch<User>("users/me", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

export const updateEmail = (data: UpdateEmailInput): Promise<User> => {
  return apiFetch<User>("users/me/email", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

export const updatePassword = ({
  currentPassword,
  newPassword,
}: UpdatePasswordInput): Promise<void> => {
  // The confirmation is only checked client-side
  return apiFetch<void>("users/me/password", {
    method: "PATCH",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
};
