import type { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

export const validateBody =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues });
    }
    req.body = parsed.data;
    next();
  };

export const validateParams =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.params);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues });
    }
    next();
  };
