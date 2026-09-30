import { useForm } from "@tanstack/react-form";
import type { z } from "zod";
import { Loader2Icon } from "lucide-react";
import { updateEmailSchema, type UpdateEmailInput } from "@/schemas/users";
import { PASSWORD_MAX_LENGTH } from "@/types/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { FormField } from "@/components/ui/form-field";
import { UnsavedChangesGuard } from "@/components/unsaved-changes-guard";

interface EmailFormProps {
  email: string;
  onSubmit: (data: UpdateEmailInput) => Promise<boolean>;
}

type EmailFormValues = z.input<typeof updateEmailSchema>;

export function EmailForm({ email, onSubmit }: EmailFormProps) {
  const defaultValues: EmailFormValues = { email, currentPassword: "" };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: updateEmailSchema,
    },
    onSubmit: async ({ value }) => {
      const data = updateEmailSchema.parse(value);
      if (await onSubmit(data)) {
        form.reset({
          // Keep the new email as the baseline
          email: data.email,
          // Don't keep the password around
          currentPassword: "",
        });
      }
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
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </FormField>
        )}
      </form.Field>

      <form.Field name="currentPassword">
        {(field) => (
          <FormField
            htmlFor="email-current-password"
            label="Current password"
            error={field.state.meta.errors[0]?.message}
          >
            <PasswordInput
              id="email-current-password"
              autoComplete="current-password"
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
              Save email
            </Button>
            <UnsavedChangesGuard when={hasChanges} />
          </>
        )}
      </form.Subscribe>
    </form>
  );
}
