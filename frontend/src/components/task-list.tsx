import { ListChecksIcon, SearchXIcon, TriangleAlertIcon } from "lucide-react";
import type { UpdateTaskInput } from "@/schemas/tasks";
import type { Task } from "@/types/tasks";
import { TaskItem } from "./task-item";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  onRetry: () => void;
  onEdit: (id: string, data: UpdateTaskInput) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  showCreator?: boolean;
}

export function TaskList({
  tasks,
  loading,
  error,
  hasActiveFilters,
  onResetFilters,
  onRetry,
  onEdit,
  onDelete,
  showCreator,
}: TaskListProps) {
  if (loading) {
    return <TaskListSkeleton />;
  }

  if (error) {
    return <TaskListError message={error} onRetry={onRetry} />;
  }

  if (tasks.length === 0) {
    return (
      <TaskListEmpty
        hasActiveFilters={hasActiveFilters}
        onResetFilters={onResetFilters}
      />
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {tasks.map((task) => (
        <li key={task._id}>
          <TaskItem
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            showCreator={showCreator}
          />
        </li>
      ))}
    </ul>
  );
}

function TaskListSkeleton({ count = 10 }: { count?: number }) {
  return (
    <ul aria-label="Loading tasks" aria-busy className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i}>
          <Skeleton className="h-24 w-full" />
        </li>
      ))}
    </ul>
  );
}

interface TaskListEmptyProps {
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

// Says why the list is empty and what to do next, instead of a bare "No tasks"
function TaskListEmpty({
  hasActiveFilters,
  onResetFilters,
}: TaskListEmptyProps) {
  const Icon = hasActiveFilters ? SearchXIcon : ListChecksIcon;

  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-10 text-center">
      <Icon className="size-6 text-muted-foreground" aria-hidden />
      <p className="font-medium">
        {hasActiveFilters ? "No tasks match your filters" : "No tasks yet"}
      </p>
      {hasActiveFilters ? (
        <Button variant="outline" size="sm" onClick={onResetFilters}>
          Clear filters
        </Button>
      ) : (
        <p className="text-sm text-muted-foreground">
          Add one with the form above.
        </p>
      )}
    </div>
  );
}

interface TaskListErrorProps {
  message: string;
  onRetry: () => void;
}

function TaskListError({ message, onRetry }: TaskListErrorProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-10 text-center"
    >
      <TriangleAlertIcon className="size-6 text-destructive" aria-hidden />
      <p className="font-medium">Couldn&apos;t load tasks</p>
      <p className="text-sm text-muted-foreground">{message}</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}
