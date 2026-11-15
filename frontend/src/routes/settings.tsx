import type { ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useAccount } from "@/hooks/useAccount";
import { useAuth } from "@/hooks/useAuth";
import { requireAuth } from "@/lib/auth";
import { Separator } from "@/components/ui/separator";
import { DisplayNameForm } from "@/components/display-name-form";
import { EmailForm } from "@/components/email-form";
import { PasswordForm } from "@/components/password-form";

export const Route = createFileRoute("/settings")({
  beforeLoad: requireAuth,
  component: SettingsPage,
});

function SettingsPage() {
  const { user: routeUser } = Route.useRouteContext();
  const { user: cachedUser } = useAuth();
  // Route context is a snapshot; the cache reflects saved changes
  const user = cachedUser ?? routeUser;
  const { updateProfile, updateEmail, updatePassword } = useAccount();

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-8 px-4 py-8 sm:px-6">
      <h2 className="text-lg font-semibold">Settings</h2>

      <SettingsSection id="profile" title="Profile">
        <DisplayNameForm
          displayName={user.displayName}
          onSubmit={updateProfile}
        />
      </SettingsSection>

      <Separator />

      <SettingsSection id="email" title="Email">
        <EmailForm email={user.email} onSubmit={updateEmail} />
      </SettingsSection>

      <Separator />

      <SettingsSection id="password" title="Password">
        <PasswordForm onSubmit={updatePassword} />
      </SettingsSection>
    </div>
  );
}

interface SettingsSectionProps {
  id: string;
  title: string;
  children: ReactNode;
}

function SettingsSection({ id, title, children }: SettingsSectionProps) {
  return (
    <section aria-labelledby={`${id}-heading`} className="flex flex-col gap-4">
      <h3 id={`${id}-heading`} className="font-medium">
        {title}
      </h3>
      {children}
    </section>
  );
}
