"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Layers,
  Save,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  BookOpen,
  ArrowUp,
  ArrowDown,
  Eye,
  Edit3,
  ExternalLink,
  GraduationCap,
  Sparkles,
  HelpCircle,
  FileQuestion,
  FileText,
  Activity,
  Award,
  Radio,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GlyphBar } from "@/components/ui/nothing-elements";

interface LessonItem {
  id: string;
  moduleId: string;
  order: number;
  title: string;
  content: string;
  resourceUrl: string;
  duration: string;
  activityType: string;
  createdAt: string;
}

interface ModuleDetails {
  id: string;
  title: string;
  description: string | null;
  targetLevel: string;
  objectives: string[];
  status: string;
  accessType: string;
  estimatedDuration: string;
}

interface ModuleEditorClientProps {
  initialModule: ModuleDetails;
  initialLessons: LessonItem[];
}

export function ModuleEditorClient({
  initialModule,
  initialLessons,
}: ModuleEditorClientProps) {
  const router = useRouter();
  const [moduleData, setModuleData] = React.useState<ModuleDetails>(initialModule);
  const [lessons, setLessons] = React.useState<LessonItem[]>(initialLessons);

  // View state: 'edit' or 'preview'
  const [viewMode, setViewMode] = React.useState<"edit" | "preview">("edit");
  const [previewSelectedLessonIndex, setPreviewSelectedLessonIndex] = React.useState<number>(0);

  // Module Details Edit Form State
  const [title, setTitle] = React.useState(moduleData.title);
  const [description, setDescription] = React.useState(moduleData.description || "");
  const [targetLevel, setTargetLevel] = React.useState(moduleData.targetLevel);
  const [estimatedDuration, setEstimatedDuration] = React.useState(moduleData.estimatedDuration);
  const [objectives, setObjectives] = React.useState<string[]>(moduleData.objectives);
  const [newObjective, setNewObjective] = React.useState("");

  const [isSavingModule, setIsSavingModule] = React.useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = React.useState(false);

  // Add Lesson Dialog State
  const [isAddLessonOpen, setIsAddLessonOpen] = React.useState(false);
  const [lessonTitle, setLessonTitle] = React.useState("");
  const [lessonContent, setLessonContent] = React.useState("");
  const [lessonResourceUrl, setLessonResourceUrl] = React.useState("");
  const [lessonDuration, setLessonDuration] = React.useState("20 mins");
  const [lessonActivityType, setLessonActivityType] = React.useState("lesson");
  const [isAddingLesson, setIsAddingLesson] = React.useState(false);

  // Status feedback
  const [feedbackMessage, setFeedbackMessage] = React.useState<{ text: string; isError?: boolean } | null>(null);

  const showFeedback = (text: string, isError = false) => {
    setFeedbackMessage({ text, isError });
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  // Save Module Meta
  const handleSaveModuleDetails = async () => {
    setIsSavingModule(true);
    try {
      const res = await fetch(`/api/facilitator/modules/${moduleData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          targetLevel,
          estimatedDuration,
          objectives,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setModuleData(data.data);
        showFeedback("Module specifications updated successfully.");
      } else {
        showFeedback(data.error || "Failed to update module.", true);
      }
    } catch {
      showFeedback("Error saving module details.", true);
    } finally {
      setIsSavingModule(false);
    }
  };

  // Publish / Unpublish Toggle
  const handleTogglePublish = async () => {
    setIsTogglingStatus(true);
    const newStatus = moduleData.status === "published" ? "draft" : "published";

    try {
      const res = await fetch(`/api/facilitator/modules/${moduleData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setModuleData(data.data);
        showFeedback(`Module is now ${newStatus.toUpperCase()}.`);
      } else {
        showFeedback(data.error || "Failed to update publish state.", true);
      }
    } catch {
      showFeedback("Network error updating status.", true);
    } finally {
      setIsTogglingStatus(false);
    }
  };

  // Add Lesson Submit
  const handleAddLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle.trim()) return;
    setIsAddingLesson(true);

    try {
      const res = await fetch(`/api/facilitator/modules/${moduleData.id}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: lessonTitle.trim(),
          content: lessonContent.trim(),
          resourceUrl: lessonResourceUrl.trim() || null,
          duration: lessonDuration.trim() || "15 mins",
          activityType: lessonActivityType,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setLessons([...lessons, data.data]);
        setIsAddLessonOpen(false);
        setLessonTitle("");
        setLessonContent("");
        setLessonResourceUrl("");
        setLessonDuration("20 mins");
        setLessonActivityType("lesson");
        showFeedback("Lesson appended to module curriculum.");
      } else {
        alert(data.error || "Failed to add lesson");
      }
    } catch {
      alert("Error adding lesson");
    } finally {
      setIsAddingLesson(false);
    }
  };

  // Reorder lessons
  const handleMoveLesson = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= lessons.length) return;

    const updated = [...lessons];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // Update local order numbers
    const reordered = updated.map((l, i) => ({ ...l, order: i + 1 }));
    setLessons(reordered);

    // Call API to persist
    try {
      await fetch(`/api/facilitator/modules/${moduleData.id}/lessons`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orders: reordered.map((l) => ({ id: l.id, order: l.order })),
        }),
      });
    } catch {
      console.error("Failed to update lesson order remotely");
    }
  };

  // Delete module
  const handleDeleteModule = async () => {
    if (!window.confirm(`Permanently delete module "${moduleData.title}" and all its lessons?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/facilitator/modules/${moduleData.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        router.push("/facilitator/modules");
        router.refresh();
      } else {
        alert(data.error || "Failed to delete module");
      }
    } catch {
      alert("Error deleting module");
    }
  };

  const isPublished = moduleData.status === "published";

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2">
      {/* Telemetry Strip / Status Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 px-4 py-2.5 rounded-2xl border border-border bg-card/80 text-foreground backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00dc82] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00dc82]"></span>
          </span>
          <span className="font-dot text-[11px] uppercase tracking-widest text-foreground font-semibold">
            MODULE.STUDIO // WORKSPACE // {moduleData.title.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <GlyphBar activeIndex={2} total={4} />
          <span className="font-mono text-[10px] text-muted-foreground">
            {isPublished ? "STATE: PUBLISHED" : "STATE: DRAFT"}
          </span>
        </div>
      </div>

      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-4">
          <Link
            href="/facilitator/modules"
            className="p-2.5 rounded-2xl bg-muted border border-border text-muted-foreground hover:text-foreground transition-colors shadow-md"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-dot font-bold uppercase tracking-wider text-foreground line-clamp-1">
                {moduleData.title}
              </h1>
              <span
                className={`font-dot text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                  isPublished
                    ? "border-[#00dc82]/40 text-[#00dc82] bg-[#00dc82]/10"
                    : "border-amber-500/40 text-amber-400 bg-amber-500/10"
                }`}
              >
                {isPublished ? "PUBLISHED" : "DRAFT"}
              </span>
            </div>
            <p className="font-mono text-xs text-muted-foreground mt-1">
              Curriculum Builder &bull; {lessons.length} lessons &bull; Target: {moduleData.targetLevel}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap font-mono text-xs">
          {/* Mode Switcher */}
          <div className="flex items-center bg-muted/50 p-1 rounded-xl border border-border">
            <button
              type="button"
              onClick={() => setViewMode("edit")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                viewMode === "edit"
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-black font-bold shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>EDITOR</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("preview")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                viewMode === "preview"
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-black font-bold shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Eye className="h-3.5 w-3.5 text-[#00dc82]" />
              <span>PREVIEW</span>
            </button>
          </div>

          {/* Publish / Unpublish Toggle */}
          <Button
            size="sm"
            variant="outline"
            onClick={handleTogglePublish}
            disabled={isTogglingStatus}
            className={`font-mono text-xs uppercase tracking-wider border-border text-foreground hover:bg-muted cursor-pointer ${
              isPublished
                ? "border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
                : "border-[#00dc82]/40 text-[#00dc82] hover:bg-[#00dc82]/10"
            }`}
          >
            {isTogglingStatus ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
            ) : isPublished ? (
              "UNPUBLISH //"
            ) : (
              "PUBLISH //"
            )}
          </Button>

          {/* Delete action */}
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDeleteModule}
            className="font-mono text-xs text-muted-foreground hover:text-[#eb0028] hover:bg-muted cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            DELETE
          </Button>
        </div>
      </div>

      {/* Feedback banner */}
      {feedbackMessage && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-mono flex items-center gap-2.5 ${
            feedbackMessage.isError
              ? "bg-[#eb0028]/10 text-[#eb0028] border border-[#eb0028]/30"
              : "bg-[#00dc82]/10 text-[#00dc82] border border-[#00dc82]/30"
          }`}
        >
          {feedbackMessage.isError ? (
            <AlertCircle className="h-4 w-4 shrink-0 text-[#eb0028]" />
          ) : (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#00dc82]" />
          )}
          <span className="font-semibold uppercase tracking-wider">{feedbackMessage.text}</span>
        </div>
      )}

      {/* VIEW MODE: EDIT */}
      {viewMode === "edit" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2 Cols): Lessons List with Reordering */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-dot text-sm uppercase tracking-wider text-foreground flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-[#eb0028]" />
                  Lessons &amp; Practical Activities ({lessons.length}) //
                </h2>
                <p className="font-mono text-xs text-muted-foreground">
                  Arrange pedagogical sequence in chronological flow.
                </p>
              </div>

              <Button
                size="sm"
                variant="red"
                onClick={() => setIsAddLessonOpen(true)}
                className="font-mono text-xs uppercase tracking-wider gap-1.5 cursor-pointer shadow-[0_0_20px_rgba(235,0,40,0.3)] keep-white"
              >
                <Plus className="h-3.5 w-3.5 keep-white" />
                <span className="keep-white">ADD LESSON //</span>
              </Button>
            </div>

            {/* Lessons Cards List */}
            {lessons.length === 0 ? (
              <div className="rounded-[28px] border border-dashed border-border bg-card/60 p-8 text-center space-y-3 text-card-foreground">
                <Layers className="mx-auto h-8 w-8 text-muted-foreground/60" />
                <p className="font-dot text-sm uppercase text-foreground">No Lessons Added Yet</p>
                <p className="font-mono text-xs text-muted-foreground max-w-sm mx-auto">
                  Click &ldquo;Add Lesson&rdquo; to introduce your first conceptual video, reading note, or practical activity.
                </p>
                <Button
                  size="sm"
                  variant="red"
                  onClick={() => setIsAddLessonOpen(true)}
                  className="font-mono text-xs uppercase tracking-wider mt-2 keep-white"
                >
                  <Plus className="h-3.5 w-3.5 mr-1 keep-white" />
                  <span className="keep-white">Add First Lesson //</span>
                </Button>
              </div>
            ) : (
              <div className="space-y-3 font-mono text-xs">
                {lessons.map((lesson, index) => {
                  const ActivityIcon =
                    lesson.activityType === "quiz"
                      ? FileQuestion
                      : lesson.activityType === "activity"
                      ? Activity
                      : lesson.activityType === "assignment"
                      ? Award
                      : FileText;

                  return (
                    <div
                      key={lesson.id}
                      className="rounded-[22px] border border-border bg-card hover:border-primary/40 p-4 flex items-start gap-3.5 transition-all text-card-foreground shadow-sm"
                    >
                      {/* Reordering arrows */}
                      <div className="flex flex-col items-center gap-1 pt-0.5">
                        <button
                          type="button"
                          onClick={() => handleMoveLesson(index, "up")}
                          disabled={index === 0}
                          className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-20 cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <span className="font-mono text-xs font-bold text-foreground">{lesson.order}</span>
                        <button
                          type="button"
                          onClick={() => handleMoveLesson(index, "down")}
                          disabled={index === lessons.length - 1}
                          className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-20 cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Lesson Content Info */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-foreground font-sans">
                            {lesson.title}
                          </span>
                          <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded border border-[#00dc82]/30 bg-[#00dc82]/10 text-[#00dc82]">
                            <ActivityIcon className="h-3 w-3 mr-1 inline" />
                            {lesson.activityType}
                          </span>
                          {lesson.duration && (
                            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {lesson.duration}
                            </span>
                          )}
                        </div>

                        {lesson.content && (
                          <p className="text-xs text-muted-foreground line-clamp-2 font-sans">
                            {lesson.content}
                          </p>
                        )}

                        {lesson.resourceUrl && (
                          <div className="pt-1">
                            <a
                              href={lesson.resourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-[#eb0028] hover:underline font-semibold"
                            >
                              Linked Material <ArrowUpRight className="h-3 w-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column (1 Col): Module Settings & Objectives */}
          <div className="space-y-4">
            <div className="rounded-[28px] border border-border bg-card p-6 backdrop-blur-xl space-y-4 shadow-sm">
              <div className="flex items-center gap-2 font-dot text-xs uppercase tracking-widest text-foreground pb-3 border-b border-border">
                <Edit3 className="h-4 w-4 text-sky-400" />
                <span>Module Details //</span>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div className="space-y-1.5">
                  <Label htmlFor="title" className="text-muted-foreground uppercase text-[10px]">
                    Title //
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-muted/50 border-border text-foreground rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="desc" className="text-muted-foreground uppercase text-[10px]">
                    Description //
                  </Label>
                  <Textarea
                    id="desc"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-muted/50 border-border text-foreground rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="target" className="text-muted-foreground uppercase text-[10px]">
                    Target Level //
                  </Label>
                  <select
                    id="target"
                    value={targetLevel}
                    onChange={(e) => setTargetLevel(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground"
                  >
                    <option className="bg-card text-foreground" value="class_9">Class 9</option>
                    <option className="bg-card text-foreground" value="class_10">Class 10 (Secondary)</option>
                    <option className="bg-card text-foreground" value="class_11">Class 11</option>
                    <option className="bg-card text-foreground" value="class_12">Class 12</option>
                    <option className="bg-card text-foreground" value="iti">ITI / Polytechnic</option>
                    <option className="bg-card text-foreground" value="graduate">Undergraduate Degree</option>
                    <option className="bg-card text-foreground" value="open">Open to All</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="duration" className="text-muted-foreground uppercase text-[10px]">
                    Duration //
                  </Label>
                  <Input
                    id="duration"
                    value={estimatedDuration}
                    onChange={(e) => setEstimatedDuration(e.target.value)}
                    className="bg-muted/50 border-border text-foreground rounded-xl"
                  />
                </div>

                {/* Objectives */}
                <div className="space-y-2 pt-2 border-t border-border">
                  <Label className="text-muted-foreground uppercase text-[10px]">
                    Learning Objectives ({objectives.length}) //
                  </Label>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {objectives.map((obj, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] bg-muted/60 p-2 rounded-xl border border-border text-foreground">
                        <span className="flex-1 truncate">&bull; {obj}</span>
                        <button
                          type="button"
                          onClick={() => setObjectives(objectives.filter((_, idx) => idx !== i))}
                          className="text-muted-foreground hover:text-[#eb0028] cursor-pointer"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-1.5 pt-1">
                    <Input
                      placeholder="New objective..."
                      value={newObjective}
                      onChange={(e) => setNewObjective(e.target.value)}
                      className="bg-muted/50 border-border text-foreground rounded-xl text-xs h-8"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (newObjective.trim()) {
                          setObjectives([...objectives, newObjective.trim()]);
                          setNewObjective("");
                        }
                      }}
                      className="h-8 text-xs px-2.5 border-border text-foreground hover:bg-muted"
                    >
                      ADD
                    </Button>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="red"
                  onClick={handleSaveModuleDetails}
                  disabled={isSavingModule}
                  className="w-full font-mono text-xs uppercase tracking-wider mt-2 cursor-pointer shadow-[0_0_20px_rgba(235,0,40,0.3)] keep-white"
                >
                  {isSavingModule ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5 keep-white" />
                      <span className="keep-white">Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5 mr-1.5 keep-white" />
                      <span className="keep-white">SAVE SPECIFICATIONS //</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE: STUDENT PREVIEW */}
      {viewMode === "preview" && (
        <div className="space-y-6">
          <div className="p-3.5 rounded-2xl bg-muted/60 border border-border text-xs font-mono text-foreground flex items-center justify-between">
            <span className="font-semibold flex items-center gap-2">
              <Eye className="h-4 w-4 text-[#00dc82]" />
              STUDENT COURSE PLAYER SIMULATOR
            </span>
            <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded border border-[#00dc82]/30 text-[#00dc82]">
              LIVE PREVIEW
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Lessons Sidebar */}
            <div className="rounded-[28px] border border-border bg-card p-6 backdrop-blur-xl md:col-span-1 space-y-4 shadow-sm">
              <div className="pb-3 border-b border-border">
                <h3 className="font-dot text-sm uppercase tracking-wider text-foreground">
                  Syllabus ({lessons.length} Lessons)
                </h3>
                <p className="font-mono text-xs text-muted-foreground mt-0.5">
                  {moduleData.estimatedDuration} &bull; {moduleData.targetLevel}
                </p>
              </div>

              <div className="space-y-1 font-mono text-xs">
                {lessons.map((lesson, idx) => (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => setPreviewSelectedLessonIndex(idx)}
                    className={`w-full text-left p-3 rounded-xl transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                      previewSelectedLessonIndex === idx
                        ? "bg-foreground text-background font-bold shadow-md"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <span className="truncate">
                      {lesson.order}. {lesson.title}
                    </span>
                    <span className="text-[10px] shrink-0 capitalize">
                      {lesson.duration || "15m"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Lesson Content Viewer */}
            <div className="rounded-[28px] border border-border bg-card p-7 backdrop-blur-xl md:col-span-2 shadow-sm">
              {lessons[previewSelectedLessonIndex] ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[#00dc82]">
                        Lesson {lessons[previewSelectedLessonIndex].order} &bull; {lessons[previewSelectedLessonIndex].activityType}
                      </span>
                      <h3 className="text-xl font-bold font-sans text-foreground mt-1">
                        {lessons[previewSelectedLessonIndex].title}
                      </h3>
                    </div>
                    {lessons[previewSelectedLessonIndex].duration && (
                      <span className="font-mono text-xs px-2.5 py-1 rounded-full border border-border bg-muted/50 text-muted-foreground">
                        {lessons[previewSelectedLessonIndex].duration}
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="text-foreground text-sm leading-relaxed whitespace-pre-wrap font-sans">
                    {lessons[previewSelectedLessonIndex].content || (
                      <span className="text-muted-foreground italic">No instructional text entered for this lesson yet.</span>
                    )}
                  </div>

                  {/* Resource Link */}
                  {lessons[previewSelectedLessonIndex].resourceUrl && (
                    <div className="p-4 rounded-2xl bg-muted/50 border border-border flex items-center justify-between">
                      <div className="flex items-center gap-2.5 text-xs font-mono">
                        <BookOpen className="h-4 w-4 text-[#eb0028]" />
                        <div>
                          <p className="font-semibold text-foreground">Linked Material</p>
                          <p className="text-[11px] text-muted-foreground truncate max-w-md">
                            {lessons[previewSelectedLessonIndex].resourceUrl}
                          </p>
                        </div>
                      </div>
                      <a
                        href={lessons[previewSelectedLessonIndex].resourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-xl bg-foreground text-background font-mono text-xs uppercase tracking-wider hover:bg-[#eb0028] hover:text-white transition-colors flex items-center gap-1.5"
                      >
                        <span>LAUNCH</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                    </div>
                  )}

                  {/* Next / Prev Controls */}
                  <div className="pt-4 border-t border-border flex items-center justify-between font-mono text-xs">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={previewSelectedLessonIndex === 0}
                      onClick={() => setPreviewSelectedLessonIndex((p) => p - 1)}
                      className="border-border text-foreground hover:bg-muted"
                    >
                      ← PREVIOUS LESSON
                    </Button>
                    <Button
                      size="sm"
                      variant="red"
                      disabled={previewSelectedLessonIndex === lessons.length - 1}
                      onClick={() => setPreviewSelectedLessonIndex((p) => p + 1)}
                      className="keep-white"
                    >
                      NEXT LESSON →
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-xs font-mono text-muted-foreground">
                  Select a lesson to preview its instructional content.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DIALOG: Add Lesson */}
      <Dialog open={isAddLessonOpen} onOpenChange={setIsAddLessonOpen}>
        <DialogContent className="sm:max-w-lg bg-card border border-border text-card-foreground rounded-[28px] p-6 shadow-2xl">
          <form onSubmit={handleAddLessonSubmit}>
            <DialogHeader className="space-y-1">
              <DialogTitle className="font-dot text-lg uppercase tracking-wider text-foreground">
                Add Lesson to Module //
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground font-mono">
                Create a modular learning step with instructions and optional resource links.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4 font-mono text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="lesson-title" className="text-muted-foreground uppercase text-[10px]">Lesson Title *</Label>
                <Input
                  id="lesson-title"
                  placeholder="e.g. Identifying Positive and Negative Terminals with Multimeter"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  className="bg-muted/50 border-border text-foreground rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="activity-type" className="text-muted-foreground uppercase text-[10px]">Activity Type</Label>
                  <select
                    id="activity-type"
                    value={lessonActivityType}
                    onChange={(e) => setLessonActivityType(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-2.5 py-2 text-xs text-foreground"
                  >
                    <option className="bg-card text-foreground" value="lesson">Lesson / Reading</option>
                    <option className="bg-card text-foreground" value="activity">Hands-on Activity</option>
                    <option className="bg-card text-foreground" value="quiz">Self-check Quiz</option>
                    <option className="bg-card text-foreground" value="assignment">Practical Assignment</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="lesson-duration" className="text-muted-foreground uppercase text-[10px]">Duration</Label>
                  <Input
                    id="lesson-duration"
                    placeholder="e.g. 20 mins"
                    value={lessonDuration}
                    onChange={(e) => setLessonDuration(e.target.value)}
                    className="bg-muted/50 border-border text-foreground rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lesson-content" className="text-muted-foreground uppercase text-[10px]">Instructional Content</Label>
                <Textarea
                  id="lesson-content"
                  rows={4}
                  placeholder="Step-by-step instructions, key takeaways, diagrams, or checklist items..."
                  value={lessonContent}
                  onChange={(e) => setLessonContent(e.target.value)}
                  className="bg-muted/50 border-border text-foreground rounded-xl font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lesson-resource" className="text-muted-foreground uppercase text-[10px]">External Resource URL (Optional)</Label>
                <Input
                  id="lesson-resource"
                  type="url"
                  placeholder="https://diksha.gov.in/... or video link"
                  value={lessonResourceUrl}
                  onChange={(e) => setLessonResourceUrl(e.target.value)}
                  className="bg-muted/50 border-border text-foreground rounded-xl"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddLessonOpen(false)} className="font-mono text-xs border-border text-foreground hover:bg-muted">
                Cancel
              </Button>
              <Button type="submit" disabled={isAddingLesson} variant="red" className="font-mono text-xs uppercase tracking-wider keep-white">
                {isAddingLesson ? <Loader2 className="h-4 w-4 animate-spin mr-1 keep-white" /> : <Plus className="h-3.5 w-3.5 mr-1 keep-white" />}
                <span className="keep-white">APPEND LESSON //</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
