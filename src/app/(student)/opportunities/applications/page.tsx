"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FolderKanban,
  LayoutGrid,
  List,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Building2,
  CheckCircle2,
  Clock,
  Sparkles,
  Edit3,
  ExternalLink,
  Plus,
  Loader2,
  Save,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, formatDate, truncate } from "@/lib/utils";
import type { ApplicationStatus as AppStatusType } from "@/types";

interface TrackedApplication {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  category: string;
  provider: string | null;
  status: AppStatusType;
  notes: string | null;
  nextAction: string | null;
  statusHistory: { status: string; date: string; note?: string }[];
  closeDate: string | null;
  verificationStatus: string;
  isSampleData: boolean;
  applicationUrl: string | null;
  updatedAt: string;
  createdAt: string;
}

const PIPELINE_COLUMNS: {
  key: AppStatusType;
  title: string;
  shortTitle: string;
  accentColor: string;
  borderClass: string;
  badgeClass: string;
}[] = [
  {
    key: "interested",
    title: "Interested",
    shortTitle: "Interested",
    accentColor: "bg-muted-foreground",
    borderClass: "border-border",
    badgeClass: "bg-muted text-foreground",
  },
  {
    key: "checking_eligibility",
    title: "Checking Eligibility",
    shortTitle: "Eligibility",
    accentColor: "bg-amber-500",
    borderClass: "border-amber-500/30",
    badgeClass: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  },
  {
    key: "preparing_documents",
    title: "Preparing Docs",
    shortTitle: "Documents",
    accentColor: "bg-blue-500",
    borderClass: "border-blue-500/30",
    badgeClass: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  },
  {
    key: "ready_to_apply",
    title: "Ready to Apply",
    shortTitle: "Ready",
    accentColor: "bg-indigo-600",
    borderClass: "border-indigo-500/30",
    badgeClass: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
  },
  {
    key: "submitted",
    title: "Submitted",
    shortTitle: "Submitted",
    accentColor: "bg-emerald-600",
    borderClass: "border-emerald-500/30",
    badgeClass: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  },
  {
    key: "awaiting_response",
    title: "Awaiting Response",
    shortTitle: "Awaiting",
    accentColor: "bg-purple-600",
    borderClass: "border-purple-500/30",
    badgeClass: "bg-purple-500/15 text-purple-700 dark:text-purple-300",
  },
  {
    key: "completed",
    title: "Completed",
    shortTitle: "Completed",
    accentColor: "bg-teal-600",
    borderClass: "border-teal-500/30",
    badgeClass: "bg-teal-500/15 text-teal-700 dark:text-teal-300",
  },
];

