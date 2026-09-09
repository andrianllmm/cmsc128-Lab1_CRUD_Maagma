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
      <Card
        role="button"
        onClick={() => setOpen(true)}
        className="cursor-pointer transition-colors hover:bg-muted"
      >
        <CardHeader>
          <div className="flex items-center gap-2">
            {/* Toggle mark as done */}
            <Checkbox
              aria-label={task.done ? "Mark as not done" : "Mark as done"}
              checked={task.done}
              onClick={(e) => e.stopPropagation()}
              onCheckedChange={(checked) =>
                onEdit(task._id, { done: checked === true })
              }
            />

            {/* Title */}
            <CardTitle
              className={cn(task.done && "text-muted-foreground line-through")}
            >
              {task.title}
            </CardTitle>
          </div>

          {/* Delete button */}
          <CardAction>
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
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
