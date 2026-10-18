import { z } from "zod";
import { LIST_NAME_MAX_LENGTH } from "@/types/lists";
import { emailSchema } from "./auth";

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

export type CreateListInput = z.infer<typeof createListSchema>;
export type AddMemberInput = z.infer<typeof addMemberSchema>;
