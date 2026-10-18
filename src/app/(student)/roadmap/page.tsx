import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatDate, cn } from "@/lib/utils";
import { GenerateRoadmapDialog } from "@/components/roadmap/generate-roadmap-dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Compass,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Route,
  BookOpen,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Learning Roadmaps | NextLearning",
  description: "Track your personalized learning roadmaps and skill milestones.",
};

export const dynamic = "force-dynamic";

export default async function StudentRoadmapsPage() {
  // 1. Fetch current or demo student profile
  const student = await prisma.studentProfile.findFirst({
    include: { user: true },
  });

  // 2. Fetch all roadmaps for the student
  const roadmaps = student
    ? await prisma.learningRoadmap.findMany({
        where: { studentId: student.id },
        include: {
          steps: {
            orderBy: { order: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  // 3. Fetch list of careers for generator dialog
  const careers = await prisma.career.findMany({
    select: {
      slug: true,
      title: true,
      category: true,
    },
    orderBy: { title: "asc" },
  });

  return (
    <div className="w-full text-foreground transition-colors duration-400 pb-16">
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6 transition-colors duration-400">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
              <span className="red-dot" />
              <span>SKILL SEQUENCING // STRUCTURED PATHWAYS</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-sans font-bold tracking-tight text-foreground">
              My Learning <span className="font-dot tracking-widest text-[#eb0028]">ROADMAPS</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl font-sans">
              Track your milestones, prepare for certifications, and build job-ready proficiencies step by step.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/chat">
              <Button variant="outline" size="sm" className="h-10 text-xs font-mono rounded-full px-4">
                <Sparkles className="h-3.5 w-3.5 mr-1.5 text-[#eb0028]" />
                CONSULT AI //
              </Button>
            </Link>

            <GenerateRoadmapDialog
              careers={careers}
              studentId={student?.id}
              triggerText="GENERATE NEW ROADMAP //"
            />
          </div>
        </div>

        {/* Roadmaps List or Empty State */}
        {roadmaps.length === 0 ? (
          <div className="rounded-[30px] border border-border p-12 text-center bg-card max-w-xl mx-auto my-8 backdrop-blur-xl shadow-md">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-muted border border-border text-[#eb0028] mb-4">
              <Compass className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2 font-sans">
              Explore careers first to generate a roadmap
            </h3>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed font-sans">
              You don’t have any active learning roadmaps yet. Choose a career from the registry, and our AI will chart a clear path from basics to job readiness.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <GenerateRoadmapDialog
                careers={careers}
                studentId={student?.id}
                triggerText="CREATE FIRST ROADMAP //"
              />
              <Link href="/chat">
                <Button variant="outline" className="text-xs font-mono rounded-full">
                  CHAT WITH ADVISOR
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roadmaps.map((roadmap) => {
              const totalSteps = roadmap.steps.length;
              const completedSteps = roadmap.steps.filter((s) => s.status === "completed").length;
              const progressPercent =
                totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
              const isFinished = progressPercent === 100 || roadmap.status === "completed";

              return (
                <div
                  key={roadmap.id}
                  className="group relative rounded-[28px] border border-border bg-card hover:bg-muted/40 p-6 sm:p-7 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between backdrop-blur-xl"
                >
                  <div>
                    {/* Status & Date */}
                    <div className="flex items-center justify-between gap-2 mb-3.5">
                      <span
                        className={cn(
                          "font-mono text-[10px] px-2.5 py-0.5 rounded-full border flex items-center gap-1.5",
                          isFinished
                            ? "bg-muted text-[#00dc82] border-[#00dc82]/30"
                            : "bg-[#eb0028]/10 text-[#eb0028] dark:text-white border-[#eb0028]/40"
                        )}
                      >
                        <span className={cn("h-1.5 w-1.5 rounded-full", isFinished ? "bg-[#00dc82]" : "bg-[#eb0028]")} />
                        {isFinished ? "COMPLETED" : "IN PROGRESS"}
                      </span>

                      <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>{formatDate(roadmap.createdAt)}</span>
                      </div>
                    </div>

                    {/* Career Title */}
                    <h2 className="text-xl font-bold font-sans text-foreground group-hover:text-[#eb0028] transition-colors mb-2">
                      {roadmap.careerTitle}
                    </h2>

                    {/* Excerpt */}
                    {roadmap.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-6 font-sans">
                        {roadmap.description}
                      </p>
                    )}
                  </div>

                  {/* Progress Bar & Stats */}
                  <div className="space-y-4 pt-4 border-t border-border">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-muted-foreground">// PROGRESS</span>
                        <span className="font-bold text-foreground">
                          {progressPercent}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden border border-border">
                        <div
                          className="h-full bg-foreground rounded-full shadow-[0_0_8px_rgba(235,0,40,0.3)] transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono text-neutral-400 pt-1">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#00dc82]" />
                        <span>
                          {completedSteps} / {totalSteps} STEPS
                        </span>
                      </div>

                      <Link
                        href={`/roadmap/${roadmap.id}`}
                        className="inline-flex items-center gap-1 font-mono text-xs text-neutral-300 hover:text-white transition-colors"
                      >
                        <span>VIEW TIMELINE //</span>
                        <ArrowRight className="h-3.5 w-3.5 text-[#eb0028]" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
