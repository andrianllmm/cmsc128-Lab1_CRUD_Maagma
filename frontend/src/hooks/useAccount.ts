import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  UpdateProfileInput,
  UpdateEmailInput,
  UpdatePasswordInput,
} from "@/schemas/users";
import type { User } from "@/types/users";
import { meQueryOptions } from "@/hooks/useAuth";
import * as usersApi from "@/api/users";

/**
 * Updates the logged-in user's account.
 * Each action returns `false` on failure (e.g. wrong current password).
 * */
export function useAccount() {
  const queryClient = useQueryClient();

  // Updates everywhere the user is shown, without refetching
  const setUser = (user: User) =>
    queryClient.setQueryData(meQueryOptions.queryKey, user);

  const profileMutation = useMutation({
    mutationFn: usersApi.updateProfile,
    onSuccess: (user) => {
      setUser(user);
      toast.success("Display name updated");
    },
    onError: (err) =>
      toast.error(err.message || "Failed to update display name"),
  });

  const emailMutation = useMutation({
    mutationFn: usersApi.updateEmail,
    onSuccess: (user) => {
      setUser(user);
      toast.success("Email updated");
    },
    onError: (err) => toast.error(err.message || "Failed to update email"),
  });

  const passwordMutation = useMutation({
    mutationFn: usersApi.updatePassword,
    onSuccess: () => toast.success("Password changed"),
    onError: (err) => toast.error(err.message || "Failed to change password"),
  });

  async function updateProfile(data: UpdateProfileInput): Promise<boolean> {
    try {
      await profileMutation.mutateAsync(data);
      return true;
    } catch {
      return false;
    }
  }

  async function updateEmail(data: UpdateEmailInput): Promise<boolean> {
    try {
      await emailMutation.mutateAsync(data);
      return true;
    } catch {
      return false;
    }
  }

  async function updatePassword(data: UpdatePasswordInput): Promise<boolean> {
    try {
      await passwordMutation.mutateAsync(data);
      return true;
    } catch {
      return false;
    }
  }

  return {
    updateProfile,
    updateEmail,
    updatePassword,
  };
}
