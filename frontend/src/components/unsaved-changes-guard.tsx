import { useBlocker } from "@tanstack/react-router";
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

interface UnsavedChangesGuardProps {
  // Whether there are unsaved changes
  when: boolean;
}

/**
 * Asks before leaving the page while there are unsaved changes.
 * In-app navigation shows a dialog; closing/reloading shows the browser's prompt.
 * */
export function UnsavedChangesGuard({ when }: UnsavedChangesGuardProps) {
  const blocker = useBlocker({
    shouldBlockFn: ({ next }) => {
      // Logging out goes to login. It has already happened, so let it through
      return when && next.fullPath !== "/login";
    },
    enableBeforeUnload: when,
    withResolver: true,
  });

  return (
    <AlertDialog
      open={blocker.status === "blocked"}
      onOpenChange={(open) => !open && blocker.reset?.()}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Discard unsaved changes?</AlertDialogTitle>
          <AlertDialogDescription>
            You have changes that haven&apos;t been saved. If you leave, they
            will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Keep editing</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => blocker.proceed?.()}
          >
            Discard
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
