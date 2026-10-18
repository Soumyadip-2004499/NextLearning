"use client";

import * as React from "react";
import { useState, useEffect, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Sparkles,
  Compass,
  RotateCcw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  ArrowRight,
  Check,
  GraduationCap,
  Briefcase,
  HelpCircle,
  X,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CareerCard } from "@/components/career/career-card";
import { CategoryFilter } from "@/components/career/category-filter";
import { CAREER_CATEGORIES } from "@/data/careers";
import { EDUCATION_LEVELS } from "@/data/education-levels";
import { CareerCard as CareerCardType } from "@/types";
import { RecommendedCareerItem } from "@/app/api/careers/recommend/route";

const SUGGESTED_INTERESTS = [
  "Computers & Coding",
  "Clean Energy & Solar",
  "Healthcare & Nursing",
  "Modern Agriculture",
  "Electrical & Trades",
  "Business & Retail",
  "Arts & Graphic Design",
  "Banking & Accounting",
  "Social Work & Teaching",
  "Automotive & Machines",
];

const SUGGESTED_SKILLS = [
  "Basic Computer Operations",
  "Customer Communication",
  "Smartphone & UPI Usage",
  "Problem Solving",
  "Domestic Electrical Safety",
  "Bookkeeping & Math",
  "Active Listening",
  "Time Management",
];

