import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "primary" | "success" | "danger" | "warning" | "info" | "secondary";

interface StatusBadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: "bg-primary/15 text-primary",
  success: "bg-success/15 text-success",
  danger: "bg-destructive/15 text-destructive",
  warning: "bg-warning/15 text-warning",
  info: "bg-info/15 text-info",
  secondary: "bg-secondary/15 text-secondary",
};

export function StatusBadge({ variant, children, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
