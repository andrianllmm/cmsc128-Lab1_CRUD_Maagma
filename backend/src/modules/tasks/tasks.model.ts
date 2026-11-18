import { Schema, model, type InferSchemaType } from "mongoose";
import { PRIORITIES, TAGS, TITLE_MAX_LENGTH } from "./tasks.constants.js";

const taskSchema = new Schema(
  {
    // The list the task belongs to
    list: {
      type: Schema.Types.ObjectId,
      ref: "List",
      required: true,
    },
    // The user who created the task
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: TITLE_MAX_LENGTH,
    },
    dueDate: {
      type: Date,
    },
    done: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: PRIORITIES,
      default: "None",
    },
    tag: {
      type: String,
      enum: TAGS,
      default: "Others",
    },
  },
  { timestamps: true },
);

// Every task query filters by list; the sort comes from the index instead of memory
taskSchema.index({ list: 1, createdAt: 1 });

export type Task = InferSchemaType<typeof taskSchema>;
export const TaskModel = model("Task", taskSchema);
