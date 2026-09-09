import { apiFetch } from "@/lib/api";
import type { CreateTaskInput, UpdateTaskInput } from "@/schemas/tasks";
import type { Task } from "@/types/tasks";

export const getTasks = () => apiFetch<Task[]>("tasks");

export const getTaskById = (id: string) => apiFetch<Task>(`tasks/${id}`);

export const createTask = (data: CreateTaskInput) =>
  apiFetch<Task>("tasks", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateTask = (id: string, data: UpdateTaskInput) =>
  apiFetch<Task>(`tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteTask = (id: string) =>
  apiFetch<Task>(`tasks/${id}`, { method: "DELETE" });
