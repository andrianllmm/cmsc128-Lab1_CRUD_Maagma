import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import type {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "@/schemas/auth";
import type { User } from "@/types/users";
import * as authApi from "@/api/auth";

// Logged-in user, or `null` if logged out
export const meQueryOptions = queryOptions({
  queryKey: ["me"],
  queryFn: authApi.getMe,
});

export function useAuth() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: user, isPending } = useQuery(meQueryOptions);

  // Switches the cached user, or `null` when logged out
  const setUser = (user: User | null) => {
    // Route guards read this cached value
    queryClient.setQueryData(meQueryOptions.queryKey, user);
    // Drop the previous user's cached data (e.g. tasks)
    queryClient.removeQueries({
      predicate: (query) => query.queryKey[0] !== meQueryOptions.queryKey[0],
    });
  };

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: setUser,
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: setUser,
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => setUser(null),
    onError: (err) => toast.error(err.message || "Failed to log out"),
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: authApi.forgotPassword,
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({
      token,
      data,
    }: {
      token: string;
      data: ResetPasswordInput;
    }) => authApi.resetPassword(token, data),
    onSuccess: () =>
      toast.success("Password reset. Log in with your new password."),
  });

  /**
   * Creates an account and logs in.
   * Throws the API error on failure, for the form to show.
   * */
  async function register(data: RegisterInput): Promise<void> {
    await registerMutation.mutateAsync(data);
  }

  /**
   * Logs in a user.
   * Throws the API error on failure, for the form to show.
   * */
  async function login(data: LoginInput): Promise<void> {
    await loginMutation.mutateAsync(data);
  }

  /**
   * Logs out the current user and goes to the login page.
   * Returns `false` on failure.
   * */
  async function logout(): Promise<boolean> {
    try {
      await logoutMutation.mutateAsync();
      // Replace so going back doesn't return to a logged-in-only page
      navigate({ to: "/login", replace: true });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Requests a password reset link for an email.
   * Throws the API error on failure, for the form to show.
   * */
  async function forgotPassword(data: ForgotPasswordInput): Promise<void> {
    await forgotPasswordMutation.mutateAsync(data);
  }

  /**
   * Sets a new password using a reset token.
   * Throws the API error on failure, for the form to show.
   * */
  async function resetPassword(
    token: string,
    data: ResetPasswordInput,
  ): Promise<void> {
    await resetPasswordMutation.mutateAsync({ token, data });
  }

  return {
    user: user ?? null,
    loading: isPending,
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    loggingOut: logoutMutation.isPending,
  };
}
