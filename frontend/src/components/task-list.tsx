import type { UpdateTaskInput } from "@/schemas/tasks";
import type { Task } from "@/types/tasks";
import { TaskItem } from "./task-item";
import { Skeleton } from "./ui/skeleton";

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  hasActiveFilters: boolean;
  onEdit: (id: string, data: UpdateTaskInput) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

export function TaskList({
  tasks,
  loading,
  error,
  hasActiveFilters,
  onEdit,
  onDelete,
}: TaskListProps) {
  if (loading) {
    return <TaskListSkeleton />;
  }

  if (error) {
    return <TaskListError message={error} />;
  }

  if (tasks.length === 0) {
    return <TaskListEmpty hasActiveFilters={hasActiveFilters} />;
  }

  return (
    <ul className="flex flex-col gap-3">
      {tasks.map((task) => (
        <li key={task._id}>
          <TaskItem task={task} onEdit={onEdit} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  );
}

function TaskListSkeleton({ count = 10 }: { count?: number }) {
  return (
    <ul className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i}>
          <Skeleton className="h-24 w-full" />
        </li>
      ))}
    </ul>
  );
}

function TaskListEmpty({ hasActiveFilters }: { hasActiveFilters: boolean }) {
  return (
    <div className="text-center">
      {hasActiveFilters ? "No tasks match your filters" : "No tasks"}
    </div>
  );
}

function TaskListError({ message }: { message: string }) {
  return <div className="text-center text-destructive">{message}</div>;
}
