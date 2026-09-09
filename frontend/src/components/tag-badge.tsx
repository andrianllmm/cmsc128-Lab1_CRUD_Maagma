import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import type { Tag } from "@/types/tasks";

const tagBadgeVariants = cva("", {
  variants: {
    tag: {
      Work: "",
      School: "",
      Personal: "",
      Others: "",
    },
  },
  defaultVariants: {
    tag: "Others",
  },
});

interface TagBadgeProps
  extends
    Omit<React.ComponentProps<typeof Badge>, "variant" | "children">,
    VariantProps<typeof tagBadgeVariants> {
  tag: Tag;
}

function TagBadge({ tag, className, ...props }: TagBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(tagBadgeVariants({ tag }), className)}
      {...props}
    >
      {tag}
    </Badge>
  );
}

export { TagBadge, tagBadgeVariants };
