import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import type { Task } from "@/types/tasks";
import type { CreateTaskInput, UpdateTaskInput } from "@/schemas/tasks";
import * as tasksApi from "@/api/tasks";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tasks removed from the list but not yet deleted server-side
  const pendingDeletes = useRef(new Map<string, Task>());

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks(options?: { silent?: boolean }) {
    if (!options?.silent) setLoading(true);
    try {
      const fetched = await tasksApi.getTasks();
      // Hide pending deletes
      setTasks(fetched.filter((t) => !pendingDeletes.current.has(t._id)));
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
    // Find task to delete
    const taskToDelete = tasks.find((t) => t._id === id);
    if (!taskToDelete) return false;

    // Remove task from state and stash it in case of undo
    setTasks((tasks) => tasks.filter((t) => t._id !== id));
    pendingDeletes.current.set(id, taskToDelete);

    // The actual delete only happens once the toast goes away
    toast(`Deleted "${taskToDelete.title}"`, {
      duration: 5000,
      action: {
        label: "Undo",
        onClick: () => undoDeleteTask(id),
      },
      onDismiss: () => finalizeDelete(id),
      onAutoClose: () => finalizeDelete(id),
    });

    return true;
  }

  async function finalizeDelete(id: string) {
    const task = pendingDeletes.current.get(id);
    if (!task) return;
    pendingDeletes.current.delete(id);

    try {
      await tasksApi.deleteTask(id);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete task");
      restoreTask(task);
    }
  }

  function undoDeleteTask(id: string) {
    const task = pendingDeletes.current.get(id);
    if (!task) return;
    pendingDeletes.current.delete(id);

    // Task was never actually deleted server-side so just put it back.
    restoreTask(task);
  }

  function restoreTask(task: Task) {
    // Insert task back into state
    setTasks((tasks) =>
      [...tasks, task].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      ),
    );
  }

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    undoDeleteTask,
  };
}
