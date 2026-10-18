"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  ArrowRight,
  Sparkles,
  Users,
  Mic,
  Award,
  BookOpen,
  Route,
  Zap,
  Globe,
  CheckCircle2,
  ChevronRight,
  Menu,
  X,
  Volume2,
  Flame,
  Layers,
  ArrowUpRight,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  DotMatrixDisplay,
  GlyphBar,
  VoiceSoundwave,
  TelemetryWidget,
  SegmentedMeter,
} from "@/components/ui/nothing-elements";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const stats = [
  { value: "36", label: "CAREER PATHWAYS", sub: "12 HIGH-GROWTH SECTORS" },
  { value: "18+", label: "VERIFIED SCHEMES", sub: "PM SURYA GHAR // NAPS" },
  { value: "11", label: "INDIAN LANGUAGES", sub: "VOICE-ENABLED INTERFACE" },
  { value: "100%", label: "DATA-GROUNDED", sub: "DIKSHA // ZERO FABRICATION" },
];

const bentoFeatures = [
  {
    id: "career-ai",
    tag: "MODULE // B",
    title: "AI CAREER RADAR",
    description:
      "Explainable weighted algorithm mapping self-reported skills and interests across vocational, technical, and emerging rural occupations.",
    stat: "94% MATCH",
    metric: "SOLAR PV ROOFTOP TECHNICIAN",
    category: "CLEAN ENERGY",
  },
  {
    id: "voice-vernacular",
    tag: "MODULE // J",
    title: "VERBATIM VOICE HUD",
    description:
      "Integrated Web Speech recognition enabling hands-free conversation in Hindi, Tamil, Telugu, and 8 other Indian languages.",
    stat: "11 LANGS",
    metric: "HINDI // TAMIL // BENGALI",
    category: "ACCESSIBILITY",
  },
  {
    id: "roadmap",
    tag: "MODULE // C",
    title: "GLYPH MILESTONE ROADMAP",
    description:
      "Step-by-step modular journey connecting school curriculum with practical certifications, DIKSHA open textbooks, and bridge exams.",
    stat: "6 STEPS",
    metric: "FOUNDATION → CERTIFICATION",
    category: "LEARNING",
  },
  {
    id: "opportunities",
    tag: "MODULE // E",
    title: "VERIFIED SCHEME DISCOVERY",
    description:
      "Deterministic eligibility checks for government financial aid, apprenticeships, and DBT scholarships. Zero fabricated deadlines.",
    stat: "18 SCHEMES",
    metric: "PM-YASASVI // VISHWAKARMA",
    category: "LIVELIHOOD",
  },
];

