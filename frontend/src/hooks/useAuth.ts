import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { RegisterInput } from "@/schemas/auth";
import * as authApi from "@/api/auth";

export function useAuth() {
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onError: (err) => toast.error(err.message || "Failed to create account"),
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

  return {
    register,
  };
}
