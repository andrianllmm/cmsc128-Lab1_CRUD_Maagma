import cors from "cors";
import express, { type Express } from "express";
import mongoose from "mongoose";
import morgan from "morgan";
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

app.use(morgan(env.NODE_ENV === "production" ? "tiny" : "dev"));
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

app.use(notFound);
app.use(errorHandler);
