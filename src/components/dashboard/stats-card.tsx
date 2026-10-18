"use client";

import * as React from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export interface StatsTrend {
  value: string;
  isPositive?: boolean;
  label?: string;
}

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: StatsTrend;
  description?: string;
  colorVariant?: "indigo" | "teal" | "amber" | "emerald" | "purple";
  href?: string;
  isLoading?: boolean;
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
  href,
  isLoading = false,
  className,
}: StatsCardProps) {
  if (isLoading) {
    return (
      <div className={cn("p-6 space-y-4 rounded-[24px] bg-card border border-border", className)}>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24 bg-muted" />
          <Skeleton className="h-10 w-10 rounded-xl bg-muted" />
        </div>
        <Skeleton className="h-10 w-28 bg-muted" />
        <Skeleton className="h-3 w-32 bg-muted" />
      </div>
    );
  }

  const content = (
    <div
      className={cn(
        "group relative overflow-hidden rounded-[24px] border border-border bg-card backdrop-blur-xl p-6 transition-all duration-300 hover:border-border/80 hover:shadow-xl hover:-translate-y-1",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="red-dot" />
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              {title}
            </p>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-dot text-3xl sm:text-4xl font-bold tracking-widest text-foreground group-hover:text-[#eb0028] transition-colors">
              {value}
            </span>
          </div>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-muted border border-border text-foreground transition-all duration-200 group-hover:border-[#eb0028] group-hover:text-[#eb0028] group-hover:shadow-[0_0_15px_rgba(235,0,40,0.3)]">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {/* Trend or description */}
      <div className="mt-4 flex items-center gap-2 font-mono text-[11px]">
        {trend ? (
          <>
            <span
              className={cn(
                "inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full border",
                trend.isPositive === true
                  ? "border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400"
                  : trend.isPositive === false
                  ? "border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400"
                  : "border-border bg-muted text-muted-foreground"
              )}
            >
              {trend.isPositive === true && <TrendingUp className="h-3 w-3" />}
              {trend.isPositive === false && <TrendingDown className="h-3 w-3" />}
              {trend.isPositive === undefined && <Minus className="h-3 w-3" />}
              {trend.value}
            </span>
            {trend.label && (
              <span className="text-muted-foreground">
                // {trend.label}
              </span>
            )}
          </>
        ) : description ? (
          <span className="text-muted-foreground line-clamp-1">
            // {description}
          </span>
        ) : null}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eb0028] rounded-[24px]">
        {content}
      </Link>
    );
  }

  return content;
}
