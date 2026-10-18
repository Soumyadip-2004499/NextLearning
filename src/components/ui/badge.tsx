"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-[#eb0028] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10 text-neutral-900 dark:text-white backdrop-blur-md hover:bg-black/10 dark:hover:bg-white/15",
        secondary:
          "border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-neutral-900/90 text-neutral-800 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800",
        outline:
          "border-black/15 dark:border-white/20 text-neutral-800 dark:text-neutral-200 bg-black/[0.03] dark:bg-black/40 backdrop-blur-md hover:border-black/30 dark:hover:border-white/40",
        destructive:
          "border-transparent bg-[#eb0028] text-white shadow-[0_0_12px_rgba(235,0,40,0.5)] keep-white",
        success:
          "border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 shadow-xs",
        red:
          "border-red-200 dark:border-red-500/40 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-200 font-semibold shadow-xs",
        dot:
          "font-dot uppercase tracking-widest text-[10px] border-black/15 dark:border-white/20 bg-black/5 dark:bg-black/60 text-neutral-800 dark:text-neutral-200 px-2.5 py-0.5",
        tape:
          "font-mono uppercase tracking-widest text-[11px] border-dashed border-black/20 dark:border-white/25 bg-black/[0.04] dark:bg-neutral-950 text-neutral-800 dark:text-neutral-300 rounded-md px-2 py-0.5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
