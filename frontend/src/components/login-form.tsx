import { useForm } from "@tanstack/react-form";
import type { z } from "zod";
import { Loader2Icon } from "lucide-react";
import { loginSchema, type LoginInput } from "@/schemas/auth";
import { PASSWORD_MAX_LENGTH } from "@/types/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { FormField } from "@/components/ui/form-field";

interface LoginFormProps {
  onSubmit: (data: LoginInput) => Promise<boolean>;
}

type LoginFormValues = z.input<typeof loginSchema>;

export function LoginForm({ onSubmit }: LoginFormProps) {
  const defaultValues: LoginFormValues = {
    email: "",
    password: "",
  };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(loginSchema.parse(value));
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col gap-4"
    >
      {/* Email */}
      <form.Field name="email">
        {(field) => (
          <FormField
            htmlFor="email"
            label="Email"
            error={field.state.meta.errors[0]?.message}
          >
            <Input
              id="email"
              // Not `type="email"` to avoid the browser's own validation UI
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              autoFocus
            />
          </FormField>
        )}
      </form.Field>

      {/* Password */}
      <form.Field name="password">
        {(field) => (
          <FormField
            htmlFor="password"
            label="Password"
            error={field.state.meta.errors[0]?.message}
          >
            <PasswordInput
              id="password"
              autoComplete="current-password"
              maxLength={PASSWORD_MAX_LENGTH}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </FormField>
        )}
      </form.Field>

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2Icon className="animate-spin" />}
            Log in
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
