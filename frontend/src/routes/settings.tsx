import { createFileRoute } from "@tanstack/react-router";
import { requireAuth } from "@/lib/auth";

export const Route = createFileRoute("/settings")({
  beforeLoad: requireAuth,
  component: SettingsPage,
});

// Placeholder until account editing is implemented
function SettingsPage() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 py-8 sm:px-6">
      <h2 className="text-lg font-semibold">Settings</h2>
      <p className="text-sm text-muted-foreground">
        Account settings are coming soon.
      </p>
    </div>
  );
}
