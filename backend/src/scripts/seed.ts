/**
 * Adds sample tasks to the personal lists of already-registered users.
 * Usage: pnpm seed <email> [email...]
 *
 * Users must register through the app first; this never creates accounts.
 * A user whose personal list already has tasks is skipped, so it's safe to rerun.
 * */
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { userService } from "../modules/users/users.service.js";
import { ListModel } from "../modules/lists/lists.model.js";
import { TaskModel } from "../modules/tasks/tasks.model.js";

const DAY_MS = 24 * 60 * 60 * 1000;

// Due dates are relative to now, so one task is always overdue
const daysFromNow = (days: number) => new Date(Date.now() + days * DAY_MS);

const SAMPLE_TASKS = [
  {
    title: "Finish CMSC 128 lab report",
    dueDate: daysFromNow(2),
    priority: "High",
    tag: "School",
  },
  {
    title: "Review for the long exam",
    dueDate: daysFromNow(5),
    priority: "Medium",
    tag: "School",
  },
  {
    title: "Submit weekly timesheet",
    dueDate: daysFromNow(-1),
    priority: "Low",
    tag: "Work",
  },
  { title: "Buy groceries", tag: "Personal" },
  { title: "Water the plants", done: true },
];

async function seedUser(email: string) {
  const user = await userService.findByEmail(email.toLowerCase());
  if (!user) {
    console.log(`${email}: no account, register it through the app first`);
    return;
  }

  const list = await ListModel.findOne({ owner: user._id, personal: true });
  if (!list) {
    console.log(`${email}: no personal list, re-register the account`);
    return;
  }

  if (await TaskModel.exists({ list: list._id })) {
    console.log(`${email}: already has tasks, skipped`);
    return;
  }

  await TaskModel.insertMany(
    SAMPLE_TASKS.map((task) => ({ ...task, list: list._id, owner: user._id })),
  );
  console.log(`${email}: added ${SAMPLE_TASKS.length} tasks`);
}

async function main() {
  const emails = process.argv.slice(2);
  if (emails.length === 0) {
    console.error("Usage: pnpm seed <email> [email...]");
    process.exitCode = 1;
    return;
  }

  await connectDB();
  try {
    for (const email of emails) await seedUser(email);
  } finally {
    await mongoose.disconnect();
  }
}

main();
