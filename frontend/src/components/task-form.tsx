import { useState, type SubmitEvent } from "react";
import { createTaskSchema, type CreateTaskInput } from "@/schemas/tasks";
import type { Task } from "@/types/tasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { FormField } from "@/components/ui/form-field";
import { PrioritySelect } from "@/components/priority-select";
import { TagSelect } from "@/components/tag-select";

interface TaskFormProps {
  task?: Task;
  submitLabel?: string;
  onSubmit: (data: CreateTaskInput) => unknown;
}

export function TaskForm({
  task,
  submitLabel = "Create",
  onSubmit,
}: TaskFormProps) {
  // Form fields
  const [title, setTitle] = useState(task?.title ?? "");
  const [dueDate, setDueDate] = useState<Date | undefined>(
    task?.dueDate ? new Date(task.dueDate) : undefined,
  );
  const [priority, setPriority] = useState<string | undefined>(
    task?.priority ?? "None",
  );
  const [tag, setTag] = useState<string | undefined>(task?.tag ?? "Others");

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    // Validate form
    const result = createTaskSchema.safeParse({
      title,
      dueDate: dueDate ?? null,
      priority,
      tag,
    });

    if (!result.success) {
      setErrors(
        Object.fromEntries(
          result.error.issues.map((issue) => [issue.path[0], issue.message]),
        ),
      );
      return;
    }

    setErrors({});
    onSubmit(result.data);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Title */}
      <FormField htmlFor="title" label="Title" error={errors.title} hideLabel>
        <Input
          id="title"
          placeholder="What do you want to do?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus={!task}
        />
      </FormField>

      <div className="flex gap-2">
        {/* Due date */}
        <FormField
          htmlFor="dueDate"
          label="Due date"
          error={errors.dueDate}
          hideLabel
          className="flex-1"
        >
          <DatePicker
            id="dueDate"
            selected={dueDate}
            onSelect={setDueDate}
            placeholder="No due date"
            className="w-full"
          />
        </FormField>

        {/* Priority */}
        <FormField
          htmlFor="priority"
          label="Priority"
          error={errors.priority}
          hideLabel
        >
          <PrioritySelect
            id="priority"
            value={priority}
            onValueChange={setPriority}
          />
        </FormField>

        {/* Tag */}
        <FormField htmlFor="tag" label="Tag" error={errors.tag} hideLabel>
          <TagSelect id="tag" value={tag} onValueChange={setTag} />
        </FormField>
      </div>

      <Button type="submit">{submitLabel}</Button>
    </form>
  );
}
