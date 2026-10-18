"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps?: { id: string; question: string }[];
  stepLabels?: string[];
  className?: string;
}

export function StepIndicator({
  currentStep,
  totalSteps,
  steps,
  stepLabels,
  className,
}: StepIndicatorProps) {
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round(((currentStep + 1) / totalSteps) * 100))
  );

  const currentLabel =
    (stepLabels && stepLabels[currentStep]) ||
    (steps && steps[currentStep]?.question) ||
    `Step ${currentStep + 1}`;

  return (
    <div className={cn("w-full space-y-3", className)} aria-label="Onboarding Progress">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center h-6 px-2.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold dark:bg-indigo-950 dark:text-indigo-300">
            Step {currentStep + 1} of {totalSteps}
          </span>
          <span className="hidden sm:inline text-xs text-muted-foreground font-medium truncate max-w-[280px]">
            {currentLabel}
          </span>
        </div>
        <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
          {progressPercent}% Complete
        </span>
      </div>

      {/* Progress Bar with Teal Gradient */}
      <div
        className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700"
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-600 via-teal-500 to-emerald-500 transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Step dots for compact navigation / preview on tablets and larger */}
      <div className="hidden md:flex items-center justify-between gap-1 pt-1">
        {Array.from({ length: totalSteps }).map((_, idx) => {
          const isCompleted = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center group relative"
              title={`Step ${idx + 1}`}
            >
              <div
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all duration-200",
                  isCompleted
                    ? "bg-teal-600 dark:bg-teal-400"
                    : isCurrent
                    ? "bg-indigo-600 ring-4 ring-indigo-100 dark:ring-indigo-950 scale-125"
                    : "bg-slate-200 dark:bg-slate-700"
                )}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StepIndicator;
