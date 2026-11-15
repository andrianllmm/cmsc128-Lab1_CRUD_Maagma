import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import type { Express } from "express";
import request from "supertest";
import { registerUser, startTestApp, stopTestApp } from "./setup.js";

type User = Awaited<ReturnType<typeof registerUser>>;

let app: Express;
// Owns a shared list and a private task
let alice: User;
// Member of Alice's shared list
let bob: User;
// Unrelated to Alice
let eve: User;

let sharedListId: string;
let privateTaskId: string;
let sharedTaskId: string;

before(async () => {
  app = await startTestApp();
  alice = await registerUser(app, "alice");
  bob = await registerUser(app, "bob");
  eve = await registerUser(app, "eve");

  const shared = await alice.agent
    .post("/api/lists")
    .send({ name: "Shared" })
    .expect(201);
  sharedListId = shared.body._id;

  await alice.agent
    .post(`/api/lists/${sharedListId}/members`)
    .send({ email: "bob@example.com" })
    .expect(200);

  const privateTask = await alice.agent
    .post(`/api/lists/${alice.personalListId}/tasks`)
    .send({ title: "Private" })
    .expect(201);
  privateTaskId = privateTask.body._id;

  const sharedTask = await alice.agent
    .post(`/api/lists/${sharedListId}/tasks`)
    .send({ title: "Shared" })
    .expect(201);
  sharedTaskId = sharedTask.body._id;
});

after(stopTestApp);

describe("authentication", () => {
  it("rejects list and task routes without a session", async () => {
    await request(app).get("/api/lists").expect(401);
    await request(app)
      .get(`/api/lists/${alice.personalListId}/tasks`)
      .expect(401);
    await request(app).patch("/api/users/me").send({}).expect(401);
  });

  it("never returns password hashes", async () => {
    const me = await alice.agent.get("/api/auth/me").expect(200);
    assert.equal(me.body.passwordHash, undefined);

    const lists = await alice.agent.get("/api/lists").expect(200);
    assert.doesNotMatch(JSON.stringify(lists.body), /passwordHash/);
  });
});

describe("list access", () => {
  it("only lists the user's own and shared lists", async () => {
    const res = await eve.agent.get("/api/lists").expect(200);
    const ids = res.body.map((list: { _id: string }) => list._id);
    assert.deepEqual(ids, [eve.personalListId]);
  });

  it("hides other users' lists as not found", async () => {
    await eve.agent.get(`/api/lists/${alice.personalListId}/tasks`).expect(404);
    await eve.agent.get(`/api/lists/${sharedListId}/tasks`).expect(404);
    await eve.agent
      .patch(`/api/lists/${sharedListId}`)
      .send({ name: "Hacked" })
      .expect(404);
    await eve.agent.delete(`/api/lists/${sharedListId}`).expect(404);
  });

  it("lets members read and add tasks", async () => {
    const res = await bob.agent
      .get(`/api/lists/${sharedListId}/tasks`)
      .expect(200);
    assert.equal(res.body.length, 1);

    await bob.agent
      .post(`/api/lists/${sharedListId}/tasks`)
      .send({ title: "From Bob" })
      .expect(201);
  });

  it("blocks members from owner-only actions", async () => {
    await bob.agent
      .post(`/api/lists/${sharedListId}/members`)
      .send({ email: "eve@example.com" })
      .expect(403);
    await bob.agent
      .patch(`/api/lists/${sharedListId}`)
      .send({ name: "Renamed" })
      .expect(403);
    await bob.agent.delete(`/api/lists/${sharedListId}`).expect(403);
  });

  it("keeps personal lists private and fixed", async () => {
    const personal = `/api/lists/${alice.personalListId}`;
    await alice.agent
      .post(`${personal}/members`)
      .send({ email: "bob@example.com" })
      .expect(400);
    await alice.agent.patch(personal).send({ name: "Renamed" }).expect(400);
    await alice.agent.delete(personal).expect(400);
  });
});

describe("task access", () => {
  it("hides tasks in lists the user can't access", async () => {
    const task = `/api/lists/${alice.personalListId}/tasks/${privateTaskId}`;
    await eve.agent.get(task).expect(404);
    await eve.agent.patch(task).send({ done: true }).expect(404);
    await eve.agent.delete(task).expect(404);
  });

  it("hides tasks requested through a different list", async () => {
    // Eve's own list, but Alice's task ID
    const task = `/api/lists/${eve.personalListId}/tasks/${privateTaskId}`;
    await eve.agent.get(task).expect(404);
    await eve.agent.patch(task).send({ done: true }).expect(404);
    await eve.agent.delete(task).expect(404);

    // Bob can access the shared list, but not Alice's private task through it
    await bob.agent
      .get(`/api/lists/${sharedListId}/tasks/${privateTaskId}`)
      .expect(404);
  });

  it("sets the task owner from the session, not the body", async () => {
    const res = await bob.agent
      .post(`/api/lists/${sharedListId}/tasks`)
      .send({ title: "Spoofed", owner: alice.user._id })
      .expect(201);
    assert.equal(res.body.owner._id, bob.user._id);
  });

  it("lets members update tasks in shared lists", async () => {
    const res = await bob.agent
      .patch(`/api/lists/${sharedListId}/tasks/${sharedTaskId}`)
      .send({ done: true })
      .expect(200);
    assert.equal(res.body.done, true);
  });
});

describe("list deletion", () => {
  it("removes the list's tasks with it", async () => {
    const list = await alice.agent
      .post("/api/lists")
      .send({ name: "Temporary" })
      .expect(201);
    const listId = list.body._id;
    const task = await alice.agent
      .post(`/api/lists/${listId}/tasks`)
      .send({ title: "Temporary" })
      .expect(201);

    await alice.agent.delete(`/api/lists/${listId}`).expect(204);
    await alice.agent
      .get(`/api/lists/${listId}/tasks/${task.body._id}`)
      .expect(404);

    const { TaskModel } = await import("../modules/tasks/tasks.model.js");
    assert.equal(await TaskModel.exists({ list: listId }), null);
  });
});
