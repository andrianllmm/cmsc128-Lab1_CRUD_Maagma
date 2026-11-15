import { useForm } from "@tanstack/react-form";
import type { z } from "zod";
import { Loader2Icon, UsersIcon } from "lucide-react";
import { addMemberSchema, type AddMemberInput } from "@/schemas/lists";
import type { List, ListUser } from "@/types/lists";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ListMembersDialogProps {
  list: List;
  isOwner: boolean;
  onAddMember: (data: AddMemberInput) => Promise<boolean>;
}

export function ListMembersDialog({
  list,
  isOwner,
  onAddMember,
}: ListMembersDialogProps) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Members"
            title="Members"
          />
        }
      >
        <UsersIcon />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="min-w-0 wrap-anywhere">
            {list.name}
          </DialogTitle>
          <DialogDescription>
            Everyone here can view and edit this list&apos;s tasks.
          </DialogDescription>
        </DialogHeader>

        <ul className="flex flex-col gap-2">
          <MemberItem user={list.owner} isOwner />
          {list.members.map((member) => (
            <MemberItem key={member._id} user={member} />
          ))}
        </ul>

        {/* The backend also rejects non-owners */}
        {isOwner && <AddMemberForm onSubmit={onAddMember} />}
      </DialogContent>
    </Dialog>
  );
}

function MemberItem({ user, isOwner }: { user: ListUser; isOwner?: boolean }) {
  return (
    <li className="flex flex-row items-center justify-between gap-2">
      <div className="flex min-w-0 flex-col">
        <span className="truncate font-medium">{user.displayName}</span>
        <span className="truncate text-muted-foreground">{user.email}</span>
      </div>
      {isOwner && <Badge variant="secondary">Owner</Badge>}
    </li>
  );
}

type AddMemberFormValues = z.input<typeof addMemberSchema>;

function AddMemberForm({
  onSubmit,
}: {
  onSubmit: (data: AddMemberInput) => Promise<boolean>;
}) {
  const defaultValues: AddMemberFormValues = { email: "" };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: addMemberSchema,
    },
    onSubmit: async ({ value }) => {
      const data = addMemberSchema.parse(value);
      if (await onSubmit(data)) form.reset();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-row items-start gap-2"
    >
      <form.Field name="email">
        {(field) => (
          <FormField
            htmlFor="memberEmail"
            label="Add member by email"
            error={field.state.meta.errors[0]?.message}
            className="flex-1"
          >
            <Input
              id="memberEmail"
              type="email"
              placeholder="friend@example.com"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </FormField>
        )}
      </form.Field>

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          // Lines up with the input below the label
          <Button type="submit" className="mt-6" disabled={isSubmitting}>
            {isSubmitting && <Loader2Icon className="animate-spin" />}
            Add
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
