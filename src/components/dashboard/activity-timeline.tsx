"use client";

import * as React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  BookOpen,
  Bookmark,
  Compass,
  Users,
  Award,
  Clock,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ActivityType =
  | "milestone"
  | "learning"
  | "opportunity"
  | "career"
  | "community";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string | Date;
  href?: string;
}

export interface ActivityTimelineProps {
  activities?: ActivityItem[];
  className?: string;
}

const typeConfig: Record<
  ActivityType,
  {
    icon: React.ComponentType<{ className?: string }>;
    tag: string;
    tagColor: string;
  }
> = {
  milestone: {
    icon: CheckCircle2,
    tag: "MILESTONE",
    tagColor: "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
  },
  learning: {
    icon: BookOpen,
    tag: "LEARNING",
    tagColor: "border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-500/10",
  },
  opportunity: {
    icon: Award,
    tag: "SCHEME",
    tagColor: "border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10",
  },
  career: {
    icon: Compass,
    tag: "CAREER",
    tagColor: "border-red-500/30 text-red-600 dark:text-red-400 bg-red-500/10",
  },
  community: {
    icon: Users,
    tag: "MENTOR",
    tagColor: "border-purple-500/30 text-purple-600 dark:text-purple-400 bg-purple-500/10",
  },
};

function formatTimestamp(time: string | Date): string {
  if (typeof time === "string" && !time.includes("-")) {
    return time;
  }
  const date = new Date(time);
  if (isNaN(date.getTime())) return String(time);

  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 1) return "JUST NOW";
  if (diffInHours < 24) return `${diffInHours}H AGO`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}D AGO`;

  return date.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  }).toUpperCase();
}

export function ActivityTimeline({
  activities = [],
  className,
}: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[20px] border border-dashed border-border p-8 text-center bg-card/50">
        <Clock className="h-6 w-6 text-muted-foreground" />
        <h4 className="mt-3 font-mono text-xs font-semibold text-foreground uppercase tracking-wider">
          // NO TELEMETRY LOGS
        </h4>
        <p className="mt-1 text-xs text-muted-foreground max-w-xs font-sans">
          Explore careers, resume milestones, or save schemes to record events here.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("relative pl-2 space-y-6 font-mono text-xs", className)}>
      {/* Dotted Vertical Connector Line */}
      <div className="absolute left-4 top-2 bottom-2 w-px border-l border-dashed border-border" />

      {activities.map((item) => {
        const config = typeConfig[item.type] || typeConfig.milestone;
        const Icon = config.icon;

        return (
          <div key={item.id} className="relative flex items-start gap-4 group">
            {/* Dot Node */}
            <div className="relative z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-card border border-border group-hover:border-[#eb0028] transition-colors shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-foreground group-hover:bg-[#eb0028]" />
            </div>

            {/* Event Content Box */}
            <div className="flex-1 rounded-2xl bg-card border border-border p-3.5 transition-all group-hover:border-primary/40 text-card-foreground shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className={cn("text-[9px] uppercase px-2 py-0.5 rounded-full border", config.tagColor)}>
                  {config.tag}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {formatTimestamp(item.timestamp)}
                </span>
              </div>

              <h4 className="text-xs font-bold text-foreground group-hover:text-red-500 transition-colors">
                {item.title}
              </h4>
              <p className="text-[11px] text-muted-foreground font-sans mt-0.5 leading-relaxed">
                {item.description}
              </p>

              {item.href && (
                <Link
                  href={item.href}
                  className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-[#eb0028] hover:underline uppercase tracking-wider"
                >
                  <span>VIEW SPEC</span>
                  <ArrowRight className="h-2.5 w-2.5" />
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
