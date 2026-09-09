import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "cn";

interface FormFieldProps {
  htmlFor: string;
  label: string;
  error?: string;
  hideLabel?: boolean;
  className?: string;
  children: ReactNode;
}

export function FormField({
  htmlFor,
  label,
  error,
  hideLabel,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={htmlFor} className={cn(hideLabel && "sr-only")}>
        {label}
      </Label>
      {children}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
