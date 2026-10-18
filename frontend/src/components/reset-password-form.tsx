import { useForm } from "@tanstack/react-form";
import type { z } from "zod";
import { Loader2Icon } from "lucide-react";
import { resetPasswordSchema, type ResetPasswordInput } from "@/schemas/auth";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "@/types/users";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { FormField } from "@/components/ui/form-field";

interface ResetPasswordFormProps {
  onSubmit: (data: ResetPasswordInput) => Promise<boolean>;
}

type ResetPasswordFormValues = z.input<typeof resetPasswordSchema>;

export function ResetPasswordForm({ onSubmit }: ResetPasswordFormProps) {
  const defaultValues: ResetPasswordFormValues = {
    newPassword: "",
    confirmPassword: "",
  };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: resetPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(resetPasswordSchema.parse(value));
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
      <form.Field name="newPassword">
        {(field) => (
          <FormField
            htmlFor="new-password"
            label="New password"
            error={field.state.meta.errors[0]?.message}
          >
            <PasswordInput
              id="new-password"
              autoComplete="new-password"
              maxLength={PASSWORD_MAX_LENGTH}
              aria-describedby="new-password-hint"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              autoFocus
            />
            <p id="new-password-hint" className="text-sm text-muted-foreground">
              At least {PASSWORD_MIN_LENGTH} characters.
            </p>
          </FormField>
        )}
      </form.Field>

      <form.Field name="confirmPassword">
        {(field) => (
          <FormField
            htmlFor="confirm-password"
            label="Confirm new password"
            error={field.state.meta.errors[0]?.message}
          >
            <PasswordInput
              id="confirm-password"
              autoComplete="new-password"
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
            Reset password
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