export default function CareerDiscoveryPage() {
  const [careers, setCareers] = useState<CareerCardType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCareers, setTotalCareers] = useState<number>(0);

  // AI Recommendations State
  const [isRecommendOpen, setIsRecommendOpen] = useState<boolean>(false);
  const [isRecommending, setIsRecommending] = useState<boolean>(false);
  const [recommendMode, setRecommendMode] = useState<boolean>(false);
  const [recommendedList, setRecommendedList] = useState<RecommendedCareerItem[]>([]);

  // Recommendation Form State
  const [formInterests, setFormInterests] = useState<string[]>([]);
  const [formSkills, setFormSkills] = useState<string[]>([]);
  const [formEducation, setFormEducation] = useState<string>("class_10");
  const [formPreference, setFormPreference] = useState<string>("employment");
  const [formAspiration, setFormAspiration] = useState<string>("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch careers based on filters
  useEffect(() => {
    if (recommendMode) return; // Do not overwrite when in recommendation mode

    let isSubscribed = true;
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (debouncedSearch) params.set("search", debouncedSearch);
    params.set("page", currentPage.toString());
    params.set("pageSize", "9");

    fetch(`/api/careers?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load careers");
        return res.json();
      })
      .then((data) => {
        if (isSubscribed) {
          if (data.success) {
            setCareers(data.data || []);
            setTotalPages(data.totalPages || 1);
            setTotalCareers(data.total || 0);
          } else {
            setError(data.error || "Unable to retrieve careers");
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isSubscribed) {
          console.error("Error loading careers:", err);
          setError("Unable to load careers. Please check your connection.");
          setLoading(false);
        }
      });

    return () => {
      isSubscribed = false;
    };
  }, [selectedCategory, debouncedSearch, currentPage, recommendMode]);

  // Handle AI Recommendation Request
  const handleGetRecommendations = async () => {
    setIsRecommending(true);
    try {
      const response = await fetch("/api/careers/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interests: formInterests,
          skills: formSkills,
          educationLevel: formEducation,
          careerPreference: formPreference,
          careerAspirations: formAspiration ? [formAspiration] : [],
        }),
      });

      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        setRecommendedList(result.data);
        setRecommendMode(true);
        setIsRecommendOpen(false);

        // Convert recommendation items to CareerCards with attached score & reasons
        const mappedCards: CareerCardType[] = result.data.map((item: RecommendedCareerItem) => ({
          ...item.career,
          matchScore: item.score,
          matchReasons: item.reasons,
        }));

        setCareers(mappedCards);
        setTotalCareers(mappedCards.length);
        setTotalPages(1);
        setCurrentPage(1);
      } else {
        alert("Could not generate recommendations at this time.");
      }
    } catch (e) {
      console.error("Recommendation error:", e);
      alert("Something went wrong while matching careers. Please try again.");
    } finally {
      setIsRecommending(false);
    }
  };

  // Exit Recommendation Mode
  const handleClearRecommendationMode = () => {
    setRecommendMode(false);
    setRecommendedList([]);
    setCurrentPage(1);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setDebouncedSearch("");
    setCurrentPage(1);
    setRecommendMode(false);
  };

  // Toggle interest chip in form
  const toggleInterest = (interest: string) => {
    setFormInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  // Toggle skill chip in form
  const toggleSkill = (skill: string) => {
    setFormSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  return (
    <div className="w-full text-foreground transition-colors duration-400">
      {/* ------------------------------------------------------------------ */}
      {/* HERO SECTION                                                       */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative overflow-hidden border-b border-border bg-card/80 backdrop-blur-xl pt-10 pb-12 sm:pt-14 sm:pb-14 transition-colors duration-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-muted/60 border border-border px-3.5 py-1 text-xs font-mono text-muted-foreground">
                <span className="red-dot" />
                <span>INDEX // 36 CAREER PATHWAYS & VOCATIONAL TRADES</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold tracking-tight text-foreground">
                Discover Your <span className="font-dot tracking-widest text-[#eb0028]">CAREER PATH</span>
              </h1>
              <p className="text-sm sm:text-base text-neutral-400 leading-relaxed max-w-xl font-sans">
                Explore 36 high-demand careers across 12 sectors. From local digital entrepreneurship to solar technical trades, discover practical stepping stones for rural India.
              </p>
            </div>

            {/* AI Recommendation CTA */}
            <div className="shrink-0 flex flex-col gap-2.5">
              <Button
                variant="red"
                size="lg"
                onClick={() => setIsRecommendOpen(true)}
                className="font-mono text-xs tracking-wider shadow-[0_0_25px_rgba(235,0,40,0.3)] cursor-pointer"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                <span>RUN AI MATCHER // SCAN</span>
              </Button>
              <div className="text-[11px] font-mono text-neutral-500 text-center md:text-left flex items-center justify-center md:justify-start gap-1.5">
                <span className="red-dot" />
                <span>Deterministic Scoring Engine · 30s Scan</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* FILTER & DISCOVERY TOOLBAR                                         */}
      {/* ------------------------------------------------------------------ */}
      <section className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur-xl py-4 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-3.5">
          {/* Active AI Recommendation Banner (if active) */}
          {recommendMode && (
            <div className="flex items-center justify-between gap-3 bg-card border border-[#eb0028]/40 rounded-2xl px-4 py-3 text-xs text-card-foreground shadow-sm">
              <div className="flex items-center gap-2.5 text-foreground font-mono">
                <span className="red-dot animate-ping" />
                <span>
                  TOP <strong>{careers.length} MATCHES</strong> // SCORING CONFIRMED FOR YOUR PROFILE
                </span>
              </div>
              <button
                type="button"
                onClick={handleClearRecommendationMode}
                className="flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground underline cursor-pointer"
              >
                <span>VIEW ALL</span>
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Search bar & Category chips */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full md:w-80 shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search careers, skills, or roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-8 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground text-xs font-mono h-10 rounded-full focus:border-primary"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Quick stats & Reset */}
            <div className="flex items-center justify-between md:justify-end gap-3 text-xs font-mono text-muted-foreground">
              <span>
                // REGISTRY: <strong className="text-foreground">{careers.length}</strong> /{" "}
                <strong className="text-foreground">{totalCareers}</strong>
              </span>
              {(selectedCategory !== "all" || debouncedSearch || recommendMode) && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-[#eb0028] hover:text-foreground font-mono text-xs cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>RESET</span>
                </button>
              )}
            </div>
          </div>

          {/* Horizontal Category Scroll Bar */}
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={(catId) => {
              if (recommendMode) setRecommendMode(false);
              setSelectedCategory(catId);
              setCurrentPage(1);
            }}
          />
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* CAREERS GRID SECTION                                               */}
      {/* ------------------------------------------------------------------ */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Loading state with skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-card p-6 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-24 rounded-lg" />
                  <Skeleton className="h-4 w-12 rounded-md" />
                </div>
                <Skeleton className="h-6 w-3/4 rounded-lg" />
                <Skeleton className="h-14 w-full rounded-lg" />
                <div className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20 rounded-md" />
                    <Skeleton className="h-6 w-24 rounded-md" />
                    <Skeleton className="h-6 w-16 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 px-4">
            <div className="inline-flex p-3 rounded-2xl bg-red-50 dark:bg-red-950/50 text-red-600 mb-4">
              <HelpCircle className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-2">
              Failed to Load Careers
            </h3>
            <p className="text-sm text-stone-500 max-w-md mx-auto mb-6">
              {error}
            </p>
            <Button variant="outline" onClick={handleResetFilters}>
              Retry Loading
            </Button>
          </div>
        ) : careers.length === 0 ? (
          /* Empty state */
          <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-stone-300 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30">
            <div className="inline-flex p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 mb-4">
              <Compass className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">
              No careers match your filters
            </h3>
            <p className="text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto mb-6 leading-relaxed">
              We couldn&apos;t find any careers matching your current search criteria. Try loosening your keywords or exploring other industry sectors.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button variant="outline" onClick={handleResetFilters}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset All Filters
              </Button>
              <Button variant="gradient" onClick={() => setIsRecommendOpen(true)}>
                <Sparkles className="h-4 w-4 mr-2" />
                Try AI Matcher
              </Button>
            </div>
          </div>
        ) : (
          /* Cards Grid with Framer Motion stagger */
          <>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.06,
                  },
                },
              }}
            >
              {careers.map((career) => (
                <motion.div
                  key={career.id}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
                  }}
                >
                  <CareerCard
                    career={career}
                    matchScore={career.matchScore}
                    matchReasons={career.matchReasons}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination Controls (only if not in AI recommend mode) */}
            {!recommendMode && totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="rounded-xl"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>

                <div className="text-sm text-stone-600 dark:text-stone-400 px-4 font-medium">
                  Page <strong className="text-stone-900 dark:text-stone-100">{currentPage}</strong> of{" "}
                  <strong className="text-stone-900 dark:text-stone-100">{totalPages}</strong>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded-xl"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      {/* ------------------------------------------------------------------ */}
      {/* AI RECOMMENDATION MODAL                                            */}
      {/* ------------------------------------------------------------------ */}
      <Dialog open={isRecommendOpen} onOpenChange={setIsRecommendOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
              <Sparkles className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Personalized Matching
              </span>
            </div>
            <DialogTitle className="text-xl">
              Get AI Career Recommendations
            </DialogTitle>
            <DialogDescription>
              Select your strengths, education level, and aspirations. NextLearning&apos;s AI engine will match the best local career opportunities for you.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-3">
            {/* Education Level */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 block mb-2">
                1. Your Current Education Level
              </label>
              <select
                value={formEducation}
                onChange={(e) => setFormEducation(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {EDUCATION_LEVELS.map((lvl) => (
                  <option key={lvl.value} value={lvl.value}>
                    {lvl.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Interests Multi-Select Chips */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 block mb-1.5">
                2. What fields interest you most? (Select 1-4)
              </label>
              <p className="text-xs text-stone-500 mb-2.5">
                Tap the topics you enjoy exploring or learning about.
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_INTERESTS.map((interest) => {
                  const isSelected = formInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                          : "bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-indigo-300"
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                      <span>{interest}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Skills Multi-Select Chips */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 block mb-1.5">
                3. Skills you already have or are learning
              </label>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_SKILLS.map((skill) => {
                  const isSelected = formSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? "bg-teal-600 text-white border-teal-600 shadow-xs"
                          : "bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-teal-300"
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                      <span>{skill}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Career Preference */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 block mb-2">
                4. Preferred Pathway
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { value: "employment", label: "Direct Employment / Job" },
                  { value: "vocational", label: "Technical / Vocational Trade" },
                  { value: "entrepreneurship", label: "Business & Self-Employment" },
                  { value: "education", label: "Higher Degrees & Academics" },
                ].map((pref) => (
                  <button
                    key={pref.value}
                    type="button"
                    onClick={() => setFormPreference(pref.value)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer font-medium ${
                      formPreference === pref.value
                        ? "border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200"
                        : "border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800"
                    }`}
                  >
                    {pref.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Career Aspiration (Optional text) */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 block mb-1.5">
                5. Any dream career in mind? (Optional)
              </label>
              <Input
                type="text"
                placeholder="e.g. Solar Technician, Web Developer, Organic Farmer, Teacher"
                value={formAspiration}
                onChange={(e) => setFormAspiration(e.target.value)}
                className="h-10 text-sm"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsRecommendOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="gradient"
              type="button"
              disabled={isRecommending}
              onClick={handleGetRecommendations}
              className="cursor-pointer"
            >
              {isRecommending ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin" />
                  <span>Analyzing Profile...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Find My Matches</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
