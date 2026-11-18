import { Link } from "@tanstack/react-router";
import { MapPinOffIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { StatusPage } from "@/components/status-page";

export function NotFoundPage() {
  return (
    <StatusPage
      icon={MapPinOffIcon}
      title="Page not found"
      description="The link may be broken, or the page may have moved."
      actions={
        <Link to="/" className={buttonVariants()}>
          Go to your tasks
        </Link>
      }
    />
  );
}
