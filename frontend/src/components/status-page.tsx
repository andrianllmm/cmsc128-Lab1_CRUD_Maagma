import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface StatusPageProps {
  icon: LucideIcon;
  title: string;
  description: string;
  // Ways forward, so the page is never a dead end
  actions: ReactNode;
}

/**
 * Full-page message for not found and error states.
 * */
export function StatusPage({
  icon: Icon,
  title,
  description,
  actions,
}: StatusPageProps) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6">
      <div className="flex w-full max-w-sm flex-col items-center gap-4 text-center">
        <Icon className="size-8 text-muted-foreground" aria-hidden />
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">{actions}</div>
      </div>
    </div>
  );
}
