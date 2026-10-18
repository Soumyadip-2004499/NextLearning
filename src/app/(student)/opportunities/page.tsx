"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Filter,
  X,
  RefreshCw,
  FolderKanban,
  GraduationCap,
  Building2,
  Calendar,
  Layers,
} from "lucide-react";
import { EDUCATION_LEVELS } from "@/data/education-levels";
import { OpportunityCard } from "@/components/opportunity/opportunity-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface OpportunityItem {
  id: string;
  title: string;
  category: string;
  provider: string | null;
  description: string;
  eligibleLevels: string[];
  location: string | null;
  skills: string[];
  openDate: string | null;
  closeDate: string | null;
  verificationStatus: string;
  isSampleData: boolean;
  isSaved?: boolean;
}

const CATEGORY_TABS = [
  { value: "all", label: "All Opportunities" },
  { value: "scholarship", label: "Scholarships" },
  { value: "scheme", label: "Govt Schemes" },
  { value: "apprenticeship", label: "Apprenticeships" },
  { value: "internship", label: "Internships" },
  { value: "training", label: "Training" },
  { value: "employment", label: "Employment" },
];

export default function OpportunitiesDiscoveryPage() {
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [savedCount, setSavedCount] = useState(0);

  // Fetch opportunities from API
  useEffect(() => {
    async function loadOpportunities() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (activeCategory !== "all") queryParams.set("category", activeCategory);
        if (selectedLevel !== "all") queryParams.set("level", selectedLevel);
        if (searchQuery.trim()) queryParams.set("search", searchQuery.trim());

        const res = await fetch(`/api/opportunities?${queryParams.toString()}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setOpportunities(json.data);
            const savedItems = json.data.filter((item: OpportunityItem) => item.isSaved);
            setSavedCount(savedItems.length);
          }
        }
      } catch (err) {
        console.error("Failed to load opportunities:", err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      loadOpportunities();
    }, 200);

    return () => clearTimeout(timer);
  }, [activeCategory, selectedLevel, searchQuery]);

  const handleResetFilters = () => {
    setActiveCategory("all");
    setSelectedLevel("all");
    setSearchQuery("");
  };

  const handleCardSaveToggle = (id: string) => {
    setOpportunities((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextSaved = !item.isSaved;
          setSavedCount((c) => (nextSaved ? c + 1 : Math.max(0, c - 1)));
          return { ...item, isSaved: nextSaved };
        }
        return item;
      })
    );
  };

  return (
    <div className="w-full text-foreground transition-colors duration-400 pb-16">
      {/* Top Header Banner */}
      <div className="bg-card/90 border-b border-border backdrop-blur-xl text-card-foreground pt-8 pb-10 px-4 sm:px-6 lg:px-8 transition-colors duration-400">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/60 border border-border text-muted-foreground font-mono text-xs mb-3">
                <span className="red-dot" />
                <span>DIRECTORY // SCHOLARSHIP & SKILLING SCHEMES</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-sans font-bold tracking-tight text-foreground">
                Opportunities & <span className="font-dot tracking-widest text-[#eb0028]">SCHOLARSHIPS</span>
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base mt-2 max-w-2xl font-sans">
                Discover government scholarships, certified apprenticeship drives, vocational
                schemes, and regional opportunities curated for rural Indian students.
              </p>
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/opportunities/saved">
                <Button
                  variant="outline"
                  className="bg-muted/60 hover:bg-muted border-border text-foreground rounded-full font-mono text-xs h-10 px-4"
                >
                  <Bookmark className="w-3.5 h-3.5 mr-2 text-[#eb0028]" />
                  SAVED
                  {savedCount > 0 && (
                    <span className="ml-1.5 px-2 py-0.5 rounded-full bg-[#eb0028] text-white text-[10px] font-bold keep-white">
                      {savedCount}
                    </span>
                  )}
                </Button>
              </Link>

              <Link href="/opportunities/applications">
                <Button
                  variant="red"
                  className="font-mono text-xs tracking-wider rounded-full h-10 px-5 shadow-[0_0_20px_rgba(235,0,40,0.3)] keep-white"
                >
                  <FolderKanban className="w-3.5 h-3.5 mr-2 keep-white" />
                  <span className="keep-white">APPLICATION TRACKER</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Search Bar & Level Dropdown */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
            <div className="md:col-span-8 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by scheme name, provider, keyword (e.g. 'Solar', 'NSP', 'PMKVY')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 pl-11 pr-10 rounded-full bg-muted/50 border-border text-foreground placeholder:text-muted-foreground font-mono text-xs focus:border-[#eb0028]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="md:col-span-4">
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="h-11 rounded-full bg-muted/50 border-border text-foreground font-mono text-xs">
                  <SelectValue placeholder="Filter by Education Level" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] bg-card border-border text-card-foreground font-mono text-xs">
                  <SelectItem value="all">ALL EDUCATION LEVELS</SelectItem>
                  {EDUCATION_LEVELS.map((lvl) => (
                    <SelectItem key={lvl.value} value={lvl.value}>
                      {lvl.label.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* Category Tabs */}
        <div className="overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-1.5 p-1 bg-muted/50 rounded-full border border-border shadow-sm min-w-max">
            {CATEGORY_TABS.map((tab) => {
              const isActive = activeCategory === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveCategory(tab.value)}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all duration-200 cursor-pointer select-none uppercase",
                    isActive
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Info & Transparency Note */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-[20px] bg-card border border-border text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="red-dot" />
            <span>
              All listed schemes link directly to official Central/State Government or certified
              institution portals. Click on any opportunity to view eligibility criteria.
            </span>
          </div>

          {(activeCategory !== "all" || selectedLevel !== "all" || searchQuery) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="h-7 px-2.5 text-xs font-mono text-[#eb0028] hover:text-foreground shrink-0"
            >
              RESET FILTERS
            </Button>
          )}
        </div>

        {/* Opportunity Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-64 rounded-2xl bg-muted/60 animate-pulse border border-border"
              />
            ))}
          </div>
        ) : opportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opp) => (
              <OpportunityCard
                key={opp.id}
                id={opp.id}
                title={opp.title}
                category={opp.category}
                provider={opp.provider}
                description={opp.description}
                closeDate={opp.closeDate}
                openDate={opp.openDate}
                location={opp.location}
                verificationStatus={opp.verificationStatus}
                isSampleData={opp.isSampleData}
                isSaved={opp.isSaved}
                onSaveToggle={handleCardSaveToggle}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="py-20 text-center rounded-3xl border border-dashed border-border bg-card/60 p-8 text-card-foreground">
            <div className="w-16 h-16 rounded-2xl bg-muted text-foreground flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">
              No matching opportunities found
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
              We couldn&apos;t find opportunities matching your current filters. Try relaxing the
              education level or search terms.
            </p>
            <Button
              onClick={handleResetFilters}
              variant="outline"
              className="border-border text-foreground hover:bg-muted rounded-xl"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
