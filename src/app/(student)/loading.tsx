import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentPortalLoading() {
  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300 min-h-[70vh]">
      {/* Top Telemetry & Sync Indicator Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border bg-card/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#eb0028] animate-ping" />
          <div className="flex flex-col">
            <span className="font-dot text-xs tracking-wider text-foreground uppercase">
              SYNCING WITH SUPABASE POSTGRES
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">
              FETCHING PERSONALIZED TELEMETRY & LEARNING DATA...
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-32 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-[#eb0028] animate-[shimmer_1.5s_infinite] w-2/3 rounded-full" />
          </div>
          <span className="text-[10px] font-mono text-neutral-500">// STREAMING</span>
        </div>
      </div>

      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64 rounded-xl bg-muted/80" />
        <Skeleton className="h-4 w-96 rounded-lg bg-muted/60" />
      </div>

      {/* 4 Stats Cards Bento Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border border-border bg-card/70 space-y-3 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-20 rounded bg-muted/80" />
              <Skeleton className="h-6 w-6 rounded-lg bg-muted/60" />
            </div>
            <Skeleton className="h-7 w-28 rounded-lg bg-muted/90" />
            <Skeleton className="h-2.5 w-36 rounded bg-muted/50" />
          </div>
        ))}
      </div>

      {/* Main Content Area Skeletons (2-column layout matching Dashboard & Radar) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2-column wide card */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-2xl border border-border bg-card/70 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2.5">
                <Skeleton className="h-4 w-4 rounded-full bg-muted" />
                <Skeleton className="h-4 w-44 rounded bg-muted/80" />
              </div>
              <Skeleton className="h-5 w-20 rounded-full bg-muted/60" />
            </div>
            <Skeleton className="h-5 w-3/4 rounded bg-muted/70" />
            <Skeleton className="h-3 w-full rounded bg-muted/50" />
            <Skeleton className="h-3 w-5/6 rounded bg-muted/50" />
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[1, 2, 3].map((step) => (
                <div key={step} className="p-3.5 rounded-xl border border-border/60 bg-muted/30 space-y-2">
                  <Skeleton className="h-3 w-16 rounded bg-muted/80" />
                  <Skeleton className="h-4 w-28 rounded bg-muted/70" />
                  <Skeleton className="h-2 w-full rounded bg-muted/40" />
                </div>
              ))}
            </div>
          </div>

          {/* Secondary Card Skeleton */}
          <div className="p-6 rounded-2xl border border-border bg-card/70 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <Skeleton className="h-4 w-36 rounded bg-muted/80" />
              <Skeleton className="h-4 w-24 rounded bg-muted/60" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2].map((card) => (
                <div key={card} className="p-4 rounded-xl border border-border/50 bg-muted/20 space-y-2.5">
                  <Skeleton className="h-4 w-32 rounded bg-muted/80" />
                  <Skeleton className="h-3 w-full rounded bg-muted/50" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-4 w-12 rounded bg-muted/60" />
                    <Skeleton className="h-4 w-16 rounded bg-muted/60" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1-column card */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl border border-border bg-card/70 space-y-4">
            <Skeleton className="h-4 w-32 rounded bg-muted/80" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/20">
                  <Skeleton className="h-8 w-8 rounded-lg bg-muted/70 shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-3 w-3/4 rounded bg-muted/80" />
                    <Skeleton className="h-2 w-1/2 rounded bg-muted/50" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
