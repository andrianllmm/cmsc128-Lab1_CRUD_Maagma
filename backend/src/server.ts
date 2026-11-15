import { app } from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { createSessionIndexes } from "./config/session.js";

async function start() {
  await connectDB();
  await createSessionIndexes();
  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
}

start();
