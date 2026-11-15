import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import type { Express } from "express";
import request from "supertest";
import { startTestApp, stopTestApp } from "./setup.js";

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
