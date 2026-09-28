import { z } from "zod";
import { isValidObjectId } from "mongoose";
import { PRIORITIES, TAGS, TITLE_MAX_LENGTH } from "./tasks.constants.js";

export const taskIdSchema = z.object({
  id: z.string().refine(isValidObjectId, { message: "Invalid task id" }),
});

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(
      TITLE_MAX_LENGTH,
      `Title must be at most ${TITLE_MAX_LENGTH} characters`,
    ),
  dueDate: z.exactOptional(z.coerce.date().nullable()),
  priority: z.exactOptional(z.enum(PRIORITIES)),
  tag: z.exactOptional(z.enum(TAGS)),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  done: z.exactOptional(z.boolean()),
});

export type TaskIdInput = z.infer<typeof taskIdSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
