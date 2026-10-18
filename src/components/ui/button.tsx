import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eb0028] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "bg-neutral-900 text-white font-semibold shadow-sm hover:bg-neutral-800 border border-neutral-800 dark:bg-white dark:text-black dark:border-white/40 dark:hover:bg-neutral-200",
        destructive:
          "bg-[#eb0028] text-white shadow-sm hover:bg-red-700",
        outline:
          "border border-black/10 dark:border-white/15 bg-black/[0.03] dark:bg-white/[0.04] backdrop-blur-md text-foreground dark:text-white shadow-sm hover:bg-black/[0.06] dark:hover:bg-white/10 hover:border-black/20 dark:hover:border-white/30",
        secondary:
          "bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-white/10 hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white",
        ghost:
          "text-neutral-700 dark:text-neutral-300 hover:bg-black/[0.05] dark:hover:bg-white/[0.07] hover:text-black dark:hover:text-white",
        link: "text-[#eb0028] underline-offset-4 hover:underline",
        gradient:
          "bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-700 text-white dark:from-white dark:via-neutral-100 dark:to-neutral-200 dark:text-black font-semibold shadow-lg hover:shadow-[0_0_25px_rgba(235,0,40,0.2)] hover:opacity-95",
        red:
          "bg-[#eb0028] text-white font-semibold shadow-[0_0_20px_-3px_rgba(235,0,40,0.5)] hover:bg-[#d00024] hover:shadow-[0_0_25px_rgba(235,0,40,0.7)] keep-white",
        dot:
          "font-dot uppercase tracking-widest bg-black/[0.03] dark:bg-white/[0.05] border border-black/15 dark:border-white/20 text-foreground dark:text-white hover:border-[#eb0028] hover:text-[#eb0028] hover:bg-red-500/10",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-xl px-3.5 text-xs",
        lg: "h-13 rounded-2xl px-8 text-base",
        icon: "h-11 w-11 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
