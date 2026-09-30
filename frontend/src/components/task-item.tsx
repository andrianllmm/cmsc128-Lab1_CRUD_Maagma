import { useState } from "react";
import { isPast } from "date-fns";
import { formatDueDate } from "@/lib/dates";
import type { UpdateTaskInput } from "@/schemas/tasks";
import type { Task } from "@/types/tasks";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { PriorityBadge } from "@/components/priority-badge";
import { TagBadge } from "@/components/tag-badge";
import { TaskForm } from "@/components/task-form";
import { TaskDeleteConfirmDialog } from "@/components/task-delete-confirm-dialog";
import { cn } from "cn";

interface TaskItemProps {
  task: Task;
  onEdit: (id: string, data: UpdateTaskInput) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

export function TaskItem({ task, onEdit, onDelete }: TaskItemProps) {
  const [open, setOpen] = useState(false);
  // Disables the checkbox while its update is saving
  const [toggling, setToggling] = useState(false);

  async function toggleDone(done: boolean) {
    setToggling(true);
    await onEdit(task._id, { done });
    setToggling(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Card className="relative transition-colors hover:bg-muted/50">
        <CardHeader>
          <div className="flex min-w-0 items-center gap-2">
            {/* Toggle mark as done */}
            <Checkbox
              aria-label={task.done ? "Mark as not done" : "Mark as done"}
              checked={task.done}
              disabled={toggling}
              onCheckedChange={(checked) => toggleDone(checked === true)}
              className="relative z-10"
            />

            {/* Title; its overlay makes the whole card open the edit dialog */}
            <CardTitle
              className={cn(
                "min-w-0 wrap-anywhere",
                task.done && "text-muted-foreground line-through",
              )}
            >
              <DialogTrigger className="cursor-pointer text-left outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:after:ring-2 focus-visible:after:ring-ring/50">
                {task.title}
              </DialogTrigger>
            </CardTitle>
          </div>

          {/* Delete button */}
          <CardAction className="relative z-10">
            <TaskDeleteConfirmDialog
              taskTitle={task.title}
              onConfirm={() => onDelete(task._id)}
            />
          </CardAction>
        </CardHeader>

        {/* Hidden when there's no details to show */}
        <CardContent className="flex flex-wrap items-center gap-2 empty:hidden">
          {/* Due date */}
          {task.dueDate && (
            <span
              className={cn(
                "text-sm text-muted-foreground",
                // Overdue if past due and not done
                !task.done &&
                  isPast(new Date(task.dueDate)) &&
                  "text-destructive",
              )}
            >
              {formatDueDate(new Date(task.dueDate))}
            </span>
          )}

          {/* Priority; hidden if default */}
          {task.priority !== "None" && (
            <PriorityBadge priority={task.priority} />
          )}

          {/* Tag; hidden if default */}
          {task.tag !== "Others" && <TagBadge tag={task.tag} />}
        </CardContent>
      </Card>

      {/* Edit task dialog */}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit task</DialogTitle>
        </DialogHeader>

        <TaskForm
          task={task}
          submitLabel="Save"
          onSubmit={async (data) => {
            const ok = await onEdit(task._id, data);
            if (ok) setOpen(false);
            return ok;
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
