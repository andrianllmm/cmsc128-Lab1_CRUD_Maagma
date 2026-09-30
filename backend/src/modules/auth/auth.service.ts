import { hashPassword, verifyPassword } from "../../lib/password.js";
import type { UserDocument } from "../users/users.model.js";
import { userService } from "../users/users.service.js";
import type { RegisterInput, LoginInput } from "./auth.schema.js";

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

// Verified against when the email is unknown, so both failures take the same time
const dummyHash = hashPassword("dummy-password");

/**
 * Logs in a user.
 * Returns `null` if the email or password is invalid.
 * */
const login = async (data: LoginInput): Promise<UserDocument | null> => {
  const user = await userService.findByEmailWithPassword(data.email);
  if (!user) {
    await verifyPassword(await dummyHash, data.password);
    return null;
  }

  const valid = await verifyPassword(user.passwordHash, data.password);
  return valid ? user : null;
};

export const authService = {
  register,
  login,
};
