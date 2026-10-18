"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles, Tag, CheckCircle2 } from "lucide-react";
import { CareerCard as CareerCardType } from "@/types";
import { getCategoryById } from "@/data/careers";
import { cn } from "@/lib/utils";

const CATEGORY_STYLES: Record<
  string,
  { bg: string; text: string; border: string; dot: string }
> = {
  technology: {
    bg: "bg-indigo-50 dark:bg-indigo-950/50",
    text: "text-indigo-700 dark:text-indigo-300",
    border: "border-indigo-200/80 dark:border-indigo-800/80",
    dot: "bg-indigo-500",
  },
  healthcare: {
    bg: "bg-rose-50 dark:bg-rose-950/50",
    text: "text-rose-700 dark:text-rose-300",
    border: "border-rose-200/80 dark:border-rose-800/80",
    dot: "bg-rose-500",
  },
  education: {
    bg: "bg-amber-50 dark:bg-amber-950/50",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200/80 dark:border-amber-800/80",
    dot: "bg-amber-500",
  },
  agriculture: {
    bg: "bg-emerald-50 dark:bg-emerald-950/50",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200/80 dark:border-emerald-800/80",
    dot: "bg-emerald-500",
  },
  environment: {
    bg: "bg-teal-50 dark:bg-teal-950/50",
    text: "text-teal-700 dark:text-teal-300",
    border: "border-teal-200/80 dark:border-teal-800/80",
    dot: "bg-teal-500",
  },
  trades: {
    bg: "bg-orange-50 dark:bg-orange-950/50",
    text: "text-orange-700 dark:text-orange-300",
    border: "border-orange-200/80 dark:border-orange-800/80",
    dot: "bg-orange-500",
  },
  business: {
    bg: "bg-blue-50 dark:bg-blue-950/50",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200/80 dark:border-blue-800/80",
    dot: "bg-blue-500",
  },
  creative: {
    bg: "bg-purple-50 dark:bg-purple-950/50",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-200/80 dark:border-purple-800/80",
    dot: "bg-purple-500",
  },
  hospitality: {
    bg: "bg-pink-50 dark:bg-pink-950/50",
    text: "text-pink-700 dark:text-pink-300",
    border: "border-pink-200/80 dark:border-pink-800/80",
    dot: "bg-pink-500",
  },
  finance: {
    bg: "bg-cyan-50 dark:bg-cyan-950/50",
    text: "text-cyan-700 dark:text-cyan-300",
    border: "border-cyan-200/80 dark:border-cyan-800/80",
    dot: "bg-cyan-500",
  },
  community: {
    bg: "bg-violet-50 dark:bg-violet-950/50",
    text: "text-violet-700 dark:text-violet-300",
    border: "border-violet-200/80 dark:border-violet-800/80",
    dot: "bg-violet-500",
  },
  manufacturing: {
    bg: "bg-slate-100 dark:bg-slate-800/80",
    text: "text-slate-700 dark:text-slate-300",
    border: "border-slate-300/80 dark:border-slate-700/80",
    dot: "bg-slate-500",
  },
};

export interface CareerCardProps {
  career: CareerCardType;
  matchScore?: number;
  matchReasons?: string[];
  className?: string;
  onClick?: () => void;
}

export function CareerCard({
  career,
  matchScore: propMatchScore,
  matchReasons: propMatchReasons,
  className,
  onClick,
}: CareerCardProps) {
  const categoryMeta = getCategoryById(career.category);
  const categoryStyle =
    CATEGORY_STYLES[career.category] || CATEGORY_STYLES.technology;

  const matchScore = propMatchScore ?? career.matchScore;
  const matchReasons = propMatchReasons ?? career.matchReasons;

  // Format skills: take first 4
  const displaySkills = (career.requiredSkills || []).slice(0, 4);
  const remainingSkillsCount = Math.max(
    0,
    (career.requiredSkills || []).length - 4
  );

  return (
    <Link
      href={`/careers/${career.slug}`}
      onClick={onClick}
      className={cn(
        "group relative flex flex-col justify-between rounded-[26px] border border-border bg-card hover:bg-muted/40 p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl backdrop-blur-xl focus-visible:outline-hidden",
        className
      )}
    >
      <div>
        {/* Top bar: Category tape label + Match Score / Demo Tag */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <span className="tape-label text-[10px] uppercase tracking-wider font-mono">
            // {(categoryMeta?.label || career.category).toUpperCase()}
          </span>

          <div className="flex items-center gap-1.5 font-mono">
            {career.isSampleData && (
              <span className="text-[10px] text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded-full">
                SAMPLE
              </span>
            )}

            {matchScore !== undefined && matchScore > 0 && (
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-muted border border-border text-foreground">
                <span className="red-dot" />
                {matchScore}%
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-foreground group-hover:text-[#eb0028] transition-colors duration-200 flex items-start justify-between gap-2">
          <span>{career.title}</span>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
        </h3>

        {/* Description */}
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {career.description}
        </p>

        {/* Match progress bar & highlight reason */}
        {matchScore !== undefined && matchScore > 0 && (
          <div className="mt-4 pt-3.5 border-t border-border">
            <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground mb-2">
              <span>// PROFILE SYNERGY</span>
              <span className="font-bold text-foreground">
                {matchScore}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden border border-border">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  matchScore >= 80
                    ? "bg-[#eb0028] shadow-[0_0_8px_#eb0028]"
                    : matchScore >= 65
                    ? "bg-foreground shadow-[0_0_8px_rgba(235,0,40,0.3)]"
                    : "bg-muted-foreground"
                )}
                style={{ width: `${matchScore}%` }}
              />
            </div>

            {matchReasons && matchReasons.length > 0 && (
              <p className="mt-2.5 text-xs font-mono text-foreground flex items-start gap-1.5 bg-muted/70 border border-border p-2.5 rounded-xl">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#00dc82] shrink-0 mt-0.5" />
                <span className="line-clamp-1">{matchReasons[0]}</span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Skills chips */}
      <div className="mt-4 pt-3.5 border-t border-border">
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2">
          <Tag className="h-3 w-3 text-[#eb0028]" />
          <span>REQUIRED SKILLS //</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {displaySkills.map((skill, idx) => (
            <span
              key={idx}
              className="inline-flex items-center font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-muted border border-border text-foreground hover:border-border transition-colors"
            >
              {skill}
            </span>
          ))}
          {remainingSkillsCount > 0 && (
            <span className="inline-flex items-center font-mono text-[11px] px-2 py-0.5 rounded-full text-muted-foreground bg-muted/50 border border-border">
              +{remainingSkillsCount}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
