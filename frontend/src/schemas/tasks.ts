import { z } from "zod";
import { PRIORITIES, TAGS } from "../types/tasks";

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  dueDate: z.exactOptional(
    z.coerce.date({ error: "Enter a valid due date" }).nullable(),
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
