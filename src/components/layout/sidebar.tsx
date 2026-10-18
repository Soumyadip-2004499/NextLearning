"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  LayoutDashboard,
  Compass,
  Sparkles,
  Route,
  BookOpen,
  Award,
  Briefcase,
  Bookmark,
  ClipboardList,
  Users,
  User,
  Settings,
  LogOut,
  X,
  Layers,
  Building2,
  HelpCircle,
  Activity,
  Mic,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import type { UserSession } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface SidebarProps {
  user?: UserSession | null;
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export function Sidebar({ user, isOpen = false, onClose, className }: SidebarProps) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  const isFacilitator = user?.role === "FACILITATOR";

  // Role-based navigation sections
  const studentSections: NavSection[] = [
    {
      title: "// 01 MAIN",
      items: [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "Career Radar", href: "/careers", icon: Compass },
        { label: "AI Voice HUD", href: "/chat", icon: Mic, badge: "LIVE" },
      ],
    },
    {
      title: "// 02 LEARN",
      items: [
        { label: "Milestone Roadmap", href: "/roadmap", icon: Route },
        { label: "Resource Library", href: "/resources", icon: BookOpen },
      ],
    },
    {
      title: "// 03 OPPORTUNITIES",
      items: [
        { label: "Browse Schemes", href: "/opportunities", icon: Briefcase },
        { label: "Saved Schemes", href: "/opportunities/saved", icon: Bookmark },
        { label: "Application Pipeline", href: "/opportunities/applications", icon: ClipboardList },
      ],
    },
    {
      title: "// 04 CONNECT",
      items: [
        { label: "NGOs & Mentors", href: "/directory", icon: Users },
        { label: "Language HUD", href: "/language", icon: HelpCircle },
      ],
    },
    {
      title: "// 05 USER",
      items: [
        { label: "My Profile", href: "/profile", icon: User },
      ],
    },
  ];

  const facilitatorSections: NavSection[] = [
    {
      title: "// 01 FACILITATOR",
      items: [
        { label: "Teacher Console", href: "/facilitator", icon: LayoutDashboard },
        { label: "Training Modules", href: "/facilitator/modules", icon: Layers },
        { label: "New Module Spec", href: "/facilitator/modules/new", icon: Sparkles },
      ],
    },
    {
      title: "// 02 STUDENT TOOLS",
      items: [
        { label: "Career Radar", href: "/careers", icon: Compass },
        { label: "Opportunities", href: "/opportunities", icon: Briefcase },
        { label: "Directory", href: "/directory", icon: Users },
      ],
    },
    {
      title: "// 03 SYSTEM",
      items: [
        { label: "Profile", href: "/profile", icon: User },
      ],
    },
  ];

  const sections = isFacilitator ? facilitatorSections : studentSections;

  const isActive = (href: string) => {
    if (href === "/dashboard" || href === "/profile" || href === "/facilitator") {
      return pathname === href;
    }
    if (href === "/opportunities") {
      return pathname === "/opportunities";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const displayName = user?.name || (isFacilitator ? "G. Sai Kavya" : "Soumyadip Chattopadhyay");
  const displayEmail = user?.email || (isFacilitator ? "demo@teacher.com" : "demo@student.com");
  const userRoleText = user?.role ? user.role : (isFacilitator ? "FACILITATOR" : "STUDENT");

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
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
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md lg:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex w-[280px] flex-col border-r border-border bg-card/95 text-card-foreground backdrop-blur-2xl transition-all duration-400 ease-in-out lg:z-30 lg:translate-x-0",
          isOpen ? "translate-x-0 shadow-[0_0_50px_rgba(0,0,0,0.8)]" : "-translate-x-full lg:translate-x-0",
          className
        )}
        aria-label="Sidebar Navigation"
      >
        {/* Brand / Logo Header */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-border px-6">
          <Link
            href="/dashboard"
            onClick={handleLinkClick}
            className="group flex items-center gap-3 transition-opacity"
          >
            <div className="w-9 h-9 rounded-xl bg-muted/60 border border-border flex items-center justify-center transition-all duration-200 group-hover:border-[#eb0028] group-hover:shadow-[0_0_15px_rgba(235,0,40,0.4)]">
              <span className="red-dot" />
            </div>
            <div className="flex flex-col">
              <span className="font-dot text-lg font-bold tracking-widest text-foreground group-hover:text-red-500 transition-colors">
                NEXTLEARNING<span className="text-[#eb0028]">.</span>OS
              </span>
              <span className="text-[9px] font-mono tracking-widest text-muted-foreground">
                v2.6 // DOTMATRIX HUD
              </span>
            </div>
          </Link>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-muted/60 border border-border text-muted-foreground hover:text-foreground lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {sections.map((section) => (
            <div key={section.title} className="space-y-1">
              <h4 className="px-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                {section.title}
              </h4>
              <nav className="space-y-1" aria-label={section.title}>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleLinkClick}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-mono tracking-wide transition-all duration-200",
                        active
                          ? "bg-foreground text-background font-bold shadow-md"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110",
                          active ? "text-background" : "text-muted-foreground group-hover:text-foreground"
                        )}
                      />
                      <span className="truncate">{item.label}</span>

                      {item.badge && (
                        <span
                          className={cn(
                            "ml-auto font-dot text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full",
                            active
                              ? "bg-background text-foreground"
                              : "bg-[#eb0028]/15 border border-red-500/30 text-red-500"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* User Profile / Status Footer */}
        <div className="shrink-0 border-t border-border p-4 bg-muted/20 space-y-3">
          <ThemeToggle variant="full" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="group flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition-all hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eb0028]"
              >
                <div className="relative">
                  <Avatar className="h-9 w-9 rounded-xl border border-border bg-muted">
                    <AvatarFallback className="rounded-xl font-dot text-xs text-foreground bg-muted">
                      {getInitials(displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-background" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-xs font-mono font-semibold text-foreground">
                    {displayName}
                  </span>
                  <span className="truncate text-[10px] font-mono text-muted-foreground uppercase">
                    {userRoleText} // ONLINE
                  </span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              side="top"
              className="w-56 rounded-2xl bg-card border border-border p-2 text-card-foreground font-mono text-xs shadow-2xl"
            >
              <DropdownMenuLabel className="font-normal px-2 py-1.5">
                <div className="font-semibold">{displayName}</div>
                <div className="text-[10px] text-muted-foreground">{displayEmail}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem asChild className="rounded-xl hover:bg-muted cursor-pointer">
                <Link href="/profile" className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5" />
                  <span>Profile Overview</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="rounded-xl hover:bg-muted cursor-pointer flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </>
  );
}
