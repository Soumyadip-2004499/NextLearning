"use client";

import * as React from "react";
import {
  BookOpen,
  Video,
  FileText,
  Activity,
  FileQuestion,
  Search,
  ExternalLink,
  Clock,
  Radio,
  Sparkles,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlyphBar } from "@/components/ui/nothing-elements";

interface ResourceCardItem {
  id: string;
  title: string;
  description: string | null;
  provider: string;
  resourceType: string;
  url: string;
  language: string;
  educationLevel: string[];
  subjects: string[];
  skills: string[];
  duration: string;
  difficulty: string;
  isSampleData: boolean;
  verifiedAt: string | null;
}

interface ResourcesClientProps {
  initialResources: ResourceCardItem[];
}

export function ResourcesClient({ initialResources }: ResourcesClientProps) {
  const [resources] = React.useState<ResourceCardItem[]>(initialResources);

  // Filters
  const [searchQuery, setSearchQuery] = React.useState("");
  const [languageFilter, setLanguageFilter] = React.useState("all");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [levelFilter, setLevelFilter] = React.useState("all");
  const [providerFilter, setProviderFilter] = React.useState("all");

  const languages = [
    { code: "all", label: "ALL LANGUAGES" },
    { code: "en", label: "ENGLISH" },
    { code: "hi", label: "HINDI (हिन्दी)" },
    { code: "ta", label: "TAMIL (தமிழ்)" },
    { code: "te", label: "TELUGU (తెలుగు)" },
    { code: "kn", label: "KANNADA (ಕನ್ನಡ)" },
    { code: "mr", label: "MARATHI (मराठी)" },
    { code: "bn", label: "BENGALI (বাংলা)" },
  ];

  const resourceTypes = [
    { id: "all", label: "ALL FORMATS" },
    { id: "video", label: "VIDEO LESSON" },
    { id: "course", label: "STRUCTURED COURSE" },
    { id: "article", label: "GUIDE & TEXTBOOK" },
    { id: "activity", label: "PRACTICAL LAB" },
    { id: "quiz", label: "MOCK ASSESSMENT" },
  ];

  const levels = [
    { id: "all", label: "ALL LEVELS" },
    { id: "class_9", label: "CLASS 9" },
    { id: "class_10", label: "CLASS 10" },
    { id: "class_12", label: "CLASS 12" },
    { id: "iti", label: "ITI / VOCATIONAL" },
    { id: "graduate", label: "UNDERGRADUATE" },
  ];

  // Distinct providers
  const availableProviders = React.useMemo(() => {
    const set = new Set<string>();
    resources.forEach((r) => {
      if (r.provider) set.add(r.provider);
    });
    return Array.from(set);
  }, [resources]);

  // Filtering
  const filteredResources = React.useMemo(() => {
    return resources.filter((r) => {
      // Language
      if (languageFilter !== "all" && r.language !== languageFilter) return false;

      // Type
      if (typeFilter !== "all" && r.resourceType !== typeFilter) return false;

      // Provider
      if (providerFilter !== "all" && !r.provider.toLowerCase().includes(providerFilter.toLowerCase())) {
        return false;
      }

      // Level
      if (levelFilter !== "all") {
        const matchesLevel = r.educationLevel.some((lvl) =>
          lvl.toLowerCase().includes(levelFilter.toLowerCase())
        );
        if (!matchesLevel) return false;
      }

      // Search query
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const inTitle = r.title.toLowerCase().includes(q);
        const inDesc = r.description && r.description.toLowerCase().includes(q);
        const inProv = r.provider.toLowerCase().includes(q);
        const inSkills = r.skills.some((s) => s.toLowerCase().includes(q));
        const inSubj = r.subjects.some((s) => s.toLowerCase().includes(q));
        if (!inTitle && !inDesc && !inProv && !inSkills && !inSubj) return false;
      }

      return true;
    });
  }, [resources, languageFilter, typeFilter, providerFilter, levelFilter, searchQuery]);

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "video":
        return Video;
      case "quiz":
        return FileQuestion;
      case "activity":
        return Activity;
      case "article":
        return FileText;
      default:
        return BookOpen;
    }
  };

  const resetAllFilters = () => {
    setSearchQuery("");
    setLanguageFilter("all");
    setTypeFilter("all");
    setLevelFilter("all");
    setProviderFilter("all");
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
            VAULT // OPEN.EDUCATIONAL.REPOSITORIES // DIKSHA · SWAYAM · SKILL INDIA
          </span>
        </div>
        <div className="flex items-center gap-2">
          <GlyphBar activeIndex={3} total={4} />
          <span className="font-mono text-[10px] text-muted-foreground">STATUS: SYNCED</span>
        </div>
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-[11px] text-[#eb0028] uppercase tracking-widest mb-1.5">
            <Layers className="h-3.5 w-3.5" />
            <span>KNOWLEDGE CATALOGUE //</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-dot font-bold uppercase tracking-wider text-foreground">
            Learning Resources
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">
            Curated, free, vernacular learning modules: practical simulation kits, vocational masterclasses, textbooks, and entrance mock exams.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
          <div className="px-3 py-1.5 rounded-xl border border-border bg-card">
            TOTAL MODULES: <span className="text-foreground font-bold">{resources.length}</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls Bento */}
      <div className="p-5 rounded-[26px] border border-border bg-card text-card-foreground backdrop-blur-xl space-y-4">
        {/* Search Input */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by topic, skill (e.g. Electrical, Multimeter, Agriculture, GST)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 pr-4 text-xs sm:text-sm bg-muted/50 border-border text-foreground placeholder:text-muted-foreground rounded-2xl h-12 focus:border-primary/50 font-sans"
          />
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {/* Language */}
          <div className="space-y-1.5">
            <label className="font-dot text-[10px] text-muted-foreground uppercase tracking-widest">
              Language //
            </label>
            <select
              aria-label="Filter by language"
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-primary/50"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code} className="bg-card text-card-foreground">
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* Resource Type */}
          <div className="space-y-1.5">
            <label className="font-dot text-[10px] text-muted-foreground uppercase tracking-widest">
              Format //
            </label>
            <select
              aria-label="Filter by format"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-primary/50"
            >
              {resourceTypes.map((t) => (
                <option key={t.id} value={t.id} className="bg-card text-card-foreground">
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Education Level */}
          <div className="space-y-1.5">
            <label className="font-dot text-[10px] text-muted-foreground uppercase tracking-widest">
              Level //
            </label>
            <select
              aria-label="Filter by education level"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-primary/50"
            >
              {levels.map((lvl) => (
                <option key={lvl.id} value={lvl.id} className="bg-card text-card-foreground">
                  {lvl.label}
                </option>
              ))}
            </select>
          </div>

          {/* Provider */}
          <div className="space-y-1.5">
            <label className="font-dot text-[10px] text-muted-foreground uppercase tracking-widest">
              Repository //
            </label>
            <select
              aria-label="Filter by provider"
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-primary/50"
            >
              <option value="all" className="bg-card text-card-foreground">ALL REPOSITORIES</option>
              {availableProviders.map((prov) => (
                <option key={prov} value={prov} className="bg-card text-card-foreground">
                  {prov.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters count & reset */}
        {(searchQuery || languageFilter !== "all" || typeFilter !== "all" || levelFilter !== "all" || providerFilter !== "all") && (
          <div className="flex items-center justify-between pt-3 border-t border-border text-xs font-mono">
            <span className="text-muted-foreground">
              FILTERED: {filteredResources.length} of {resources.length} MODULES
            </span>
            <button
              type="button"
              onClick={resetAllFilters}
              className="text-[#eb0028] hover:text-foreground uppercase tracking-wider font-semibold cursor-pointer transition-colors"
            >
              RESET ALL FILTERS //
            </button>
          </div>
        )}
      </div>

      {/* Resources Cards Grid */}
      {filteredResources.length === 0 ? (
        <Card className="rounded-[28px] border border-dashed border-border bg-card/60 p-12 text-center text-card-foreground">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/60 mb-3" />
          <h3 className="font-dot text-lg uppercase tracking-wider text-foreground">No Modules Matched</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 font-mono">
            Try adjusting your language, education level, or search keyword.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={resetAllFilters}
            className="mt-5 text-xs font-mono uppercase tracking-wider border-border text-foreground hover:bg-muted"
          >
            Reset Filters //
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res) => {
            const TypeIcon = getTypeIcon(res.resourceType);

            return (
              <div
                key={res.id}
                className="group rounded-[26px] border border-border hover:border-primary/30 bg-card p-6 backdrop-blur-xl flex flex-col justify-between transition-all duration-300 hover:shadow-lg dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.8)] text-card-foreground"
              >
                <div>
                  {/* Top Bar: Provider and Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-dot text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full border border-border bg-muted/60 text-foreground">
                      {res.provider}
                    </span>
                    <div className="flex items-center gap-1.5 font-mono text-[10px]">
                      <span className="px-2 py-0.5 rounded border border-border text-muted-foreground uppercase">
                        {res.language}
                      </span>
                      <span className="px-2 py-0.5 rounded border border-[#00dc82]/30 text-[#00dc82] capitalize">
                        {res.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold font-sans text-foreground group-hover:text-[#eb0028] transition-colors line-clamp-2 leading-snug">
                    {res.title}
                  </h3>

                  {/* Description */}
                  {res.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-2 leading-relaxed">
                      {res.description}
                    </p>
                  )}

                  {/* Metadata: Format & Duration */}
                  <div className="flex items-center gap-4 font-mono text-xs text-muted-foreground pt-3 mt-4 border-t border-border">
                    <span className="flex items-center gap-1.5 capitalize text-foreground">
                      <TypeIcon className="h-3.5 w-3.5 text-[#eb0028]" />
                      {res.resourceType}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      {res.duration}
                    </span>
                  </div>

                  {/* Skills tags */}
                  {res.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-3">
                      {res.skills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="font-mono text-[10px] px-2.5 py-0.5 rounded-md bg-muted/60 border border-border text-muted-foreground"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Action */}
                <div className="pt-4 mt-5 border-t border-border flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                    {res.isSampleData ? "SAMPLE OER" : "VERIFIED OER"}
                  </span>

                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black hover:bg-[#eb0028] hover:text-white dark:hover:bg-[#eb0028] dark:hover:text-white font-mono text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md keep-white"
                  >
                    <span className="keep-white">LAUNCH</span>
                    <ArrowUpRight className="h-3.5 w-3.5 keep-white" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
