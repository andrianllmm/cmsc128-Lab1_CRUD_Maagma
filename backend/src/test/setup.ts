import type { Express } from "express";
import { MongoMemoryReplSet } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";

let replSet: MongoMemoryReplSet;

/**
 * Starts an in-memory MongoDB and loads the app against it.
 * The app is imported after the env is set, since config is read on import.
 * */
export const startTestApp = async (): Promise<Express> => {
  replSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } });

  Object.assign(process.env, {
    NODE_ENV: "test",
    MONGODB_URI: replSet.getUri("todo-test"),
    CORS_ORIGIN: "http://localhost:5173",
    APP_URL: "http://localhost:5173",
    SESSION_SECRET: "test-secret-that-is-at-least-32-chars",
    // Overrides any local .env so tests never send real emails
    SMTP_HOST: "",
    SMTP_USER: "",
    SMTP_PASS: "",
  });

  const { connectDB } = await import("../config/db.js");
  const { app } = await import("../app.js");
  await connectDB();
  // Build indexes up front so tests see the same constraints as production
  await Promise.all(
    Object.values(mongoose.models).map((model) => model.init()),
  );
  return app;
};

export const stopTestApp = async () => {
  await mongoose.disconnect();
  await replSet.stop();
};

/**
 * Registers a user and returns an agent that keeps their session cookie.
 * */
export const registerUser = async (app: Express, name: string) => {
  const agent = request.agent(app);
  const res = await agent
    .post("/api/auth/register")
    .send({
      email: `${name}@example.com`,
      displayName: name,
      password: "password123",
    })
    .expect(201);

  const lists = await agent.get("/api/lists").expect(200);
  const personalListId: string = lists.body[0]._id;

  return { agent, user: res.body, personalListId };
};
