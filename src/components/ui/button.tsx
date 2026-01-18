import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Solid variants with Sneat-style shadows
        default: "bg-primary text-primary-foreground shadow-[0_0.125rem_0.25rem_0_rgba(105,108,255,0.4)] hover:bg-primary/90 hover:shadow-[0_0.25rem_1rem_0_rgba(105,108,255,0.5)] hover:-translate-y-0.5 active:translate-y-0 focus:bg-primary/85",
        destructive: "bg-destructive text-destructive-foreground shadow-[0_0.125rem_0.25rem_0_rgba(255,62,29,0.4)] hover:bg-destructive/90 hover:shadow-[0_0.25rem_1rem_0_rgba(255,62,29,0.5)] hover:-translate-y-0.5 active:translate-y-0",
        success: "bg-success text-success-foreground shadow-[0_0.125rem_0.25rem_0_rgba(113,221,55,0.4)] hover:bg-success/90 hover:shadow-[0_0.25rem_1rem_0_rgba(113,221,55,0.5)] hover:-translate-y-0.5 active:translate-y-0",
        warning: "bg-warning text-warning-foreground shadow-[0_0.125rem_0.25rem_0_rgba(255,171,0,0.4)] hover:bg-warning/90 hover:shadow-[0_0.25rem_1rem_0_rgba(255,171,0,0.5)] hover:-translate-y-0.5 active:translate-y-0",
        info: "bg-info text-info-foreground shadow-[0_0.125rem_0.25rem_0_rgba(3,195,236,0.4)] hover:bg-info/90 hover:shadow-[0_0.25rem_1rem_0_rgba(3,195,236,0.5)] hover:-translate-y-0.5 active:translate-y-0",
        secondary: "bg-secondary text-secondary-foreground shadow-[0_0.125rem_0.25rem_0_rgba(133,146,163,0.4)] hover:bg-secondary/90 hover:shadow-[0_0.25rem_1rem_0_rgba(133,146,163,0.5)] hover:-translate-y-0.5 active:translate-y-0",
        
        // Label variants (soft background with solid text) - Sneat style
        "label-primary": "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0.25rem_1rem_0_rgba(105,108,255,0.4)] hover:-translate-y-0.5",
        "label-destructive": "bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground hover:shadow-[0_0.25rem_1rem_0_rgba(255,62,29,0.4)] hover:-translate-y-0.5",
        "label-success": "bg-success/10 text-success hover:bg-success hover:text-success-foreground hover:shadow-[0_0.25rem_1rem_0_rgba(113,221,55,0.4)] hover:-translate-y-0.5",
        "label-warning": "bg-warning/10 text-warning hover:bg-warning hover:text-warning-foreground hover:shadow-[0_0.25rem_1rem_0_rgba(255,171,0,0.4)] hover:-translate-y-0.5",
        "label-info": "bg-info/10 text-info hover:bg-info hover:text-info-foreground hover:shadow-[0_0.25rem_1rem_0_rgba(3,195,236,0.4)] hover:-translate-y-0.5",
        "label-secondary": "bg-secondary/10 text-secondary hover:bg-secondary hover:text-secondary-foreground hover:shadow-[0_0.25rem_1rem_0_rgba(133,146,163,0.4)] hover:-translate-y-0.5",
        
        // Outline variants
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-primary/50 hover:-translate-y-0.5",
        "outline-primary": "border border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0.25rem_1rem_0_rgba(105,108,255,0.4)] hover:-translate-y-0.5",
        "outline-destructive": "border border-destructive text-destructive bg-transparent hover:bg-destructive hover:text-destructive-foreground hover:shadow-[0_0.25rem_1rem_0_rgba(255,62,29,0.4)] hover:-translate-y-0.5",
        "outline-success": "border border-success text-success bg-transparent hover:bg-success hover:text-success-foreground hover:shadow-[0_0.25rem_1rem_0_rgba(113,221,55,0.4)] hover:-translate-y-0.5",
        
        // Text variants (minimal styling)
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        "text-primary": "text-primary hover:bg-primary/10",
        "text-secondary": "text-secondary hover:bg-secondary/10",
      },
      size: {
        default: "h-[38px] px-5 py-2",
        xs: "h-[30px] rounded-md px-3 text-xs",
        sm: "h-[34px] rounded-md px-4 text-sm",
        lg: "h-[46px] rounded-md px-8 text-base",
        xl: "h-[54px] rounded-lg px-10 text-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-xs": "h-6 w-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
