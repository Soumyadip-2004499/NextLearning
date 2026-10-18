"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  LayoutDashboard,
  Compass,
  Route,
  MessageSquare,
  Award,
  Building2,
  BookOpen,
  User,
  ArrowRightLeft,
  Menu,
  X,
  CheckCircle2,
  MapPin,
  LogOut,
  Bookmark,
  Briefcase,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";

interface StudentShellProps {
  children: React.ReactNode;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    role: string;
    language: string;
    image?: string | null;
  };
  studentProfile: {
    id?: string;
    displayName: string | null;
    educationLevel?: string | null;
    careerPreference?: string | null;
    state?: string | null;
    district?: string | null;
  } | null;
}

export function StudentShell({
  children,
  user,
  studentProfile,
}: StudentShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      current: pathname === "/dashboard",
    },
    {
      name: "Career Radar",
      href: "/careers",
      icon: Compass,
      current: pathname.startsWith("/careers"),
    },
    {
      name: "Learning Roadmap",
      href: "/roadmap",
      icon: Route,
      current: pathname.startsWith("/roadmap"),
    },
    {
      name: "AI Voice HUD",
      href: "/chat",
      icon: MessageSquare,
      current: pathname.startsWith("/chat"),
    },
    {
      name: "Schemes & Scholarships",
      href: "/opportunities",
      icon: Award,
      current:
        pathname.startsWith("/opportunities") &&
        !pathname.includes("/saved") &&
        !pathname.includes("/applications"),
    },
    {
      name: "Organization Directory",
      href: "/directory",
      icon: Building2,
      current: pathname === "/directory",
    },
    {
      name: "Learning Resources",
      href: "/resources",
      icon: BookOpen,
      current: pathname === "/resources",
    },
    {
      name: "Student Profile",
      href: "/profile",
      icon: User,
      current: pathname === "/profile",
    },
  ];

  const displayName =
    studentProfile?.displayName || user.name || "Soumyadip Chattopadhyay";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const formattedEdu = studentProfile?.educationLevel
    ? studentProfile.educationLevel.replace(/_/g, " ").toUpperCase()
    : "CLASS 10";

  const trackText = studentProfile?.careerPreference
    ? studentProfile.careerPreference.toUpperCase()
    : "VOCATIONAL";

  const location = [studentProfile?.district, studentProfile?.state]
    .filter(Boolean)
    .join(", ") || "Kolkata, West Bengal";

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    document.cookie = "nextlearning_role=; path=/; max-age=0";
    document.cookie = "nextlearning_user=; path=/; max-age=0";
    document.cookie = "nextlearning_session=; path=/; max-age=0";
    document.cookie = "udaan_role=; path=/; max-age=0";
    document.cookie = "udaan_user=; path=/; max-age=0";
    document.cookie = "udaan_session=; path=/; max-age=0";
    window.location.href = "/auth/login";
  };

  return (
    <div className="min-h-screen bg-background text-foreground dot-bg flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-40 bg-[#0c0c10]/90 border-b border-white/[0.08] text-foreground px-4 py-3 flex items-center justify-between shadow-md backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05] border border-white/20 text-[#eb0028] font-bold shadow-sm">
            <span className="red-dot" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-dot tracking-wider text-foreground text-sm font-bold">
                NEXTLEARNING
              </span>
              <Badge
                variant="outline"
                className="text-[10px] bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30 py-0 px-1.5 h-4"
              >
                STUDENT
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground truncate max-w-[170px]">
              {displayName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle variant="compact" />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/[0.05] border border-white/10 text-foreground hover:bg-white/10"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Slideout Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex">
          <div className="w-72 bg-card text-card-foreground border-r border-border flex flex-col h-full shadow-2xl p-5">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500 text-slate-950">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <span className="font-bold text-lg text-foreground">
                  NextLearning Student
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-5 space-y-1.5 flex-1 overflow-y-auto">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors",
                      item.current
                        ? "bg-[#eb0028]/10 text-foreground font-bold border border-[#eb0028]/30"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 lg:w-72 bg-card/95 text-card-foreground flex-col shrink-0 border-r border-border h-screen sticky top-0 overflow-y-auto backdrop-blur-2xl">
        {/* Brand Header */}
        <div className="p-5 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted border border-border text-[#eb0028] font-bold shadow-md group-hover:border-[#eb0028] transition-colors">
              <span className="red-dot" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-dot text-base font-bold text-foreground tracking-wider">
                  NEXTLEARNING
                </span>
                <Badge
                  variant="outline"
                  className="border-teal-500/30 text-teal-600 dark:text-teal-400 bg-teal-500/10 text-[10px] px-1.5 py-0"
                >
                  STUDENT
                </Badge>
              </div>
              <p className="text-[10px] font-mono text-muted-foreground">
                LEARNER HUD
              </p>
            </div>
          </Link>
        </div>

        {/* Student Profile Card */}
        <div className="mx-4 my-4 p-3.5 rounded-2xl bg-muted/40 border border-border shadow-xs">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10 border border-teal-500/40">
              {user.image && <AvatarImage src={user.image} alt={displayName} />}
              <AvatarFallback className="bg-gradient-to-tr from-teal-600 to-indigo-600 text-white font-semibold text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-foreground truncate">
                  {displayName}
                </p>
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-500 shrink-0" />
              </div>
              <p className="text-[11px] text-muted-foreground font-mono truncate mt-0.5">
                {formattedEdu} // {trackText}
              </p>
              {location && (
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono mt-1">
                  <MapPin className="h-2.5 w-2.5 text-[#eb0028] shrink-0" />
                  <span className="truncate">{location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="px-3 py-2 flex-1 space-y-6">
          <div>
            <p className="px-3 text-[10px] font-mono font-semibold uppercase tracking-widest text-muted-foreground">
              Learner Portal
            </p>
            <nav className="mt-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all group",
                      item.current
                        ? "bg-[#eb0028]/10 text-foreground font-bold border border-[#eb0028]/30 shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        item.current
                          ? "text-[#eb0028]"
                          : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div>
            <p className="px-3 text-[10px] font-mono font-semibold uppercase tracking-widest text-muted-foreground">
              Quick Shortcuts
            </p>
            <div className="mt-2 space-y-1">
              <Link
                href="/roadmap"
                className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              >
                <Route className="h-4 w-4 text-[#eb0028]" />
                <span>Active Roadmap</span>
              </Link>
              <Link
                href="/opportunities/saved"
                className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              >
                <Bookmark className="h-4 w-4 text-amber-500" />
                <span>Saved Schemes</span>
              </Link>
              <Link
                href="/opportunities/applications"
                className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              >
                <Briefcase className="h-4 w-4 text-[#00dc82]" />
                <span>Applications Tracker</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="p-4 border-t border-border bg-[#0c0c0f]/60 space-y-2.5">
          <ThemeToggle variant="full" />

          <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Verified Learner
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">
              v2.6 HUD
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="w-full text-xs text-muted-foreground hover:text-rose-500 hover:bg-rose-950/10 justify-center h-8 font-mono"
          >
            <LogOut className="h-3.5 w-3.5 mr-1.5" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
