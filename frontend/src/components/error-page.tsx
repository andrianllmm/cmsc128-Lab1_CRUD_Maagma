import {
  Link,
  useRouter,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { TriangleAlertIcon } from "lucide-react";
import { ApiError } from "@/lib/api";
import { Button, buttonVariants } from "@/components/ui/button";
import { StatusPage } from "@/components/status-page";

/**
 * Replaces a page that failed to load or crashed.
 * API errors already have user-facing messages; anything else is a bug,
 * so its details stay in the console instead of on screen.
 * */
export function ErrorPage({ error, reset }: ErrorComponentProps) {
  const router = useRouter();

  const description =
    error instanceof ApiError
      ? error.message
      : "Something went wrong while showing this page.";

  function retry() {
    reset();
    // Reruns the failed loaders
    router.invalidate();
  }

  return (
    <StatusPage
      icon={TriangleAlertIcon}
      title="Couldn't load this page"
      description={description}
      actions={
        <>
          <Button onClick={retry}>Try again</Button>
          <Link to="/" className={buttonVariants({ variant: "outline" })}>
            Go to your tasks
          </Link>
        </>
      }
    />
  );
}
