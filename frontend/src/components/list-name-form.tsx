import { useForm } from "@tanstack/react-form";
import type { z } from "zod";
import { Loader2Icon } from "lucide-react";
import { createListSchema, type CreateListInput } from "@/schemas/lists";
import { LIST_NAME_MAX_LENGTH } from "@/types/lists";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";

interface ListNameFormProps {
  name?: string;
  submitLabel: string;
  onSubmit: (data: CreateListInput) => Promise<boolean>;
}

type ListNameFormValues = z.input<typeof createListSchema>;

/**
 * Name field for creating or renaming a list.
 * */
export function ListNameForm({
  name = "",
  submitLabel,
  onSubmit,
}: ListNameFormProps) {
  const defaultValues: ListNameFormValues = { name };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: createListSchema,
    },
    onSubmit: async ({ value }) => {
      const data = createListSchema.parse(value);
      if (await onSubmit(data)) form.reset();
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
      <form.Field name="name">
        {(field) => (
          <FormField
            htmlFor="listName"
            label="Name"
            error={field.state.meta.errors[0]?.message}
          >
            <Input
              id="listName"
              placeholder="e.g. Group project"
              maxLength={LIST_NAME_MAX_LENGTH}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </FormField>
        )}
      </form.Field>

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <Button type="submit" className="self-end" disabled={isSubmitting}>
            {isSubmitting && <Loader2Icon className="animate-spin" />}
            {submitLabel}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
