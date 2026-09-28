import { TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TaskDeleteConfirmDialogProps {
  taskTitle: string;
  onConfirm: () => void;
}

export function TaskDeleteConfirmDialog({
  taskTitle,
  onConfirm,
}: TaskDeleteConfirmDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="hover:text-destructive"
            aria-label={`Delete "${taskTitle}"`}
          />
        }
      >
        <TrashIcon />
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete "{taskTitle}"?</AlertDialogTitle>
          <AlertDialogDescription>
            You can undo this for a few seconds after deleting.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
