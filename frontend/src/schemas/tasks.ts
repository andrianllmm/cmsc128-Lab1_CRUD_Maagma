import { z } from "zod";
import { PRIORITIES, TAGS, TITLE_MAX_LENGTH } from "../types/tasks";

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(
      TITLE_MAX_LENGTH,
      `Title must be at most ${TITLE_MAX_LENGTH} characters`,
    ),
  dueDate: z.exactOptional(
    z.coerce.date<Date>({ error: "Enter a valid due date" }).nullable(),
  ),
  priority: z.exactOptional(
    z.enum(PRIORITIES, { error: "Select a valid priority" }),
  ),
  tag: z.exactOptional(z.enum(TAGS, { error: "Select a valid tag" })),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  done: z.exactOptional(z.boolean()),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
