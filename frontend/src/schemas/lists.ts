import { z } from "zod";
import { LIST_NAME_MAX_LENGTH } from "@/types/lists";

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

export type CreateListInput = z.infer<typeof createListSchema>;
