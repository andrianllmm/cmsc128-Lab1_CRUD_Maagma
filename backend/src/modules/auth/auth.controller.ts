import type { Request, Response } from "express";

import { SESSION_COOKIE_NAME } from "../../config/session.js";
import { authService } from "./auth.service.js";
import { userService } from "../users/users.service.js";
import type {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "./auth.schema.js";

const startSession = async (
  req: Request<unknown, unknown, unknown>,
  userId: string,
) => {
  // New session ID on login to prevent session fixation
  await new Promise<void>((resolve, reject) =>
    req.session.regenerate((err) => (err ? reject(err) : resolve())),
  );
  req.session.userId = userId;
};

const register = async (
  req: Request<unknown, unknown, RegisterInput>,
  res: Response,
) => {
  const user = await authService.register(req.body);

  if (!user) {
    return res.status(409).json({ message: "Email already in use" });
  }

  await startSession(req, user.id);

  res.status(201).json(user);
};

const login = async (
  req: Request<unknown, unknown, LoginInput>,
  res: Response,
) => {
  const user = await authService.login(req.body);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  await startSession(req, user.id);

  res.status(200).json(user);
};

const logout = async (req: Request, res: Response) => {
  // Delete the session from the store so its ID can't be reused
  await new Promise<void>((resolve, reject) =>
    req.session.destroy((err) => (err ? reject(err) : resolve())),
  );
  res.clearCookie(SESSION_COOKIE_NAME);

  res.status(204).end();
};

const me = async (req: Request, res: Response) => {
  const user = await userService.findById(req.session.userId!);

  // Session outlived its user
  if (!user) {
    return res.status(401).json({ message: "Not logged in" });
  }

  res.status(200).json(user);
};

const forgotPassword = async (
  req: Request<unknown, unknown, ForgotPasswordInput>,
  res: Response,
) => {
  // Result ignored so the response doesn't reveal whether the email exists
  await authService.forgotPassword(req.body.email);

  res.status(200).json({
    message: "If an account uses that email, a reset link has been sent",
  });
};

const resetPassword = async (
  req: Request<unknown, unknown, ResetPasswordInput>,
  res: Response,
) => {
  const reset = await authService.resetPassword(
    req.body.token,
    req.body.newPassword,
  );

  if (!reset) {
    return res
      .status(400)
      .json({ message: "Reset link is invalid or has expired" });
  }

  res.status(200).json({ message: "Password has been reset" });
};

export const authController = {
  register,
  login,
  logout,
  me,
  forgotPassword,
  resetPassword,
};
