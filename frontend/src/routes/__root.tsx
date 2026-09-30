import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/sonner";

// Available to every route's `beforeLoad`/`loader` (e.g. auth guards)
interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SiteHeader />
      {/* Fills the space below the header */}
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
      <Toaster />
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  );
}
