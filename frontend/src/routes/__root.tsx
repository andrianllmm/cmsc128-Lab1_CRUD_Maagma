import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/sonner";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <Outlet />
      <Toaster />
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  );
}
