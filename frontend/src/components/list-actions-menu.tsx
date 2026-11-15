import { useState } from "react";
import { EllipsisIcon, PencilIcon, TrashIcon } from "lucide-react";
import type { CreateListInput } from "@/schemas/lists";
import type { List } from "@/types/lists";
import { Button } from "@/components/ui/button";
import { ListNameForm } from "@/components/list-name-form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ListActionsMenuProps {
  list: List;
  onRename: (data: CreateListInput) => Promise<boolean>;
  onDelete: () => void;
}

/**
 * Rename and delete actions for a list the user owns.
 * */
export function ListActionsMenu({
  list,
  onRename,
  onDelete,
}: ListActionsMenuProps) {
  const [renaming, setRenaming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="List options"
              title="List options"
            />
          }
        >
          <EllipsisIcon />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setRenaming(true)}>
            <PencilIcon />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleting(true)}
          >
            <TrashIcon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Rename dialog */}
      <Dialog open={renaming} onOpenChange={setRenaming}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename list</DialogTitle>
          </DialogHeader>
          <ListNameForm
            name={list.name}
            submitLabel="Save"
            onSubmit={async (data) => {
              const ok = await onRename(data);
              if (ok) setRenaming(false);
              return ok;
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={deleting} onOpenChange={setDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="min-w-0 wrap-anywhere">
              Delete "{list.name}"?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Its tasks are deleted too, for every member. This can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={onDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
