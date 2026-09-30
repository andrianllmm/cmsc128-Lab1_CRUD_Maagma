import type { Request, Response } from "express";

import { authService } from "./auth.service.js";
import type { RegisterInput } from "./auth.schema.js";

const register = async (
  req: Request<unknown, unknown, RegisterInput>,
  res: Response,
) => {
  const user = await authService.register(req.body);

  if (!user) {
    return res.status(409).json({ message: "Email already in use" });
  }

  // New session ID on login to prevent session fixation
  await new Promise<void>((resolve, reject) =>
    req.session.regenerate((err) => (err ? reject(err) : resolve())),
  );
  req.session.userId = user.id;

  res.status(201).json(user);
};

export const authController = {
  register,
};
