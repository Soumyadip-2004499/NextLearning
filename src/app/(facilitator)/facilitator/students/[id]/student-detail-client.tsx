"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  GraduationCap,
  Compass,
  Route,
  Bookmark,
  FileCheck2,
  Send,
  Edit3,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Loader2,
  BookOpen,
  Briefcase,
  AlertCircle,
  Save,
  Radio,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { GlyphBar } from "@/components/ui/nothing-elements";

interface StepData {
  id: string;
  order: number;
  title: string;
  description: string | null;
  type: string;
  status: string;
  duration: string | null;
  completedAt: string | null;
  resource?: {
    id: string;
    title: string;
    provider: string | null;
    url: string | null;
    resourceType: string | null;
  } | null;
}

interface RoadmapData {
  id: string;
  careerTitle: string;
  description: string | null;
  status: string;
  steps: StepData[];
}

interface SavedOppData {
  id: string;
  opportunityId?: string;
  title: string;
  provider: string | null;
  category: string;
  description: string;
  location?: string | null;
  applicationUrl: string | null;
  savedAt?: string;
}

interface AppRecordData {
  id: string;
  title: string;
  provider: string | null;
  status: string;
  nextAction: string | null;
  notes: string | null;
  updatedAt: string;
}

interface RecommendationData {
  id: string;
  type: string;
  message: string | null;
  isRead: boolean;
  createdAt: string;
}

interface StudentDetailClientProps {
  student: {
    id: string;
    displayName: string;
    email: string | null;
    educationLevel: string;
    state: string;
    district: string;
    interests: string[];
    hobbies: string[];
    favoriteSubjects: string[];
    skills: string[];
    careerAspirations: string[];
    learningStyle: string;
    careerPreference: string;
    availableHours: number;
    deviceAccess: string;
    assignmentNotes: string;
    assignedAt: string;
    roadmaps: RoadmapData[];
    savedOpportunities: SavedOppData[];
    applications: AppRecordData[];
    recommendations: RecommendationData[];
  };
  availableResources: { id: string; title: string; provider: string | null; resourceType: string | null }[];
  availableOpportunities: { id: string; title: string; provider: string | null; category: string }[];
}

