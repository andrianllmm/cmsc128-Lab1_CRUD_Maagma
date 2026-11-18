import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "../lib/logger.js";

export async function connectDB() {
  mongoose.set("strictQuery", true);
  // Operator objects in filters (e.g. `{ $ne: null }` from user input) are matched as plain values.
  // Zod already rejects them in request bodies; this covers anything that gets past it.
  // Operators the code adds on purpose are marked with `mongoose.trusted()`.
  mongoose.set("sanitizeFilter", true);

  await mongoose.connect(env.MONGODB_URI, {
    maxPoolSize: 10,
  });

  logger.info("MongoDB connected");
}
