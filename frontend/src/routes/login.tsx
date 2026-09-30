import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import type { LoginInput } from "@/schemas/auth";
import { LoginForm } from "@/components/login-form";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(data: LoginInput) {
    const ok = await login(data);
    if (ok) navigate({ to: "/" });
    return ok;
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <h2 className="text-lg font-semibold">Welcome back!</h2>
        <LoginForm onSubmit={handleLogin} />
      </div>
    </div>
  );
}
