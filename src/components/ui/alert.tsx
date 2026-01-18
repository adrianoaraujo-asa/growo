import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-9 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
  {
    variants: {
      variant: {
        // Default with neutral styling
        default: "bg-background text-foreground border-border [&>svg]:text-foreground",
        
        // Solid variants (Sneat alert-solid-*)
        primary: "bg-primary text-primary-foreground border-primary [&>svg]:text-primary-foreground",
        success: "bg-success text-success-foreground border-success [&>svg]:text-success-foreground",
        warning: "bg-warning text-warning-foreground border-warning [&>svg]:text-warning-foreground",
        destructive: "bg-destructive text-destructive-foreground border-destructive [&>svg]:text-destructive-foreground",
        info: "bg-info text-info-foreground border-info [&>svg]:text-info-foreground",
        
        // Soft variants (light background with colored text)
        "soft-primary": "bg-primary/10 text-primary border-primary/20 [&>svg]:text-primary",
        "soft-success": "bg-success/10 text-success border-success/20 [&>svg]:text-success",
        "soft-warning": "bg-warning/10 text-warning border-warning/20 [&>svg]:text-warning",
        "soft-destructive": "bg-destructive/10 text-destructive border-destructive/20 [&>svg]:text-destructive",
        "soft-info": "bg-info/10 text-info border-info/20 [&>svg]:text-info",
        
        // Outline variants (border only)
        "outline-primary": "bg-transparent text-primary border-primary [&>svg]:text-primary",
        "outline-success": "bg-transparent text-success border-success [&>svg]:text-success",
        "outline-warning": "bg-transparent text-warning border-warning [&>svg]:text-warning",
        "outline-destructive": "bg-transparent text-destructive border-destructive [&>svg]:text-destructive",
        "outline-info": "bg-transparent text-info border-info [&>svg]:text-info",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn("mb-1 font-medium leading-none tracking-tight", className)} {...props} />
  ),
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
  ),
);
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription, alertVariants };
