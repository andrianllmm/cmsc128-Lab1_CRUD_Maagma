import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RegisterForm } from "@/components/register-form";
import { useAuth } from "@/hooks/useAuth";
import type { RegisterInput } from "@/schemas/auth";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleRegister(data: RegisterInput) {
    const ok = await register(data);
    if (ok) navigate({ to: "/" });
    return ok;
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <h2 className="text-lg font-semibold">Create an account</h2>
        <RegisterForm onSubmit={handleRegister} />
      </div>
    </div>
  );
}
