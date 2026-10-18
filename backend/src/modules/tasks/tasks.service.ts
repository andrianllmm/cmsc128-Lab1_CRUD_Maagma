import { TaskModel, type Task } from "./tasks.model.js";
import type { CreateTaskInput, UpdateTaskInput } from "./tasks.schema.js";

// Every query filters by `owner`, so a user can only reach their own tasks.
// Another user's task is treated as not found.

const getTasks = async (ownerId: string): Promise<Task[]> => {
  return TaskModel.find({ owner: ownerId });
};

const getTaskById = async (
  ownerId: string,
  id: string,
): Promise<Task | null> => {
  return TaskModel.findOne({ _id: id, owner: ownerId });
};

const createTask = async (
  ownerId: string,
  data: CreateTaskInput,
): Promise<Task> => {
  return TaskModel.create({ ...data, owner: ownerId });
};

const updateTask = async (
  ownerId: string,
  id: string,
  data: UpdateTaskInput,
): Promise<Task | null> => {
  return TaskModel.findOneAndUpdate({ _id: id, owner: ownerId }, data, {
    returnDocument: "after",
    runValidators: true,
  });
};

const deleteTask = async (
  ownerId: string,
  id: string,
): Promise<Task | null> => {
  return TaskModel.findOneAndDelete({ _id: id, owner: ownerId });
};

export const taskService = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
