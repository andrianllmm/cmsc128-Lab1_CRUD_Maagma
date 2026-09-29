import { useState } from "react";
import { formatRelative } from "date-fns";
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Card className="relative transition-colors hover:bg-muted/50">
        <CardHeader>
          <div className="flex min-w-0 items-center gap-2">
            {/* Toggle mark as done */}
            <Checkbox
              aria-label={task.done ? "Mark as not done" : "Mark as done"}
              checked={task.done}
              onCheckedChange={(checked) =>
                onEdit(task._id, { done: checked === true })
              }
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

        <CardContent className="flex flex-wrap items-center gap-2">
          {/* Due date */}
          {task.dueDate && (
            <span className="text-sm text-muted-foreground">
              {formatRelative(new Date(task.dueDate), new Date())}
            </span>
          )}

          {/* Priority */}
          <PriorityBadge priority={task.priority} />

          {/* Tag */}
          <TagBadge tag={task.tag} />
        </CardContent>
      </Card>

      {/* Edit task dialog */}
      <DialogContent>
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
