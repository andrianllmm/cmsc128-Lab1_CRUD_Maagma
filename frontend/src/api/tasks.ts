import { apiFetch } from "@/lib/api";
import type { CreateTaskInput, UpdateTaskInput } from "@/schemas/tasks";
import type { Task } from "@/types/tasks";

// Tasks are nested under the list they belong to
const tasksPath = (listId: string) => `lists/${listId}/tasks`;

export const getTasks = (listId: string) => apiFetch<Task[]>(tasksPath(listId));

export const getTaskById = (listId: string, id: string) =>
  apiFetch<Task>(`${tasksPath(listId)}/${id}`);

export const createTask = (listId: string, data: CreateTaskInput) =>
  apiFetch<Task>(tasksPath(listId), {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateTask = (listId: string, id: string, data: UpdateTaskInput) =>
  apiFetch<Task>(`${tasksPath(listId)}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteTask = (listId: string, id: string) =>
  apiFetch<Task>(`${tasksPath(listId)}/${id}`, { method: "DELETE" });
