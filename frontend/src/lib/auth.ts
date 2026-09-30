import { redirect } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { meQueryOptions } from "@/hooks/useAuth";

interface GuardArgs {
  context: { queryClient: QueryClient };
}

// Uses the cached user if there is one
function getUser(queryClient: QueryClient) {
  return queryClient.query({ ...meQueryOptions, staleTime: "static" });
}

/**
 * `beforeLoad` guard for logged-in-only routes.
 * Redirects to login if logged out; otherwise adds `user` to the route context.
 * */
export async function requireAuth({ context }: GuardArgs) {
  const user = await getUser(context.queryClient);
  if (!user) throw redirect({ to: "/login" });
  return { user };
}

/**
 * `beforeLoad` guard for logged-out-only routes (e.g. login).
 * Redirects to the profile page if logged in.
 * */
export async function requireGuest({ context }: GuardArgs) {
  const user = await getUser(context.queryClient);
  if (user) throw redirect({ to: "/profile" });
}
