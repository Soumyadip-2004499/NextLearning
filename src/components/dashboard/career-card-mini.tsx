"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { CareerCard } from "@/types";

export interface CareerCardMiniProps {
  career: CareerCard & {
    salaryRange?: string | null;
  };
  className?: string;
}

export function CareerCardMini({ career, className }: CareerCardMiniProps) {
  const matchScore = career.matchScore ?? 92;

  // Format category name
  const formattedCategory = career.category
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-border bg-card backdrop-blur-xl p-5 transition-all duration-300 hover:scale-[1.02] hover:border-border/80 hover:shadow-xl",
        className
      )}
    >
      <div>
        {/* Top Badges: Category & Match Score */}
        <div className="flex items-center justify-between gap-2">
          <span className="tape-label text-foreground text-[9px]">
            {formattedCategory}
          </span>

          <div className="flex items-center gap-1 font-dot text-xs text-[#eb0028]">
            <span className="red-dot w-1.5 h-1.5" />
            <span>{matchScore}%</span>
          </div>
        </div>

        {/* Title */}
        <div className="mt-3">
          <h4 className="font-mono text-sm font-bold text-foreground group-hover:text-[#eb0028] transition-colors line-clamp-1">
            {career.title}
          </h4>
          <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed font-sans">
            {career.description}
          </p>
        </div>

        {/* Skills Chips */}
        {career.requiredSkills && career.requiredSkills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1 font-mono">
            {career.requiredSkills.slice(0, 2).map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center rounded-md bg-muted border border-border px-2 py-0.5 text-[10px] text-foreground"
              >
                {skill}
              </span>
            ))}
            {career.requiredSkills.length > 2 && (
              <span className="inline-flex items-center rounded-md bg-muted/60 border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
                +{career.requiredSkills.length - 2}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom Action Footer */}
      <div className="mt-5 flex items-center justify-between border-t border-border pt-3 font-mono text-xs">
        <span className="text-[10px] text-muted-foreground">
          // SPEC READY
        </span>

        <Link
          href={`/careers/${career.slug}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-foreground transition-colors hover:text-[#eb0028]"
        >
          <span>EXPLORE</span>
          <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
