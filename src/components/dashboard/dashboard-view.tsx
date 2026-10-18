"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  Compass,
  Award,
  Sparkles,
  BookOpen,
  Route,
  ArrowRight,
  Clock,
  Calendar,
  CheckCircle2,
  PlayCircle,
  ExternalLink,
  Target,
  Bookmark,
  MapPin,
  Mic,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsCard } from "@/components/dashboard/stats-card";
import { CareerCardMini } from "@/components/dashboard/career-card-mini";
import { ActivityTimeline, type ActivityItem } from "@/components/dashboard/activity-timeline";
import {
  DotMatrixDisplay,
  SegmentedMeter,
  TelemetryWidget,
  VoiceSoundwave,
} from "@/components/ui/nothing-elements";
import type { UserSession, CareerCard } from "@/types";

export interface DashboardViewProps {
  user: UserSession;
  studentProfile?: {
    displayName: string | null;
    educationLevel: string | null;
    state: string | null;
    district: string | null;
    interests: string[];
    skills: string[];
    careerAspirations: string[];
    careerPreference: string | null;
  } | null;
  activeRoadmap?: {
    id: string;
    careerTitle: string;
    description: string | null;
    status: string;
    steps: Array<{
      id: string;
      order: number;
      title: string;
      description: string | null;
      type: string;
      status: string;
      duration?: string | null;
    }>;
  } | null;
  recommendedCareers?: CareerCard[];
  savedOpportunities?: Array<{
    id: string;
    notes?: string | null;
    opportunity: {
      id: string;
      title: string;
      category: string;
      provider?: string | null;
      applicationUrl?: string | null;
      isSampleData?: boolean;
    };
  }>;
  recentActivities?: ActivityItem[];
  isLoading?: boolean;
}

