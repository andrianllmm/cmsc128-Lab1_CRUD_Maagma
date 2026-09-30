import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(3000),
  MONGODB_URI: z.url(),
  CORS_ORIGIN: z.url(),
  SESSION_SECRET: z.string().min(32),
});

export const env = envSchema.parse(process.env);
