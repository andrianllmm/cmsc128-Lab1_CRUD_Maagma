import { hashPassword } from "../../lib/password.js";
import type { UserDocument } from "../users/users.model.js";
import { userService } from "../users/users.service.js";
import type { RegisterInput } from "./auth.schema.js";

/**
 * Creates an account.
 * Returns `null` if the email is already taken.
 * */
const register = async (data: RegisterInput): Promise<UserDocument | null> => {
  const existing = await userService.findByEmail(data.email);
  if (existing) return null;

  const hashedPassword = await hashPassword(data.password);
  return userService.createUser({
    email: data.email,
    displayName: data.displayName,
    passwordHash: hashedPassword,
  });
};

export const authService = {
  register,
};
