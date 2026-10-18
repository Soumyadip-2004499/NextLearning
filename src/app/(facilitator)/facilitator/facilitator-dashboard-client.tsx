"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  Compass,
  Layers,
  Send,
  Search,
  Filter,
  PlusCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Clock,
  Sparkles,
  Award,
  BookOpen,
  ArrowRight,
  UserPlus,
  Info,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface StudentItem {
  id: string;
  displayName: string;
  email: string | null;
  educationLevel: string;
  state: string;
  district: string;
  interests: string[];
  skills: string[];
  careerAspirations: string[];
  roadmapCount: number;
  activeRoadmaps: number;
  roadmapProgress: number;
  savedOpportunitiesCount: number;
  applicationsCount: number;
  lastActive: string;
  notes: string | null;
}

interface ActivityItem {
  id: string;
  type: string;
  studentName: string;
  title: string;
  description: string;
  timestamp: string;
}

interface FacilitatorDashboardClientProps {
  facilitatorName: string;
  organization: string;
  district: string;
  state: string;
  stats: {
    totalStudents: number;
    activeRoadmaps: number;
    modulesPublished: number;
    totalModules: number;
    recommendationsSent: number;
  };
  initialStudents: StudentItem[];
  initialActivity: ActivityItem[];
}

export function FacilitatorDashboardClient({
  facilitatorName,
  organization,
  district,
  state,
  stats,
  initialStudents,
  initialActivity,
}: FacilitatorDashboardClientProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [levelFilter, setLevelFilter] = React.useState("all");
  const [progressFilter, setProgressFilter] = React.useState("all");
  const [students, setStudents] = React.useState(initialStudents);
  const [isAddStudentOpen, setIsAddStudentOpen] = React.useState(false);
  const [newStudentName, setNewStudentName] = React.useState("");
  const [newStudentPhone, setNewStudentPhone] = React.useState("");
  const [newStudentLevel, setNewStudentLevel] = React.useState("class_10");

  // Filtering students
  const filteredStudents = React.useMemo(() => {
    return students.filter((s) => {
      // Search
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        s.displayName.toLowerCase().includes(q) ||
        s.educationLevel.toLowerCase().includes(q) ||
        s.district.toLowerCase().includes(q) ||
        s.interests.some((i) => i.toLowerCase().includes(q)) ||
        s.careerAspirations.some((c) => c.toLowerCase().includes(q));

      // Level
      const matchesLevel =
        levelFilter === "all" ||
        s.educationLevel.toLowerCase().includes(levelFilter.toLowerCase());

      // Progress
      let matchesProgress = true;
      if (progressFilter === "high") {
        matchesProgress = s.roadmapProgress >= 50;
      } else if (progressFilter === "in_progress") {
        matchesProgress = s.roadmapProgress > 0 && s.roadmapProgress < 50;
      } else if (progressFilter === "started") {
        matchesProgress = s.roadmapProgress === 0;
      }

      return matchesSearch && matchesLevel && matchesProgress;
    });
  }, [students, searchQuery, levelFilter, progressFilter]);

  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    // Simulate adding demo student assignment
    const mockStudent: StudentItem = {
      id: `student-demo-${Date.now()}`,
      displayName: newStudentName.trim(),
      email: `${newStudentName.toLowerCase().replace(/\s+/g, "")}@example.com`,
      educationLevel: newStudentLevel,
      state: state || "Andhra Pradesh",
      district: district || "Anantapur",
      interests: ["trades", "technology"],
      skills: ["Basic Computer Operations"],
      careerAspirations: ["Vocational Technician"],
      roadmapCount: 1,
      activeRoadmaps: 1,
      roadmapProgress: 0,
      savedOpportunitiesCount: 0,
      applicationsCount: 0,
      lastActive: "Just enrolled",
      notes: "Newly enrolled student. Initial orientation pending.",
    };

    setStudents([mockStudent, ...students]);
    setIsAddStudentOpen(false);
    setNewStudentName("");
    setNewStudentPhone("");
  };

  return (
    <div className="space-y-8">
      {/* Telemetry Status Banner */}
      <div className="rounded-[22px] border border-border bg-card/95 p-4 shadow-sm text-xs font-mono text-muted-foreground flex items-center justify-between flex-wrap gap-2 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <span className="red-dot" />
          <span className="text-foreground font-bold tracking-wider">
            FACILITATOR TERMINAL //
          </span>
          <span className="text-muted-foreground">
            Evaluation Console Active · District Grassroots Ingestion
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground font-mono">
          <span>{organization.toUpperCase()}</span>
          <span>/</span>
          <span>{district.toUpperCase()}, {state.toUpperCase()}</span>
        </div>
      </div>

      {/* Welcome & Overview Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-sans font-bold tracking-tight text-foreground">
            Welcome back, <span className="font-dot tracking-widest text-[#eb0028]">{facilitatorName.toUpperCase()}</span>
          </h1>
          <p className="text-xs font-mono text-muted-foreground mt-1">
            // STUDENT MENTORSHIP ROSTER & SKILLING ACCELERATION
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="bg-card border-border text-foreground font-mono text-xs rounded-full hover:border-[#eb0028] shadow-xs">
                <UserPlus className="h-3.5 w-3.5 mr-1.5 text-[#eb0028]" />
                ENROLL STUDENT //
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-card border-border text-foreground rounded-[28px] shadow-2xl">
              <form onSubmit={handleAddStudentSubmit}>
                <DialogHeader>
                  <DialogTitle className="font-sans font-bold text-foreground text-lg">Enroll New Student</DialogTitle>
                  <DialogDescription className="text-xs font-mono text-muted-foreground">
                    Assign a student from your district center to your mentorship roster.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="student-name" className="text-xs font-mono text-muted-foreground">STUDENT FULL NAME</Label>
                    <Input
                      id="student-name"
                      placeholder="e.g. Priya Kumari"
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                      className="bg-card border-border text-foreground rounded-xl text-xs font-mono placeholder:text-muted-foreground focus-visible:border-[#eb0028]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="student-phone" className="text-xs font-mono text-muted-foreground">PHONE / WHATSAPP</Label>
                    <Input
                      id="student-phone"
                      placeholder="+91 9876543210"
                      value={newStudentPhone}
                      onChange={(e) => setNewStudentPhone(e.target.value)}
                      className="bg-card border-border text-foreground rounded-xl text-xs font-mono placeholder:text-muted-foreground focus-visible:border-[#eb0028]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="student-level" className="text-xs font-mono text-muted-foreground">EDUCATION LEVEL</Label>
                    <select
                      id="student-level"
                      className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-[#eb0028]"
                      value={newStudentLevel}
                      onChange={(e) => setNewStudentLevel(e.target.value)}
                    >
                      <option value="class_9">Class 9</option>
                      <option value="class_10">Class 10 (Secondary)</option>
                      <option value="class_11">Class 11</option>
                      <option value="class_12">Class 12 (Higher Secondary)</option>
                      <option value="iti">ITI / Polytechnic Vocational</option>
                      <option value="graduate">Undergraduate Degree</option>
                    </select>
                  </div>
                  <div className="p-3 bg-muted rounded-xl text-xs font-mono text-muted-foreground border border-border">
                    <span className="text-foreground font-semibold">// PRIVACY NOTICE:</span> Assigned students will share career preferences and roadmap milestones.
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddStudentOpen(false)} className="rounded-xl font-mono text-xs border-border text-foreground bg-card hover:bg-muted">
                    CANCEL
                  </Button>
                  <Button type="submit" variant="red" className="rounded-xl font-mono text-xs">
                    CONFIRM ENROLLMENT //
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Link href="/facilitator/modules/new">
            <Button size="sm" variant="red" className="font-mono text-xs tracking-wider rounded-full shadow-[0_0_15px_rgba(235,0,40,0.3)]">
              <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
              CREATE MODULE //
            </Button>
          </Link>

          <Link href="/facilitator/directory">
            <Button variant="outline" size="sm" className="font-mono text-xs rounded-full border-border bg-card text-foreground hover:border-[#eb0028] shadow-xs">
              <Compass className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
              DIRECTORY
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <Card className="border border-border bg-card/95 rounded-[24px] shadow-sm hover:border-foreground/20 hover:shadow-md transition-all backdrop-blur-xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                STUDENTS // ROSTER
              </span>
              <div className="p-2 rounded-xl bg-muted border border-border text-foreground">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-foreground">
                {stats.totalStudents}
              </span>
              <span className="text-xs text-[#00dc82] font-mono flex items-center">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00dc82] mr-1" /> ACTIVE
              </span>
            </div>
            <p className="text-[10px] font-mono text-muted-foreground mt-1">Direct facilitator mentorship</p>
          </CardContent>
        </Card>

        {/* Active Roadmaps */}
        <Card className="border border-border bg-card/95 rounded-[24px] shadow-sm hover:border-foreground/20 hover:shadow-md transition-all backdrop-blur-xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                ROADMAPS // ACTIVE
              </span>
              <div className="p-2 rounded-xl bg-muted border border-border text-[#eb0028]">
                <Compass className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-foreground">
                {stats.activeRoadmaps}
              </span>
              <span className="text-xs text-muted-foreground font-mono">TRACKING</span>
            </div>
            <p className="text-[10px] font-mono text-muted-foreground mt-1">Active skill pathways</p>
          </CardContent>
        </Card>

        {/* Modules Published */}
        <Card className="border border-border bg-card/95 rounded-[24px] shadow-sm hover:border-foreground/20 hover:shadow-md transition-all backdrop-blur-xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                MODULES // LIVE
              </span>
              <div className="p-2 rounded-xl bg-muted border border-border text-foreground">
                <Layers className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-foreground">
                {stats.modulesPublished}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                / {stats.totalModules} TOTAL
              </span>
            </div>
            <p className="text-[10px] font-mono text-muted-foreground mt-1">Self-paced training units</p>
          </CardContent>
        </Card>

        {/* Recommendations Sent */}
        <Card className="border border-border bg-card/95 rounded-[24px] shadow-sm hover:border-foreground/20 hover:shadow-md transition-all backdrop-blur-xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                DELIVERIES // SENT
              </span>
              <div className="p-2 rounded-xl bg-muted border border-border text-[#00dc82]">
                <Send className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-foreground">
                {stats.recommendationsSent}
              </span>
              <span className="text-xs text-[#00dc82] font-mono">DELIVERED</span>
            </div>
            <p className="text-[10px] font-mono text-muted-foreground mt-1">Curated links & schemes</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Student List & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Student List */}
        <div id="students-table" className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="red-dot" />
                <h2 className="text-lg font-bold font-mono tracking-tight text-foreground uppercase">
                  My Assigned Students //
                </h2>
              </div>
              <p className="text-xs font-mono text-muted-foreground mt-0.5">
                Active Mentorship Roster · Showing {filteredStudents.length} of {students.length} students
              </p>
            </div>

            {/* Filters & Search */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative w-full sm:w-52">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-xs font-mono bg-card border-border text-foreground rounded-xl placeholder:text-muted-foreground focus-visible:border-[#eb0028] focus-visible:ring-1 focus-visible:ring-[#eb0028] shadow-xs"
                />
              </div>

              <select
                aria-label="Filter by education level"
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="h-9 rounded-xl border border-border bg-card px-3 text-xs font-mono text-foreground focus:outline-none focus:border-[#eb0028] cursor-pointer shadow-xs"
              >
                <option value="all">All Levels</option>
                <option value="class_9">Class 9</option>
                <option value="class_10">Class 10</option>
                <option value="class_12">Class 12</option>
                <option value="graduate">Graduate</option>
              </select>

              <select
                aria-label="Filter by roadmap progress"
                value={progressFilter}
                onChange={(e) => setProgressFilter(e.target.value)}
                className="h-9 rounded-xl border border-border bg-card px-3 text-xs font-mono text-foreground focus:outline-none focus:border-[#eb0028] cursor-pointer shadow-xs"
              >
                <option value="all">All Progress</option>
                <option value="high">&gt; 50% Completed</option>
                <option value="in_progress">In Progress</option>
                <option value="started">Just Started (0%)</option>
              </select>
            </div>
          </div>

          {/* Students List Cards */}
          {filteredStudents.length === 0 ? (
            <Card className="border border-dashed border-border bg-card/40 p-8 text-center rounded-[24px]">
              <Users className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-mono font-semibold text-foreground mt-2">No students match your filter</p>
              <p className="text-xs font-mono text-muted-foreground mt-1">Try resetting search keywords or education level filter.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setLevelFilter("all");
                  setProgressFilter("all");
                }}
                className="mt-4 text-xs font-mono border-border text-foreground hover:border-[#eb0028] rounded-full bg-card"
              >
                RESET FILTERS //
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredStudents.map((student) => (
                <Link
                  key={student.id}
                  href={`/facilitator/students/${student.id}`}
                  className="block group"
                >
                  <Card className="border border-border bg-card/95 hover:border-foreground/20 hover:shadow-xl transition-all rounded-[24px] backdrop-blur-xl group-hover:-translate-y-0.5 shadow-sm">
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* Student Info */}
                        <div className="space-y-2 flex-1 min-w-0">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="font-mono font-bold text-foreground group-hover:text-[#eb0028] transition-colors text-base sm:text-lg tracking-tight">
                              {student.displayName}
                            </span>
                            <span className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-border bg-muted text-foreground font-semibold">
                              {student.educationLevel.replace("_", " ")}
                            </span>
                            <span className="text-muted-foreground">&bull;</span>
                            <span className="text-xs font-mono text-muted-foreground">
                              {student.district}, {student.state}
                            </span>
                          </div>

                          {/* Aspirations & Interests */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {student.careerAspirations.slice(0, 2).map((asp, i) => (
                              <span
                                key={i}
                                className="font-mono text-[10px] px-2.5 py-0.5 rounded-md border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-200 font-medium"
                              >
                                {asp}
                              </span>
                            ))}
                            {student.interests.slice(0, 2).map((interest, i) => (
                              <span
                                key={i}
                                className="font-mono text-[10px] px-2 py-0.5 rounded-md border border-border bg-muted text-foreground capitalize"
                              >
                                {interest.replace("_", " ")}
                              </span>
                            ))}
                          </div>

                          {/* Notes snippet if exists */}
                          {student.notes && (
                            <p className="text-xs font-mono text-muted-foreground italic line-clamp-1 border-l-2 border-border pl-2 mt-1">
                              &ldquo;{student.notes}&rdquo;
                            </p>
                          )}
                        </div>

                        {/* Progress Bar & Actions */}
                        <div className="sm:w-52 shrink-0 flex flex-col justify-center space-y-2 sm:border-l sm:border-border sm:pl-5">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-muted-foreground">Roadmap Progress</span>
                            <span className="font-bold text-[#00dc82]">{student.roadmapProgress}%</span>
                          </div>
                          <Progress value={student.roadmapProgress} className="h-2 bg-muted [&>div]:bg-[#00dc82]" />
                          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground pt-0.5">
                            <span>{student.activeRoadmaps} active roadmap{student.activeRoadmaps === 1 ? '' : 's'}</span>
                            <span className="flex items-center gap-1 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all">
                              <span className="text-[10px] uppercase">DOSSIER</span>
                              <ChevronRight className="h-3.5 w-3.5 text-[#eb0028]" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (1 Col): Activity Feed & Quick Links */}
        <div className="space-y-6">
          {/* Recent Activity Feed */}
          <Card className="border border-border bg-card/95 rounded-[24px] shadow-sm backdrop-blur-xl">
            <CardHeader className="pb-3 border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold font-mono text-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#eb0028]" />
                  Recent Activity Feed
                </CardTitle>
                <span className="font-mono text-[10px] text-[#00dc82] px-2 py-0.5 rounded-full border border-[#00dc82]/30 bg-[#00dc82]/10 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00dc82] animate-pulse" />
                  Live
                </span>
              </div>
              <CardDescription className="text-xs font-mono text-muted-foreground">
                Milestones & recommendations across cohort
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              {initialActivity.length === 0 ? (
                <div className="text-center py-6 text-xs font-mono text-muted-foreground">
                  No activity recorded yet today.
                </div>
              ) : (
                <div className="space-y-4">
                  {initialActivity.slice(0, 6).map((item) => (
                    <div key={item.id} className="flex items-start gap-3 text-xs">
                      <div className="mt-0.5 p-1.5 rounded-xl bg-muted border border-border text-[#00dc82] shrink-0">
                        {item.type === "recommendation" ? (
                          <Send className="h-3.5 w-3.5 text-[#eb0028]" />
                        ) : (
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#00dc82]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="font-mono font-bold text-foreground truncate text-xs">
                            {item.studentName}
                          </p>
                          <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                            {new Date(item.timestamp).toLocaleDateString("en-IN", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <p className="text-foreground/80 font-mono text-xs mt-0.5 font-medium">{item.title}</p>
                        <p className="text-[11px] font-mono text-muted-foreground truncate mt-0.5">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Vocational Skilling Spotlight */}
          <Card className="border border-border bg-card/95 text-foreground rounded-[24px] shadow-sm relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#eb0028]/10 rounded-full blur-2xl pointer-events-none" />
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-[#eb0028] text-xs font-mono uppercase tracking-wider font-semibold">
                <Sparkles className="h-3.5 w-3.5" />
                Facilitator Resource Toolkit
              </div>
              <CardTitle className="text-base text-foreground font-mono font-bold">
                PM Surya Ghar & Solar Rooftop Skilling
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs font-mono text-muted-foreground">
              <p className="leading-relaxed">
                The Ministry of New & Renewable Energy has announced new training batches for Surya Mitra technicians.
              </p>
              <div className="pt-2">
                <Link href="/facilitator/directory">
                  <Button size="sm" className="w-full bg-[#eb0028] hover:bg-[#c50022] text-white font-mono font-bold text-xs rounded-full cursor-pointer">
                    BROWSE PARTNER NGOS & PROVIDERS //
                    <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
