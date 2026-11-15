import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "../lib/logger.js";

export async function connectDB() {
  mongoose.set("strictQuery", true);

  await mongoose.connect(env.MONGODB_URI, {
    maxPoolSize: 10,
  });

  logger.info("MongoDB connected");
}
