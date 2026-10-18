import { useForm } from "@tanstack/react-form";
import type { z } from "zod";
import { Loader2Icon } from "lucide-react";
import { updateProfileSchema, type UpdateProfileInput } from "@/schemas/users";
import { DISPLAY_NAME_MAX_LENGTH } from "@/types/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { UnsavedChangesGuard } from "@/components/unsaved-changes-guard";

interface DisplayNameFormProps {
  displayName: string;
  onSubmit: (data: UpdateProfileInput) => Promise<boolean>;
}

type DisplayNameFormValues = z.input<typeof updateProfileSchema>;

export function DisplayNameForm({
  displayName,
  onSubmit,
}: DisplayNameFormProps) {
  const defaultValues: DisplayNameFormValues = { displayName };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: updateProfileSchema,
    },
    onSubmit: async ({ value }) => {
      const data = updateProfileSchema.parse(value);
      // New baseline for unsaved changes
      if (await onSubmit(data)) form.reset(data);
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
      <form.Field name="displayName">
        {(field) => (
          <FormField
            htmlFor="displayName"
            label="Display name"
            error={field.state.meta.errors[0]?.message}
          >
            <Input
              id="displayName"
              autoComplete="name"
              maxLength={DISPLAY_NAME_MAX_LENGTH}
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
              Save display name
            </Button>
            <UnsavedChangesGuard when={hasChanges} />
          </>
        )}
      </form.Subscribe>
    </form>
  );
}
