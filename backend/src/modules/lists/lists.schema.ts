import { z } from "zod";
import { isValidObjectId } from "mongoose";
import { LIST_NAME_MAX_LENGTH } from "./lists.constants.js";
import { emailSchema } from "../auth/auth.schema.js";

export const listIdSchema = z.object({
  listId: z.string().refine(isValidObjectId, { message: "Invalid list id" }),
});

export const createListSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(
      LIST_NAME_MAX_LENGTH,
      `Name must be at most ${LIST_NAME_MAX_LENGTH} characters`,
    ),
});

export const addMemberSchema = z.object({
  email: emailSchema,
});

export type ListIdInput = z.infer<typeof listIdSchema>;
export type CreateListInput = z.infer<typeof createListSchema>;
export type AddMemberInput = z.infer<typeof addMemberSchema>;
