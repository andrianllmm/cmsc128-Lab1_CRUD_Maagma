import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env.js";
import { sessionMiddleware } from "./config/session.js";
import { swaggerSpec } from "./config/swagger.js";
import { errorHandler, notFound } from "./middleware/error.js";

import { authRouter } from "./modules/auth/auth.router.js";
import { listRouter } from "./modules/lists/lists.router.js";
import { taskRouter } from "./modules/tasks/tasks.router.js";
import { userRouter } from "./modules/users/users.router.js";

export const app: Express = express();

// Hosts like Render terminate HTTPS at a proxy; trusting it lets Express see the request as HTTPS,
// so the `secure` session cookie is sent and rate limits use the client's IP instead of the proxy's
if (env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Standard security headers (no sniffing, no framing, CSP, HSTS) and no `X-Powered-By`
app.use(helmet());

// Request logs would clutter test output
if (env.NODE_ENV !== "test") {
  app.use(morgan(env.NODE_ENV === "production" ? "tiny" : "dev"));
}
// Allow the frontend to send the session cookie
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(sessionMiddleware);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRouter);
app.use("/api/lists", listRouter);
app.use("/api/lists/:listId/tasks", taskRouter);
app.use("/api/users", userRouter);

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server and DB status
 */
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// In production the backend also serves the built frontend, so the app and API share one origin
// and the `sameSite: "lax"` session cookie works without CORS
const frontendDist = fileURLToPath(
  new URL("../../frontend/dist", import.meta.url),
);
if (env.NODE_ENV === "production" && existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  // Client-side routes (e.g. /lists/123) load the app, which then routes itself
  app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api")) return next();
    res.sendFile("index.html", { root: frontendDist });
  });
}

app.use(notFound);
app.use(errorHandler);
