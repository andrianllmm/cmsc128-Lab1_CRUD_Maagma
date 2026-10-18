import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { useAuth } from "@/hooks/useAuth";
import { requireGuest } from "@/lib/auth";
import type { ForgotPasswordInput } from "@/schemas/auth";
import { RESET_LINK_TTL_MINUTES } from "@/types/users";

export const Route = createFileRoute("/forgot-password")({
  beforeLoad: requireGuest,
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  // Email the link was sent to; shows the confirmation instead of the form
  const [sentTo, setSentTo] = useState<string | null>(null);

  async function handleForgotPassword(data: ForgotPasswordInput) {
    const ok = await forgotPassword(data);
    if (ok) setSentTo(data.email);
    return ok;
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6">
      <div className="flex w-full max-w-sm flex-col gap-6">
        {sentTo ? (
          <>
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold">Check your email</h2>
              {/* Same wording whether or not the account exists */}
              <p className="text-sm text-muted-foreground">
                If an account uses{" "}
                <span className="font-medium text-foreground">{sentTo}</span>,
                we sent a link to reset your password. It expires in{" "}
                {RESET_LINK_TTL_MINUTES} minutes.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSentTo(null)}
              className="self-start text-sm font-medium underline-offset-4 hover:underline"
            >
              Use a different email or resend
            </button>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold">Forgot your password?</h2>
              <p className="text-sm text-muted-foreground">
                Enter your account&apos;s email and we&apos;ll send you a link
                to reset it.
              </p>
            </div>
            <ForgotPasswordForm onSubmit={handleForgotPassword} />
          </>
        )}
        <p className="text-center text-sm text-muted-foreground">
          Remembered it?{" "}
          <Link
            to="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
