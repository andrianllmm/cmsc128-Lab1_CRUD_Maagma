import crypto from "crypto";
import { hashPassword, verifyPassword } from "../../lib/password.js";
import { env } from "../../config/env.js";
import { destroyUserSessions } from "../../config/session.js";
import { sendMail } from "../../lib/mailer.js";
import type { UserDocument } from "../users/users.model.js";
import { RESET_TOKEN_TTL_MS } from "../users/users.constants.js";
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

/**
 * Checks a user's current password
 * */
const checkPassword = async (
  userId: string,
  password: string,
): Promise<boolean> => {
  const user = await userService.findByIdWithPassword(userId);
  if (!user) return false;
  return verifyPassword(user.passwordHash, password);
};

/**
 * Replaces a user's password.
 * Returns `false` if the current password is wrong.
 * */
const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<boolean> => {
  if (!(await checkPassword(userId, currentPassword))) return false;

  const hashedPassword = await hashPassword(newPassword);
  await userService.updatePasswordHash(userId, hashedPassword);
  return true;
};

// Tokens are random and high-entropy, so a fast unsalted hash is enough and lets us look them up
const hashResetToken = (token: string): string =>
  crypto.createHash("sha256").update(token).digest("hex");

/**
 * Starts a password reset by emailing the user a reset link.
 * Returns `false` if no account uses the email.
 * */
const forgotPassword = async (email: string): Promise<boolean> => {
  const user = await userService.findByEmail(email);
  if (!user) return false;

  const resetToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

  // Only the hash is stored, so a leaked database doesn't expose usable links
  await userService.updateResetToken(
    user.id,
    hashResetToken(resetToken),
    expiresAt,
  );

  const link = `${env.APP_URL}/reset-password?token=${resetToken}`;

  sendMail(
    user.email,
    "Reset your password",
    `Reset your password using this link (expires in ${RESET_TOKEN_TTL_MS / 60000} minutes):\n\n${link}\n\nIf you didn't request this, you can ignore this email.`,
  ).catch((err) => console.error("Failed to send reset email:", err));

  return true;
};

/**
 * Sets a new password using a reset token.
 * Returns `false` if the token is invalid or expired.
 * */
const resetPassword = async (
  token: string,
  newPassword: string,
): Promise<boolean> => {
  const user = await userService.findByValidResetToken(hashResetToken(token));
  if (!user) return false;

  const hashedPassword = await hashPassword(newPassword);
  await userService.updatePasswordHash(user.id, hashedPassword);
  await destroyUserSessions(user.id);
  return true;
};

export const authService = {
  register,
  login,
  checkPassword,
  changePassword,
  forgotPassword,
  resetPassword,
};
