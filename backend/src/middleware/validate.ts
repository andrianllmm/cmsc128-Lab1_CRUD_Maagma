import type { Request, Response, NextFunction } from "express";
import { z, ZodError, ZodType } from "zod";

// Readable message with per-field errors
function formatError(error: ZodError) {
  return {
    message: error.issues.map((issue) => issue.message).join(", "),
    errors: z.flattenError(error).fieldErrors,
  };
}

export const validateBody =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(formatError(parsed.error));
    }
    req.body = parsed.data;
    next();
  };

export const validateParams =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.params);
    if (!parsed.success) {
      return res.status(400).json(formatError(parsed.error));
    }
    next();
  };
