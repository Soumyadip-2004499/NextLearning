"use client";

import * as React from "react";
import { useRef } from "react";
import {
  Cpu,
  HeartPulse,
  GraduationCap,
  Sprout,
  Leaf,
  Wrench,
  Briefcase,
  Palette,
  Utensils,
  Landmark,
  Users,
  Factory,
  Compass,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { CAREER_CATEGORIES } from "@/data/careers";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  Cpu,
  HeartPulse,
  GraduationCap,
  Sprout,
  Leaf,
  Wrench,
  Briefcase,
  Palette,
  Utensils,
  Landmark,
  Users,
  Factory,
  Compass,
};

export interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  counts?: Record<string, number>;
  className?: string;
}

export function CategoryFilter({
  selectedCategory,
  onSelectCategory,
  counts,
  className,
}: CategoryFilterProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -240 : 240;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const isAllSelected = selectedCategory === "all" || !selectedCategory;

  return (
    <div className={cn("relative w-full group/filter", className)}>
      {/* Left scroll control (desktop) */}
      <button
        type="button"
        onClick={() => scroll("left")}
        aria-label="Scroll left"
        className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 shadow-md opacity-0 group-hover/filter:opacity-100 transition-opacity duration-200 hover:bg-stone-50 dark:hover:bg-stone-800 cursor-pointer"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Categories container */}
      <div
        ref={scrollContainerRef}
        role="tablist"
        aria-label="Career Categories"
        className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* 'All' category button */}
        <button
          type="button"
          role="tab"
          aria-selected={isAllSelected}
          onClick={() => onSelectCategory("all")}
          className={cn(
            "flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-mono tracking-wider transition-all duration-200 shrink-0 snap-start cursor-pointer uppercase",
            isAllSelected
              ? "bg-foreground text-background font-semibold shadow-sm border border-foreground"
              : "border border-border bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground hover:border-primary/30"
          )}
        >
          <Compass className={cn("h-3.5 w-3.5 shrink-0", isAllSelected ? "text-background" : "text-[#eb0028]")} />
          <span>ALL SECTORS</span>
          {counts?.all !== undefined && (
            <span
              className={cn(
                "ml-1 text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold",
                isAllSelected
                  ? "bg-background text-foreground"
                  : "bg-muted text-foreground"
              )}
            >
              {counts.all}
            </span>
          )}
        </button>

        {/* Categories from CAREER_CATEGORIES */}
        {CAREER_CATEGORIES.map((cat) => {
          const IconComponent = ICON_MAP[cat.icon] || Compass;
          const isSelected = selectedCategory === cat.id;
          const count = counts?.[cat.id];

          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => onSelectCategory(cat.id)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-mono tracking-wider transition-all duration-200 shrink-0 snap-start cursor-pointer uppercase",
                isSelected
                  ? "bg-foreground text-background font-semibold shadow-sm border border-foreground"
                  : "border border-border bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground hover:border-primary/30"
              )}
            >
              <IconComponent
                className={cn(
                  "h-3.5 w-3.5 shrink-0",
                  isSelected ? "text-background" : "text-muted-foreground"
                )}
              />
              <span>{cat.label}</span>
              {count !== undefined && (
                <span
                  className={cn(
                    "ml-0.5 text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold",
                    isSelected
                      ? "bg-background text-foreground"
                      : "bg-muted text-foreground"
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Right scroll control (desktop) */}
      <button
        type="button"
        onClick={() => scroll("right")}
        aria-label="Scroll right"
        className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 shadow-md opacity-0 group-hover/filter:opacity-100 transition-opacity duration-200 hover:bg-stone-50 dark:hover:bg-stone-800 cursor-pointer"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
