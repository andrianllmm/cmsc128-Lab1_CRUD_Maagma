import "dotenv/config";
import { z } from "zod";

// Treats blank values as unset
const optionalString = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().optional(),
);

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    PORT: z.coerce.number().default(3000),
    MONGODB_URI: z.url(),
    CORS_ORIGIN: z.url(),
    APP_URL: z.url(),
    SESSION_SECRET: z.string().min(32),
    // Email is printed to the terminal when SMTP isn't configured
    SMTP_HOST: optionalString,
    SMTP_PORT: z.coerce.number().default(465),
    SMTP_USER: optionalString,
    SMTP_PASS: optionalString,
    MAIL_FROM: optionalString,
  })
  .superRefine((env, ctx) => {
    const smtp = {
      SMTP_HOST: env.SMTP_HOST,
      SMTP_USER: env.SMTP_USER,
      SMTP_PASS: env.SMTP_PASS,
    };
    const missing = Object.entries(smtp).filter(([, value]) => !value);

    // A partial config is likely a typo, so fail instead of silently printing
    const partial = missing.length > 0 && missing.length < 3;
    // Printed emails expose reset links in the logs
    const requiredInProduction =
      env.NODE_ENV === "production" && missing.length > 0;

    if (partial || requiredInProduction) {
      for (const [key] of missing) {
        ctx.addIssue({
          code: "custom",
          path: [key],
          message: requiredInProduction
            ? "Required in production"
            : "Required when SMTP is configured",
        });
      }
    }
  });

export const env = envSchema.parse(process.env);
