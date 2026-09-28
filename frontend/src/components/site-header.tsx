import { Link } from "@tanstack/react-router";
import { ListTodoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="mx-auto flex h-12 max-w-xl items-center justify-between gap-2 px-4 sm:px-6">
        {/* App title */}
        <h1>
          <Button
            variant="ghost"
            className="-ml-2.5 text-base font-semibold"
            render={<Link to="/" />}
            nativeButton={false}
          >
            <ListTodoIcon />
            To-Do List
          </Button>
        </h1>

        <ThemeSwitcher />
      </div>
    </header>
  );
}
