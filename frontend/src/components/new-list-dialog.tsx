import { useState } from "react";
import { PlusIcon } from "lucide-react";
import type { CreateListInput } from "@/schemas/lists";
import { Button } from "@/components/ui/button";
import { ListNameForm } from "@/components/list-name-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface NewListDialogProps {
  onSubmit: (data: CreateListInput) => Promise<boolean>;
}

export function NewListDialog({ onSubmit }: NewListDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="New list"
            title="New list"
          />
        }
      >
        <PlusIcon />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>New list</DialogTitle>
          <DialogDescription>
            A collaborative list you can share with other users.
          </DialogDescription>
        </DialogHeader>

        <ListNameForm
          submitLabel="Create list"
          onSubmit={async (data) => {
            const ok = await onSubmit(data);
            if (ok) setOpen(false);
            return ok;
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
