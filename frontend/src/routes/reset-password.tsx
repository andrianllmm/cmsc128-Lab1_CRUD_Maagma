import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { ResetPasswordForm } from "@/components/reset-password-form";
import { useAuth } from "@/hooks/useAuth";
import { requireGuest } from "@/lib/auth";
import type { ResetPasswordInput } from "@/schemas/auth";

// The token comes from the emailed link, e.g. `/reset-password?token=...`
const searchSchema = z.object({
  token: z.string().optional().catch(undefined),
});

export const Route = createFileRoute("/reset-password")({
  validateSearch: searchSchema,
  beforeLoad: requireGuest,
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { token } = Route.useSearch();
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  async function handleResetPassword(data: ResetPasswordInput) {
    const ok = await resetPassword(token!, data);
    // Replace so going back doesn't return to a used reset link
    if (ok) navigate({ to: "/login", replace: true });
    return ok;
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6">
      <div className="flex w-full max-w-sm flex-col gap-6">
        {token ? (
          <>
            <h2 className="text-lg font-semibold">Set a new password</h2>
            <ResetPasswordForm onSubmit={handleResetPassword} />
          </>
        ) : (
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold">Invalid reset link</h2>
            <p className="text-sm text-muted-foreground">
              This link is missing its reset token. Open the link from your
              email again, or request a new one.
            </p>
          </div>
        )}
        <p className="text-center text-sm text-muted-foreground">
          Link expired?{" "}
          <Link
            to="/forgot-password"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Request a new one
          </Link>
        </p>
      </div>
    </div>
  );
}
