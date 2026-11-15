import { Link, useRouterState } from "@tanstack/react-router";
import { ListTodoIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserMenu } from "@/components/user-menu";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="mx-auto flex h-12 max-w-xl items-center justify-between gap-2 px-4 sm:px-6">
        {/* App title */}
        <h1>
          <Button
            variant="ghost"
            className="-ml-2.5 text-base font-semibold"
            render={<Link to="/" />}
            nativeButton={false}
          >
            <ListTodoIcon />
            TODO
          </Button>
        </h1>

        <HeaderActions />
      </div>
    </header>
  );
}

function HeaderActions() {
  const { user, loading } = useAuth();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  // Placeholder the size of the avatar while the user loads
  if (loading) return <Skeleton className="size-8 rounded-full" />;

  if (user) return <UserMenu user={user} />;

  // On the login page, offer the other way in instead of a link to the same page
  const onLogin = pathname === "/login";

  return (
    <Button
      variant="outline"
      size="sm"
      render={<Link to={onLogin ? "/register" : "/login"} />}
      nativeButton={false}
    >
      {onLogin ? "Create account" : "Log in"}
    </Button>
  );
}
