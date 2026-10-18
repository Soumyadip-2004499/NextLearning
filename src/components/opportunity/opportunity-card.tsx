"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bookmark,
  Calendar,
  Building2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Clock,
  MapPin,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn, formatDate, truncate } from "@/lib/utils";

export interface OpportunityCardProps {
  id: string;
  title: string;
  category: string;
  provider?: string | null;
  description: string;
  closeDate?: string | Date | null;
  openDate?: string | Date | null;
  location?: string | null;
  verificationStatus?: string;
  isSampleData?: boolean;
  isSaved?: boolean;
  onSaveToggle?: (id: string, e: React.MouseEvent) => void;
  onClick?: (id: string) => void;
  href?: string;
  className?: string;
}

export function OpportunityCard({
  id,
  title,
  category,
  provider,
  description,
  closeDate,
  openDate,
  location,
  verificationStatus = "unverified",
  isSampleData = true,
  isSaved = false,
  onSaveToggle,
  onClick,
  href,
  className,
}: OpportunityCardProps) {
  const [saved, setSaved] = useState(isSaved);
  const [saving, setSaving] = useState(false);

  // Sync state if prop changes
  React.useEffect(() => {
    setSaved(isSaved);
  }, [isSaved]);

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onSaveToggle) {
      onSaveToggle(id, e);
      return;
    }

    // Default internal optimistic save toggle
    const nextSavedState = !saved;
    setSaved(nextSavedState);
    setSaving(true);

    try {
      const res = await fetch(`/api/opportunities/${id}/save`, {
        method: nextSavedState ? "POST" : "DELETE",
      });
      if (!res.ok) {
        // Revert on failure
        setSaved(!nextSavedState);
      }
    } catch (err) {
      console.error("Save toggle error:", err);
      setSaved(!nextSavedState);
    } finally {
      setSaving(false);
    }
  };

  const getCategoryBadge = (cat: string) => {
    const c = cat.toLowerCase();
    switch (c) {
      case "scholarship":
        return {
          label: "Scholarship",
          style: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
        };
      case "scheme":
        return {
          label: "Govt Scheme",
          style: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800",
        };
      case "apprenticeship":
        return {
          label: "Apprenticeship",
          style: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
        };
      case "internship":
        return {
          label: "Internship",
          style: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800",
        };
      case "training":
        return {
          label: "Training",
          style: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800",
        };
      case "employment":
        return {
          label: "Employment",
          style: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800",
        };
      case "entrepreneurship":
        return {
          label: "Entrepreneurship",
          style: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800",
        };
      default:
        return {
          label: cat.charAt(0).toUpperCase() + cat.slice(1),
          style: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
        };
    }
  };

  const getVerificationBadge = () => {
    switch (verificationStatus.toLowerCase()) {
      case "verified":
        return (
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#00dc82] bg-[#00dc82]/10 px-2.5 py-0.5 rounded-full border border-[#00dc82]/30">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00dc82]" />
            VERIFIED
          </span>
        );
      case "expired":
        return (
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-neutral-400 bg-neutral-900 px-2.5 py-0.5 rounded-full border border-neutral-700">
            <Clock className="w-3 h-3 text-neutral-400" />
            CLOSED
          </span>
        );
      case "sample":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-neutral-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
            <span className="red-dot" />
            SAMPLE SPEC
          </span>
        );
    }
  };

  const cardLink = href || `/opportunities/${id}`;

  return (
    <Card
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-[26px] border border-border bg-card hover:bg-muted/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 backdrop-blur-xl",
        className
      )}
      onClick={() => onClick && onClick(id)}
    >
      <div>
        <CardHeader className="p-5 pb-3 space-y-2.5">
          {/* Top Badges & Save Button */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="tape-label text-[10px] uppercase font-mono tracking-wider">
                // {category.toUpperCase()}
              </span>
              {getVerificationBadge()}
            </div>

            <button
              type="button"
              onClick={handleSaveClick}
              disabled={saving}
              title={saved ? "Remove from saved" : "Save opportunity"}
              className={cn(
                "p-2 rounded-xl transition-all cursor-pointer shrink-0 border",
                saved
                  ? "bg-[#eb0028]/20 text-[#eb0028] border-[#eb0028]/40 shadow-[0_0_12px_rgba(235,0,40,0.3)]"
                  : "bg-muted text-muted-foreground hover:text-foreground border-border hover:border-border"
              )}
              aria-label={saved ? "Remove bookmark" : "Add bookmark"}
            >
              <Bookmark
                className={cn(
                  "w-3.5 h-3.5 transition-transform group-active:scale-90",
                  saved ? "fill-current" : ""
                )}
              />
            </button>
          </div>

          {/* Title */}
          <Link href={cardLink} className="block group-hover:text-[#eb0028] transition-colors mt-1">
            <h3 className="font-bold text-base sm:text-lg text-foreground leading-snug line-clamp-2">
              {title}
            </h3>
          </Link>

          {/* Provider */}
          {provider && (
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground truncate">
              <Building2 className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate">{provider}</span>
            </div>
          )}
        </CardHeader>

        <CardContent className="px-5 py-2 space-y-3">
          {/* Description snippet */}
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {truncate(description, 130)}
          </p>

          {/* Location and Dates */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-xs text-muted-foreground pt-1">
            {location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span className="truncate max-w-[180px]">{location}</span>
              </div>
            )}

            {closeDate ? (
              <div className="flex items-center gap-1 text-foreground">
                <Calendar className="w-3.5 h-3.5 text-[#eb0028] shrink-0" />
                <span>DEADLINE: {formatDate(closeDate)}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span>OPEN ENROLLMENT</span>
              </div>
            )}
          </div>
        </CardContent>
      </div>

      <CardFooter className="px-5 py-3.5 border-t border-border bg-muted/40 flex items-center justify-between">
        <Link
          href={cardLink}
          className="font-mono text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        >
          // FULL SPEC
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-[#eb0028]" />
        </Link>

        <Link href={cardLink}>
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs font-mono tracking-wider"
          >
            APPLY & TRACK
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default OpportunityCard;
