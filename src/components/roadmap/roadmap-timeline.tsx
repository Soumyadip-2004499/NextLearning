"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  Wrench,
  Award,
  Flag,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  Check,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface RoadmapStepItem {
  id: string;
  order: number;
  title: string;
  description: string | null;
  type: string;
  status: string;
  duration: string | null;
  completedAt?: string | Date | null;
  resourceId?: string | null;
  resource?: {
    id: string;
    title: string;
    url?: string | null;
    resourceType?: string | null;
    duration?: string | null;
  } | null;
}

interface RoadmapTimelineProps {
  roadmapId: string;
  steps: RoadmapStepItem[];
  onStepUpdated?: (updatedStep: RoadmapStepItem) => void;
}

const STEP_TYPE_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType; color: string; bg: string }
> = {
  learn: {
    label: "Knowledge",
    icon: BookOpen,
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-200",
  },
  practice: {
    label: "Hands-on",
    icon: Wrench,
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
  },
  exam: {
    label: "Assessment",
    icon: Award,
    color: "text-purple-600",
    bg: "bg-purple-50 border-purple-200",
  },
  milestone: {
    label: "Milestone",
    icon: Flag,
    color: "text-rose-600",
    bg: "bg-rose-50 border-rose-200",
  },
};

export function RoadmapTimeline({
  roadmapId,
  steps: initialSteps,
  onStepUpdated,
}: RoadmapTimelineProps) {
  const [steps, setSteps] = useState<RoadmapStepItem[]>(initialSteps);
  const [expandedStepId, setExpandedStepId] = useState<string | null>(
    // Default expand the first in_progress or pending step
    initialSteps.find((s) => s.status === "in_progress")?.id ||
      initialSteps[0]?.id ||
      null
  );
  const [updatingStepId, setUpdatingStepId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync when prop updates
  React.useEffect(() => {
    setSteps(initialSteps);
  }, [initialSteps]);

  const toggleExpand = (id: string) => {
    setExpandedStepId((prev) => (prev === id ? null : id));
  };

  const handleUpdateStatus = async (
    stepId: string,
    newStatus: "pending" | "in_progress" | "completed" | "skipped"
  ) => {
    setUpdatingStepId(stepId);
    setErrorMsg(null);

    // Optimistic local update
    const previousSteps = [...steps];
    const updatedSteps = steps.map((s) =>
      s.id === stepId
        ? {
            ...s,
            status: newStatus,
            completedAt: newStatus === "completed" ? new Date().toISOString() : null,
          }
        : s
    );
    setSteps(updatedSteps);

    try {
      const res = await fetch(`/api/roadmap/${roadmapId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stepId,
          status: newStatus,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update step status on server.");
      }

      const data = await res.json();
      if (onStepUpdated && data.data) {
        onStepUpdated(data.data);
      }
    } catch (err) {
      console.error("Step status update failed:", err);
      // Rollback to previous state
      setSteps(previousSteps);
      setErrorMsg("Failed to update step. Please check connection.");
    } finally {
      setUpdatingStepId(null);
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto py-2">
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Connected Vertical Timeline Line */}
      <div className="relative pl-6 sm:pl-10 space-y-6 before:absolute before:left-3 sm:before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-white/10">
        {steps.map((step, idx) => {
          const isCompleted = step.status === "completed";
          const isInProgress = step.status === "in_progress";
          const isPending = step.status === "pending" || step.status === "skipped";
          const isExpanded = expandedStepId === step.id;
          const isUpdating = updatingStepId === step.id;

          const typeConfig = STEP_TYPE_CONFIG[step.type] || STEP_TYPE_CONFIG.learn;
          const TypeIcon = typeConfig.icon;

          return (
            <motion.div
              key={step.id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.05 }}
              className="relative group"
            >
              {/* Timeline Node Icon */}
              <div
                className={cn(
                  "absolute -left-6 sm:-left-10 top-3 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl border transition-all duration-200 z-10 font-mono text-xs",
                  isCompleted
                    ? "bg-white border-white text-black shadow-[0_0_12px_rgba(255,255,255,0.7)]"
                    : isInProgress
                    ? "bg-black border-[#eb0028] text-[#eb0028] shadow-[0_0_12px_#eb0028]"
                    : "bg-black border-white/20 text-neutral-400"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4 stroke-[3]" />
                ) : isInProgress ? (
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#eb0028] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#eb0028]" />
                  </span>
                ) : (
                  <span>0{step.order}</span>
                )}
              </div>

              {/* Step Card */}
              <div
                className={cn(
                  "rounded-[24px] border transition-all duration-200 overflow-hidden shadow-md",
                  isCompleted
                    ? "border-border bg-card opacity-90"
                    : isInProgress
                    ? "border-[#eb0028]/60 bg-card shadow-[0_0_25px_rgba(235,0,40,0.12)]"
                    : "border-border bg-card hover:border-border"
                )}
              >
                {/* Header (Always Visible) */}
                <div
                  onClick={() => toggleExpand(step.id)}
                  className="p-4 sm:p-5 cursor-pointer flex items-start sm:items-center justify-between gap-3 select-none"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Step Number Badge */}
                      <span className="tape-label text-[9px] uppercase tracking-wider font-mono">
                        STEP 0{step.order} //
                      </span>

                      {/* Step Type Badge */}
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded-full bg-muted border border-border text-foreground">
                        <TypeIcon className="h-3 w-3 text-[#eb0028]" />
                        {typeConfig.label.toUpperCase()}
                      </span>

                      {/* Status Badge */}
                      <span
                        className={cn(
                          "font-mono text-[10px] px-2.5 py-0.5 rounded-full border",
                          isCompleted
                            ? "bg-muted text-[#00dc82] border-[#00dc82]/30"
                            : isInProgress
                            ? "bg-[#eb0028]/10 text-[#eb0028] dark:text-white border-[#eb0028]/40"
                            : "bg-muted text-muted-foreground border-border"
                        )}
                      >
                        {step.status.replace("_", " ").toUpperCase()}
                      </span>

                      {/* Estimated Duration */}
                      {step.duration && (
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground ml-auto sm:ml-0">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {step.duration}
                        </span>
                      )}
                    </div>

                    {/* Step Title */}
                    <h3
                      className={cn(
                        "text-base sm:text-lg font-sans font-semibold tracking-tight transition-colors",
                        isCompleted
                          ? "text-muted-foreground line-through decoration-muted-foreground"
                          : isInProgress
                          ? "text-foreground font-bold"
                          : "text-foreground"
                      )}
                    >
                      {step.title}
                    </h3>
                  </div>

                  {/* Expand / Collapse Icon */}
                  <div className="shrink-0 pt-1 sm:pt-0 text-muted-foreground hover:text-foreground">
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </div>

                {/* Expandable Step Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-border px-4 sm:px-5 py-4 bg-muted/40"
                    >
                      {/* Description */}
                      {step.description && (
                        <p className="text-sm text-foreground/90 leading-relaxed mb-4 font-sans">
                          {step.description}
                        </p>
                      )}

                      {/* Curated Resource Link */}
                      {step.resource && (
                        <div className="mb-4 p-3.5 rounded-2xl bg-card border border-border flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <span className="tape-label text-[9px] uppercase tracking-wider font-mono">
                              CURATED RESOURCE //
                            </span>
                            <div className="text-sm font-medium text-foreground truncate mt-1">
                              {step.resource.title}
                            </div>
                            {step.resource.duration && (
                              <div className="text-xs font-mono text-muted-foreground">
                                TIME ESTIMATE: {step.resource.duration}
                              </div>
                            )}
                          </div>
                          {step.resource.url && (
                            <a
                              href={step.resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-full bg-foreground text-background font-semibold transition-colors hover:opacity-90"
                            >
                              <span>OPEN //</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      )}

                      {/* Completion Date Tag */}
                      {step.completedAt && (
                        <div className="text-xs font-mono text-[#00dc82] flex items-center gap-1.5 mb-3">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>
                            COMPLETED:{" "}
                            {new Date(step.completedAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      )}

                      {/* Actions Footer */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/[0.08]">
                        <div className="flex items-center gap-2">
                          {/* Toggle Progress button */}
                          {!isCompleted && !isInProgress && (
                            <Button
                              size="sm"
                              variant="red"
                              disabled={isUpdating}
                              onClick={() => handleUpdateStatus(step.id, "in_progress")}
                              className="h-8 text-xs font-mono"
                            >
                              START STEP //
                            </Button>
                          )}

                          {isInProgress && (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isUpdating}
                              onClick={() => handleUpdateStatus(step.id, "pending")}
                              className="h-8 text-xs font-mono border-white/20 text-neutral-300 hover:text-white"
                            >
                              PAUSE
                            </Button>
                          )}
                        </div>

                        {/* Mark Complete / Incomplete CTA */}
                        {isCompleted ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={isUpdating}
                            onClick={() => handleUpdateStatus(step.id, "in_progress")}
                            className="h-8 text-xs font-mono text-neutral-400 hover:text-white"
                          >
                            <RefreshCw className="h-3 w-3 mr-1.5" />
                            REOPEN
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            disabled={isUpdating}
                            onClick={() => handleUpdateStatus(step.id, "completed")}
                            className="h-8 text-xs font-mono bg-white hover:bg-neutral-200 text-black font-semibold rounded-xl"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            MARK COMPLETE
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
