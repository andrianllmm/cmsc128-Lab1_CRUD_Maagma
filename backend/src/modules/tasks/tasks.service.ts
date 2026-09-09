import { TaskModel, type Task } from "./tasks.model.js";
import type { CreateTaskInput, UpdateTaskInput } from "./tasks.schema.js";

const getTasks = async (): Promise<Task[]> => {
  return TaskModel.find();
};

const getTaskById = async (id: string): Promise<Task | null> => {
  return TaskModel.findOne({ _id: id });
};

const createTask = async (data: CreateTaskInput): Promise<Task> => {
  return TaskModel.create(data);
};

const updateTask = async (
  id: string,
  data: UpdateTaskInput,
): Promise<Task | null> => {
  return TaskModel.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

const deleteTask = async (id: string): Promise<Task | null> => {
  return TaskModel.findByIdAndDelete(id);
};

export const taskService = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
