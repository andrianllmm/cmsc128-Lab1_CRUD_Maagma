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
 * Each action throws the API error on failure (e.g. wrong current password), for the form to show.
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
  });

  const emailMutation = useMutation({
    mutationFn: usersApi.updateEmail,
    onSuccess: (user) => {
      setUser(user);
      toast.success("Email updated");
    },
  });

  const passwordMutation = useMutation({
    mutationFn: usersApi.updatePassword,
    onSuccess: () => toast.success("Password changed"),
  });

  async function updateProfile(data: UpdateProfileInput): Promise<void> {
    await profileMutation.mutateAsync(data);
  }

  async function updateEmail(data: UpdateEmailInput): Promise<void> {
    await emailMutation.mutateAsync(data);
  }

  async function updatePassword(data: UpdatePasswordInput): Promise<void> {
    await passwordMutation.mutateAsync(data);
  }

  return {
    updateProfile,
    updateEmail,
    updatePassword,
  };
}
