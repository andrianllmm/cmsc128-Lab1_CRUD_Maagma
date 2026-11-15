import type { Request, Response, NextFunction } from "express";

/**
 * Rejects requests without a logged-in session.
 * */
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not logged in" });
  }
  next();
};
