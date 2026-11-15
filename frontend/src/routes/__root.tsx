import {
  HeadContent,
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
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
      {/* Applies each route's `head`, e.g. the page title */}
      <HeadContent />
      {/* Lets keyboard users jump past the header; only visible when focused */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:ring-3 focus:ring-ring/50"
      >
        Skip to content
      </a>
      <SiteHeader />
      {/* Fills the space below the header */}
      <main
        id="main"
        tabIndex={-1}
        className="flex flex-1 flex-col outline-none"
      >
        <Outlet />
      </main>
      <Toaster />
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  );
}
