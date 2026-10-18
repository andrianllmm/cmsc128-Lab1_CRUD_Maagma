import type { Request, Response } from "express";

import { taskService } from "./tasks.service.js";
import type {
  TaskIdInput,
  CreateTaskInput,
  UpdateTaskInput,
} from "./tasks.schema.js";

const getTasks = async (req: Request, res: Response) => {
  const tasks = await taskService.getTasks(req.session.userId!);
  res.json(tasks);
};

const getTaskById = async (req: Request<TaskIdInput>, res: Response) => {
  const task = await taskService.getTaskById(
    req.session.userId!,
    req.params.id,
  );

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json(task);
};

const createTask = async (
  req: Request<unknown, unknown, CreateTaskInput>,
  res: Response,
) => {
  const task = await taskService.createTask(req.session.userId!, req.body);
  res.status(201).json(task);
};

const updateTask = async (
  req: Request<TaskIdInput, unknown, UpdateTaskInput>,
  res: Response,
) => {
  const task = await taskService.updateTask(
    req.session.userId!,
    req.params.id,
    req.body,
  );

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json(task);
};

const deleteTask = async (req: Request<TaskIdInput>, res: Response) => {
  const task = await taskService.deleteTask(req.session.userId!, req.params.id);

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
