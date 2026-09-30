import type { Request, Response } from "express";

import { authService } from "./auth.service.js";
import { userService } from "../users/users.service.js";
import type { RegisterInput, LoginInput } from "./auth.schema.js";

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

const me = async (req: Request, res: Response) => {
  const user = await userService.findById(req.session.userId!);

  // Session outlived its user
  if (!user) {
    return res.status(401).json({ message: "Not logged in" });
  }

  res.status(200).json(user);
};

export const authController = {
  register,
  login,
  me,
};
