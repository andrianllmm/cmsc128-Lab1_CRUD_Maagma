import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import type { RegisterInput, LoginInput } from "@/schemas/auth";
import type { User } from "@/types/users";
import * as authApi from "@/api/auth";

// Logged-in user, or `null` if logged out
export const meQueryOptions = queryOptions({
  queryKey: ["me"],
  queryFn: authApi.getMe,
});

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isPending } = useQuery(meQueryOptions);

  const setUser = (user: User) =>
    queryClient.setQueryData(meQueryOptions.queryKey, user);

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: setUser,
    onError: (err) => toast.error(err.message || "Failed to create account"),
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: setUser,
    onError: (err) => toast.error(err.message || "Failed to log in"),
  });

  /**
   * Creates an account and logs in.
   * Returns `false` on failure (e.g. email already in use).
   * */
  async function register(data: RegisterInput): Promise<boolean> {
    try {
      await registerMutation.mutateAsync(data);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Logs in a user.
   * Returns `false` on failure (e.g. invalid credentials).
   * */
  async function login(data: LoginInput): Promise<boolean> {
    try {
      await loginMutation.mutateAsync(data);
      return true;
    } catch {
      return false;
    }
  }

  return {
    user: user ?? null,
    loading: isPending,
    register,
    login,
  };
}