export default function ApplicationTrackerPage() {
  const [applications, setApplications] = useState<TrackedApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");

  // Modal Editing State
  const [editingApp, setEditingApp] = useState<TrackedApplication | null>(null);
  const [modalStatus, setModalStatus] = useState<AppStatusType>("interested");
  const [modalNotes, setModalNotes] = useState("");
  const [modalNextAction, setModalNextAction] = useState("");
  const [savingModal, setSavingModal] = useState(false);

  useEffect(() => {
    async function fetchApplications() {
      setLoading(true);
      try {
        const res = await fetch("/api/opportunities/applications");
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setApplications(json.data);
          }
        }
      } catch (err) {
        console.error("Failed to load applications:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchApplications();
  }, []);

  const openUpdateModal = (app: TrackedApplication) => {
    setEditingApp(app);
    setModalStatus(app.status);
    setModalNotes(app.notes || "");
    setModalNextAction(app.nextAction || "");
  };

  const handleSaveModal = async () => {
    if (!editingApp) return;
    setSavingModal(true);

    try {
      const payload = {
        status: modalStatus,
        notes: modalNotes,
        nextAction: modalNextAction,
      };

      const res = await fetch(`/api/opportunities/${editingApp.opportunityId}/apply`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json();
        // Update local state
        setApplications((prev) =>
          prev.map((item) =>
            item.opportunityId === editingApp.opportunityId
              ? {
                  ...item,
                  status: modalStatus,
                  notes: modalNotes,
                  nextAction: modalNextAction,
                  updatedAt: new Date().toISOString(),
                }
              : item
          )
        );
        setEditingApp(null);
      }
    } catch (err) {
      console.error("Failed to update application:", err);
    } finally {
      setSavingModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Top Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <Link
                href="/opportunities"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mb-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to All Opportunities
              </Link>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center gap-3">
                <FolderKanban className="w-7 h-7 text-teal-600" />
                Application Pipeline Tracker
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Track and organize your progress from document prep to official confirmation.
              </p>
            </div>

            {/* View Switcher & Action */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-muted p-1 rounded-xl border border-border">
                <button
                  type="button"
                  onClick={() => setViewMode("kanban")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer",
                    viewMode === "kanban"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  Kanban Board
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer",
                    viewMode === "list"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <List className="w-3.5 h-3.5" />
                  List View
                </button>
              </div>

              <Link href="/opportunities">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold h-10 px-4 keep-white">
                  <Plus className="w-4 h-4 mr-1.5 keep-white" />
                  <span className="keep-white">Track New</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Prominent Warning Callout */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-foreground text-xs sm:text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-amber-600 dark:text-amber-400">Official Application Verification Rule:</span>
            <p className="leading-relaxed text-muted-foreground">
              Only mark a record as <strong className="text-foreground">Submitted</strong> after you have actually completed and
              submitted the form on the official government/institution portal. NextLearning helps you
              organize documents and track deadlines, but does not submit applications on your
              behalf.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-sm text-muted-foreground">Loading your applications pipeline...</p>
          </div>
        ) : applications.length === 0 ? (
          /* Empty State */
          <div className="py-24 text-center rounded-3xl border border-dashed border-border bg-card/50 p-8 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center mx-auto mb-4">
              <FolderKanban className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              No applications being tracked yet
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              When viewing scholarships or training schemes, click <strong>Track Application</strong>{" "}
              to manage your checklist, document preparation, and submission milestone notes.
            </p>
            <Link href="/opportunities">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 h-11 font-semibold shadow-md shadow-indigo-600/20 keep-white">
                <span className="keep-white">Explore Opportunities</span>
                <ArrowRight className="w-4 h-4 ml-2 keep-white" />
              </Button>
            </Link>
          </div>
        ) : viewMode === "kanban" ? (
          /* Kanban Board View */
          <div className="overflow-x-auto pb-6">
            <div className="flex gap-4 min-w-[1300px]">
              {PIPELINE_COLUMNS.map((col) => {
                const columnApps = applications.filter((app) => app.status === col.key);

                return (
                  <div
                    key={col.key}
                    className="flex-1 flex flex-col min-w-[200px] max-w-[260px] bg-muted/40 rounded-3xl p-3 border border-border"
                  >
                    {/* Column Header */}
                    <div className="flex items-center justify-between pb-3 px-1">
                      <div className="flex items-center gap-2">
                        <span className={cn("w-2.5 h-2.5 rounded-full", col.accentColor)} />
                        <span className="font-bold text-xs text-foreground">
                          {col.title}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-muted-foreground bg-card px-2 py-0.5 rounded-full border border-border">
                        {columnApps.length}
                      </span>
                    </div>

                    {/* Column Cards */}
                    <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-0.5">
                      {columnApps.map((app) => (
                        <Card
                          key={app.id}
                          onClick={() => openUpdateModal(app)}
                          className="rounded-2xl border border-border bg-card p-3.5 shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-pointer group text-card-foreground"
                        >
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                              {app.category}
                            </span>

                            <h4 className="font-bold text-xs sm:text-sm text-foreground line-clamp-2 group-hover:text-indigo-600 transition-colors">
                              {app.opportunityTitle}
                            </h4>

                            {app.provider && (
                              <p className="text-[11px] text-muted-foreground truncate">
                                {app.provider}
                              </p>
                            )}

                            {app.nextAction && (
                              <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-foreground">
                                <span className="font-bold text-indigo-600 dark:text-indigo-400">Next:</span> {truncate(app.nextAction, 60)}
                              </div>
                            )}

                            <div className="flex items-center justify-between pt-1 border-t border-border text-[10px] text-muted-foreground">
                              <span>Updated {formatDate(app.updatedAt)}</span>
                              <Edit3 className="w-3 h-3 text-muted-foreground group-hover:text-indigo-600" />
                            </div>
                          </div>
                        </Card>
                      ))}

                      {columnApps.length === 0 && (
                        <div className="h-28 rounded-2xl border border-dashed border-border flex items-center justify-center text-[11px] text-muted-foreground italic">
                          No items in {col.shortTitle}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* List View */
          <div className="space-y-3">
            {applications.map((app) => {
              const colMeta = PIPELINE_COLUMNS.find((c) => c.key === app.status);

              return (
                <Card
                  key={app.id}
                  className="rounded-3xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow text-card-foreground"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={cn(
                            "text-xs font-bold px-2.5 py-0.5 rounded-full capitalize",
                            colMeta?.badgeClass || "bg-muted text-foreground"
                          )}
                        >
                          Stage: {colMeta?.title || app.status}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Category: {app.category}
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto md:ml-2">
                          Last Updated: {formatDate(app.updatedAt)}
                        </span>
                      </div>

                      <Link
                        href={`/opportunities/${app.opportunityId}`}
                        className="text-base sm:text-lg font-bold text-foreground hover:text-indigo-600 transition-colors block"
                      >
                        {app.opportunityTitle}
                      </Link>

                      {app.provider && (
                        <p className="text-xs text-muted-foreground font-medium">
                          {app.provider}
                        </p>
                      )}

                      {app.nextAction && (
                        <div className="text-xs text-foreground pt-1">
                          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                            Next Action:
                          </span>{" "}
                          {app.nextAction}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 pt-2 md:pt-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openUpdateModal(app)}
                        className="rounded-xl text-xs font-semibold h-9 border-border text-foreground hover:bg-muted"
                      >
                        <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                        Update Status
                      </Button>

                      <Link href={`/opportunities/${app.opportunityId}`}>
                        <Button
                          size="sm"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold h-9 keep-white"
                        >
                          <span className="keep-white">View Details</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Update Status & Notes Modal Dialog */}
      <Dialog open={!!editingApp} onOpenChange={(open) => !open && setEditingApp(null)}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6 bg-card border border-border text-card-foreground">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl font-bold text-foreground">Update Pipeline Progress</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {editingApp?.opportunityTitle}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Warning if setting to submitted */}
            {modalStatus === "submitted" && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-foreground">
                <span className="font-bold text-amber-600 dark:text-amber-400">Check:</span> Have you submitted this application on the
                official portal?
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Pipeline Stage</Label>
              <Select
                value={modalStatus}
                onValueChange={(val) => setModalStatus(val as AppStatusType)}
              >
                <SelectTrigger className="h-11 rounded-xl text-sm font-medium border-border bg-background text-foreground">
                  <SelectValue placeholder="Select pipeline stage" />
                </SelectTrigger>
                <SelectContent className="bg-card border border-border text-card-foreground">
                  {PIPELINE_COLUMNS.map((col) => (
                    <SelectItem key={col.key} value={col.key} className="text-foreground">
                      {col.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Next Action Item</Label>
              <Input
                value={modalNextAction}
                onChange={(e) => setModalNextAction(e.target.value)}
                placeholder="e.g. Bring photocopy of Aadhaar to Gram Panchayat"
                className="h-10 rounded-xl text-sm border-border bg-muted/50 text-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Personal Notes / Reference Number</Label>
              <Textarea
                value={modalNotes}
                onChange={(e) => setModalNotes(e.target.value)}
                placeholder="Application tracking ID, username, teacher remarks..."
                rows={3}
                className="rounded-xl text-sm resize-none border-border bg-muted/50 text-foreground"
              />
            </div>
          </div>

          <DialogFooter className="flex sm:justify-between items-center gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setEditingApp(null)}
              className="rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleSaveModal}
              disabled={savingModal}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold h-10 px-5 keep-white"
            >
              {savingModal ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin keep-white" />
                  <span className="keep-white">Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-1.5 keep-white" />
                  <span className="keep-white">Save Changes</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
