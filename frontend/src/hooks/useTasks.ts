import { useState } from "react";
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import type { CreateTaskInput, UpdateTaskInput } from "@/schemas/tasks";
import * as tasksApi from "@/api/tasks";

export const tasksQueryOptions = queryOptions({
  queryKey: ["tasks"],
  queryFn: tasksApi.getTasks,
});

export function useTasks() {
  const queryClient = useQueryClient();

  // Tasks hidden from the list but not yet deleted server-side
  const [pendingDeletes, setPendingDeletes] = useState<ReadonlySet<string>>(
    new Set(),
  );

  const { data, isPending, error } = useQuery({
    ...tasksQueryOptions,
    // Hide pending deletes
    select: (tasks) => tasks.filter((t) => !pendingDeletes.has(t._id)),
  });

  const invalidateTasks = () =>
    queryClient.invalidateQueries({ queryKey: tasksQueryOptions.queryKey });

  const createMutation = useMutation({
    mutationFn: tasksApi.createTask,
    onSuccess: invalidateTasks,
    onError: (err) => toast.error(err.message || "Failed to create task"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskInput }) =>
      tasksApi.updateTask(id, data),
    onSuccess: invalidateTasks,
    onError: (err) => toast.error(err.message || "Failed to update task"),
  });

  const deleteMutation = useMutation({
    mutationFn: tasksApi.deleteTask,
    onSuccess: (_, id) => {
      // Drop the task from the cache before it stops being hidden
      queryClient.setQueryData(tasksQueryOptions.queryKey, (tasks) =>
        tasks?.filter((t) => t._id !== id),
      );
    },
    onError: (err) => toast.error(err.message || "Failed to delete task"),
    // On error, un-hiding restores the task
    onSettled: (_, __, id) => unhide(id),
  });

  function hide(id: string) {
    setPendingDeletes((ids) => new Set(ids).add(id));
  }

  function unhide(id: string) {
    setPendingDeletes((ids) => {
      const next = new Set(ids);
      next.delete(id);
      return next;
    });
  }

  async function createTask(data: CreateTaskInput) {
    try {
      await createMutation.mutateAsync(data);
      return true;
    } catch {
      return false;
    }
  }

  async function updateTask(id: string, data: UpdateTaskInput) {
    try {
      await updateMutation.mutateAsync({ id, data });
      return true;
    } catch {
      return false;
    }
  }

  async function deleteTask(id: string) {
    // Find task to delete
    const taskToDelete = data?.find((t) => t._id === id);
    if (!taskToDelete) return false;

    // Hide task from the list; it stays in the cache in case of undo
    hide(id);

    // Ensures only one of undo or delete runs
    let settled = false;

    // The actual delete only happens once the toast goes away
    function finalizeDelete() {
      if (settled) return;
      settled = true;
      deleteMutation.mutate(id);
    }

    // Task was never actually deleted server-side so just un-hide it
    function undoDelete() {
      if (settled) return;
      settled = true;
      unhide(id);
    }

    toast(`Deleted "${taskToDelete.title}"`, {
      duration: 5000,
      action: {
        label: "Undo",
        onClick: undoDelete,
      },
      onDismiss: finalizeDelete,
      onAutoClose: finalizeDelete,
    });

    return true;
  }

  return {
    tasks: data ?? [],
    loading: isPending,
    // Keep showing cached tasks if only a background refetch failed
    error: data ? null : (error?.message ?? null),
    createTask,
    updateTask,
    deleteTask,
  };
}
