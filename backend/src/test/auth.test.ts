import assert from "node:assert/strict";
import { after, before, describe, it, mock } from "node:test";
import type { Express } from "express";
import request from "supertest";
import { startTestApp, stopTestApp } from "./setup.js";
import { listService } from "../modules/lists/lists.service.js";
import { UserModel } from "../modules/users/users.model.js";

let app: Express;

before(async () => {
  app = await startTestApp();
});
after(stopTestApp);

const signup = (email: string) =>
  request(app)
    .post("/api/auth/register")
    .send({ email, displayName: "User", password: "password123" });

describe("registration", () => {
  it("rejects an email that's already taken", async () => {
    await signup("taken@example.com").expect(201);
    await signup("TAKEN@example.com").expect(409);
  });

  it("creates only one account for concurrent signups", async () => {
    const results = await Promise.all(
      Array.from({ length: 5 }, () => signup("race@example.com")),
    );
    const statuses = results.map((res) => res.status).sort();

    assert.deepEqual(statuses, [201, 409, 409, 409, 409]);
    assert.equal(
      await UserModel.countDocuments({ email: "race@example.com" }),
      1,
    );
  });

  it("undoes the signup if the personal list can't be created", async () => {
    const failing = mock.method(listService, "createPersonalList", async () => {
      throw new Error("Database unavailable");
    });

    try {
      await signup("broken@example.com").expect(500);
    } finally {
      failing.mock.restore();
    }

    assert.equal(await UserModel.exists({ email: "broken@example.com" }), null);
    // The email isn't left taken
    await signup("broken@example.com").expect(201);
  });
});
