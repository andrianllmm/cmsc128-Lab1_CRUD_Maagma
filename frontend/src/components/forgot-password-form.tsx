import { useForm } from "@tanstack/react-form";
import type { z } from "zod";
import { Loader2Icon } from "lucide-react";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/schemas/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";

interface ForgotPasswordFormProps {
  onSubmit: (data: ForgotPasswordInput) => Promise<boolean>;
}

type ForgotPasswordFormValues = z.input<typeof forgotPasswordSchema>;

export function ForgotPasswordForm({ onSubmit }: ForgotPasswordFormProps) {
  const defaultValues: ForgotPasswordFormValues = {
    email: "",
  };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: forgotPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(forgotPasswordSchema.parse(value));
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
