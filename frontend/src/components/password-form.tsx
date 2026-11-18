import { useForm } from "@tanstack/react-form";
import type { z } from "zod";
import { Loader2Icon } from "lucide-react";
import {
  updatePasswordSchema,
  type UpdatePasswordInput,
} from "@/schemas/users";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "@/types/users";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { FormField } from "@/components/ui/form-field";
import { FormError } from "@/components/ui/form-error";
import { useServerError } from "@/hooks/useServerError";
import { UnsavedChangesGuard } from "@/components/unsaved-changes-guard";

interface PasswordFormProps {
  onSubmit: (data: UpdatePasswordInput) => Promise<void>;
}

type PasswordFormValues = z.input<typeof updatePasswordSchema>;

export function PasswordForm({ onSubmit }: PasswordFormProps) {
  const defaultValues: PasswordFormValues = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const server = useServerError([
    "currentPassword",
    "newPassword",
    "confirmPassword",
  ]);

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: updatePasswordSchema,
    },
    onSubmit: async ({ value }) => {
      // Don't leave passwords on screen
      if (await server.run(() => onSubmit(updatePasswordSchema.parse(value))))
        form.reset();
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

      <form.Field name="currentPassword">
        {(field) => (
          <FormField
            htmlFor="current-password"
            label="Current password"
            error={
              field.state.meta.errors[0]?.message ??
              server.fieldError(field.name)
            }
          >
            <PasswordInput
              id="current-password"
              autoComplete="current-password"
              maxLength={PASSWORD_MAX_LENGTH}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </FormField>
        )}
      </form.Field>

      <form.Field name="newPassword">
        {(field) => (
          <FormField
            htmlFor="new-password"
            label="New password"
            error={
              field.state.meta.errors[0]?.message ??
              server.fieldError(field.name)
            }
          >
            <PasswordInput
              id="new-password"
              autoComplete="new-password"
              maxLength={PASSWORD_MAX_LENGTH}
              aria-describedby="new-password-hint"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
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
            error={
              field.state.meta.errors[0]?.message ??
              server.fieldError(field.name)
            }
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

      <form.Subscribe
        selector={(state) => [state.isSubmitting, !state.isDefaultValue]}
      >
        {([isSubmitting, hasChanges]) => (
          <>
            <Button
              type="submit"
              className="self-start"
              disabled={isSubmitting || !hasChanges}
            >
              {isSubmitting && <Loader2Icon className="animate-spin" />}
              Change password
            </Button>
            <UnsavedChangesGuard when={hasChanges} />
          </>
        )}
      </form.Subscribe>
    </form>
  );
}
