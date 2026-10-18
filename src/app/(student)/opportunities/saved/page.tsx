"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bookmark,
  Trash2,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Building2,
  Sparkles,
  Loader2,
  FolderKanban,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate, truncate } from "@/lib/utils";

interface SavedOpportunityItem {
  id: string;
  savedRecordId: string;
  title: string;
  category: string;
  provider: string | null;
  description: string;
  eligibleLevels: string[];
  location: string | null;
  skills: string[];
  openDate: string | null;
  closeDate: string | null;
  applicationUrl: string | null;
  sourceUrl: string | null;
  lastVerified: string | null;
  verificationStatus: string;
  isSampleData: boolean;
  savedAt: string;
  notes: string | null;
}

export default function SavedOpportunitiesPage() {
  const [savedItems, setSavedItems] = useState<SavedOpportunityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSaved() {
      setLoading(true);
      try {
        const res = await fetch("/api/opportunities/saved");
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setSavedItems(json.data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch saved opportunities:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSaved();
  }, []);

  const handleRemove = async (opportunityId: string) => {
    setRemovingId(opportunityId);
    // Optimistic remove
    const previous = [...savedItems];
    setSavedItems((prev) => prev.filter((item) => item.id !== opportunityId));

    try {
      const res = await fetch(`/api/opportunities/${opportunityId}/save`, {
        method: "DELETE",
      });
      if (!res.ok) {
        setSavedItems(previous);
      }
    } catch {
      setSavedItems(previous);
    } finally {
      setRemovingId(null);
    }
  };

  const getVerificationBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "verified":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Verified
          </span>
        );
      case "sample":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-700 bg-violet-50 dark:bg-violet-950/60 dark:text-violet-300 px-2 py-0.5 rounded-md border border-violet-200 dark:border-violet-800">
            <Sparkles className="w-3 h-3 text-violet-600" />
            Sample Data
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            Pending Verification
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Top Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <Link
                href="/opportunities"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mb-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                All Opportunities
              </Link>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center gap-3">
                <Bookmark className="w-7 h-7 text-rose-500 fill-rose-500" />
                Saved Opportunities
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Bookmarks and schemes you are considering applying for.
              </p>
            </div>

            <Link href="/opportunities/applications">
              <Button
                variant="outline"
                className="rounded-xl text-xs sm:text-sm font-semibold border-border text-foreground hover:bg-muted"
              >
                <FolderKanban className="w-4 h-4 mr-2 text-indigo-600" />
                View Application Tracker
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-sm text-muted-foreground">Loading your saved opportunities...</p>
          </div>
        ) : savedItems.length > 0 ? (
          <div className="space-y-4">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {savedItems.length} {savedItems.length === 1 ? "Opportunity" : "Opportunities"} Saved
            </div>

            <div className="grid gap-4">
              {savedItems.map((opp) => (
                <Card
                  key={opp.id}
                  className="rounded-3xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow p-5 sm:p-6 text-card-foreground"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="space-y-2.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800">
                          {opp.category}
                        </span>
                        {getVerificationBadge(opp.verificationStatus)}
                        {opp.isSampleData && (
                          <span className="text-[10px] uppercase font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
                            Demo
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground ml-auto md:ml-2">
                          Saved on {formatDate(opp.savedAt)}
                        </span>
                      </div>

                      <Link href={`/opportunities/${opp.id}`} className="block group">
                        <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-indigo-600 transition-colors">
                          {opp.title}
                        </h3>
                      </Link>

                      {opp.provider && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                          <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>{opp.provider}</span>
                        </div>
                      )}

                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {truncate(opp.description, 160)}
                      </p>

                      {opp.notes && (
                        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-foreground">
                          <span className="font-semibold text-amber-600 dark:text-amber-400">My Note:</span> {opp.notes}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-muted-foreground pt-1">
                        {opp.closeDate ? (
                          <div className="flex items-center gap-1 font-medium text-foreground">
                            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                            <span>Deadline: {formatDate(opp.closeDate)}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Rolling enrollment</span>
                          </div>
                        )}
                        {opp.location && <span>• {opp.location}</span>}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex md:flex-col items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border">
                      <Link href={`/opportunities/${opp.id}`} className="flex-1 md:w-36">
                        <Button
                          size="sm"
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold h-9 keep-white"
                        >
                          <span className="keep-white">View Details</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1.5 keep-white" />
                        </Button>
                      </Link>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemove(opp.id)}
                        disabled={removingId === opp.id}
                        className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl h-9 px-3"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="py-24 text-center rounded-3xl border border-dashed border-border bg-card/50 p-8 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center mx-auto mb-4">
              <Bookmark className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              No saved opportunities yet
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              When exploring scholarships, schemes, or skilling drives, tap the bookmark icon to
              save them here for easy review and comparison.
            </p>
            <Link href="/opportunities">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 h-11 font-semibold shadow-md shadow-indigo-600/20 keep-white">
                <span className="keep-white">Explore Opportunities</span>
                <ArrowRight className="w-4 h-4 ml-2 keep-white" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
