import { z } from "zod";
import { displayNameSchema, emailSchema, passwordSchema } from "./auth";

const currentPasswordSchema = z.string().min(1, "Current password is required");

export const updateProfileSchema = z.object({
  displayName: displayNameSchema,
});

export const updateEmailSchema = z.object({
  email: emailSchema,
  currentPassword: currentPasswordSchema,
});

export const updatePasswordSchema = z
  .object({
    currentPassword: currentPasswordSchema,
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdateEmailInput = z.infer<typeof updateEmailSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
