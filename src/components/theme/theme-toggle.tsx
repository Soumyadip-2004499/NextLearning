"use client";

import * as React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./theme-provider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  variant?: "compact" | "full" | "pill";
  className?: string;
}

export function ThemeToggle({ variant = "compact", className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted && theme === "light";

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={(e) => toggleTheme(e)}
        className={cn(
          "w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl border transition-all duration-300 group text-xs font-mono active:scale-[0.98]",
          isLight
            ? "bg-black/[0.04] border-black/10 text-neutral-800 hover:border-[#eb0028] hover:bg-black/[0.07]"
            : "bg-white/[0.04] border-white/10 text-neutral-200 hover:border-[#eb0028] hover:bg-white/[0.08]",
          className
        )}
        title={isLight ? "Switch to Dark Matrix mode" : "Switch to Light Matrix mode"}
        aria-label="Toggle theme mode"
      >
        <div className="flex items-center gap-2.5">
          {isLight ? (
            <Sun className="h-4 w-4 text-amber-500 transition-transform duration-300 group-hover:rotate-45" />
          ) : (
            <Moon className="h-4 w-4 text-neutral-300 transition-transform duration-300 group-hover:-rotate-12" />
          )}
          <span className="font-dot tracking-wider text-[11px]">
            {isLight ? "LIGHT MODE" : "DARK MATRIX"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="red-dot" />
        </div>
      </button>
    );
  }

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={(e) => toggleTheme(e)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono transition-all duration-300 active:scale-95",
          isLight
            ? "border-black/15 bg-black/[0.04] text-neutral-900 hover:border-[#eb0028]"
            : "border-white/15 bg-white/[0.04] text-neutral-200 hover:border-[#eb0028]",
          className
        )}
        title={isLight ? "Switch to Dark Matrix mode" : "Switch to Light Matrix mode"}
        aria-label="Toggle theme mode"
      >
        {isLight ? (
          <Sun className="h-3.5 w-3.5 text-amber-500 transition-transform duration-300 group-hover:rotate-45" />
        ) : (
          <Moon className="h-3.5 w-3.5 text-neutral-300 transition-transform duration-300 group-hover:-rotate-12" />
        )}
        <span className="font-dot text-[10px] tracking-wider">
          {isLight ? "LIGHT" : "DARK"}
        </span>
        <span className="red-dot" />
      </button>
    );
  }

  // Compact variant (default)
  return (
    <button
      type="button"
      onClick={(e) => toggleTheme(e)}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-2xl border transition-all duration-300 group active:scale-90",
        isLight
          ? "border-black/10 bg-black/[0.04] text-neutral-800 hover:border-[#eb0028] hover:bg-black/[0.08]"
          : "border-white/10 bg-white/[0.04] text-neutral-200 hover:border-[#eb0028] hover:bg-white/[0.08]",
        className
      )}
      title={isLight ? "Switch to Dark Matrix mode" : "Switch to Light Matrix mode"}
      aria-label="Toggle theme mode"
    >
      {isLight ? (
        <Sun className="h-4 w-4 text-amber-500 transition-transform duration-300 group-hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 text-neutral-300 transition-transform duration-300 group-hover:-rotate-12" />
      )}
      <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#eb0028]" />
    </button>
  );
}
