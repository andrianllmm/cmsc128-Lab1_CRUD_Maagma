import { Loader2Icon } from "lucide-react";

/**
 * Shown while a page's data loads, so a slow connection isn't a blank screen.
 * */
export function PagePending() {
  return (
    <div
      role="status"
      className="flex flex-1 items-center justify-center gap-2 p-8 text-sm text-muted-foreground"
    >
      <Loader2Icon className="size-4 animate-spin" aria-hidden />
      Loading…
    </div>
  );
}
