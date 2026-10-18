"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, Loader2, ArrowRight } from "lucide-react";

interface CareerOption {
  slug: string;
  title: string;
  category: string;
}

interface GenerateRoadmapDialogProps {
  careers: CareerOption[];
  triggerText?: string;
  studentId?: string;
}

export function GenerateRoadmapDialog({
  careers,
  triggerText = "Generate New Roadmap",
  studentId,
}: GenerateRoadmapDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string>(careers[0]?.slug || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGenerate = async () => {
    if (!selectedSlug) return;
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/roadmap/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          careerSlug: selectedSlug,
          studentProfileId: studentId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to generate roadmap.");
      }

      const data = await res.json();
      setOpen(false);
      router.push(`/roadmap/${data.data.id}`);
      router.refresh();
    } catch (err: unknown) {
      console.error("Roadmap generation failed:", err);
      const msg = err instanceof Error ? err.message : "Failed to generate roadmap";
      setError(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs font-semibold">
          <Plus className="h-4 w-4 mr-1.5" />
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm mb-1">
            <Sparkles className="h-4 w-4" />
            AI Roadmap Architect
          </div>
          <DialogTitle className="text-xl">Generate a Career Roadmap</DialogTitle>
          <DialogDescription>
            Select a career path. NextLearning AI will analyze your learning level and generate a step-by-step milestone timeline.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Choose Career Pathway
            </label>
            <select
              value={selectedSlug}
              onChange={(e) => setSelectedSlug(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm ring-offset-background focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              disabled={isGenerating}
            >
              {careers.map((career) => (
                <option key={career.slug} value={career.slug}>
                  {career.title} ({career.category})
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl bg-indigo-50/70 p-3.5 border border-indigo-100 text-xs text-indigo-900 leading-relaxed space-y-1">
            <div className="font-semibold text-indigo-950 flex items-center gap-1.5">
              <span>Tailored for Rural Opportunities</span>
            </div>
            <p>
              Includes government-recognized NSQF levels, Skill India modules, hands-on tool drills, and apprenticeship linkages.
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleGenerate}
            disabled={!selectedSlug || isGenerating}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                Generate Roadmap
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
