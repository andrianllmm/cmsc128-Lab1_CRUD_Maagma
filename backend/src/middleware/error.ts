import type { Request, Response, NextFunction } from "express";

interface HttpError extends Error {
  status?: number;
  expose?: boolean;
}

export const notFound = (req: Request, res: Response) => {
  res
    .status(404)
    .json({ message: `Route ${req.method} ${req.path} not found` });
};

export const errorHandler = (
  err: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const status = err.status ?? 500;

  if (status >= 500) {
    console.error(err);
  }

  // Only expose client-safe messages (e.g. malformed JSON body)
  const message = err.expose ? err.message : "Internal server error";
  res.status(status).json({ message });
};
