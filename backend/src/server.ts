import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { sessionMiddleware } from "./config/session.js";
import { swaggerSpec } from "./config/swagger.js";
import { errorHandler, notFound } from "./middleware/error.js";

import { authRouter } from "./modules/auth/auth.router.js";
import { taskRouter } from "./modules/tasks/tasks.router.js";

const app = express();

app.use(morgan(env.NODE_ENV === "production" ? "tiny" : "dev"));
// Allow the frontend to send the session cookie
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(sessionMiddleware);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);

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

async function start() {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
}

start();
