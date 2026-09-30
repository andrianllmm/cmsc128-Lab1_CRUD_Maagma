import { createFileRoute, redirect } from "@tanstack/react-router";
import { format } from "date-fns";
import { meQueryOptions } from "@/hooks/useAuth";

export const Route = createFileRoute("/profile")({
  // Logged-in users only
  beforeLoad: async ({ context }) => {
    // Uses the cached user if there is one
    const user = await context.queryClient.query({
      ...meQueryOptions,
      staleTime: "static",
    });
    if (!user) throw redirect({ to: "/login" });
    return { user };
  },
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = Route.useRouteContext();

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 py-8 sm:px-6">
      <h2 className="text-lg font-semibold">Profile</h2>

      <dl className="flex flex-col gap-4 text-sm">
        <div className="flex flex-col gap-1">
          <dt className="text-muted-foreground">Display name</dt>
          <dd className="font-medium">{user.displayName}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-muted-foreground">Email</dt>
          <dd className="font-medium">{user.email}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-muted-foreground">Member since</dt>
          <dd className="font-medium">
            {format(new Date(user.createdAt), "PPP")}
          </dd>
        </div>
      </dl>
    </div>
  );
}
