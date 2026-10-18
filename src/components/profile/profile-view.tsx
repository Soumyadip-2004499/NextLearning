"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  User,
  MapPin,
  GraduationCap,
  Sparkles,
  BookOpen,
  Target,
  Clock,
  Smartphone,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  Compass,
  Award,
  Users,
  Lightbulb,
  ArrowRight,
  ShieldCheck,
  Heart,
  Save,
  Radio,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GlyphBar } from "@/components/ui/nothing-elements";
import type { UserSession, StudentProfileData } from "@/types";

export interface ProfileViewProps {
  user: UserSession;
  initialProfile: StudentProfileData;
  mentorInfo?: {
    name: string;
    organization: string;
    notes?: string;
  } | null;
}

export function ProfileView({ user, initialProfile, mentorInfo }: ProfileViewProps) {
  const shouldReduceMotion = useReducedMotion();
  const [profile, setProfile] = React.useState<StudentProfileData>(initialProfile);

  // Active dialog state
  const [activeDialog, setActiveDialog] = React.useState<
    "basic" | "interests" | "skills" | "goals" | "preferences" | null
  >(null);

  // Draft state for modal editing
  const [draftData, setDraftData] = React.useState<Partial<StudentProfileData>>({});
  const [newTagInput, setNewTagInput] = React.useState("");
  const [saveSuccessNotice, setSaveSuccessNotice] = React.useState<string | null>(null);

  const openEditDialog = (section: "basic" | "interests" | "skills" | "goals" | "preferences") => {
    setActiveDialog(section);
    setDraftData({ ...profile });
    setNewTagInput("");
  };

  const handleSave = () => {
    setProfile((prev) => ({
      ...prev,
      ...draftData,
    }));
    setActiveDialog(null);
    setSaveSuccessNotice("Profile updated successfully!");
    setTimeout(() => setSaveSuccessNotice(null), 4000);
  };

  // Add tag to draft list
  const handleAddTag = (field: "interests" | "skills" | "careerAspirations" | "hobbies") => {
    if (!newTagInput.trim()) return;
    const currentList = draftData[field] || [];
    if (!currentList.includes(newTagInput.trim())) {
      setDraftData({
        ...draftData,
        [field]: [...currentList, newTagInput.trim()],
      });
    }
    setNewTagInput("");
  };

  // Remove tag from draft list
  const handleRemoveTag = (
    field: "interests" | "skills" | "careerAspirations" | "hobbies",
    itemToRemove: string
  ) => {
    const currentList = draftData[field] || [];
    setDraftData({
      ...draftData,
      [field]: currentList.filter((item) => item !== itemToRemove),
    });
  };

  // Calculate profile completion percentage
  const calculateCompletion = () => {
    let score = 0;
    if (profile.displayName) score += 15;
    if (profile.educationLevel && profile.state) score += 20;
    if (profile.interests && profile.interests.length > 0) score += 20;
    if (profile.skills && profile.skills.length > 0) score += 20;
    if (profile.careerAspirations && profile.careerAspirations.length > 0) score += 15;
    if (profile.careerPreference) score += 10;
    return Math.min(score, 100);
  };

  const completionPercent = calculateCompletion();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.35,
        ease: [0, 0, 0.2, 1],
      },
    },
  };

  const displayName = profile.displayName || user.name || "Student";
  const formattedEdu = profile.educationLevel
    ? profile.educationLevel.replace(/_/g, " ").toUpperCase()
    : "CLASS 10";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-16 max-w-7xl mx-auto py-2"
    >
      {/* Telemetry Strip / Status Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 px-4 py-2.5 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00dc82] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00dc82]"></span>
          </span>
          <span className="font-dot text-[11px] uppercase tracking-widest text-white/90">
            PROFILE // STUDENT.DOSSIER // CONFIDENTIAL ID: {profile.id.slice(0, 12)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <GlyphBar activeIndex={3} total={4} />
          <span className="font-mono text-[10px] text-neutral-400">STATUS: VERIFIED</span>
        </div>
      </div>

      {/* Save Success Alert */}
      {saveSuccessNotice && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-2xl border border-[#00dc82]/40 bg-[#00dc82]/10 px-4 py-3 text-xs font-mono text-[#00dc82]"
        >
          <CheckCircle2 className="h-4 w-4 text-[#00dc82]" />
          <span className="font-semibold uppercase tracking-wider">{saveSuccessNotice}</span>
        </motion.div>
      )}

      {/* 1. Header Profile Summary Card */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-[28px] border border-border bg-card text-card-foreground p-6 sm:p-8 backdrop-blur-xl shadow-2xl"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <Avatar className="h-20 w-20 border-2 border-border shadow-xl bg-muted">
              {user.image && <AvatarImage src={user.image} alt={displayName} />}
              <AvatarFallback className="bg-muted text-2xl font-dot font-bold text-foreground border border-border">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-dot font-bold uppercase tracking-wider text-foreground">
                  {displayName}
                </h1>
                <span className="font-dot text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full border border-border bg-muted text-foreground">
                  {formattedEdu}
                </span>
                <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded border border-[#eb0028]/30 bg-[#eb0028]/10 text-[#eb0028]">
                  STUDENT NODE
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#eb0028]" />
                  {[profile.district, profile.state].filter(Boolean).join(", ") || "Kolkata, West Bengal"}
                </span>
                <span>//</span>
                <span>{user.email || "demo@student.com"}</span>
                {profile.availableHours && (
                  <>
                    <span>//</span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      {profile.availableHours} HRS/WEEK COMMITTED
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => openEditDialog("basic")}
              className="gap-2 font-mono text-xs uppercase tracking-wider border-border text-foreground hover:border-foreground/40 bg-card cursor-pointer"
            >
              <Edit3 className="h-3.5 w-3.5 text-muted-foreground" />
              <span>EDIT DETAILS //</span>
            </Button>

            <Link href="/dashboard">
              <Button size="sm" variant="red" className="w-full sm:w-auto font-mono text-xs tracking-wider gap-1.5 cursor-pointer">
                <Compass className="h-3.5 w-3.5" />
                <span>DASHBOARD</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Profile Completion Indicator */}
        <div className="mt-8 rounded-2xl border border-border bg-muted/60 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#00dc82] shadow-[0_0_8px_#00dc82]" />
              <span className="font-dot text-xs uppercase tracking-widest text-foreground">
                PROFILE STRENGTH: {completionPercent}%
              </span>
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              {completionPercent >= 90
                ? "OPTIMAL MATCH QUALITY // HIGH RECOMMENDATION PRECISION"
                : "COMPLETE REMAINING SECTIONS FOR MAXIMUM AI MATCH ACCURACY"}
            </span>
          </div>

          {/* Segmented meter */}
          <div className="mt-3 grid grid-cols-10 gap-1">
            {Array.from({ length: 10 }).map((_, i) => {
              const active = i < Math.round(completionPercent / 10);
              return (
                <div
                  key={i}
                  className={`h-2 rounded-sm transition-all duration-300 ${
                    active
                      ? "bg-[#00dc82] shadow-[0_0_8px_rgba(0,220,130,0.6)]"
                      : "bg-muted"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* 2. Grid of Organized Profile Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section: My Interests & Hobbies */}
        <motion.div variants={itemVariants}>
          <div className="h-full rounded-[26px] border border-border bg-card text-card-foreground p-6 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted border border-border text-[#eb0028]">
                    <Heart className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-dot text-sm uppercase tracking-wider text-foreground">My Interests</h3>
                    <p className="font-mono text-[11px] text-muted-foreground">
                      Curiosity triggers and preferred topics
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEditDialog("interests")}
                  className="font-mono text-xs text-muted-foreground hover:text-foreground cursor-pointer h-8 px-2.5"
                >
                  <Edit3 className="h-3 w-3 mr-1" />
                  <span>EDIT</span>
                </Button>
              </div>

              <div className="pt-4 space-y-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Core Interests //
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {profile.interests && profile.interests.length > 0 ? (
                      profile.interests.map((interest) => (
                        <span
                          key={interest}
                          className="font-mono text-xs px-3 py-1 rounded-full border border-border bg-muted text-foreground"
                        >
                          {interest.replace(/_/g, " ").toUpperCase()}
                        </span>
                      ))
                    ) : (
                      <span className="font-mono text-xs text-muted-foreground italic">No interests added yet</span>
                    )}
                  </div>
                </div>

                {profile.favoriteSubjects && profile.favoriteSubjects.length > 0 && (
                  <div className="pt-3 border-t border-border">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Favorite Subjects //
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {profile.favoriteSubjects.map((sub) => (
                        <span
                          key={sub}
                          className="font-mono text-xs px-2.5 py-0.5 rounded-md border border-border bg-muted text-foreground"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {profile.hobbies && profile.hobbies.length > 0 && (
                  <div className="pt-3 border-t border-border">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Hobbies //
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {profile.hobbies.map((hobby) => (
                        <span
                          key={hobby}
                          className="font-mono text-xs px-2.5 py-0.5 rounded-md border border-border bg-muted text-foreground"
                        >
                          {hobby}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section: My Skills */}
        <motion.div variants={itemVariants}>
          <div className="h-full rounded-[26px] border border-border bg-card text-card-foreground p-6 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted border border-border text-[#00dc82]">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-dot text-sm uppercase tracking-wider text-foreground">My Skills</h3>
                    <p className="font-mono text-[11px] text-muted-foreground">
                      Current practical and vocational capabilities
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEditDialog("skills")}
                  className="font-mono text-xs text-muted-foreground hover:text-foreground cursor-pointer h-8 px-2.5"
                >
                  <Edit3 className="h-3 w-3 mr-1" />
                  <span>EDIT</span>
                </Button>
              </div>

              <div className="pt-4 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {profile.skills && profile.skills.length > 0 ? (
                    profile.skills.map((skill) => (
                      <div
                        key={skill}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#00dc82]/30 bg-[#00dc82]/10 px-3 py-1.5 font-mono text-xs text-[#00dc82]"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#00dc82]" />
                        <span>{skill}</span>
                      </div>
                    ))
                  ) : (
                    <span className="font-mono text-xs text-muted-foreground italic">No skills registered yet</span>
                  )}
                </div>

                <div className="mt-4 rounded-2xl bg-muted/60 border border-border p-4 font-mono text-xs text-muted-foreground">
                  <p>
                    RECOMMENDATION: Complete practical exercises in your active roadmap to unlock verified skill badges.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section: My Goals & Aspirations */}
        <motion.div variants={itemVariants}>
          <div className="h-full rounded-[26px] border border-border bg-card text-card-foreground p-6 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted border border-border text-amber-500 dark:text-amber-400">
                    <Target className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-dot text-sm uppercase tracking-wider text-foreground">My Goals</h3>
                    <p className="font-mono text-[11px] text-muted-foreground">
                      Target career paths and future employment objectives
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEditDialog("goals")}
                  className="font-mono text-xs text-muted-foreground hover:text-foreground cursor-pointer h-8 px-2.5"
                >
                  <Edit3 className="h-3 w-3 mr-1" />
                  <span>EDIT</span>
                </Button>
              </div>

              <div className="pt-4 space-y-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Target Careers //
                  </p>
                  <div className="mt-2 space-y-2">
                    {profile.careerAspirations && profile.careerAspirations.length > 0 ? (
                      profile.careerAspirations.map((aspiration) => (
                        <div
                          key={aspiration}
                          className="flex items-center justify-between rounded-xl border border-border bg-muted/60 p-3"
                        >
                          <span className="font-sans text-xs font-bold text-foreground">
                            {aspiration}
                          </span>
                          <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded border border-amber-500/30 bg-amber-500/10 text-amber-500 dark:text-amber-400">
                            TARGET
                          </span>
                        </div>
                      ))
                    ) : (
                      <span className="font-mono text-xs text-muted-foreground italic">No aspirations listed yet</span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between font-mono text-xs">
                  <span className="text-muted-foreground">Weekly Commitment:</span>
                  <span className="font-bold text-foreground">
                    {profile.availableHours ? `${profile.availableHours} HRS / WEEK` : "NOT SPECIFIED"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section: My Preferences */}
        <motion.div variants={itemVariants}>
          <div className="h-full rounded-[26px] border border-border bg-card text-card-foreground p-6 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted border border-border text-sky-500 dark:text-sky-400">
                    <Lightbulb className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-dot text-sm uppercase tracking-wider text-foreground">My Preferences</h3>
                    <p className="font-mono text-[11px] text-muted-foreground">
                      Learning methodology and livelihood trajectory
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEditDialog("preferences")}
                  className="font-mono text-xs text-muted-foreground hover:text-foreground cursor-pointer h-8 px-2.5"
                >
                  <Edit3 className="h-3 w-3 mr-1" />
                  <span>EDIT</span>
                </Button>
              </div>

              <div className="pt-4 space-y-3 font-mono text-xs">
                {/* Learning Style */}
                <div className="rounded-xl border border-border bg-muted/60 p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground uppercase text-[10px]">Learning Style</span>
                    <span className="font-dot text-[10px] text-sky-500 dark:text-sky-400 uppercase">
                      {profile.learningStyle || "Visual"} Learner
                    </span>
                  </div>
                  <p className="text-muted-foreground font-sans text-xs">
                    Excels through hands-on diagrams, practical equipment breakdowns, and video simulators.
                  </p>
                </div>

                {/* Career Preference */}
                <div className="rounded-xl border border-border bg-muted/60 p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground uppercase text-[10px]">Career Track</span>
                    <span className="font-dot text-[10px] text-[#00dc82] uppercase">
                      {profile.careerPreference || "Vocational"} Pathway
                    </span>
                  </div>
                  <p className="text-muted-foreground font-sans text-xs">
                    Targeting certified field apprenticeships, technical licensing, and direct livelihood income.
                  </p>
                </div>

                {/* Device Access */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-muted-foreground">Primary Device:</span>
                  <span className="font-semibold text-foreground uppercase">
                    {profile.deviceAccess || "Smartphone"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 3. Assigned Mentor Section */}
      {mentorInfo && (
        <motion.div variants={itemVariants}>
          <div className="rounded-[28px] border border-border bg-card text-card-foreground p-6 sm:p-8 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted border border-border text-[#eb0028] shadow-sm shrink-0">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-base font-bold font-sans text-foreground">
                      Assigned Mentor: {mentorInfo.name}
                    </h3>
                    <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded border border-[#00dc82]/30 bg-[#00dc82]/10 text-[#00dc82]">
                      VERIFIED FACILITATOR
                    </span>
                  </div>
                  <p className="text-xs font-mono text-muted-foreground mt-0.5">
                    Organization: {mentorInfo.organization}
                  </p>
                  {mentorInfo.notes && (
                    <p className="mt-2 text-xs italic text-muted-foreground max-w-2xl font-sans">
                      &ldquo;{mentorInfo.notes}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              <div className="shrink-0">
                <Link href="/directory">
                  <Button size="sm" variant="outline" className="font-mono text-xs uppercase tracking-wider border-border text-foreground hover:border-foreground/40 bg-card cursor-pointer">
                    <span>CONNECT IN DIRECTORY //</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ==================================================================== */}
      {/* EDIT MODAL DIALOGS                                                   */}
      {/* ==================================================================== */}

      {/* 1. Basic Info Dialog */}
      <Dialog open={activeDialog === "basic"} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="max-w-md bg-card border border-border text-foreground rounded-[28px] p-6 shadow-2xl">
          <DialogHeader className="space-y-1">
            <DialogTitle className="font-dot text-lg uppercase tracking-wider text-foreground">
              Edit Basic Information //
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground font-mono">
              Update your name, schooling level, and regional location.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 font-mono text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="displayName" className="text-muted-foreground uppercase text-[10px]">Display Name</Label>
              <Input
                id="displayName"
                value={draftData.displayName || ""}
                onChange={(e) => setDraftData({ ...draftData, displayName: e.target.value })}
                className="bg-muted/50 border-border text-foreground rounded-xl placeholder:text-muted-foreground"
                placeholder="Soumyadip Chattopadhyay"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="district" className="text-muted-foreground uppercase text-[10px]">District</Label>
                <Input
                  id="district"
                  value={draftData.district || ""}
                  onChange={(e) => setDraftData({ ...draftData, district: e.target.value })}
                  className="bg-muted/50 border-border text-foreground rounded-xl placeholder:text-muted-foreground"
                  placeholder="Kolkata"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="state" className="text-muted-foreground uppercase text-[10px]">State</Label>
                <Input
                  id="state"
                  value={draftData.state || ""}
                  onChange={(e) => setDraftData({ ...draftData, state: e.target.value })}
                  className="bg-muted/50 border-border text-foreground rounded-xl placeholder:text-muted-foreground"
                  placeholder="West Bengal"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="educationLevel" className="text-muted-foreground uppercase text-[10px]">Education Level</Label>
                <Input
                  id="educationLevel"
                  value={draftData.educationLevel || ""}
                  onChange={(e) => setDraftData({ ...draftData, educationLevel: e.target.value })}
                  className="bg-muted/50 border-border text-foreground rounded-xl placeholder:text-muted-foreground"
                  placeholder="class_10"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="availableHours" className="text-muted-foreground uppercase text-[10px]">Hours / Week</Label>
                <Input
                  id="availableHours"
                  type="number"
                  value={draftData.availableHours || ""}
                  onChange={(e) => setDraftData({ ...draftData, availableHours: parseInt(e.target.value) || 0 })}
                  className="bg-muted/50 border-border text-foreground rounded-xl placeholder:text-muted-foreground"
                  placeholder="10"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setActiveDialog(null)} className="font-mono text-xs border-border text-foreground bg-card hover:bg-muted">
              Cancel
            </Button>
            <Button variant="red" onClick={handleSave} className="font-mono text-xs gap-1.5">
              <Save className="h-3.5 w-3.5" />
              <span>SAVE CHANGES //</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. Interests Dialog */}
      <Dialog open={activeDialog === "interests"} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="max-w-md bg-card border border-border text-foreground rounded-[28px] p-6 shadow-2xl">
          <DialogHeader className="space-y-1">
            <DialogTitle className="font-dot text-lg uppercase tracking-wider text-foreground">
              Edit My Interests //
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground font-mono">
              Add or remove subjects and industries you want to learn about.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 font-mono text-xs">
            <div className="flex gap-2">
              <Input
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag("interests"))}
                placeholder="e.g. clean_energy, robotics, farming"
                className="bg-muted/50 border-border text-foreground rounded-xl placeholder:text-muted-foreground"
              />
              <Button type="button" onClick={() => handleAddTag("interests")} size="sm" variant="outline" className="border-border text-foreground bg-card hover:bg-muted">
                <Plus className="h-4 w-4 mr-1" />
                <span>ADD</span>
              </Button>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-1">
              {draftData.interests && draftData.interests.length > 0 ? (
                draftData.interests.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-muted px-2.5 py-1 text-xs text-foreground"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag("interests", tag)}
                      className="hover:text-[#eb0028] cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">No interests registered.</span>
              )}
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setActiveDialog(null)} className="font-mono text-xs border-border text-foreground bg-card hover:bg-muted">
              Cancel
            </Button>
            <Button variant="red" onClick={handleSave} className="font-mono text-xs">
              SAVE CHANGES //
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. Skills Dialog */}
      <Dialog open={activeDialog === "skills"} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="max-w-md bg-card border border-border text-foreground rounded-[28px] p-6 shadow-2xl">
          <DialogHeader className="space-y-1">
            <DialogTitle className="font-dot text-lg uppercase tracking-wider text-foreground">
              Edit My Skills //
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground font-mono">
              Register technical or hands-on skills you already possess.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 font-mono text-xs">
            <div className="flex gap-2">
              <Input
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag("skills"))}
                placeholder="e.g. Soldering, Motor repair, Spreadsheet"
                className="bg-muted/50 border-border text-foreground rounded-xl placeholder:text-muted-foreground"
              />
              <Button type="button" onClick={() => handleAddTag("skills")} size="sm" variant="outline" className="border-border text-foreground bg-card hover:bg-muted">
                <Plus className="h-4 w-4 mr-1" />
                <span>ADD</span>
              </Button>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-1">
              {draftData.skills && draftData.skills.length > 0 ? (
                draftData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#00dc82]/30 bg-[#00dc82]/10 px-2.5 py-1 text-xs text-[#00dc82]"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag("skills", skill)}
                      className="hover:text-red-400 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">No skills registered.</span>
              )}
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setActiveDialog(null)} className="font-mono text-xs border-border text-foreground bg-card hover:bg-muted">
              Cancel
            </Button>
            <Button variant="red" onClick={handleSave} className="font-mono text-xs">
              SAVE CHANGES //
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 4. Goals Dialog */}
      <Dialog open={activeDialog === "goals"} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="max-w-md bg-card border border-border text-foreground rounded-[28px] p-6 shadow-2xl">
          <DialogHeader className="space-y-1">
            <DialogTitle className="font-dot text-lg uppercase tracking-wider text-foreground">
              Edit My Goals //
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground font-mono">
              Add target roles you want to pursue.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 font-mono text-xs">
            <div className="flex gap-2">
              <Input
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag("careerAspirations"))}
                placeholder="e.g. Solar Technician, Web Developer"
                className="bg-muted/50 border-border text-foreground rounded-xl placeholder:text-muted-foreground"
              />
              <Button type="button" onClick={() => handleAddTag("careerAspirations")} size="sm" variant="outline" className="border-border text-foreground bg-card hover:bg-muted">
                <Plus className="h-4 w-4 mr-1" />
                <span>ADD</span>
              </Button>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-1">
              {draftData.careerAspirations && draftData.careerAspirations.length > 0 ? (
                draftData.careerAspirations.map((goal) => (
                  <span
                    key={goal}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs text-amber-500 dark:text-amber-400"
                  >
                    <span>{goal}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag("careerAspirations", goal)}
                      className="hover:text-red-400 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">No career goals listed.</span>
              )}
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setActiveDialog(null)} className="font-mono text-xs border-border text-foreground bg-card hover:bg-muted">
              Cancel
            </Button>
            <Button variant="red" onClick={handleSave} className="font-mono text-xs">
              SAVE CHANGES //
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 5. Preferences Dialog */}
      <Dialog open={activeDialog === "preferences"} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="max-w-md bg-card border border-border text-foreground rounded-[28px] p-6 shadow-2xl">
          <DialogHeader className="space-y-1">
            <DialogTitle className="font-dot text-lg uppercase tracking-wider text-foreground">
              Edit Preferences //
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground font-mono">
              Configure your learning and livelihood approach.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 font-mono text-xs">
            <div className="space-y-1.5">
              <Label className="text-muted-foreground uppercase text-[10px]">Learning Style</Label>
              <Input
                value={draftData.learningStyle || ""}
                onChange={(e) => setDraftData({ ...draftData, learningStyle: e.target.value })}
                placeholder="visual / hands_on / reading"
                className="bg-muted/50 border-border text-foreground rounded-xl placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-muted-foreground uppercase text-[10px]">Career Preference</Label>
              <Input
                value={draftData.careerPreference || ""}
                onChange={(e) => setDraftData({ ...draftData, careerPreference: e.target.value })}
                placeholder="vocational / employment / entrepreneurship"
                className="bg-muted/50 border-border text-foreground rounded-xl placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-muted-foreground uppercase text-[10px]">Device Access</Label>
              <Input
                value={draftData.deviceAccess || ""}
                onChange={(e) => setDraftData({ ...draftData, deviceAccess: e.target.value })}
                placeholder="smartphone / computer / shared"
                className="bg-muted/50 border-border text-foreground rounded-xl placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setActiveDialog(null)} className="font-mono text-xs border-border text-foreground bg-card hover:bg-muted">
              Cancel
            </Button>
            <Button variant="red" onClick={handleSave} className="font-mono text-xs">
              SAVE CHANGES //
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
