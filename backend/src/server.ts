import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { swaggerSpec } from "./config/swagger.js";

const app = express();

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());
app.use(morgan(env.NODE_ENV === "production" ? "tiny" : "dev"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

async function start() {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
}

start();
