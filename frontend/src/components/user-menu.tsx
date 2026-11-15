import { Link } from "@tanstack/react-router";
import { LogOutIcon, SettingsIcon, SunMoonIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@/types/users";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { UserAvatar } from "@/components/user-avatar";

interface UserMenuProps {
  user: User;
}

export function UserMenu({ user }: UserMenuProps) {
  const { logout } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label="Open user menu"
          />
        }
      >
        <UserAvatar displayName={user.displayName} />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {/* Profile details; links to the profile page */}
        <DropdownMenuItem render={<Link to="/profile" />}>
          <UserAvatar displayName={user.displayName} />
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-medium">{user.displayName}</span>
            <span className="truncate text-xs text-muted-foreground">
              {user.email}
            </span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link to="/settings" />}>
            <SettingsIcon />
            Settings
          </DropdownMenuItem>

          {/* Not a menu item, so it doesn't close the menu */}
          <div className="flex items-center justify-between gap-2 px-1.5 py-1 text-sm">
            <span className="flex items-center gap-1.5">
              <SunMoonIcon className="size-4" />
              Theme
            </span>
            <ThemeSwitcher />
          </div>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={logout}>
          <LogOutIcon />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
