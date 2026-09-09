import { Schema, model, type InferSchemaType } from "mongoose";
import { PRIORITIES, TAGS } from "./tasks.constants.js";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
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

export type Task = InferSchemaType<typeof taskSchema>;
export const TaskModel = model("Task", taskSchema);
