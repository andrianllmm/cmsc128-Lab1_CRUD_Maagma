import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { Task } from "@/types/tasks";
import type { CreateTaskInput, UpdateTaskInput } from "@/schemas/tasks";
import * as tasksApi from "@/api/tasks";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks(options?: { silent?: boolean }) {
    if (!options?.silent) setLoading(true);
    try {
      setTasks(await tasksApi.getTasks());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      if (!options?.silent) setLoading(false);
    }
  }

  async function createTask(data: CreateTaskInput) {
    try {
      await tasksApi.createTask(data);
      await fetchTasks({ silent: true });
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create task");
      return false;
    }
  }

  async function updateTask(id: string, data: UpdateTaskInput) {
    try {
      await tasksApi.updateTask(id, data);
      await fetchTasks({ silent: true });
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update task");
      return false;
    }
  }

  async function deleteTask(id: string) {
    try {
      await tasksApi.deleteTask(id);
      await fetchTasks({ silent: true });
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete task");
      return false;
    }
  }

  return { tasks, loading, error, createTask, updateTask, deleteTask };
}
