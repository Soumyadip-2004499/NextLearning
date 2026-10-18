"use client";

import * as React from "react";
import Link from "next/link";
import {
  Layers,
  PlusCircle,
  Clock,
  GraduationCap,
  Edit2,
  Trash2,
  BookOpen,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Radio,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { GlyphBar } from "@/components/ui/nothing-elements";

interface ModuleCardItem {
  id: string;
  title: string;
  description: string | null;
  targetLevel: string;
  objectives: string[];
  status: string;
  accessType: string;
  estimatedDuration: string;
  lessonCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ModulesListClientProps {
  initialModules: ModuleCardItem[];
}

export function ModulesListClient({ initialModules }: ModulesListClientProps) {
  const [modules, setModules] = React.useState<ModuleCardItem[]>(initialModules);
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  // Filter modules
  const filteredModules = React.useMemo(() => {
    return modules.filter((m) => {
      const matchesStatus = statusFilter === "all" || m.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        m.title.toLowerCase().includes(q) ||
        (m.description && m.description.toLowerCase().includes(q)) ||
        m.targetLevel.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [modules, statusFilter, searchQuery]);

  const handleDelete = async (id: string, title: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the module "${title}"? All associated lessons will also be removed.`
    );
    if (!confirmDelete) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/facilitator/modules/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setModules((prev) => prev.filter((m) => m.id !== id));
      } else {
        alert(data.error || "Failed to delete module");
      }
    } catch {
      alert("Error deleting module. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-2">
      {/* Telemetry Strip / Status Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 px-4 py-2.5 rounded-2xl border border-border bg-card/80 text-foreground backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00dc82] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00dc82]"></span>
          </span>
          <span className="font-dot text-[11px] uppercase tracking-widest text-foreground font-semibold">
            FACILITATOR // AUTHORING.TERMINAL // TRAINING MODULES
          </span>
        </div>
        <div className="flex items-center gap-2">
          <GlyphBar activeIndex={2} total={4} />
          <span className="font-mono text-[10px] text-muted-foreground">STATUS: READY</span>
        </div>
      </div>

      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-[11px] text-[#eb0028] uppercase tracking-widest mb-1.5">
            <Layers className="h-3.5 w-3.5" />
            <span>CURRICULUM BUILDER //</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-dot font-bold uppercase tracking-wider text-foreground">
            Training Modules
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">
            Author and publish micro-courses, vocational checklists, and hands-on skill simulators for assigned village learners.
          </p>
        </div>

        <Link href="/facilitator/modules/new">
          <Button variant="red" size="lg" className="font-mono text-xs tracking-wider gap-2 cursor-pointer shadow-[0_0_20px_rgba(235,0,40,0.3)] keep-white">
            <PlusCircle className="h-4 w-4 keep-white" />
            <span className="keep-white">CREATE NEW MODULE //</span>
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar Bento */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-[26px] border border-border bg-card text-card-foreground backdrop-blur-xl">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search authored modules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 text-xs bg-muted/50 border-border text-foreground rounded-xl placeholder:text-muted-foreground font-mono"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto font-mono text-xs">
          <span className="text-muted-foreground uppercase text-[10px]">Filter Status:</span>
          <div className="flex items-center gap-1.5 bg-muted/50 p-1 rounded-xl border border-border">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                statusFilter === "all"
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-black font-bold shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All ({modules.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("published")}
              className={`px-3 py-1 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                statusFilter === "published"
                  ? "bg-[#00dc82] text-black font-bold shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Published ({modules.filter((m) => m.status === "published").length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("draft")}
              className={`px-3 py-1 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                statusFilter === "draft"
                  ? "bg-amber-400 text-black font-bold shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Drafts ({modules.filter((m) => m.status === "draft").length})
            </button>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      {filteredModules.length === 0 ? (
        <Card className="rounded-[28px] border border-dashed border-border bg-card/60 p-12 text-center text-card-foreground">
          <Layers className="mx-auto h-12 w-12 text-muted-foreground/60 mb-3" />
          <h3 className="font-dot text-lg uppercase tracking-wider text-foreground">No Training Modules Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 font-mono">
            {searchQuery || statusFilter !== "all"
              ? "No modules match the specified search or status criteria."
              : "You haven't authored any training modules yet. Create your first module to share guidance with rural students."}
          </p>
          <Link href="/facilitator/modules/new" className="inline-block mt-5">
            <Button variant="red" size="sm" className="font-mono text-xs uppercase tracking-wider keep-white">
              <PlusCircle className="h-4 w-4 mr-1.5 keep-white" />
              <span className="keep-white">Build First Module //</span>
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module) => {
            const isPublished = module.status === "published";

            return (
              <div
                key={module.id}
                className="group rounded-[26px] border border-border hover:border-primary/30 bg-card p-6 backdrop-blur-xl flex flex-col justify-between transition-all duration-300 hover:shadow-lg dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.8)] text-card-foreground"
              >
                <div>
                  {/* Top Bar: Status and Access */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`font-dot text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                        isPublished
                          ? "border-[#00dc82]/40 text-[#00dc82] bg-[#00dc82]/10"
                          : "border-amber-500/40 text-amber-400 bg-amber-500/10"
                      }`}
                    >
                      {isPublished ? "PUBLISHED" : "DRAFT"}
                    </span>
                    <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded border border-border text-muted-foreground">
                      {module.accessType}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold font-sans text-foreground line-clamp-2 mt-2 group-hover:text-[#eb0028] transition-colors leading-snug">
                    {module.title}
                  </h3>

                  {/* Description */}
                  {module.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-2 leading-relaxed">
                      {module.description}
                    </p>
                  )}

                  {/* Meta items */}
                  <div className="flex items-center gap-4 font-mono text-xs text-muted-foreground pt-3 mt-4 border-t border-border">
                    <span className="flex items-center gap-1.5 text-foreground">
                      <BookOpen className="h-3.5 w-3.5 text-[#eb0028]" />
                      {module.lessonCount} {module.lessonCount === 1 ? "Lesson" : "Lessons"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      {module.estimatedDuration}
                    </span>
                  </div>

                  {/* Target Education Level */}
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground pt-2">
                    <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Target:</span>
                    <span className="text-foreground font-semibold uppercase">{module.targetLevel}</span>
                  </div>

                  {/* Objectives tags preview */}
                  {module.objectives.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-3">
                      {module.objectives.slice(0, 2).map((obj, i) => (
                        <span
                          key={i}
                          className="font-mono text-[10px] px-2.5 py-0.5 rounded-md bg-muted/60 border border-border text-muted-foreground truncate max-w-[200px]"
                        >
                          &bull; {obj}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Action Bar */}
                <div className="pt-4 mt-5 border-t border-border flex items-center justify-between gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(module.id, module.title)}
                    disabled={deletingId === module.id}
                    className="h-8 px-2.5 text-muted-foreground hover:text-[#eb0028] hover:bg-muted cursor-pointer"
                    title="Delete module"
                  >
                    {deletingId === module.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </Button>

                  <Link href={`/facilitator/modules/${module.id}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="font-mono text-xs uppercase tracking-wider border-border text-foreground hover:bg-muted cursor-pointer h-8"
                    >
                      <Edit2 className="h-3.5 w-3.5 mr-1 text-[#eb0028]" />
                      <span>MANAGE //</span>
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
