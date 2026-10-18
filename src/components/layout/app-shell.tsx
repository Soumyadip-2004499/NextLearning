"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  Search,
  Bell,
  Wifi,
  WifiOff,
  ChevronRight,
  Home,
  CheckCircle2,
  Mic,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserSession } from "@/types";
import { Sidebar } from "@/components/layout/sidebar";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface AppShellProps {
  children: React.ReactNode;
  user?: UserSession | null;
  breadcrumbs?: BreadcrumbItem[];
}

export function AppShell({ children, user, breadcrumbs }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [isOnline, setIsOnline] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const pathname = usePathname();
  const router = useRouter();

  // Monitor network status
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine);
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  // Compute breadcrumbs if not provided
  const computedBreadcrumbs = React.useMemo<BreadcrumbItem[]>(() => {
    if (breadcrumbs && breadcrumbs.length > 0) {
      return breadcrumbs;
    }

    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0 || segments[0] === "dashboard") {
      return [{ label: "Dashboard", href: "/dashboard" }];
    }

    const items: BreadcrumbItem[] = [{ label: "Dashboard", href: "/dashboard" }];

    let currentPath = "";
    segments.forEach((seg, index) => {
      currentPath += `/${seg}`;
      const isLast = index === segments.length - 1;

      // Format segment name
      const formatted = seg
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      items.push({
        label: formatted,
        href: isLast ? undefined : currentPath,
      });
    });

    return items;
  }, [breadcrumbs, pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/careers?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const sampleNotifications = [
    {
      id: "notif-1",
      title: "PM Surya Ghar Skilling Drive",
      description: "Batch enrollment open in Kolkata district. 2 open slots remaining.",
      time: "2 hours ago",
      read: false,
      href: "/opportunities",
    },
    {
      id: "notif-2",
      title: "New Roadmap Milestone Unlocked",
      description: "Step 2: Multimeter Diagnostics is now ready for hands-on practice.",
      time: "1 day ago",
      read: false,
      href: "/roadmap",
    },
    {
      id: "notif-3",
      title: "Facilitator Note from G. Sai Kavya",
      description: "Reviewed your career aspirations. Great focus on clean energy!",
      time: "2 days ago",
      read: true,
      href: "/profile",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-[#eb0028] selection:text-white dot-bg transition-colors duration-400">
      {/* Sidebar navigation */}
      <Sidebar
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Container - offset by sidebar width on large screens */}
      <div className="flex flex-1 flex-col lg:pl-[280px]">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 flex h-20 shrink-0 items-center justify-between border-b border-border bg-card/85 text-card-foreground px-4 backdrop-blur-2xl sm:px-8 transition-colors duration-400">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted/60 border border-border text-foreground hover:bg-muted lg:hidden"
              aria-label="Open sidebar menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumb Navigation (Nothing OS Monospaced Style) */}
            <nav
              aria-label="Breadcrumbs"
              className="hidden sm:flex items-center space-x-2 text-xs font-mono text-muted-foreground"
            >
              <Link
                href="/dashboard"
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="red-dot mr-1" />
                <span className="font-dot text-xs text-foreground">NEXTLEARNING</span>
              </Link>
              {computedBreadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb.label + idx}>
                  <span className="text-muted-foreground/60">//</span>
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="hover:text-foreground transition-colors uppercase"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-foreground font-semibold uppercase tracking-wider">
                      {crumb.label}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-64 lg:w-80">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH CAREERS, SCHEMES..."
                className="h-10 w-full rounded-2xl border-border bg-background/50 pl-10 pr-3 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:border-[#eb0028] focus:bg-background transition-colors duration-300"
              />
            </form>

            {/* Voice Assistant Shortcut */}
            <Link href="/chat">
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex items-center gap-2 h-10 px-3.5 rounded-2xl border-border bg-card text-foreground hover:bg-muted hover:border-[#eb0028] font-mono text-xs transition-colors duration-300"
              >
                <Mic className="h-3.5 w-3.5 text-[#eb0028]" />
                <span className="font-dot text-[10px]">VOICE</span>
              </Button>
            </Link>

            {/* Offline / Online Status Indicator */}
            <div className="flex items-center">
              {isOnline ? (
                <div
                  className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-emerald-300"
                  title="System is connected and synchronized"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="hidden sm:inline">ONLINE</span>
                </div>
              ) : (
                <div
                  className="flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-950/40 px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-amber-300"
                  title="Offline mode active. Your progress will sync automatically when reconnected."
                >
                  <WifiOff className="h-3 w-3 text-amber-400" />
                  <span>OFFLINE SYNC</span>
                </div>
              )}
            </div>

            {/* Light / Dark Mode Toggle */}
            <ThemeToggle variant="compact" />

            {/* Notifications Bell */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-card text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eb0028] transition-colors duration-300"
                  aria-label="View notifications"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#eb0028] shadow-[0_0_8px_#eb0028]" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-80 sm:w-96 rounded-[24px] border border-border bg-card text-card-foreground p-3 font-mono text-xs shadow-2xl backdrop-blur-2xl"
              >
                <div className="flex items-center justify-between p-2">
                  <DropdownMenuLabel className="p-0 font-dot text-xs uppercase tracking-widest text-white">
                    TELEMETRY ALERTS
                  </DropdownMenuLabel>
                  <Badge variant="red" className="text-[9px] px-2 py-0.5">
                    2 NEW
                  </Badge>
                </div>
                <DropdownMenuSeparator className="bg-white/10 my-2" />

                <div className="space-y-1">
                  {sampleNotifications.map((notif) => (
                    <DropdownMenuItem
                      key={notif.id}
                      asChild
                      className="rounded-xl p-3 hover:bg-white/[0.08] cursor-pointer"
                    >
                      <Link href={notif.href} className="flex flex-col space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white">
                            {notif.title}
                          </span>
                          {!notif.read && (
                            <span className="red-dot" />
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                          {notif.description}
                        </p>
                        <span className="text-[9px] text-neutral-500 font-mono">
                          {notif.time}
                        </span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content Viewport */}
        <main className="flex-1 px-4 py-8 sm:px-8 sm:py-10 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
