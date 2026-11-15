import assert from "node:assert/strict";
import { after, before, it } from "node:test";
import type { Express } from "express";
import request from "supertest";
import { registerUser, startTestApp, stopTestApp } from "./setup.js";

let app: Express;

before(async () => {
  app = await startTestApp();
  await registerUser(app, "alice");
});
after(stopTestApp);

const login = (password: string) =>
  request(app)
    .post("/api/auth/login")
    .send({ email: "alice@example.com", password });

it("doesn't count successful logins", async () => {
  for (let i = 0; i < 15; i++) await login("password123").expect(200);
});

it("blocks logins after too many wrong passwords", async () => {
  for (let i = 0; i < 10; i++) await login("wrong-password").expect(401);

  const res = await login("password123").expect(429);
  assert.equal(res.body.message, "Too many attempts, try again later");
  assert.ok(res.headers["ratelimit"]);
});

it("limits password reset emails", async () => {
  const forgot = () =>
    request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "alice@example.com" });

  for (let i = 0; i < 5; i++) await forgot().expect(200);
  await forgot().expect(429);
});
