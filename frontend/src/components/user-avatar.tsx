import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserAvatarProps {
  displayName: string;
  size?: "default" | "sm" | "lg";
  // Names the avatar for screen readers and shows on hover
  label?: string;
}

export function UserAvatar({ displayName, size, label }: UserAvatarProps) {
  return (
    <Avatar
      size={size}
      title={label}
      aria-label={label}
      role={label ? "img" : undefined}
    >
      <AvatarFallback aria-hidden={!!label}>
        {getInitials(displayName)}
      </AvatarFallback>
    </Avatar>
  );
}

// "Juan dela Cruz" -> "JC"
function getInitials(name: string) {
  const words = name.trim().split(/\s+/);
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : "";
  return (first + last).toUpperCase();
}
