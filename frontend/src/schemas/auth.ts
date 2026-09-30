import { z } from "zod";
import {
  DISPLAY_NAME_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "../types/users";

// Trim before checking the format, otherwise surrounding spaces fail it
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Email is required")
  .pipe(z.email("Enter a valid email address"));

// Not trimmed: the password must match exactly what the user typed
export const passwordSchema = z
  .string()
  .min(
    PASSWORD_MIN_LENGTH,
    `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
  )
  .max(
    PASSWORD_MAX_LENGTH,
    `Password must be at most ${PASSWORD_MAX_LENGTH} characters`,
  );

export const displayNameSchema = z
  .string()
  .trim()
  .min(1, "Display name is required")
  .max(
    DISPLAY_NAME_MAX_LENGTH,
    `Display name must be at most ${DISPLAY_NAME_MAX_LENGTH} characters`,
  );

export const registerSchema = z.object({
  email: emailSchema,
  displayName: displayNameSchema,
  password: passwordSchema,
});

export type RegisterInput = z.infer<typeof registerSchema>;
