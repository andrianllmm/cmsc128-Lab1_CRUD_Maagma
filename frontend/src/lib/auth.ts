import { redirect } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { meQueryOptions } from "@/hooks/useAuth";

/**
 * `beforeLoad` guard for logged-in-only routes.
 * Redirects to login if logged out; otherwise adds `user` to the route context.
 * */
export async function requireAuth({
  context,
}: {
  context: { queryClient: QueryClient };
}) {
  // Uses the cached user if there is one
  const user = await context.queryClient.query({
    ...meQueryOptions,
    staleTime: "static",
  });
  if (!user) throw redirect({ to: "/login" });
  return { user };
}
