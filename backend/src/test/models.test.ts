import assert from "node:assert/strict";
import { after, before, it } from "node:test";
import type { Express } from "express";
import { registerUser, startTestApp, stopTestApp } from "./setup.js";
import { ListModel } from "../modules/lists/lists.model.js";

let app: Express;

before(async () => {
  app = await startTestApp();
});
after(stopTestApp);

it("allows only one personal list per user", async () => {
  const { user } = await registerUser(app, "alice");

  await assert.rejects(
    ListModel.create({ name: "Personal", owner: user._id, personal: true }),
    { code: 11000 },
  );
  // Collaborative lists aren't limited
  await ListModel.create({ name: "A", owner: user._id });
  await ListModel.create({ name: "B", owner: user._id });
});
