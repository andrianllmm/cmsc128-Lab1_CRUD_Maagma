import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { Loader2Icon, LogOutIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { requireAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/profile")({
  beforeLoad: requireAuth,
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = Route.useRouteContext();
  const { logout, loggingOut } = useAuth();

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

      <Button
        variant="outline"
        className="self-start"
        onClick={logout}
        disabled={loggingOut}
      >
        {loggingOut ? <Loader2Icon className="animate-spin" /> : <LogOutIcon />}
        Log out
      </Button>
    </div>
  );
}