const indianLangs = [
  { name: "हिन्दी", code: "hi", prompt: "कक्षा 10 के बाद कौन से तकनीकी काम सीख सकते हैं?" },
  { name: "English", code: "en", prompt: "How can I become an Agritech Drone Pilot?" },
  { name: "தமிழ்", code: "ta", prompt: "சூரிய மின்சக்தி தொழில்நுட்ப படிப்பு விவரங்கள்" },
  { name: "తెలుగు", code: "te", prompt: "వ్యవసాయ సాంకేతిక కోర్సులు ఏమిటి?" },
  { name: "বাংলা", code: "bn", prompt: "গ্রামীণ ডিজিটাল উদ্যোক্তা হওয়ার উপায়" },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLang, setActiveLang] = useState(0);
  const [isListeningSim, setIsListeningSim] = useState(true);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden dot-bg transition-colors duration-400">
      {/* Top Telemetry & Status Bar */}
      <div className="border-b border-border bg-card/60 backdrop-blur-xl transition-colors duration-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <TelemetryWidget />
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 text-foreground backdrop-blur-2xl transition-colors duration-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-muted/60 border border-border flex items-center justify-center transition-all duration-300 group-hover:border-[#eb0028] group-hover:shadow-[0_0_20px_rgba(235,0,40,0.4)]">
                <span className="red-dot" />
              </div>
              <div className="flex flex-col">
                <span className="font-dot text-xl sm:text-2xl font-bold tracking-widest text-foreground group-hover:text-red-500 transition-colors">
                  NEXTLEARNING
                </span>
                <span className="text-[10px] font-mono tracking-widest text-muted-foreground">
                  LEARNING → LIVELIHOOD
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-8 text-xs font-mono tracking-wider">
              <a
                href="#bento"
                className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors uppercase flex items-center gap-1.5"
              >
                <span className="text-neutral-400 dark:text-neutral-600">//</span> 01 FEATURES
              </a>
              <a
                href="#voice-preview"
                className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors uppercase flex items-center gap-1.5"
              >
                <span className="text-neutral-400 dark:text-neutral-600">//</span> 02 VOICE HUD
              </a>
              <a
                href="#pathway"
                className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors uppercase flex items-center gap-1.5"
              >
                <span className="text-neutral-400 dark:text-neutral-600">//</span> 03 PATHWAYS
              </a>
              <Link
                href="/careers"
                className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors uppercase flex items-center gap-1.5"
              >
                <span className="text-neutral-400 dark:text-neutral-600">//</span> 04 CAREERS
              </Link>
            </div>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center gap-2.5">
              <ThemeToggle variant="compact" />
              <Link href="/auth/login">
                <Button variant="outline" size="sm" className="font-mono text-xs">
                  SIGN IN
                </Button>
              </Link>
              <Link href="/api/auth/demo-student">
                <Button variant="red" size="sm" className="font-mono text-xs gap-2 keep-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span className="keep-white">STUDENT DEMO</span>
                  <ArrowRight className="w-3.5 h-3.5 keep-white" />
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-2xl bg-muted border border-border text-foreground"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Dropdown */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden border-t border-border py-6 space-y-4 font-mono text-sm bg-background/95 backdrop-blur-xl"
              >
                <a
                  href="#bento"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white"
                >
                  // 01 FEATURES
                </a>
                <a
                  href="#voice-preview"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white"
                >
                  // 02 VOICE HUD
                </a>
                <a
                  href="#pathway"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white"
                >
                  // 03 PATHWAYS
                </a>
                <Link
                  href="/careers"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white"
                >
                  // 04 CAREER RADAR
                </Link>
                <div className="pt-3 flex flex-col gap-2">
                  <div className="pb-1">
                    <ThemeToggle variant="full" />
                  </div>
                  <Link href="/api/auth/demo-student" className="w-full">
                    <Button variant="red" className="w-full font-mono text-xs keep-white">
                      <span className="keep-white">STUDENT DEMO</span>
                    </Button>
                  </Link>
                  <Link href="/auth/login" className="w-full">
                    <Button variant="outline" className="w-full font-mono text-xs">
                      SIGN IN
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-32 overflow-hidden">
        {/* Subtle Glyph Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* System Identification Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-8"
            >
              <div className="tape-label border-black/15 dark:border-white/20 text-neutral-800 dark:text-neutral-200">
                <span className="red-dot" />
                <span>CITI INDIA HACKATHON // 2026</span>
                <span className="text-neutral-400 dark:text-neutral-500">•</span>
                <span className="font-dot text-foreground font-semibold">REIMAGINING RURAL EDUCATION</span>
              </div>
            </motion.div>

            {/* Giant Dot-Matrix & High-Contrast Typography */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] uppercase text-foreground"
            >
              Every Rural Student Can Now{" "}
              <span className="font-dot text-[#eb0028] block sm:inline font-bold">
                BUILD & MONETIZE
              </span>{" "}
              Their Strengths<span className="text-[#eb0028]">.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 text-base sm:text-xl text-neutral-600 dark:text-neutral-400 font-sans max-w-2xl mx-auto leading-relaxed"
            >
              An intelligent, voice-first learning-to-livelihood ecosystem. Personalized
              career discovery across 12 sectors, grounded learning roadmaps, and verified
              government schemes — all in their regional language.
            </motion.p>

            {/* Modern CTA Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/api/auth/demo-student" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-black dark:bg-white text-white dark:text-black font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 border border-black dark:border-white shadow-md font-mono text-sm px-8"
                >
                  START EXPLORATION
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>

              <Link href="/chat" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto font-mono text-sm px-8 border-border text-foreground hover:border-[#eb0028] hover:text-[#eb0028] gap-3"
                >
                  <VoiceSoundwave isListening={isListeningSim} />
                  VOICE ASSISTANT
                </Button>
              </Link>
            </motion.div>

            {/* Live Indicator Pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-neutral-600 dark:text-neutral-400"
            >
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Supabase Postgres Active
              </span>
              <span>//</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-500" />
                66 Verified Careers
              </span>
              <span>//</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#eb0028]" />
                Web Speech Voice Ready
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Metrics Ticker (Nothing OS Hardware Display) */}
      <section className="border-y border-border bg-card/60 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="relative group">
                <div className="font-dot text-3xl sm:text-4xl lg:text-5xl font-bold tracking-widest text-foreground group-hover:text-[#eb0028] transition-colors">
                  {stat.value}
                </div>
                <div className="font-mono text-xs uppercase tracking-wider text-foreground/85 mt-1 font-medium">
                  {stat.label}
                </div>
                <div className="font-mono text-[10px] text-muted-foreground mt-0.5">
                  {stat.sub}
                </div>
                <div className="absolute -bottom-2 left-0 w-8 h-[2px] bg-border group-hover:w-16 group-hover:bg-[#eb0028] transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Bento Box Grid */}
      <section id="bento" className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <div className="tape-label border-black/15 dark:border-white/20 text-neutral-800 dark:text-neutral-200 mb-3">
                <span className="red-dot" />
                <span>HARDWARE-GRADE ARCHITECTURE</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight text-foreground">
                THE NEXTLEARNING <span className="font-dot text-[#eb0028]">BENTO SYSTEM</span>
              </h2>
            </div>
            <p className="text-muted-foreground font-mono text-xs max-w-md">
              // PURPOSE-BUILT FOR LOW-LITERACY STUDENTS AND RURAL MOBILE USERS. ZERO
              DEAD-ENDS, 100% EXPLAINABLE REASONING.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Card 1: Large Featured Card */}
            <div className="md:col-span-2 nothing-card nothing-card-red p-8 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="tape-label text-[#eb0028] border-red-500/30">
                    MODULE // B : DISCOVER
                  </span>
                  <span className="font-dot text-xs text-muted-foreground">STATUS // 94% MATCH</span>
                </div>
                <h3 className="font-dot text-2xl sm:text-3xl font-bold tracking-widest uppercase mb-3 text-foreground">
                  TRANSPARENT CAREER ENGINE
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xl mb-8 font-sans">
                  No black-box scores. NextLearning uses a 4-pillar normalized weighted formula
                  (Interests 30%, Skills 25%, Goals 25%, Education 20%) to match rural youth
                  with both STEM and crucial non-STEM pathways like Agritech Drone Pilots, Solar
                  Technicians, and SHG Facilitators.
                </p>

                {/* Interactive Simulation Display */}
                <div className="p-4 rounded-2xl bg-card border border-border space-y-3 font-mono text-xs text-card-foreground shadow-sm">
                  <div className="flex items-center justify-between text-foreground">
                    <span className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" /> TOP MATCH: SOLAR PV ROOFTOP TECHNICIAN
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">ELIGIBLE (CLASS 10)</span>
                  </div>
                  <SegmentedMeter value={94} max={100} totalSegments={16} />
                  <div className="text-[11px] text-muted-foreground flex items-center justify-between pt-1 border-t border-border">
                    <span>SECTOR: CLEAN ENERGY // SALARY: ₹18K-35K</span>
                    <Link
                      href="/careers/solar-pv-rooftop-technician"
                      className="text-[#eb0028] hover:underline flex items-center gap-1 font-semibold"
                    >
                      EXPLORE SPEC <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between pt-6 border-t border-border">
                <span className="font-mono text-xs text-muted-foreground">
                  // EXPLAINABLE AI · ZERO FABRICATION
                </span>
                <Link href="/careers">
                  <Button variant="outline" size="sm" className="font-mono text-xs border-border text-foreground hover:bg-muted">
                    VIEW ALL 66 PATHWAYS
                  </Button>
                </Link>
              </div>
            </div>

            {/* Bento Card 2: Voice & Local Language */}
            <div className="nothing-card p-8 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="tape-label text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                    MODULE // J : VOICE
                  </span>
                  <span className="red-dot" />
                </div>
                <h3 className="font-dot text-xl sm:text-2xl font-bold tracking-widest uppercase mb-3 text-foreground">
                  VERNACULAR VOICE HUD
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed mb-6 font-sans">
                  Speak comfortably in native dialect. The Web Speech API adapter converts
                  spoken queries into structured profiles with zero typing friction.
                </p>

                {/* Voice Visualizer Demo */}
                <div className="p-4 rounded-2xl bg-card border border-border space-y-4 text-card-foreground shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-muted-foreground">AUDIO FEED</span>
                    <VoiceSoundwave isListening={true} />
                  </div>
                  <div className="p-3 rounded-xl bg-muted/50 border border-border font-sans text-xs text-foreground italic">
                    &ldquo;मुझे सोलर पैनल और बिजली का काम सीखना है...&rdquo;
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <span className="font-mono text-[11px] text-muted-foreground">11 INDIAN LANGUAGES</span>
                <Link href="/chat">
                  <Button variant="red" size="sm" className="font-mono text-xs keep-white">
                    <span className="keep-white">TRY VOICE HUD</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Bento Card 3: Learning Roadmap */}
            <div className="nothing-card p-8 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="tape-label text-blue-600 dark:text-blue-400 border-blue-500/30">
                    MODULE // C : LEARN
                  </span>
                  <span className="font-dot text-xs text-muted-foreground">06 MILESTONES</span>
                </div>
                <h3 className="font-dot text-xl sm:text-2xl font-bold tracking-widest uppercase mb-3 text-foreground">
                  PERSONAL PATHWAY
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed mb-6 font-sans">
                  Interactive timeline with real open educational resources (DIKSHA,
                  SWAYAM, Spoken Tutorials). Complete milestones and earn verifiable skills.
                </p>

                {/* Milestone preview */}
                <div className="space-y-2 font-mono text-xs">
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-emerald-800 dark:text-emerald-300">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> 01 BASIC ELECTRICAL SAFETY
                    </span>
                    <span className="text-[10px] font-bold">DONE</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted/60 border border-[#eb0028]/40 flex items-center justify-between text-foreground">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#eb0028] animate-ping" />
                      02 ROOFTOP PV INSTALLATION
                    </span>
                    <span className="text-[10px] text-[#eb0028] font-bold">IN PROGRESS</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted/40 border border-border flex items-center justify-between text-muted-foreground">
                    <span>03 GRID-TIE INVERTER SETUP</span>
                    <span className="text-[10px]">PENDING</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <span className="font-mono text-[11px] text-muted-foreground">CURRICULUM ALIGNED</span>
                <Link href="/roadmap">
                  <Button variant="outline" size="sm" className="font-mono text-xs border-border text-foreground hover:bg-muted">
                    VIEW ROADMAP
                  </Button>
                </Link>
              </div>
            </div>

            {/* Bento Card 4: Verified Opportunities (Wide) */}
            <div className="md:col-span-2 nothing-card p-8 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="tape-label text-amber-500 dark:text-amber-400 border-amber-500/30">
                    MODULE // E & F : OPPORTUNITIES
                  </span>
                  <span className="font-dot text-xs text-muted-foreground">18 VERIFIED LISTINGS</span>
                </div>
                <h3 className="font-dot text-2xl sm:text-3xl font-bold tracking-widest uppercase mb-3 text-foreground">
                  SCHOLARSHIPS & APPRENTICESHIP PIPELINE
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xl mb-6 font-sans">
                  Matched against real government initiatives: PM Surya Ghar Muft Bijli Yojana,
                  PM-YASASVI, NAPS Apprenticeships, and NABARD Rural Programs. Includes 7-stage
                  application tracker with notes and verified external portals.
                </p>

                {/* Scheme Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                  <div className="p-3 rounded-2xl bg-card border border-border text-card-foreground shadow-sm">
                    <div className="text-[10px] text-muted-foreground">// GOVT SCHEME</div>
                    <div className="font-bold text-foreground text-xs mt-1">PM SURYA GHAR</div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">₹78,000 SUBSIDY + SKILLS</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-card border border-border text-card-foreground shadow-sm">
                    <div className="text-[10px] text-muted-foreground">// SCHOLARSHIP</div>
                    <div className="font-bold text-foreground text-xs mt-1">PM-YASASVI</div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">₹75K-1.25L / YEAR</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-card border border-border text-card-foreground shadow-sm">
                    <div className="text-[10px] text-muted-foreground">// APPRENTICESHIP</div>
                    <div className="font-bold text-foreground text-xs mt-1">NAPS SOLAR DRIVE</div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">PAID STIPEND + EXP</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between pt-6 border-t border-border">
                <span className="font-mono text-xs text-muted-foreground">
                  // OFFICIAL PORTAL LINKS · NO FAKE CLAIMS
                </span>
                <Link href="/opportunities">
                  <Button variant="outline" size="sm" className="font-mono text-xs border-border text-foreground hover:bg-muted">
                    BROWSE OPPORTUNITIES
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Vernacular Voice Simulator */}
      <section id="voice-preview" className="py-20 border-t border-border bg-card/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="nothing-card p-8 sm:p-12 border-border relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <span className="red-dot" />
                <span className="font-dot text-sm tracking-widest text-foreground">
                  VOICE INTERACTION HUD
                </span>
              </div>
              <VoiceSoundwave isListening={isListeningSim} />
            </div>

            {/* Language Selector Pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {indianLangs.map((lang, index) => (
                <button
                  key={lang.code}
                  onClick={() => setActiveLang(index)}
                  className={`px-4 py-2 rounded-2xl font-mono text-xs uppercase transition-all duration-200 cursor-pointer ${
                    activeLang === index
                      ? "bg-foreground text-background font-bold shadow-sm"
                      : "bg-muted/50 border border-border text-foreground hover:border-primary/40"
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>

            {/* Simulated Live Query */}
            <div className="p-6 rounded-2xl bg-card border border-border space-y-4 text-card-foreground shadow-sm">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Mic className="w-3.5 h-3.5 text-[#eb0028]" /> LIVE INPUT ({indianLangs[activeLang].code.toUpperCase()})
                </span>
                <span className="text-[10px] text-emerald-500 dark:text-emerald-400 font-semibold">// CONFIDENCE: 98.4%</span>
              </div>
              <p className="text-lg sm:text-2xl font-sans text-foreground font-medium">
                &ldquo;{indianLangs[activeLang].prompt}&rdquo;
              </p>
              <div className="pt-4 border-t border-border flex items-center justify-between">
                <span className="font-mono text-xs text-muted-foreground">
                  NEXTLEARNING AI: <span className="text-foreground">Analyzing profile & local institutes...</span>
                </span>
                <Link href="/chat">
                  <Button variant="red" size="sm" className="font-mono text-xs keep-white">
                    <span className="keep-white">SPEAK WITH AI NOW</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facilitator Mode Banner */}
      <section className="py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[30px] border border-border bg-card dark:bg-[#121216] p-8 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-8 text-foreground shadow-sm">
            <div className="max-w-2xl">
              <div className="tape-label border-emerald-600/30 text-emerald-700 dark:text-emerald-400 mb-4 bg-emerald-500/10">
                <Users className="w-3.5 h-3.5" />
                <span>COMMUNITY MULTIPLIER EFFECT</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight mb-4 text-neutral-900 dark:text-white font-dot">
                TEACHER & VILLAGE FACILITATOR CONSOLE
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed font-sans">
                One village teacher or NGO coordinator can spot talent and guide multiple students.
                Inspect student roadmaps, assign personalized training modules, and deliver
                scholarship recommendations.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Link href="/facilitator" className="w-full sm:w-auto">
                <Button size="lg" className="w-full font-mono text-xs bg-black text-white dark:bg-white dark:text-black border border-black dark:border-white shadow-sm hover:bg-neutral-800 dark:hover:bg-neutral-200">
                  <span className="font-semibold">FACILITATOR CONSOLE</span>
                </Button>
              </Link>
              <Link href="/facilitator/modules/new" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full font-mono text-xs border-border text-foreground hover:bg-muted">
                  BUILD TRAINING MODULE
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA / Terminal Footer */}
      <footer className="border-t border-border bg-card/80 dark:bg-[#050507] py-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-12 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-muted border border-border flex items-center justify-center">
                <span className="red-dot" />
              </div>
              <span className="font-dot text-lg font-bold tracking-widest text-foreground">
                NEXTLEARNING
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-6 font-mono text-xs text-muted-foreground">
              <Link href="/language" className="hover:text-foreground transition-colors">
                LANGUAGE
              </Link>
              <Link href="/careers" className="hover:text-foreground transition-colors">
                CAREERS
              </Link>
              <Link href="/roadmap" className="hover:text-foreground transition-colors">
                ROADMAPS
              </Link>
              <Link href="/opportunities" className="hover:text-foreground transition-colors">
                SCHEMES
              </Link>
              <Link href="/directory" className="hover:text-foreground transition-colors">
                ECOSYSTEM
              </Link>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-muted-foreground">
            <div>
              BUILT FOR THE CITI INDIA HACKATHON 2026 // OPEN SOURCE PROTOTYPE
            </div>
            <div className="flex items-center gap-3">
              <span className="red-dot" />
              <span>SYSTEM READY // DEMO MODE ENABLED</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