export function DashboardView({
  user,
  studentProfile,
  activeRoadmap,
  recommendedCareers = [],
  savedOpportunities = [],
  recentActivities = [],
  isLoading = false,
}: DashboardViewProps) {
  const shouldReduceMotion = useReducedMotion();

  // Compute roadmap stats
  const steps = activeRoadmap?.steps || [];
  const completedSteps = steps.filter((s) => s.status === "completed").length;
  const progressPercent = steps.length > 0 ? Math.round((completedSteps / steps.length) * 100) : 33;
  const currentStep = steps.find((s) => s.status === "in_progress") || steps.find((s) => s.status === "pending") || steps[0];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.4,
        ease: [0, 0, 0.2, 1],
      },
    },
  };

  const displayName = studentProfile?.displayName || user.name || "Soumyadip Chattopadhyay";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const formattedEdu = studentProfile?.educationLevel
    ? studentProfile.educationLevel.replace(/_/g, " ").toUpperCase()
    : "CLASS 10";
  const locationText = [studentProfile?.district, studentProfile?.state]
    .filter(Boolean)
    .join(", ") || "Kolkata, West Bengal";

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-40 rounded-[28px] bg-white/[0.05]" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-[24px] bg-white/[0.05]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10 sm:space-y-12 pb-16"
    >
      {/* 1. Nothing OS Bento Welcome Card */}
      <motion.div
        variants={itemVariants}
        className="nothing-card p-6 sm:p-8 relative overflow-hidden border-border bg-card/95 text-card-foreground shadow-xs"
      >
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <Avatar className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border border-border bg-muted shrink-0">
              {user.image && <AvatarImage src={user.image} alt={displayName} />}
              <AvatarFallback className="rounded-2xl font-dot text-2xl text-foreground bg-muted">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="red-dot" />
                <h1 className="font-dot text-2xl sm:text-3xl font-bold tracking-widest text-foreground uppercase">
                  NAMASTE, {displayName}
                </h1>
                <span className="tape-label text-[10px] text-muted-foreground">
                  {formattedEdu}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-muted-foreground pt-0.5">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-red-500" />
                  {locationText}
                </span>
                <span>//</span>
                <span className="flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5 text-muted-foreground" />
                  TRACK: {studentProfile?.careerPreference ? studentProfile.careerPreference.toUpperCase() : "VOCATIONAL"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/careers">
              <Button
                variant="outline"
                size="sm"
                className="font-mono text-xs gap-1.5 border-border hover:bg-muted"
              >
                <Compass className="h-3.5 w-3.5" />
                <span>CAREER RADAR</span>
              </Button>
            </Link>

            <Link href="/opportunities">
              <Button
                variant="outline"
                size="sm"
                className="font-mono text-xs gap-1.5 border-border hover:bg-muted"
              >
                <Award className="h-3.5 w-3.5" />
                <span>SCHEMES</span>
              </Button>
            </Link>

            <Link href="/chat">
              <Button
                variant="red"
                size="sm"
                className="font-mono text-xs gap-2"
              >
                <Mic className="h-3.5 w-3.5" />
                <span>VOICE HUD</span>
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* 2. Nothing OS Bento Stats Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
      >
        <StatsCard
          title="CAREER MATCHES"
          value="12"
          icon={Compass}
          trend={{ value: "+3 NEW", isPositive: true, label: "SKILL ALIGNED" }}
          href="/careers"
        />

        <StatsCard
          title="LEARNING PROGRESS"
          value={`${progressPercent}%`}
          icon={Route}
          trend={{ value: `${completedSteps}/${steps.length || 6}`, label: "MILESTONES" }}
          href="/roadmap"
        />

        <StatsCard
          title="SAVED OPPORTUNITIES"
          value={savedOpportunities.length.toString() || "1"}
          icon={Award}
          trend={{ value: "PM SURYA GHAR", label: "DEC DEADLINE" }}
          href="/opportunities/saved"
        />

        <StatsCard
          title="RESOURCES ACCESSED"
          value="8"
          icon={BookOpen}
          trend={{ value: "+2", isPositive: true, label: "COMPLETED" }}
          href="/resources"
        />
      </motion.div>

      {/* 3. Continue Learning Box (Nothing OS Segmented Progress) */}
      <motion.div variants={itemVariants}>
        <div className="nothing-card p-6 sm:p-8 space-y-6 border-border bg-card/95 text-card-foreground shadow-xs rounded-[28px]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="red-dot" />
                <span className="font-dot text-lg font-bold tracking-widest text-foreground uppercase">
                  ACTIVE VOCATIONAL ROADMAP
                </span>
              </div>
              <p className="font-mono text-xs text-muted-foreground">
                // GROUNDED ON NATIONAL SKILL QUALIFICATION FRAMEWORK (NSQF LEVEL 4)
              </p>
            </div>

            <Link href="/roadmap">
              <Button variant="outline" size="sm" className="font-mono text-xs gap-1 border-border hover:bg-muted">
                <span>FULL ROADMAP SPEC</span>
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>

          {activeRoadmap ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="font-mono text-lg font-bold text-foreground uppercase">
                    {activeRoadmap.careerTitle}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground font-sans max-w-2xl leading-relaxed">
                    {activeRoadmap.description || "Master essential technical competencies, electrical testing, and solar array mounting under PM Surya Ghar Yojana."}
                  </p>
                </div>

                <div className="sm:text-right shrink-0">
                  <SegmentedMeter value={progressPercent} max={100} totalSegments={16} />
                  <p className="font-mono text-[10px] text-muted-foreground mt-1 uppercase">
                    {completedSteps} OF {steps.length} MILESTONES VERIFIED
                  </p>
                </div>
              </div>

              {/* Active Milestone Card */}
              {currentStep && (
                <div className="mt-6 rounded-2xl border border-border bg-muted/40 p-6 space-y-4 font-mono shadow-xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="tape-label text-[#eb0028] border-red-500/30">
                      STEP 0{currentStep.order} // ACTIVE
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      EST: {currentStep.duration || "4 WEEKS"}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-foreground">
                    {currentStep.title}
                  </h4>
                  <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                    {currentStep.description}
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-border">
                    <span className="text-[10px] text-muted-foreground">
                      SOURCE: SKILL INDIA DIGITAL // DIKSHA CURRICULUM
                    </span>
                    <Link href={`/roadmap/${activeRoadmap.id}`}>
                      <Button variant="red" size="sm" className="font-mono text-xs gap-1.5 h-8">
                        <PlayCircle className="h-3.5 w-3.5" />
                        <span>RESUME STEP</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center font-mono">
              <Route className="h-8 w-8 text-muted-foreground mb-2" />
              <h4 className="text-xs font-bold text-foreground uppercase">NO ACTIVE ROADMAP</h4>
              <p className="mt-1 text-xs text-muted-foreground max-w-sm font-sans">
                Select a recommended career path to generate your customized step-by-step pathway.
              </p>
              <Link href="/careers" className="mt-4">
                <Button variant="red" size="sm" className="font-mono text-xs">
                  EXPLORE CAREERS
                </Button>
              </Link>
            </div>
          )}
        </div>
      </motion.div>

      {/* 4. Recommended Careers Bento Grid */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="red-dot" />
              <h2 className="font-dot text-base sm:text-lg font-bold tracking-widest uppercase text-foreground">
                RECOMMENDED CAREER PATHWAYS
              </h2>
            </div>
            <p className="font-mono text-xs text-muted-foreground mt-0.5">
              // WEIGHTED MATCHING ENGINE RESULTS FOR YOUR REGIONAL PROFILE
            </p>
          </div>

          <Link href="/careers">
            <Button variant="outline" size="sm" className="font-mono text-xs gap-1 border-border hover:bg-muted">
              <span>VIEW ALL (36+)</span>
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {recommendedCareers.map((career) => (
            <CareerCardMini key={career.id} career={career} />
          ))}
        </div>
      </motion.div>

      {/* 5. Split Section: Deadlines & Telemetry Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Deadlines (7 cols) */}
        <motion.div variants={itemVariants} className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="red-dot" />
                <h2 className="font-dot text-sm sm:text-base font-bold tracking-widest uppercase text-foreground">
                  VERIFIED SCHEMES & DEADLINES
                </h2>
              </div>
              <p className="font-mono text-[11px] text-muted-foreground mt-0.5">
                // GOVERNMENT FINANCIAL AID & APPRENTICESHIP BATCHES
              </p>
            </div>

            <Link href="/opportunities/saved">
              <Button variant="outline" size="sm" className="font-mono text-xs gap-1 border-border hover:bg-muted">
                <span>VIEW SAVED</span>
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {savedOpportunities.length > 0 ? (
              savedOpportunities.map((item) => {
                const opp = item.opportunity;
                return (
                  <div
                    key={item.id}
                    className="rounded-[22px] border border-border bg-card p-5 transition-all hover:border-border/80 shadow-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="tape-label text-amber-500 dark:text-amber-400 border-amber-500/30 text-[9px]">
                            {opp.category.toUpperCase()}
                          </span>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                            // VERIFIED SOURCE
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-foreground line-clamp-1">
                          {opp.title}
                        </h4>

                        <p className="text-xs text-muted-foreground font-sans line-clamp-1">
                          Provider: {opp.provider || "Government of India"}
                        </p>

                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-1">
                          <Calendar className="h-3 w-3" />
                          <span>CLOSING: 31 DEC 2026</span>
                          <span className="text-red-500 dark:text-red-400 font-bold">• 75D REMAINING</span>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center gap-2 shrink-0 pt-2 sm:pt-0">
                        <Link href={`/opportunities/${opp.id}`}>
                          <Button size="sm" variant="outline" className="font-mono text-xs h-8 px-3 border-border hover:bg-muted">
                            VIEW SPEC
                          </Button>
                        </Link>
                        {opp.applicationUrl && (
                          <a
                            href={opp.applicationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-semibold text-foreground hover:text-[#eb0028] flex items-center gap-1"
                          >
                            <span>PORTAL</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-[22px] border border-dashed border-border p-8 text-center bg-muted/30">
                <Bookmark className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
                <h4 className="font-mono text-xs font-bold text-foreground uppercase">// NO SAVED SCHEMES</h4>
                <p className="mt-1 text-xs text-muted-foreground font-sans">
                  Bookmark verified scholarships and apprenticeships to track opening dates.
                </p>
                <Link href="/opportunities" className="mt-3 inline-block">
                  <Button size="sm" variant="outline" className="font-mono text-xs border-border hover:bg-muted">
                    BROWSE SCHEMES
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* Telemetry Activity (5 cols) */}
        <motion.div variants={itemVariants} className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="red-dot" />
                <h2 className="font-dot text-sm sm:text-base font-bold tracking-widest uppercase text-foreground">
                  RECENT TELEMETRY
                </h2>
              </div>
              <p className="font-mono text-[11px] text-muted-foreground mt-0.5">
                // LEARNING & VERIFICATION EVENT LOGS
              </p>
            </div>
          </div>

          <div className="nothing-card p-6 border-border bg-card/95 text-card-foreground shadow-xs rounded-[28px]">
            <ActivityTimeline activities={recentActivities} />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
