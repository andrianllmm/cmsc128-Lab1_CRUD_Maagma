import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import type { z } from "zod";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { createListSchema, type CreateListInput } from "@/schemas/lists";
import { LIST_NAME_MAX_LENGTH } from "@/types/lists";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface NewListDialogProps {
  onSubmit: (data: CreateListInput) => Promise<boolean>;
}

type NewListFormValues = z.input<typeof createListSchema>;

export function NewListDialog({ onSubmit }: NewListDialogProps) {
  const [open, setOpen] = useState(false);
  const defaultValues: NewListFormValues = { name: "" };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: createListSchema,
    },
    onSubmit: async ({ value }) => {
      const data = createListSchema.parse(value);
      if (await onSubmit(data)) {
        form.reset();
        setOpen(false);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="New list"
            title="New list"
          />
        }
      >
        <PlusIcon />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>New list</DialogTitle>
          <DialogDescription>
            A collaborative list you can share with other users.
          </DialogDescription>
        </DialogHeader>

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
              <Button
                type="submit"
                className="self-end"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2Icon className="animate-spin" />}
                Create list
              </Button>
            )}
          </form.Subscribe>
        </form>
      </DialogContent>
    </Dialog>
  );
}
