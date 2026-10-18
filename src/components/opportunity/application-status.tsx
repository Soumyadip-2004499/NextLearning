"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  FileText,
  AlertTriangle,
  ArrowRight,
  Send,
  Sparkles,
  HelpCircle,
  Calendar,
  Save,
  Loader2,
  ListOrdered,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, formatDate } from "@/lib/utils";
import type { ApplicationStatus as AppStatusType } from "@/types";

export interface StatusStep {
  key: AppStatusType;
  label: string;
  shortLabel: string;
  description: string;
  color: string;
}

export const STATUS_STEPS: StatusStep[] = [
  {
    key: "interested",
    label: "Interested",
    shortLabel: "Interested",
    description: "Bookmarked and exploring details",
    color: "bg-slate-500 text-white",
  },
  {
    key: "checking_eligibility",
    label: "Checking Eligibility",
    shortLabel: "Eligibility",
    description: "Verifying marks, age, income criteria",
    color: "bg-amber-500 text-white",
  },
  {
    key: "preparing_documents",
    label: "Preparing Documents",
    shortLabel: "Documents",
    description: "Gathering certificates, photos, marksheet copies",
    color: "bg-blue-500 text-white",
  },
  {
    key: "ready_to_apply",
    label: "Ready to Apply",
    shortLabel: "Ready",
    description: "All files ready, ready to visit official website",
    color: "bg-indigo-600 text-white",
  },
  {
    key: "submitted",
    label: "Submitted",
    shortLabel: "Submitted",
    description: "Form filled on official website & acknowledgement noted",
    color: "bg-emerald-600 text-white",
  },
  {
    key: "awaiting_response",
    label: "Awaiting Response",
    shortLabel: "Awaiting",
    description: "Waiting for merit list, call letter or disbursal",
    color: "bg-purple-600 text-white",
  },
  {
    key: "completed",
    label: "Completed",
    shortLabel: "Completed",
    description: "Scholarship received / enrolled / selected",
    color: "bg-teal-600 text-white",
  },
];

interface ApplicationStatusProps {
  opportunityId: string;
  opportunityTitle?: string;
  currentStatus: AppStatusType | string;
  notes?: string | null;
  nextAction?: string | null;
  statusHistory?: { status: string; date: string; note?: string }[] | string | null;
  onStatusUpdated?: (newRecord: {
    status: AppStatusType;
    notes?: string;
    nextAction?: string;
  }) => void;
  className?: string;
}