export function StudentDetailClient({
  student,
  availableResources,
  availableOpportunities,
}: StudentDetailClientProps) {
  const [notes, setNotes] = React.useState(student.assignmentNotes);
  const [isSavingNotes, setIsSavingNotes] = React.useState(false);
  const [notesSuccessMessage, setNotesSuccessMessage] = React.useState<string | null>(null);

  // Recommendations state
  const [recommendList, setRecommendList] = React.useState(student.recommendations);
  const [isRecommendResourceOpen, setIsRecommendResourceOpen] = React.useState(false);
  const [isRecommendOpportunityOpen, setIsRecommendOpportunityOpen] = React.useState(false);

  const [selectedResourceId, setSelectedResourceId] = React.useState(availableResources[0]?.id || "");
  const [resourceMessage, setResourceMessage] = React.useState("");

  const [selectedOppId, setSelectedOppId] = React.useState(availableOpportunities[0]?.id || "");
  const [oppMessage, setOppMessage] = React.useState("");

  const [isSubmittingRec, setIsSubmittingRec] = React.useState(false);

  // Handle saving facilitator notes
  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    setNotesSuccessMessage(null);
    try {
      const res = await fetch(`/api/facilitator/students/${student.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      const data = await res.json();
      if (data.success) {
        setNotesSuccessMessage("Facilitator notes updated successfully.");
        setTimeout(() => setNotesSuccessMessage(null), 3000);
      } else {
        alert(data.error || "Failed to update notes");
      }
    } catch {
      alert("Error saving notes. Please try again.");
    } finally {
      setIsSavingNotes(false);
    }
  };

  // Handle recommend resource
  const handleSendResourceRec = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResourceId) return;
    setIsSubmittingRec(true);

    try {
      const res = await fetch("/api/facilitator/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: student.id,
          type: "resource",
          referenceId: selectedResourceId,
          message: resourceMessage,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRecommendList([data.data, ...recommendList]);
        setIsRecommendResourceOpen(false);
        setResourceMessage("");
      } else {
        alert(data.error || "Could not send recommendation");
      }
    } catch {
      alert("Failed to send recommendation");
    } finally {
      setIsSubmittingRec(false);
    }
  };

  // Handle recommend opportunity
  const handleSendOppRec = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOppId) return;
    setIsSubmittingRec(true);

    try {
      const res = await fetch("/api/facilitator/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: student.id,
          type: "opportunity",
          referenceId: selectedOppId,
          message: oppMessage,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRecommendList([data.data, ...recommendList]);
        setIsRecommendOpportunityOpen(false);
        setOppMessage("");
      } else {
        alert(data.error || "Could not send recommendation");
      }
    } catch {
      alert("Failed to send recommendation");
    } finally {
      setIsSubmittingRec(false);
    }
  };

  // Calculate overall roadmap progress
  let totalSteps = 0;
  let completedSteps = 0;
  student.roadmaps.forEach((rm) => {
    rm.steps.forEach((step) => {
      totalSteps += 1;
      if (step.status === "completed") completedSteps += 1;
    });
  });
  const overallProgress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-2">
      {/* Telemetry Strip / Status Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 px-4 py-2.5 rounded-2xl border border-border bg-card/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00dc82] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00dc82]"></span>
          </span>
          <span className="font-dot text-[11px] uppercase tracking-widest text-foreground">
            STUDENT // TELEMETRY.MONITOR // DOSSIER: {student.displayName.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <GlyphBar activeIndex={3} total={4} />
          <span className="font-mono text-[10px] text-muted-foreground">ENCRYPTED</span>
        </div>
      </div>

      {/* Top Breadcrumb & Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-4">
          <Link
            href="/facilitator"
            className="p-2.5 rounded-2xl bg-card border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors shadow-md"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-dot font-bold uppercase tracking-wider text-foreground">
                {student.displayName}
              </h1>
              <span className="font-dot text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full border border-border bg-muted text-foreground">
                {student.educationLevel.replace("_", " ")}
              </span>
            </div>
            <p className="font-mono text-xs text-muted-foreground mt-1">
              Assigned: {new Date(student.assignedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })} &bull; {student.district}, {student.state}
            </p>
          </div>
        </div>

        {/* Recommend Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsRecommendResourceOpen(true)}
            className="font-mono text-xs uppercase tracking-wider border-border text-foreground hover:border-foreground/40 bg-card cursor-pointer"
          >
            <BookOpen className="h-3.5 w-3.5 mr-1 text-[#eb0028]" />
            <span>RECOMMEND RESOURCE //</span>
          </Button>

          <Button
            size="sm"
            variant="red"
            onClick={() => setIsRecommendOpportunityOpen(true)}
            className="font-mono text-xs uppercase tracking-wider cursor-pointer shadow-[0_0_20px_rgba(235,0,40,0.3)]"
          >
            <Send className="h-3.5 w-3.5 mr-1" />
            <span>RECOMMEND SCHEME //</span>
          </Button>
        </div>
      </div>

      {/* Privacy Notice Banner */}
      <div className="rounded-2xl border border-border bg-card p-3.5 text-xs text-muted-foreground font-mono flex items-center gap-2.5">
        <ShieldAlert className="h-4 w-4 text-[#eb0028] shrink-0" />
        <span>
          PRIVACY PROTOCOL: Demographic attributes are safeguarded. Only competencies, milestones, and application trackers are visible.
        </span>
      </div>

      {/* Top Profile Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core Profile */}
        <div className="rounded-[26px] border border-border bg-card text-card-foreground p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2 font-dot text-xs uppercase tracking-widest text-foreground pb-3 border-b border-border">
            <User className="h-4 w-4 text-[#eb0028]" />
            <span>Aspirations &amp; Goals //</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <span className="text-muted-foreground text-[10px] uppercase">Target Careers:</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {student.careerAspirations.length > 0 ? (
                  student.careerAspirations.map((a, i) => (
                    <span key={i} className="font-mono text-xs px-2.5 py-0.5 rounded-md border border-amber-500/30 bg-amber-500/10 text-amber-500 dark:text-amber-400">
                      {a}
                    </span>
                  ))
                ) : (
                  <span className="text-muted-foreground italic">Undecided</span>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <span className="text-muted-foreground text-[10px] uppercase">Interests:</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {student.interests.map((it, i) => (
                  <span key={i} className="font-mono text-[10px] px-2 py-0.5 rounded border border-border bg-muted text-foreground capitalize">
                    {it.replace("_", " ")}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <span className="text-muted-foreground text-[10px] uppercase">Favorite Subjects:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {student.favoriteSubjects.map((s, i) => (
                  <span key={i} className="bg-muted border border-border text-foreground px-2 py-0.5 rounded text-[10px]">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Readiness & Context */}
        <div className="rounded-[26px] border border-border bg-card text-card-foreground p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2 font-dot text-xs uppercase tracking-widest text-foreground pb-3 border-b border-border">
            <GraduationCap className="h-4 w-4 text-[#00dc82]" />
            <span>Learning Context &amp; Skills //</span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between py-1 border-b border-border">
              <span className="text-muted-foreground">Learning Style:</span>
              <span className="font-semibold text-foreground capitalize">{student.learningStyle}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border">
              <span className="text-muted-foreground">Preferred Track:</span>
              <span className="font-semibold text-foreground capitalize">{student.careerPreference}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border">
              <span className="text-muted-foreground">Device Access:</span>
              <span className="font-semibold text-foreground capitalize">{student.deviceAccess}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border">
              <span className="text-muted-foreground">Weekly Study Hours:</span>
              <span className="font-semibold text-[#00dc82]">{student.availableHours} HRS/WEEK</span>
            </div>
            <div className="pt-1">
              <span className="text-muted-foreground text-[10px] uppercase">Verified Skills:</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {student.skills.map((sk, i) => (
                  <span key={i} className="font-mono text-[10px] px-2 py-0.5 rounded border border-[#00dc82]/30 bg-[#00dc82]/10 text-[#00dc82]">
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Overall Progress & Roadmaps */}
        <div className="rounded-[26px] border border-border bg-card text-card-foreground p-6 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 font-dot text-xs uppercase tracking-widest text-foreground pb-3 border-b border-border">
              <Route className="h-4 w-4 text-[#eb0028]" />
              <span>Curriculum Progress //</span>
            </div>

            <div className="space-y-3 font-mono text-xs mt-4">
              <div className="flex justify-between font-semibold">
                <span className="text-muted-foreground">VERIFIED COMPLETION:</span>
                <span className="text-[#00dc82]">{overallProgress}%</span>
              </div>

              {/* Segmented meter */}
              <div className="grid grid-cols-10 gap-1">
                {Array.from({ length: 10 }).map((_, i) => {
                  const active = i < Math.round(overallProgress / 10);
                  return (
                    <div
                      key={i}
                      className={`h-2 rounded-sm transition-all duration-300 ${
                        active
                          ? "bg-[#00dc82] shadow-[0_0_8px_rgba(0,220,130,0.6)]"
                          : "bg-muted"
                      }`}
                    />
                  );
                })}
              </div>

              <p className="text-[11px] text-muted-foreground">
                {completedSteps} of {totalSteps} modular roadmap steps completed
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-border space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Saved Schemes:</span>
              <span className="font-bold text-foreground">{student.savedOpportunities.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Active Applications:</span>
              <span className="font-bold text-foreground">{student.applications.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabbed Sections */}
      <Tabs defaultValue="roadmap" className="w-full">
        <TabsList className="bg-muted border border-border p-1 rounded-2xl flex flex-wrap gap-1 font-mono text-xs">
          <TabsTrigger value="roadmap" className="data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-xl text-muted-foreground">
            Roadmaps ({student.roadmaps.length})
          </TabsTrigger>
          <TabsTrigger value="applications" className="data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-xl text-muted-foreground">
            Applications ({student.applications.length + student.savedOpportunities.length})
          </TabsTrigger>
          <TabsTrigger value="notes" className="data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-xl text-muted-foreground">
            Facilitator Notes
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-xl text-muted-foreground">
            Dispatched ({recommendList.length})
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: ROADMAP */}
        <TabsContent value="roadmap" className="space-y-4 pt-4">
          {student.roadmaps.length === 0 ? (
            <div className="p-8 text-center bg-card rounded-[26px] border border-border">
              <p className="text-xs font-mono text-muted-foreground">No active learning roadmaps found.</p>
            </div>
          ) : (
            student.roadmaps.map((rm) => (
              <div key={rm.id} className="rounded-[26px] border border-border bg-card text-card-foreground p-6 backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div>
                    <h3 className="font-dot text-base uppercase tracking-wider text-foreground">
                      {rm.careerTitle}
                    </h3>
                    {rm.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {rm.description}
                      </p>
                    )}
                  </div>
                  <span className="font-dot text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full border border-border bg-muted text-foreground">
                    {rm.status}
                  </span>
                </div>

                <div className="space-y-3">
                  {rm.steps.map((step) => (
                    <div
                      key={step.id}
                      className="flex items-start gap-3 p-4 rounded-2xl border border-border bg-muted/60 transition-colors"
                    >
                      <div className="mt-0.5">
                        {step.status === "completed" ? (
                          <CheckCircle2 className="h-5 w-5 text-[#00dc82]" />
                        ) : step.status === "in_progress" ? (
                          <Clock className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border border-border flex items-center justify-center text-[10px] font-mono text-muted-foreground">
                            {step.order}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 font-mono text-xs">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-foreground">
                            Step {step.order}: {step.title}
                          </h4>
                          <span className="text-[10px] text-muted-foreground uppercase">
                            {step.duration || "Self-paced"}
                          </span>
                        </div>
                        {step.description && (
                          <p className="text-muted-foreground mt-1 font-sans">{step.description}</p>
                        )}

                        {step.resource && (
                          <div className="mt-2.5 flex items-center gap-2 text-[11px] text-[#eb0028] font-mono">
                            <BookOpen className="h-3.5 w-3.5" />
                            <span>{step.resource.title}</span>
                            {step.resource.provider && (
                              <span className="text-muted-foreground">({step.resource.provider})</span>
                            )}
                            {step.resource.url && (
                              <a
                                href={step.resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-foreground hover:underline flex items-center gap-0.5 ml-1"
                              >
                                [OPEN] <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </TabsContent>

        {/* TAB 2: APPLICATIONS & SAVED OPPORTUNITIES */}
        <TabsContent value="applications" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Active Applications */}
            <div className="rounded-[26px] border border-border bg-card text-card-foreground p-6 backdrop-blur-xl space-y-4">
              <div className="flex items-center gap-2 font-dot text-xs uppercase tracking-widest text-foreground pb-3 border-b border-border">
                <FileCheck2 className="h-4 w-4 text-[#00dc82]" />
                <span>Application Records ({student.applications.length})</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {student.applications.length === 0 ? (
                  <p className="text-muted-foreground py-4 text-center">No applications recorded.</p>
                ) : (
                  student.applications.map((app) => (
                    <div key={app.id} className="p-3.5 rounded-2xl border border-border bg-muted/60 space-y-1.5">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-foreground">{app.title}</span>
                        <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded border border-border bg-card text-muted-foreground">
                          {app.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">Provider: {app.provider || "Government Agency"}</p>
                      {app.nextAction && (
                        <div className="text-[11px] text-[#00dc82] bg-[#00dc82]/10 p-2 rounded-xl border border-[#00dc82]/20">
                          <strong>Next Action:</strong> {app.nextAction}
                        </div>
                      )}
                      {app.notes && (
                        <p className="text-[11px] text-muted-foreground italic">&ldquo;{app.notes}&rdquo;</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Saved Opportunities */}
            <div className="rounded-[26px] border border-border bg-card text-card-foreground p-6 backdrop-blur-xl space-y-4">
              <div className="flex items-center gap-2 font-dot text-xs uppercase tracking-widest text-foreground pb-3 border-b border-border">
                <Bookmark className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                <span>Saved Opportunities ({student.savedOpportunities.length})</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {student.savedOpportunities.length === 0 ? (
                  <p className="text-muted-foreground py-4 text-center">No schemes bookmarked.</p>
                ) : (
                  student.savedOpportunities.map((opp) => (
                    <div key={opp.id} className="p-3.5 rounded-2xl border border-border bg-muted/60 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-foreground">{opp.title}</span>
                        <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded border border-border bg-card text-muted-foreground">
                          {opp.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">{opp.provider}</p>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 font-sans">{opp.description}</p>
                      {opp.applicationUrl && (
                        <a
                          href={opp.applicationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-[#eb0028] hover:underline pt-1 font-semibold"
                        >
                          Visit Portal <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* TAB 3: FACILITATOR NOTES */}
        <TabsContent value="notes" className="space-y-4 pt-4">
          <div className="rounded-[26px] border border-border bg-card text-card-foreground p-6 backdrop-blur-xl space-y-4">
            <div className="flex items-center gap-2 font-dot text-xs uppercase tracking-widest text-foreground pb-3 border-b border-border">
              <Edit3 className="h-4 w-4 text-[#eb0028]" />
              <span>Facilitator Observation Log //</span>
            </div>

            <div className="space-y-4">
              {notesSuccessMessage && (
                <div className="p-3.5 rounded-2xl bg-[#00dc82]/10 border border-[#00dc82]/30 text-xs font-mono text-[#00dc82] flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#00dc82] shrink-0" />
                  <span>{notesSuccessMessage}</span>
                </div>
              )}

              <Textarea
                rows={6}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Log guidance notes (e.g. Completed orientation on 12th Oct. Recommended solar technician pathway. Needs assistance with Class 10 marksheet attestation)..."
                className="text-xs bg-muted/50 border-border focus:border-[#eb0028] text-foreground rounded-2xl font-mono placeholder:text-muted-foreground"
              />

              <div className="flex justify-between items-center pt-2 font-mono text-xs">
                <span className="text-muted-foreground text-[10px]">
                  Encrypted // Authorized Facilitators Only
                </span>
                <Button
                  size="sm"
                  variant="red"
                  onClick={handleSaveNotes}
                  disabled={isSavingNotes}
                  className="font-mono text-xs uppercase tracking-wider"
                >
                  {isSavingNotes ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5 mr-1.5" />
                      SAVE NOTES //
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* TAB 4: RECOMMENDATIONS */}
        <TabsContent value="recommendations" className="space-y-4 pt-4">
          <div className="rounded-[26px] border border-border bg-card text-card-foreground p-6 backdrop-blur-xl space-y-4">
            <div className="flex items-center gap-2 font-dot text-xs uppercase tracking-widest text-foreground pb-3 border-b border-border">
              <Send className="h-4 w-4 text-[#00dc82]" />
              <span>Recommendations Log //</span>
            </div>

            {recommendList.length === 0 ? (
              <div className="text-center py-8 text-xs font-mono text-muted-foreground">
                No recommendations dispatched yet. Use the buttons above to recommend resources or schemes.
              </div>
            ) : (
              <div className="space-y-3 font-mono text-xs">
                {recommendList.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3.5 rounded-2xl border border-border bg-muted/60 flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded border border-[#00dc82]/30 bg-[#00dc82]/10 text-[#00dc82]">
                          {rec.type}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(rec.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                      <p className="text-foreground font-medium">{rec.message || "Recommendation shared"}</p>
                    </div>

                    <span className="font-mono text-[10px] uppercase text-muted-foreground">
                      {rec.isRead ? "VIEWED" : "PENDING"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* DIALOG: Recommend Learning Resource */}
      <Dialog open={isRecommendResourceOpen} onOpenChange={setIsRecommendResourceOpen}>
        <DialogContent className="sm:max-w-md bg-card border border-border text-foreground rounded-[28px] p-6 shadow-2xl">
          <form onSubmit={handleSendResourceRec}>
            <DialogHeader className="space-y-1">
              <DialogTitle className="font-dot text-lg uppercase tracking-wider text-foreground">
                Recommend Resource //
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground font-mono">
                Select an open educational module from DIKSHA or Skill India to dispatch to {student.displayName}.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3 font-mono text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="resourceSelect" className="text-muted-foreground uppercase text-[10px]">Select Resource</Label>
                <select
                  id="resourceSelect"
                  value={selectedResourceId}
                  onChange={(e) => setSelectedResourceId(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted px-3 py-2 text-xs text-foreground focus:border-[#eb0028]"
                >
                  {availableResources.map((res) => (
                    <option key={res.id} value={res.id} className="bg-card text-foreground">
                      {res.title} ({res.provider})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="recMsg" className="text-muted-foreground uppercase text-[10px]">Facilitator Advice Note</Label>
                <Textarea
                  id="recMsg"
                  rows={3}
                  value={resourceMessage}
                  onChange={(e) => setResourceMessage(e.target.value)}
                  placeholder="e.g. Focus on Chapter 3 regarding inverter troubleshooting before our next center workshop..."
                  className="bg-muted/50 border-border text-foreground rounded-xl text-xs font-mono placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsRecommendResourceOpen(false)}
                className="font-mono text-xs border-border text-foreground bg-card hover:bg-muted"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="red"
                size="sm"
                disabled={isSubmittingRec}
                className="font-mono text-xs"
              >
                {isSubmittingRec ? "Dispatching..." : "DISPATCH //"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG: Recommend Opportunity */}
      <Dialog open={isRecommendOpportunityOpen} onOpenChange={setIsRecommendOpportunityOpen}>
        <DialogContent className="sm:max-w-md bg-card border border-border text-foreground rounded-[28px] p-6 shadow-2xl">
          <form onSubmit={handleSendOppRec}>
            <DialogHeader className="space-y-1">
              <DialogTitle className="font-dot text-lg uppercase tracking-wider text-foreground">
                Recommend Scheme //
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground font-mono">
                Suggest an apprenticeship opening or scholarship to {student.displayName}.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3 font-mono text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="oppSelect" className="text-muted-foreground uppercase text-[10px]">Select Scheme</Label>
                <select
                  id="oppSelect"
                  value={selectedOppId}
                  onChange={(e) => setSelectedOppId(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted px-3 py-2 text-xs text-foreground focus:border-[#eb0028]"
                >
                  {availableOpportunities.map((opp) => (
                    <option key={opp.id} value={opp.id} className="bg-card text-foreground">
                      {opp.title} ({opp.provider})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="oppMsg" className="text-muted-foreground uppercase text-[10px]">Guidance Note</Label>
                <Textarea
                  id="oppMsg"
                  rows={3}
                  value={oppMessage}
                  onChange={(e) => setOppMessage(e.target.value)}
                  placeholder="e.g. Verify your income certificate by Monday; this scheme covers 100% of tool-kit costs..."
                  className="bg-muted/50 border-border text-foreground rounded-xl text-xs font-mono placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsRecommendOpportunityOpen(false)}
                className="font-mono text-xs border-border text-foreground bg-card hover:bg-muted"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="red"
                size="sm"
                disabled={isSubmittingRec}
                className="font-mono text-xs"
              >
                {isSubmittingRec ? "Dispatching..." : "DISPATCH //"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
