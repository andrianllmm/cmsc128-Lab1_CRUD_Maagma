import type { Request, Response } from "express";

import { taskService } from "./tasks.service.js";
import type {
  TaskIdInput,
  CreateTaskInput,
  UpdateTaskInput,
} from "./tasks.schema.js";

const getTasks = async (req: Request, res: Response) => {
  const tasks = await taskService.getTasks();
  res.json(tasks);
};

const getTaskById = async (req: Request<TaskIdInput>, res: Response) => {
  const task = await taskService.getTaskById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json(task);
};

const createTask = async (
  req: Request<unknown, unknown, CreateTaskInput>,
  res: Response,
) => {
  const task = await taskService.createTask(req.body);
  res.status(201).json(task);
};

const updateTask = async (
  req: Request<TaskIdInput, unknown, UpdateTaskInput>,
  res: Response,
) => {
  const task = await taskService.updateTask(req.params.id, req.body);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json(task);
};

const deleteTask = async (req: Request<TaskIdInput>, res: Response) => {
  const task = await taskService.deleteTask(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json(task);
};

export const taskController = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
