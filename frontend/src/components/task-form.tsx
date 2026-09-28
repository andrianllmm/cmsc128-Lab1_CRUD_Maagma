import { useForm } from "@tanstack/react-form";
import type { z } from "zod";
import { Loader2Icon } from "lucide-react";
import { createTaskSchema, type CreateTaskInput } from "@/schemas/tasks";
import type { Task } from "@/types/tasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { FormField } from "@/components/ui/form-field";
import { PrioritySelect } from "@/components/priority-select";
import { TagSelect } from "@/components/tag-select";

interface TaskFormProps {
  task?: Task;
  submitLabel?: string;
  onSubmit: (data: CreateTaskInput) => Promise<boolean>;
}

type TaskFormValues = z.input<typeof createTaskSchema>;

export function TaskForm({
  task,
  submitLabel = "Create",
  onSubmit,
}: TaskFormProps) {
  const defaultValues: TaskFormValues = {
    title: task?.title ?? "",
    dueDate: task?.dueDate ? new Date(task.dueDate) : null,
    priority: task?.priority ?? "None",
    tag: task?.tag ?? "Others",
  };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: createTaskSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      // Validators don't transform values, so parse to get the schema output
      const ok = await onSubmit(createTaskSchema.parse(value));

      // Clear the create form after a successful submit
      if (ok && !task) formApi.reset();
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
      {/* Title */}
      <form.Field name="title">
        {(field) => (
          <FormField
            htmlFor="title"
            label="Title"
            error={field.state.meta.errors[0]?.message}
          >
            <Input
              id="title"
              placeholder="What do you want to do?"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              autoFocus={!task}
            />
          </FormField>
        )}
      </form.Field>

      <div className="flex gap-2">
        {/* Due date */}
        <form.Field name="dueDate">
          {(field) => (
            <FormField
              htmlFor="dueDate"
              label="Due date"
              error={field.state.meta.errors[0]?.message}
              className="flex-1"
            >
              <DateTimePicker
                id="dueDate"
                selected={field.state.value ?? undefined}
                onSelect={(date) => field.handleChange(date ?? null)}
                placeholder="No due date"
                className="w-full"
              />
            </FormField>
          )}
        </form.Field>

        {/* Priority */}
        <form.Field name="priority">
          {(field) => (
            <FormField
              htmlFor="priority"
              label="Priority"
              error={field.state.meta.errors[0]?.message}
            >
              <PrioritySelect
                id="priority"
                value={field.state.value}
                onValueChange={field.handleChange}
              />
            </FormField>
          )}
        </form.Field>

        {/* Tag */}
        <form.Field name="tag">
          {(field) => (
            <FormField
              htmlFor="tag"
              label="Tag"
              error={field.state.meta.errors[0]?.message}
            >
              <TagSelect
                id="tag"
                value={field.state.value}
                onValueChange={field.handleChange}
              />
            </FormField>
          )}
        </form.Field>
      </div>

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2Icon className="animate-spin" />}
            {submitLabel}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