export function ApplicationStatusTracker({
  opportunityId,
  opportunityTitle,
  currentStatus = "interested",
  notes = "",
  nextAction = "",
  statusHistory,
  onStatusUpdated,
  className,
}: ApplicationStatusProps) {
  const [selectedStatus, setSelectedStatus] = useState<AppStatusType>(
    (currentStatus as AppStatusType) || "interested"
  );
  const [currentNotes, setCurrentNotes] = useState(notes || "");
  const [currentNextAction, setCurrentNextAction] = useState(nextAction || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Parse history if passed as string
  const parsedHistory: { status: string; date: string; note?: string }[] =
    typeof statusHistory === "string"
      ? (() => {
          try {
            return JSON.parse(statusHistory);
          } catch {
            return [];
          }
        })()
      : Array.isArray(statusHistory)
      ? statusHistory
      : [];

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === selectedStatus);

  const handleStatusChange = (newStatus: string) => {
    const statusKey = newStatus as AppStatusType;
    if (statusKey === "submitted" && selectedStatus !== "submitted") {
      setShowWarningModal(true);
    }
    setSelectedStatus(statusKey);
  };

  const handleSave = async () => {
    setIsUpdating(true);
    setSaveMessage(null);

    try {
      const payload = {
        status: selectedStatus,
        notes: currentNotes,
        nextAction: currentNextAction,
      };

      const res = await fetch(`/api/opportunities/${opportunityId}/apply`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // Fallback to POST if patch failed or record not yet created
        const postRes = await fetch(`/api/opportunities/${opportunityId}/apply`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!postRes.ok) throw new Error("Failed to update status");
      }

      setSaveMessage("Application progress saved successfully!");
      if (onStatusUpdated) {
        onStatusUpdated({
          status: selectedStatus,
          notes: currentNotes,
          nextAction: currentNextAction,
        });
      }
      setTimeout(() => setSaveMessage(null), 3500);
    } catch (err) {
      console.error("Error saving status:", err);
      setSaveMessage("Error updating status. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={cn("space-y-6 w-full", className)}>
      {/* Submitted Warning Banner */}
      {selectedStatus === "submitted" && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs sm:text-sm flex items-start gap-3"
        >
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Application Submission Verification:</span>
            <p className="leading-relaxed">
              Only mark this step as <strong>Submitted</strong> after you have actually filled and
              submitted the official form on the provider&apos;s portal. NextLearning tracks your progress
              for guidance, but does not submit applications on your behalf.
            </p>
          </div>
        </motion.div>
      )}

      {/* Visual Stepper Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Pipeline Stage ({currentStepIndex + 1} of {STATUS_STEPS.length}):{" "}
            <span className="text-indigo-600 dark:text-indigo-400 font-bold capitalize">
              {STATUS_STEPS[currentStepIndex]?.label || selectedStatus}
            </span>
          </span>
          <span>{Math.round(((currentStepIndex + 1) / STATUS_STEPS.length) * 100)}% Complete</span>
        </div>

        {/* Desktop Stepper */}
        <div className="hidden lg:grid grid-cols-7 gap-2">
          {STATUS_STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <button
                key={step.key}
                type="button"
                onClick={() => handleStatusChange(step.key)}
                className={cn(
                  "flex flex-col items-center text-center p-2.5 rounded-xl border transition-all text-xs cursor-pointer select-none",
                  isCurrent
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20 ring-2 ring-indigo-200 dark:ring-indigo-950 font-bold"
                    : isCompleted
                    ? "bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800"
                    : "bg-slate-50 dark:bg-slate-800/40 text-slate-500 border-slate-200 dark:border-slate-800 hover:border-slate-300"
                )}
              >
                <div className="flex items-center justify-center w-5 h-5 rounded-full mb-1 text-[11px] font-bold">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>
                <span className="truncate w-full font-medium">{step.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile/Tablet Compact Stepper Bar */}
        <div className="lg:hidden w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-600 via-teal-500 to-emerald-500 transition-all duration-300"
            style={{
              width: `${((currentStepIndex + 1) / STATUS_STEPS.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Status Selector & Fields Form */}
      <div className="grid sm:grid-cols-2 gap-4 pt-2">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Current Stage
          </Label>
          <Select value={selectedStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className="h-11 rounded-xl text-sm font-medium">
              <SelectValue placeholder="Select current status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_STEPS.map((s) => (
                <SelectItem key={s.key} value={s.key}>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{s.label}</span>
                    <span className="text-xs text-muted-foreground">— {s.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Next Action / Reminder
          </Label>
          <Input
            value={currentNextAction}
            onChange={(e) => setCurrentNextAction(e.target.value)}
            placeholder="e.g. Visit cyber cafe for color printouts on Monday"
            className="h-11 rounded-xl text-sm"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Personal Notes & Application ID
        </Label>
        <Textarea
          value={currentNotes}
          onChange={(e) => setCurrentNotes(e.target.value)}
          placeholder="Record your application reference number, login user ID, facilitator guidance notes, or nodal center address..."
          rows={3}
          className="rounded-xl text-sm resize-none"
        />
      </div>

      {/* Save Button & Feedback */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div>
          {saveMessage && (
            <p
              className={cn(
                "text-xs font-semibold flex items-center gap-1.5",
                saveMessage.includes("Error") ? "text-rose-500" : "text-emerald-600 dark:text-emerald-400"
              )}
            >
              <CheckCircle2 className="w-4 h-4" />
              {saveMessage}
            </p>
          )}
        </div>

        <Button
          type="button"
          onClick={handleSave}
          disabled={isUpdating}
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 h-10 font-medium shadow-md shadow-indigo-600/20"
        >
          {isUpdating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving Progress...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Progress
            </>
          )}
        </Button>
      </div>

      {/* Status History Timeline (if available) */}
      {parsedHistory.length > 0 && (
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Activity Log
          </span>
          <div className="space-y-2">
            {parsedHistory.map((item, idx) => (
              <div
                key={idx}
                className="text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-start justify-between gap-3"
              >
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                    {item.status.replace(/_/g, " ")}
                  </span>
                  {item.note && (
                    <p className="text-muted-foreground mt-0.5">{item.note}</p>
                  )}
                </div>
                <span className="text-[11px] text-slate-400 shrink-0">
                  {formatDate(item.date)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplicationStatusTracker;
