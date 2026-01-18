import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center border font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        // Solid variants
        default: "border-transparent bg-primary text-primary-foreground shadow-sm",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow-sm",
        success: "border-transparent bg-success text-success-foreground shadow-sm",
        warning: "border-transparent bg-warning text-warning-foreground shadow-sm",
        info: "border-transparent bg-info text-info-foreground shadow-sm",
        
        // Label/Soft variants (Sneat bg-label-*)
        "label-primary": "border-transparent bg-primary/10 text-primary",
        "label-secondary": "border-transparent bg-secondary/10 text-secondary",
        "label-destructive": "border-transparent bg-destructive/10 text-destructive",
        "label-success": "border-transparent bg-success/10 text-success",
        "label-warning": "border-transparent bg-warning/10 text-warning",
        "label-info": "border-transparent bg-info/10 text-info",
        
        // Outline variants
        outline: "text-foreground border-border bg-transparent",
        "outline-primary": "text-primary border-primary bg-transparent",
        "outline-secondary": "text-secondary border-secondary bg-transparent",
        "outline-destructive": "text-destructive border-destructive bg-transparent",
        "outline-success": "text-success border-success bg-transparent",
        "outline-warning": "text-warning border-warning bg-transparent",
        "outline-info": "text-info border-info bg-transparent",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs rounded-full",
        sm: "px-2 py-0.5 text-[10px] rounded-full",
        lg: "px-3 py-1 text-sm rounded-full",
        // Pill style for counts
        pill: "px-2 py-0.5 text-xs rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { Badge, badgeVariants };
