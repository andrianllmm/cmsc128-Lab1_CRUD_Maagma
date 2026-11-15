import { rateLimit } from "express-rate-limit";

const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;
const ONE_HOUR_MS = 60 * 60 * 1000;

const TOO_MANY = { message: "Too many attempts, try again later" };

/**
 * Limits password guessing on routes that check a password or token.
 * Only failed attempts count, so users who log in normally are never blocked.
 * */
export const failedAuthLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES_MS,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: TOO_MANY,
});

/**
 * Limits routes that send emails, since every request succeeds and sends one.
 * */
export const emailLimiter = rateLimit({
  windowMs: ONE_HOUR_MS,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: TOO_MANY,
});
