import type { RequestHandler } from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import { env } from "./env.js";

const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// Data stored server-side per session
declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

/**
 * Server-side sessions stored in MongoDB.
 * The browser only holds a signed session ID cookie; the session data lives in the `sessions` collection,
 * so sessions survive page refreshes and backend restarts, and can be destroyed on logout.
 * */
export const sessionMiddleware: RequestHandler = session({
  name: "sid",
  secret: env.SESSION_SECRET,
  // Only save sessions that were modified (i.e. after login)
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: env.MONGODB_URI,
    collectionName: "sessions",
    // Expired sessions are removed by a MongoDB TTL index
    ttl: SESSION_MAX_AGE_MS / 1000,
  }),
  cookie: {
    // Not readable by JavaScript
    httpOnly: true,
    // Not sent on cross-site requests
    sameSite: "lax",
    // HTTPS only in production
    secure: env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE_MS,
  },
});
