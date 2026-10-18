"use client";

import * as React from "react";
import {
  Building2,
  Users,
  Briefcase,
  GraduationCap,
  HeartHandshake,
  Search,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Mail,
  Globe,
  Sparkles,
  Radio,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GlyphBar } from "@/components/ui/nothing-elements";

interface OrganizationItem {
  id: string;
  name: string;
  type: string;
  description: string | null;
  expertise: string[];
  location: string;
  serviceArea: string | null;
  contactUrl: string | null;
  website: string | null;
  verified: boolean;
  isSampleData: boolean;
}

interface DirectoryClientProps {
  initialOrganizations: OrganizationItem[];
}

export function DirectoryClient({ initialOrganizations }: DirectoryClientProps) {
  const [organizations] = React.useState<OrganizationItem[]>(initialOrganizations);
  const [selectedType, setSelectedType] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  // Contact Dialog
  const [contactOrg, setContactOrg] = React.useState<OrganizationItem | null>(null);

  const tabs = [
    { id: "all", label: "ALL ENTITIES", icon: Building2 },
    { id: "mentor", label: "MENTORS", icon: Users },
    { id: "ngo", label: "NGO PARTNERS", icon: HeartHandshake },
    { id: "training_provider", label: "TRAINING HUBS", icon: GraduationCap },
    { id: "employer", label: "EMPLOYERS", icon: Briefcase },
  ];

  const filteredOrgs = React.useMemo(() => {
    return organizations.filter((org) => {
      const matchesType = selectedType === "all" || org.type === selectedType;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        org.name.toLowerCase().includes(q) ||
        (org.description && org.description.toLowerCase().includes(q)) ||
        org.location.toLowerCase().includes(q) ||
        org.expertise.some((e) => e.toLowerCase().includes(q));

      return matchesType && matchesSearch;
    });
  }, [organizations, selectedType, searchQuery]);

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "mentor":
        return { label: "MENTOR NETWORK", border: "border-sky-500/40 text-sky-400 bg-sky-500/10" };
      case "ngo":
        return { label: "GRASSROOTS NGO", border: "border-[#00dc82]/40 text-[#00dc82] bg-[#00dc82]/10" };
      case "training_provider":
        return { label: "VOCATIONAL HUB", border: "border-amber-500/40 text-amber-400 bg-amber-500/10" };
      case "employer":
        return { label: "RURAL EMPLOYER", border: "border-[#eb0028]/40 text-[#eb0028] bg-[#eb0028]/10" };
      default:
        return { label: type.toUpperCase(), border: "border-white/20 text-white/70 bg-white/5" };
    }
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
            NETWORK // VERIFIED.PARTNERS // GRASSROOTS ECOSYSTEM
          </span>
        </div>
        <div className="flex items-center gap-2">
          <GlyphBar activeIndex={2} total={4} />
          <span className="font-mono text-[10px] text-muted-foreground">STATUS: ONLINE</span>
        </div>
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-[11px] text-[#eb0028] uppercase tracking-widest mb-1.5">
            <Radio className="h-3.5 w-3.5 animate-pulse" />
            <span>COMMUNITY REGISTRY //</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-dot font-bold uppercase tracking-wider text-foreground">
            Directory &amp; Partners
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">
            Connect directly with verified district mentors, vocational skilling foundations, and inclusive local employers across rural India.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
          <div className="px-3 py-1.5 rounded-xl border border-border bg-card">
            TOTAL ENTITIES: <span className="text-foreground font-bold">{organizations.length}</span>
          </div>
        </div>
      </div>

      {/* Search & Tab Filters Panel */}
      <div className="space-y-4 p-5 rounded-[26px] border border-border bg-card/95 text-card-foreground backdrop-blur-xl">
        {/* Search Input */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by organization name, district, or expertise (e.g. Solar, Digital Literacy, Pratham)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 pr-4 text-xs sm:text-sm bg-muted/50 border-border text-foreground placeholder:text-muted-foreground rounded-2xl h-12 focus:border-primary/50 font-sans"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const count =
              tab.id === "all"
                ? organizations.length
                : organizations.filter((o) => o.type === tab.id).length;
            const isSelected = selectedType === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedType(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-dot text-xs uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-black shadow-md font-bold"
                    : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/80 border border-border"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
                <span
                  className={`font-mono text-[10px] px-1.5 py-0.5 rounded-md ${
                    isSelected ? "bg-white text-black dark:bg-black dark:text-white" : "bg-muted text-muted-foreground border border-border"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Organizations Grid */}
      {filteredOrgs.length === 0 ? (
        <Card className="rounded-[28px] border border-dashed border-border bg-card/60 p-12 text-center text-card-foreground">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground/60 mb-3" />
          <h3 className="font-dot text-lg uppercase tracking-wider text-foreground">No Entities Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 font-mono">
            No verified entities matched keyword &ldquo;{searchQuery}&rdquo;.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setSelectedType("all");
            }}
            className="mt-5 text-xs font-mono uppercase tracking-wider border-border text-foreground hover:bg-muted"
          >
            Reset Filters //
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrgs.map((org) => {
            const badge = getTypeBadge(org.type);

            return (
              <div
                key={org.id}
                className="group rounded-[26px] border border-border hover:border-primary/30 bg-card p-6 backdrop-blur-xl flex flex-col justify-between transition-all duration-300 hover:shadow-lg dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.8)] text-card-foreground"
              >
                <div>
                  {/* Top Bar: Type Badge & Verified Indicator */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span
                      className={`font-dot text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full border ${badge.border}`}
                    >
                      {badge.label}
                    </span>

                    {org.verified && (
                      <span className="flex items-center gap-1.5 font-mono text-[10px] text-[#00dc82]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#00dc82] shadow-[0_0_8px_#00dc82]" />
                        VERIFIED
                      </span>
                    )}
                  </div>

                  {/* Organization Title */}
                  <h3 className="text-lg font-bold font-sans text-foreground group-hover:text-[#eb0028] transition-colors line-clamp-1">
                    {org.name}
                  </h3>

                  {/* Description */}
                  {org.description && (
                    <p className="text-xs text-muted-foreground line-clamp-3 mt-2 leading-relaxed">
                      {org.description}
                    </p>
                  )}

                  {/* Location & Service Area */}
                  <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground pt-3 mt-4 border-t border-border">
                    <MapPin className="h-3.5 w-3.5 text-[#eb0028] shrink-0" />
                    <span className="truncate">{org.location}</span>
                    {org.serviceArea && (
                      <span className="text-muted-foreground/80">({org.serviceArea})</span>
                    )}
                  </div>

                  {/* Expertise Tags */}
                  {org.expertise.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-3">
                      {org.expertise.map((exp, idx) => (
                        <span
                          key={idx}
                          className="font-mono text-[10px] px-2.5 py-0.5 rounded-md bg-muted/60 border border-border text-muted-foreground"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="pt-4 mt-5 border-t border-border flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                    {org.isSampleData ? "DEMO NODE" : "ACTIVE NODE"}
                  </span>

                  <div className="flex items-center gap-2">
                    {org.website && (
                      <a
                        href={org.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl border border-border bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title="Visit Official Website"
                      >
                        <Globe className="h-3.5 w-3.5" />
                      </a>
                    )}
                    <Button
                      size="sm"
                      variant="red"
                      onClick={() => setContactOrg(org)}
                      className="font-mono text-xs tracking-wider h-8 px-3 cursor-pointer keep-white"
                    >
                      <Mail className="h-3 w-3 mr-1 keep-white" />
                      <span className="keep-white">CONNECT</span>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DIALOG: Contact Organization */}
      <Dialog open={!!contactOrg} onOpenChange={(open) => !open && setContactOrg(null)}>
        <DialogContent className="sm:max-w-md bg-card border border-border text-card-foreground rounded-[28px] p-6 shadow-2xl">
          <DialogHeader className="space-y-1.5">
            <div className="flex items-center gap-2 font-mono text-[10px] text-[#eb0028] uppercase tracking-widest">
              <Mail className="h-3.5 w-3.5" />
              <span>DIRECT OUTREACH PROTOCOL //</span>
            </div>
            <DialogTitle className="font-dot text-xl uppercase tracking-wider text-foreground">
              Connect with {contactOrg?.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Direct connection channels for apprenticeships, village mentorship, or vocational skilling inquiries.
            </DialogDescription>
          </DialogHeader>

          {contactOrg && (
            <div className="space-y-4 py-3 text-xs">
              <div className="p-4 bg-muted/50 rounded-2xl border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-foreground">{contactOrg.name}</span>
                  <span className="font-dot text-[10px] px-2 py-0.5 rounded-full border border-border text-muted-foreground uppercase">
                    {contactOrg.type.replace("_", " ")}
                  </span>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">{contactOrg.description}</p>
                <div className="flex items-center gap-1.5 font-mono text-muted-foreground text-[11px] pt-1 border-t border-border">
                  <MapPin className="h-3 w-3 text-[#eb0028]" />
                  <span>{contactOrg.location}</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Verified Contact Channels:
                </p>
                {contactOrg.contactUrl ? (
                  <a
                    href={contactOrg.contactUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-xl border border-border bg-muted/70 text-foreground hover:bg-muted transition-colors font-mono text-xs flex items-center justify-between"
                  >
                    <span>LAUNCH PARTNER INTAKE PORTAL</span>
                    <ArrowUpRight className="h-4 w-4 text-[#eb0028]" />
                  </a>
                ) : (
                  <div className="p-3.5 rounded-xl border border-border bg-muted/40 text-muted-foreground font-mono text-xs space-y-1">
                    <p className="text-muted-foreground text-[10px] uppercase">Nodal Guidance Desk:</p>
                    <p className="text-foreground font-semibold">
                      nodal@{contactOrg.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.org.in
                    </p>
                  </div>
                )}
                {contactOrg.website && (
                  <a
                    href={contactOrg.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl border border-border bg-muted/40 text-muted-foreground hover:text-foreground text-xs flex items-center gap-2 font-mono"
                  >
                    <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{contactOrg.website}</span>
                  </a>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setContactOrg(null)}
              className="w-full font-mono text-xs uppercase tracking-wider border-border text-foreground hover:bg-muted"
            >
              Close Window //
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
