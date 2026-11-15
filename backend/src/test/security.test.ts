import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import type { Express } from "express";
import request from "supertest";
import crypto from "node:crypto";
import { registerUser, startTestApp, stopTestApp } from "./setup.js";
import { userService } from "../modules/users/users.service.js";

let app: Express;

before(async () => {
  app = await startTestApp();
});
after(stopTestApp);

describe("security headers", () => {
  it("sets standard security headers", async () => {
    const res = await request(app).get("/api/health").expect(200);

    assert.equal(res.headers["x-content-type-options"], "nosniff");
    assert.equal(res.headers["x-frame-options"], "SAMEORIGIN");
    assert.ok(res.headers["content-security-policy"]);
    assert.ok(res.headers["strict-transport-security"]);
  });

  it("doesn't reveal the server framework", async () => {
    const res = await request(app).get("/api/health").expect(200);
    assert.equal(res.headers["x-powered-by"], undefined);
  });
});

describe("query injection", () => {
  it("rejects operator objects in request bodies", async () => {
    await request(app)
      .post("/api/auth/login")
      .send({ email: { $ne: null }, password: { $ne: null } })
      .expect(400);
  });

  it("still resets passwords with a valid token", async () => {
    const { user } = await registerUser(app, "resetter");
    const token = "a".repeat(64);
    const hash = crypto.createHash("sha256").update(token).digest("hex");
    await userService.updateResetToken(
      user._id,
      hash,
      new Date(Date.now() + 60_000),
    );

    await request(app)
      .post("/api/auth/reset-password")
      .send({ token, newPassword: "new-password123" })
      .expect(200);
    await request(app)
      .post("/api/auth/login")
      .send({ email: "resetter@example.com", password: "new-password123" })
      .expect(200);
  });
});
