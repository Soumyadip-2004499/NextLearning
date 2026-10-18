"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  Route,
  Share2,
  Download,
  AlertCircle,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RoadmapTimeline, RoadmapStepItem } from "@/components/roadmap/roadmap-timeline";
import { formatDate, cn } from "@/lib/utils";

interface RoadmapDetailViewProps {
  initialRoadmap: {
    id: string;
    careerTitle: string;
    description: string | null;
    status: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    student?: {
      displayName: string | null;
      educationLevel: string | null;
    } | null;
    steps: RoadmapStepItem[];
  };
}

export function RoadmapDetailView({ initialRoadmap }: RoadmapDetailViewProps) {
  const [roadmap, setRoadmap] = useState(initialRoadmap);
  const [steps, setSteps] = useState<RoadmapStepItem[]>(initialRoadmap.steps);

  const totalSteps = steps.length;
  const completedSteps = steps.filter((s) => s.status === "completed").length;
  const inProgressSteps = steps.filter((s) => s.status === "in_progress").length;
  const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  const isFinished = progressPercent === 100;

  const handleStepUpdated = (updatedStep: RoadmapStepItem) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === updatedStep.id ? updatedStep : s))
    );
  };

  return (
    <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <Link
          href="/roadmap"
          className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>// ALL ROADMAPS</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/chat">
            <Button variant="outline" size="sm" className="h-9 text-xs font-mono border-border hover:border-primary/40 text-foreground rounded-full px-4">
              <Sparkles className="h-3.5 w-3.5 mr-1.5 text-[#eb0028]" />
              AI ADVISOR // CONSULT
            </Button>
          </Link>
        </div>
      </div>

      {/* Header Banner & Progress Summary */}
      <div className="rounded-[32px] border border-border bg-card p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-2xl text-card-foreground">
        <div className="relative space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="tape-label text-[10px] uppercase font-mono tracking-wider">
                // CAREER ROADMAP
              </span>

              <span
                className={cn(
                  "font-mono text-[10px] px-2.5 py-0.5 rounded-full border flex items-center gap-1.5",
                  isFinished
                    ? "bg-[#00dc82]/10 text-[#00dc82] border-[#00dc82]/30"
                    : "bg-[#eb0028]/10 text-foreground border-[#eb0028]/40"
                )}
              >
                <span className={cn("h-1.5 w-1.5 rounded-full", isFinished ? "bg-[#00dc82]" : "bg-[#eb0028]")} />
                {isFinished ? "100% COMPLETED" : `${progressPercent}% COMPLETE`}
              </span>
            </div>

            <div className="text-xs font-mono text-muted-foreground">
              CREATED: {formatDate(roadmap.createdAt)}
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl font-sans font-bold tracking-tight text-foreground">
              {roadmap.careerTitle}
            </h1>
            {roadmap.description && (
              <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl font-sans">
                {roadmap.description}
              </p>
            )}
          </div>

          {/* Progress Bar & KPI Cards */}
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-muted-foreground">// OVERALL MILESTONE PROGRESS</span>
                <span className="text-foreground font-bold">{progressPercent}%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden border border-border">
                <div
                  className="h-full bg-primary rounded-full shadow-[0_0_8px_rgba(235,0,40,0.5)] transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
              <div className="rounded-[20px] bg-muted/50 p-3.5 border border-border">
                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">TOTAL STEPS //</div>
                <div className="text-lg font-bold font-mono text-foreground mt-0.5">{totalSteps}</div>
              </div>

              <div className="rounded-[20px] bg-muted/50 p-3.5 border border-border">
                <div className="text-[10px] font-mono text-[#00dc82] uppercase tracking-wider">COMPLETED //</div>
                <div className="text-lg font-bold font-mono text-foreground mt-0.5 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#00dc82]" />
                  {completedSteps}
                </div>
              </div>

              <div className="rounded-[20px] bg-muted/50 p-3.5 border border-border">
                <div className="text-[10px] font-mono text-[#eb0028] uppercase tracking-wider">IN PROGRESS //</div>
                <div className="text-lg font-bold font-mono text-foreground mt-0.5">{inProgressSteps}</div>
              </div>

              <div className="rounded-[20px] bg-muted/50 p-3.5 border border-border">
                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">REMAINING //</div>
                <div className="text-lg font-bold font-mono text-foreground mt-0.5">
                  {Math.max(0, totalSteps - completedSteps)}
                </div>
              </div>
            </div>
          </div>

          {/* Completed celebratory alert */}
          {isFinished && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-[#00dc82]/10 border border-[#00dc82]/30 text-foreground flex items-center gap-3"
            >
              <div className="h-10 w-10 rounded-xl bg-foreground text-background flex items-center justify-center shrink-0">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm font-sans text-foreground">Congratulations on completing this roadmap!</h4>
                <p className="text-xs text-muted-foreground mt-0.5 font-sans">
                  You have successfully finished all foundational, practical, and assessment milestones. You are now prepared to explore apprenticeships and apply for opportunities!
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Visual Roadmap Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              Step-by-Step Learning Timeline
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Click each milestone card to view detailed learning instructions and resources.
            </p>
          </div>
        </div>

        <RoadmapTimeline
          roadmapId={roadmap.id}
          steps={steps}
          onStepUpdated={handleStepUpdated}
        />
      </div>
    </div>
  );
}
