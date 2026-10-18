import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function FacilitatorPortalLoading() {
  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300 min-h-[70vh]">
      {/* Top Facilitator Telemetry Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border bg-card/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <div className="flex flex-col">
            <span className="font-dot text-xs tracking-wider text-foreground uppercase">
              FACILITATOR TELEMETRY // COHORT SYNC
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">
              FETCHING ROSTER, MODULE STATUS & COMMUNITY METRICS FROM SUPABASE...
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-32 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 animate-[shimmer_1.5s_infinite] w-3/4 rounded-full" />
          </div>
          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">// SYNCING</span>
        </div>
      </div>

      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-72 rounded-xl bg-muted/80" />
          <Skeleton className="h-4 w-96 rounded-lg bg-muted/60" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-36 rounded-xl bg-muted/70" />
          <Skeleton className="h-10 w-36 rounded-xl bg-muted/70" />
        </div>
      </div>

      {/* 4 Facilitator Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border border-border bg-card/70 space-y-3 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-24 rounded bg-muted/80" />
              <Skeleton className="h-6 w-6 rounded-lg bg-muted/60" />
            </div>
            <Skeleton className="h-7 w-20 rounded-lg bg-muted/90" />
            <Skeleton className="h-2.5 w-32 rounded bg-muted/50" />
          </div>
        ))}
      </div>

      {/* Main Roster / Modules Content Skeleton */}
      <div className="p-6 rounded-2xl border border-border bg-card/70 space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-border/60">
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-4 rounded-full bg-muted" />
            <Skeleton className="h-5 w-48 rounded bg-muted/80" />
          </div>
          <Skeleton className="h-8 w-44 rounded-xl bg-muted/60" />
        </div>

        {/* List items */}
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((row) => (
            <div
              key={row}
              className="p-4 rounded-xl border border-border/50 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl bg-muted/70 shrink-0" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-40 rounded bg-muted/80" />
                  <Skeleton className="h-3 w-64 rounded bg-muted/50" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-20 rounded-full bg-muted/60" />
                <Skeleton className="h-8 w-24 rounded-lg bg-muted/70" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
