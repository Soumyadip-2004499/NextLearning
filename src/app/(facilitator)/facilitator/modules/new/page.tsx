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
  HelpCircle,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { GlyphBar } from "@/components/ui/nothing-elements";

export default function CreateModulePage() {
  const router = useRouter();

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [targetLevel, setTargetLevel] = React.useState("class_10");
  const [accessType, setAccessType] = React.useState<"free" | "paid">("free");
  const [estimatedDuration, setEstimatedDuration] = React.useState("2 Weeks");

  // Objectives array
  const [objectives, setObjectives] = React.useState<string[]>([
    "Understand key foundational concepts",
    "Perform hands-on vocational tasks safely",
  ]);
  const [newObjective, setNewObjective] = React.useState("");

  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleAddObjective = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObjective.trim()) return;
    setObjectives([...objectives, newObjective.trim()]);
    setNewObjective("");
  };

  const handleRemoveObjective = (index: number) => {
    setObjectives(objectives.filter((_, i) => i !== index));
  };

  const handleSubmit = async (status: "draft" | "published") => {
    if (!title.trim()) {
      setErrorMessage("Please enter a title for this training module.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/facilitator/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          targetLevel,
          objectives,
          status,
          accessType,
          estimatedDuration: estimatedDuration.trim() || "Self-paced",
        }),
      });

      const data = await res.json();
      if (data.success) {
        router.push(`/facilitator/modules/${data.data.id}`);
      } else {
        setErrorMessage(data.error || "Failed to create module.");
        setIsLoading(false);
      }
    } catch {
      setErrorMessage("Network error occurred while creating module. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-2">
      {/* Telemetry Strip / Status Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 px-4 py-2.5 rounded-2xl border border-border bg-card/80 text-foreground backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#eb0028] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#eb0028]"></span>
          </span>
          <span className="font-dot text-[11px] uppercase tracking-widest text-foreground font-semibold">
            MODULE // AUTHORING.CREATOR // DRAFT SPECIFICATION
          </span>
        </div>
        <div className="flex items-center gap-2">
          <GlyphBar activeIndex={1} total={4} />
          <span className="font-mono text-[10px] text-muted-foreground">STATUS: DRAFT</span>
        </div>
      </div>

      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-4">
          <Link
            href="/facilitator/modules"
            className="p-2.5 rounded-2xl bg-muted border border-border text-muted-foreground hover:text-foreground transition-colors shadow-md"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-dot font-bold uppercase tracking-wider text-foreground">
              Create Module //
            </h1>
            <p className="font-mono text-xs text-muted-foreground mt-1">
              Specify curriculum overview, target schooling levels, and vocational goals.
            </p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-[#eb0028]/10 border border-[#eb0028]/30 text-xs font-mono text-[#eb0028] flex items-center gap-2.5">
          <AlertCircle className="h-4 w-4 text-[#eb0028] shrink-0" />
          <span className="font-semibold uppercase tracking-wider">{errorMessage}</span>
        </div>
      )}

      {/* Form Bento Card */}
      <div className="rounded-[28px] border border-border bg-card text-card-foreground backdrop-blur-xl p-7 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center gap-2 font-dot text-xs uppercase tracking-widest text-foreground pb-3 border-b border-border">
          <Layers className="h-4 w-4 text-[#eb0028]" />
          <span>Curriculum Specifications //</span>
        </div>

        <div className="space-y-5 font-mono text-xs">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="module-title" className="text-muted-foreground uppercase text-[10px] tracking-wider">
              Module Title <span className="text-[#eb0028]">*</span>
            </Label>
            <Input
              id="module-title"
              placeholder="e.g. Domestic Solar PV Installation & Safety Basics"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-muted/50 border-border text-foreground rounded-xl placeholder:text-muted-foreground focus:border-primary/50 h-11 font-sans text-sm"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="module-desc" className="text-muted-foreground uppercase text-[10px] tracking-wider">
              Curriculum Overview &amp; Description //
            </Label>
            <Textarea
              id="module-desc"
              rows={4}
              placeholder="Outline what skills the student will gain, equipment needed, and practical outcomes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-muted/50 border-border text-foreground rounded-xl placeholder:text-muted-foreground focus:border-primary/50 text-xs font-mono"
            />
          </div>

          {/* Grid: Target Level & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="target-level" className="text-muted-foreground uppercase text-[10px] tracking-wider">
                Target Level //
              </Label>
              <select
                id="target-level"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary/50"
                value={targetLevel}
                onChange={(e) => setTargetLevel(e.target.value)}
              >
                <option value="class_9" className="bg-card text-card-foreground">Class 9 Students</option>
                <option value="class_10" className="bg-card text-card-foreground">Class 10 (Secondary Pass)</option>
                <option value="class_11" className="bg-card text-card-foreground">Class 11 Students</option>
                <option value="class_12" className="bg-card text-card-foreground">Class 12 (Higher Secondary)</option>
                <option value="iti" className="bg-card text-card-foreground">ITI / Polytechnic Vocational</option>
                <option value="graduate" className="bg-card text-card-foreground">Undergraduate Degree</option>
                <option value="open" className="bg-card text-card-foreground">Open to All (Universal)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="duration" className="text-muted-foreground uppercase text-[10px] tracking-wider">
                Estimated Duration //
              </Label>
              <Input
                id="duration"
                placeholder="e.g. 2 Weeks (10 Hours total)"
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(e.target.value)}
                className="bg-muted/50 border-border text-foreground rounded-xl placeholder:text-muted-foreground focus:border-primary/50"
              />
            </div>
          </div>

          {/* Access Type */}
          <div className="space-y-2 pt-2 border-t border-border">
            <Label className="text-muted-foreground uppercase text-[10px] tracking-wider">
              Access Subsidies //
            </Label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground">
                <input
                  type="radio"
                  name="accessType"
                  value="free"
                  checked={accessType === "free"}
                  onChange={() => setAccessType("free")}
                  className="accent-[#00dc82]"
                />
                <span>Free Access (Subsidized for Rural Youth)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground">
                <input
                  type="radio"
                  name="accessType"
                  value="paid"
                  checked={accessType === "paid"}
                  onChange={() => setAccessType("paid")}
                  className="accent-[#eb0028]"
                />
                <span>Partner Sponsored / Verified Credential</span>
              </label>
            </div>
          </div>

          {/* Learning Objectives List */}
          <div className="space-y-3 pt-3 border-t border-border">
            <div className="flex items-center justify-between">
              <Label className="text-muted-foreground uppercase text-[10px] tracking-wider">
                Key Learning Objectives ({objectives.length}) //
              </Label>
              <span className="text-[10px] text-muted-foreground">Measurable Capabilities</span>
            </div>

            <div className="space-y-2">
              {objectives.map((obj, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#00dc82] shadow-[0_0_8px_#00dc82] shrink-0" />
                  <span className="flex-1 text-xs text-foreground bg-muted/50 px-3 py-2 rounded-xl border border-border font-sans">
                    {obj}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveObjective(index)}
                    className="p-1.5 text-muted-foreground hover:text-[#eb0028] transition-colors cursor-pointer"
                    title="Remove objective"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add objective input */}
            <div className="flex items-center gap-2 pt-1">
              <Input
                placeholder="Add new learning objective..."
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddObjective(e);
                  }
                }}
                className="bg-muted/50 border-border text-foreground rounded-xl placeholder:text-muted-foreground focus:border-primary/50 h-9 font-sans text-xs"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddObjective}
                className="font-mono text-xs border-border text-foreground hover:bg-muted shrink-0 cursor-pointer h-9"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                ADD
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-border flex items-center justify-between gap-3">
          <Link href="/facilitator/modules">
            <Button variant="ghost" size="sm" className="font-mono text-xs text-muted-foreground hover:text-foreground">
              Cancel
            </Button>
          </Link>

          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isLoading}
              onClick={() => handleSubmit("draft")}
              className="font-mono text-xs uppercase tracking-wider border-border text-foreground hover:bg-muted cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
              ) : (
                <Save className="h-3.5 w-3.5 mr-1.5" />
              )}
              Save as Draft
            </Button>

            <Button
              type="button"
              variant="red"
              size="sm"
              disabled={isLoading}
              onClick={() => handleSubmit("published")}
              className="font-mono text-xs uppercase tracking-wider cursor-pointer shadow-[0_0_20px_rgba(235,0,40,0.3)] keep-white"
            >
              {isLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5 keep-white" />
              ) : (
                <Send className="h-3.5 w-3.5 mr-1.5 keep-white" />
              )}
              <span className="keep-white">PUBLISH MODULE //</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
