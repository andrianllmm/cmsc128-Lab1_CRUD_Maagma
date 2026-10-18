import type { Request, Response } from "express";

import { authService } from "../auth/auth.service.js";
import { userService } from "./users.service.js";
import type {
  UpdateProfileInput,
  UpdateEmailInput,
  UpdatePasswordInput,
} from "./users.schema.js";

const WRONG_PASSWORD = {
  message: "Current password is incorrect",
  errors: { currentPassword: ["Current password is incorrect"] },
};

const updateProfile = async (
  req: Request<unknown, unknown, UpdateProfileInput>,
  res: Response,
) => {
  const user = await userService.updateDisplayName(
    req.session.userId!,
    req.body.displayName,
  );

  // Session outlived its user
  if (!user) {
    return res.status(401).json({ message: "Not logged in" });
  }

  res.status(200).json(user);
};

const updateEmail = async (
  req: Request<unknown, unknown, UpdateEmailInput>,
  res: Response,
) => {
  const userId = req.session.userId!;

  if (!(await authService.checkPassword(userId, req.body.currentPassword))) {
    return res.status(400).json(WRONG_PASSWORD);
  }

  const user = await userService.updateEmail(userId, req.body.email);

  if (!user) {
    return res.status(409).json({ message: "Email already in use" });
  }

  res.status(200).json(user);
};

const updatePassword = async (
  req: Request<unknown, unknown, UpdatePasswordInput>,
  res: Response,
) => {
  const changed = await authService.changePassword(
    req.session.userId!,
    req.body.currentPassword,
    req.body.newPassword,
    req.sessionID,
  );

  if (!changed) {
    return res.status(400).json(WRONG_PASSWORD);
  }

  res.status(204).end();
};

export const userController = {
  updateProfile,
  updateEmail,
  updatePassword,
};
