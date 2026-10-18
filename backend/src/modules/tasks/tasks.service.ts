import { TaskModel, type Task } from "./tasks.model.js";
import type { CreateTaskInput, UpdateTaskInput } from "./tasks.schema.js";

// Every query filters by `list`, which `requireListAccess` already checked the user can access.
// A task in another list is treated as not found.

// Shows who created each task in shared lists
const withOwner = { path: "owner", select: "displayName" };

const getTasks = async (listId: string): Promise<Task[]> => {
  return TaskModel.find({ list: listId }).populate(withOwner);
};

const getTaskById = async (
  listId: string,
  id: string,
): Promise<Task | null> => {
  return TaskModel.findOne({ _id: id, list: listId }).populate(withOwner);
};

const createTask = async (
  listId: string,
  ownerId: string,
  data: CreateTaskInput,
): Promise<Task> => {
  const task = await TaskModel.create({
    ...data,
    list: listId,
    owner: ownerId,
  });
  return task.populate(withOwner);
};

const updateTask = async (
  listId: string,
  id: string,
  data: UpdateTaskInput,
): Promise<Task | null> => {
  return TaskModel.findOneAndUpdate({ _id: id, list: listId }, data, {
    returnDocument: "after",
    runValidators: true,
  }).populate(withOwner);
};

const deleteTask = async (listId: string, id: string): Promise<Task | null> => {
  return TaskModel.findOneAndDelete({ _id: id, list: listId });
};

export const taskService = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
