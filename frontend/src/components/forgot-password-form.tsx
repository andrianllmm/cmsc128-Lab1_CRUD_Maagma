import { useForm } from "@tanstack/react-form";
import type { z } from "zod";
import { Loader2Icon } from "lucide-react";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/schemas/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { FormError } from "@/components/ui/form-error";
import { useServerError } from "@/hooks/useServerError";

interface ForgotPasswordFormProps {
  onSubmit: (data: ForgotPasswordInput) => Promise<void>;
}

type ForgotPasswordFormValues = z.input<typeof forgotPasswordSchema>;

export function ForgotPasswordForm({ onSubmit }: ForgotPasswordFormProps) {
  const defaultValues: ForgotPasswordFormValues = {
    email: "",
  };

  const server = useServerError(["email"]);

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: forgotPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      await server.run(() => onSubmit(forgotPasswordSchema.parse(value)));
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
      {/* Errors from the API that aren't about one field, e.g. invalid credentials */}
      <FormError message={server.formError} />

      {/* Email */}
      <form.Field name="email">
        {(field) => (
          <FormField
            htmlFor="email"
            label="Email"
            error={
              field.state.meta.errors[0]?.message ??
              server.fieldError(field.name)
            }
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

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2Icon className="animate-spin" />}
            Send reset link
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
