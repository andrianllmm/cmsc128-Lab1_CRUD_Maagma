import { app } from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { createSessionIndexes } from "./config/session.js";
import { logger } from "./lib/logger.js";

async function start() {
  await connectDB();
  await createSessionIndexes();
  app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT}`);
  });
}

start();
