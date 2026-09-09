import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import type { Priority } from "@/types/tasks";

const priorityBadgeVariants = cva("", {
  variants: {
    priority: {
      High: "border-transparent bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400",
      Medium:
        "border-transparent bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
      Low: "border-transparent bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
      None: "",
    },
  },
  defaultVariants: {
    priority: "None",
  },
});

interface PriorityBadgeProps
  extends
    Omit<React.ComponentProps<typeof Badge>, "variant" | "children">,
    VariantProps<typeof priorityBadgeVariants> {
  priority: Priority;
}

function PriorityBadge({ priority, className, ...props }: PriorityBadgeProps) {
  return (
    <Badge
      variant={priority === "None" ? "outline" : "default"}
      className={cn(priorityBadgeVariants({ priority }), className)}
      {...props}
    >
      {priority}
    </Badge>
  );
}

export { PriorityBadge, priorityBadgeVariants };
