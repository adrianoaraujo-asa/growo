import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-lg bg-card text-card-foreground",
  {
    variants: {
      variant: {
        default: "border border-border/50 shadow-[0_2px_6px_0_rgba(67,89,113,0.12)]",
        elevated: "border border-border/30 shadow-[0_4px_24px_0_rgba(67,89,113,0.1)]",
        flat: "border border-border",
        ghost: "border-0 shadow-none bg-transparent",
        // Sneat border-shadow style with colored bottom border
        "border-primary": "border border-border/50 shadow-[0_2px_6px_0_rgba(67,89,113,0.12)] border-b-2 border-b-primary",
        "border-success": "border border-border/50 shadow-[0_2px_6px_0_rgba(67,89,113,0.12)] border-b-2 border-b-success",
        "border-warning": "border border-border/50 shadow-[0_2px_6px_0_rgba(67,89,113,0.12)] border-b-2 border-b-warning",
        "border-danger": "border border-border/50 shadow-[0_2px_6px_0_rgba(67,89,113,0.12)] border-b-2 border-b-destructive",
        "border-info": "border border-border/50 shadow-[0_2px_6px_0_rgba(67,89,113,0.12)] border-b-2 border-b-info",
      },
      hover: {
        none: "",
        lift: "hover:-translate-y-1",
        glow: "hover:shadow-[0_0_20px_rgba(105,108,255,0.15)]",
        border: "hover:border-primary/50",
      },
    },
    defaultVariants: {
      variant: "default",
      hover: "none",
    },
  }
);

export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, hover, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn(cardVariants({ variant, hover }), className)} 
      {...props} 
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-5 pb-0", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn("text-lg font-medium leading-none tracking-tight text-heading", className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-5", className)} {...props} />,
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-5 pt-0", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants };
