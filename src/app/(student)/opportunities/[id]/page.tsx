"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MapPin,
  Bookmark,
  Sparkles,
  Clock,
  FileCheck,
  ShieldAlert,
  AlertTriangle,
  FolderKanban,
  Check,
  Layers,
  GraduationCap,
  Loader2,
  Share2,
} from "lucide-react";
import { EDUCATION_LEVELS } from "@/data/education-levels";
import { ApplicationStatusTracker } from "@/components/opportunity/application-status";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn, formatDate } from "@/lib/utils";
import type { ApplicationStatus as AppStatusType } from "@/types";

interface OpportunityDetail {
  id: string;
  title: string;
  category: string;
  provider: string | null;
  description: string;
  eligibleLevels: string[];
  eligibilityRules: { field: string; value: unknown; description: string }[];
  location: string | null;
  skills: string[];
  openDate: string | null;
  closeDate: string | null;
  requiredDocuments: string[];
  applicationUrl: string | null;
  sourceUrl: string | null;
  lastVerified: string | null;
  verificationStatus: string;
  isSampleData: boolean;
  isSaved: boolean;
  applicationRecord?: {
    id: string;
    status: AppStatusType;
    notes?: string | null;
    nextAction?: string | null;
    statusHistory?: { status: string; date: string; note?: string }[];
  } | null;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OpportunityDetailPage({ params }: PageProps) {
  const unwrappedParams = use(params);
  const opportunityId = unwrappedParams.id;

  const [opportunity, setOpportunity] = useState<OpportunityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [savingBookmark, setSavingBookmark] = useState(false);
  const [showTrackerSection, setShowTrackerSection] = useState(false);

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/opportunities/${opportunityId}`);
        if (!res.ok) {
          throw new Error("Could not load opportunity details");
        }
        const json = await res.json();
        if (json.data) {
          setOpportunity(json.data);
          setIsSaved(Boolean(json.data.isSaved));
          if (json.data.applicationRecord) {
            setShowTrackerSection(true);
          }
        } else {
          throw new Error("Opportunity not found");
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error fetching details");
      } finally {
        setLoading(false);
      }
    }

    if (opportunityId) {
      fetchDetail();
    }
  }, [opportunityId]);

  const handleToggleSave = async () => {
    if (!opportunity) return;
    const nextSavedState = !isSaved;
    setIsSaved(nextSavedState);
    setSavingBookmark(true);

    try {
      const res = await fetch(`/api/opportunities/${opportunity.id}/save`, {
        method: nextSavedState ? "POST" : "DELETE",
      });
      if (!res.ok) {
        setIsSaved(!nextSavedState);
      }
    } catch {
      setIsSaved(!nextSavedState);
    } finally {
      setSavingBookmark(false);
    }
  };

  const getEducationLabel = (code: string) => {
    const found = EDUCATION_LEVELS.find((lvl) => lvl.value === code);
    return found ? found.label : code.replace(/_/g, " ").toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-sm font-medium text-muted-foreground">
            Loading opportunity criteria and details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <Card className="max-w-md w-full text-center p-6 rounded-3xl">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <CardTitle className="text-xl font-bold mb-2">Opportunity Not Found</CardTitle>
          <CardDescription className="mb-6">
            {error || "The opportunity you are looking for may have expired or does not exist."}
          </CardDescription>
          <Link href="/opportunities">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Opportunities
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="bg-card border-b border-border sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link
            href="/opportunities"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Opportunities</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleSave}
              disabled={savingBookmark}
              className={cn(
                "rounded-xl h-9 text-xs font-semibold transition-all border-border",
                isSaved
                  ? "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300"
                  : "text-foreground"
              )}
            >
              <Bookmark className={cn("w-3.5 h-3.5 mr-1.5", isSaved ? "fill-current" : "")} />
              {isSaved ? "Saved" : "Save"}
            </Button>

            <Button
              size="sm"
              onClick={() => setShowTrackerSection(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-9 text-xs font-semibold shadow-sm keep-white"
            >
              <FolderKanban className="w-3.5 h-3.5 mr-1.5 keep-white" />
              <span className="keep-white">Track Application</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Sample Data Notice if Applicable */}
        {opportunity.isSampleData && (
          <div className="p-4 rounded-2xl bg-violet-50/80 dark:bg-violet-950/40 border border-violet-200/80 dark:border-violet-800 flex items-start gap-3 text-xs text-violet-900 dark:text-violet-200">
            <Sparkles className="w-5 h-5 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Sample Record for Demonstration:</span>
              <p className="mt-0.5 leading-relaxed">
                This opportunity record contains realistic sample data to illustrate the format of
                government skilling drives and post-matric scholarship programs. Official URLs
                connect to actual authentic portals.
              </p>
            </div>
          </div>
        )}

        {/* Hero Header Card */}
        <Card className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden text-card-foreground">
          <CardHeader className="p-6 sm:p-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800">
                {opportunity.category}
              </span>

              {opportunity.verificationStatus === "verified" && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Official Source
                </span>
              )}

              {opportunity.verificationStatus === "sample" && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-950 dark:text-violet-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  Sample Data
                </span>
              )}

              {opportunity.verificationStatus === "unverified" && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-300">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Verification Pending
                </span>
              )}

              {opportunity.lastVerified && (
                <span className="text-xs text-muted-foreground ml-auto">
                  Last verified: {formatDate(opportunity.lastVerified)}
                </span>
              )}
            </div>

            <CardTitle className="text-2xl sm:text-3xl font-extrabold text-foreground leading-tight">
              {opportunity.title}
            </CardTitle>

            {opportunity.provider && (
              <div className="flex items-center gap-2 text-sm sm:text-base font-medium text-muted-foreground">
                <Building2 className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>{opportunity.provider}</span>
              </div>
            )}

            {/* Quick Metadata Chips */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs text-muted-foreground border-t border-border">
              {opportunity.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">
                    {opportunity.location}
                  </span>
                </div>
              )}

              {opportunity.closeDate ? (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  <span className="font-semibold text-foreground">
                    Closes: {formatDate(opportunity.closeDate)}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Ongoing / Rolling Applications</span>
                </div>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* 2-Column Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Main Details (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Description Card */}
            <Card className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-4 text-card-foreground">
              <h2 className="text-lg font-bold text-foreground">
                About this Program
              </h2>
              <p className="text-sm sm:text-base text-foreground/90 leading-relaxed whitespace-pre-line">
                {opportunity.description}
              </p>
            </Card>

            {/* Eligible Education Levels */}
            <Card className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-4 text-card-foreground">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-foreground">
                  Eligible Education Levels
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {opportunity.eligibleLevels && opportunity.eligibleLevels.length > 0 ? (
                  opportunity.eligibleLevels.map((lvl) => (
                    <span
                      key={lvl}
                      className="px-3.5 py-1.5 rounded-xl bg-muted text-foreground text-xs sm:text-sm font-semibold border border-border"
                    >
                      {getEducationLabel(lvl)}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">Open to all students</span>
                )}
              </div>
            </Card>

            {/* Required Documents */}
            {opportunity.requiredDocuments && opportunity.requiredDocuments.length > 0 && (
              <Card className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-4 text-card-foreground">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-teal-600" />
                  <h2 className="text-lg font-bold text-foreground">
                    Required Documents Checklist
                  </h2>
                </div>
                <p className="text-xs text-muted-foreground">
                  Ensure you have clear physical copies and scanned photos/PDFs before visiting the
                  official registration portal:
                </p>
                <div className="grid sm:grid-cols-2 gap-2.5 pt-1">
                  {opportunity.requiredDocuments.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs sm:text-sm text-foreground"
                    >
                      <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="font-medium">{doc}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Relevant Skills */}
            {opportunity.skills && opportunity.skills.length > 0 && (
              <Card className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-4 text-card-foreground">
                <h2 className="text-lg font-bold text-foreground">
                  Target / Acquired Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {opportunity.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-500/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {/* Embedded Application Pipeline Tracker */}
            <Card
              id="tracker"
              className={cn(
                "rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-md transition-all text-card-foreground",
                showTrackerSection ? "ring-2 ring-primary" : ""
              )}
            >
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                    <FolderKanban className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">
                      My Application Tracker
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Track your steps from document collection through final selection
                    </p>
                  </div>
                </div>
              </div>

              <ApplicationStatusTracker
                opportunityId={opportunity.id}
                opportunityTitle={opportunity.title}
                currentStatus={opportunity.applicationRecord?.status || "interested"}
                notes={opportunity.applicationRecord?.notes}
                nextAction={opportunity.applicationRecord?.nextAction}
                statusHistory={opportunity.applicationRecord?.statusHistory}
              />
            </Card>
          </div>

          {/* Right Action Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Direct Apply Action Card */}
            <Card className="rounded-3xl border border-border p-6 sm:p-7 space-y-5 bg-card text-card-foreground shadow-md">
              <h3 className="text-base font-bold text-foreground">
                Official Application Channel
              </h3>

              {opportunity.applicationUrl ? (
                <div className="space-y-3">
                  <a
                    href={opportunity.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold py-6 rounded-2xl shadow-lg shadow-teal-500/25 text-sm sm:text-base cursor-pointer keep-white"
                    >
                      <span className="keep-white">Apply on Official Portal</span>
                      <ExternalLink className="w-4 h-4 ml-2 keep-white" />
                    </Button>
                  </a>

                  {opportunity.sourceUrl && (
                    <a
                      href={opportunity.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline pt-1"
                    >
                      Visit Official Notification / Source Page →
                    </a>
                  )}
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-muted text-xs text-muted-foreground">
                  Applications are accepted offline via district nodal ITIs or school headmasters.
                </div>
              )}

              {/* Crucial Transparency Warning */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-foreground space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Important Note:</span>
                </div>
                <p className="leading-relaxed text-muted-foreground">
                  Clicking <strong className="text-foreground">Apply</strong> opens the authentic official application portal.
                  NextLearning guides you and tracks your progress, but{" "}
                  <strong className="text-foreground">we do not submit applications on your behalf</strong>.
                </p>
              </div>
            </Card>

            {/* Application Dates Card */}
            <Card className="rounded-3xl border border-border bg-card p-6 space-y-4 text-card-foreground">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                Application Timelines
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <span className="text-muted-foreground">Opening Date:</span>
                  <span className="font-semibold text-foreground">
                    {opportunity.openDate ? formatDate(opportunity.openDate) : "Announced Year-Round"}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <span className="text-muted-foreground">Closing Deadline:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {opportunity.closeDate ? formatDate(opportunity.closeDate) : "Rolling / Continuous"}
                  </span>
                </div>

                {opportunity.verificationStatus === "unverified" && (
                  <p className="text-[11px] text-amber-600 italic">
                    * Dates subject to state nodal confirmation. Verify with your school or ITI
                    counselor.
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
