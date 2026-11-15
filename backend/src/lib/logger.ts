import { env } from "../config/env.js";

// Tests assert on responses, so logs would only add noise
const silent = env.NODE_ENV === "test";

/**
 * App logs, in one place so they can be silenced or redirected.
 * The seed script prints to the console directly, since its output is the point.
 * */
export const logger = {
  info: (...args: unknown[]) => {
    if (!silent) console.info(...args);
  },
  error: (...args: unknown[]) => {
    if (!silent) console.error(...args);
  },
};
