import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  ArrowLeft,
  Sparkles,
  TrendingUp,
  IndianRupee,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  Compass,
  ArrowRight,
  ExternalLink,
  Bot,
  Layers,
  MapPin,
  Clock,
  Award,
  BookOpen,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { parseJsonField, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CareerCard } from "@/components/career/career-card";
import { getCategoryById } from "@/data/careers";
import { CareerCard as CareerCardType } from "@/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const career = await prisma.career.findUnique({
    where: { slug },
    select: { title: true, description: true },
  });

  if (!career) {
    return {
      title: "Career Not Found | NextLearning",
    };
  }

  return {
    title: `${career.title} — Career Discovery | NextLearning`,
    description: career.description.slice(0, 155),
  };
}

export default async function CareerDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const career = await prisma.career.findUnique({
    where: { slug },
    include: {
      skills: {
        include: {
          skill: true,
        },
      },
    },
  });

  if (!career) {
    notFound();
  }

  // Parse JSON attributes
  const requiredSkills = parseJsonField<string[]>(career.requiredSkills, []);
  const requiredQualifications = parseJsonField<string[]>(
    career.requiredQualifications,
    []
  );
  const firstSteps = parseJsonField<string[]>(career.firstSteps, []);
  const educationPaths = parseJsonField<string[]>(career.educationPaths, []);
  const relatedSlugs = parseJsonField<string[]>(career.relatedCareers, []);

  // Fetch related careers
  const relatedCareersRecords = await prisma.career.findMany({
    where: {
      OR: [
        { slug: { in: relatedSlugs } },
        { category: career.category, id: { not: career.id } },
      ],
    },
    take: 3,
  });

  const relatedCareersData: CareerCardType[] = relatedCareersRecords.map(
    (rc) => ({
      id: rc.id,
      title: rc.title,
      slug: rc.slug,
      category: rc.category,
      description: rc.description,
      requiredSkills: parseJsonField<string[]>(rc.requiredSkills, []),
      isSampleData: rc.isSampleData,
    })
  );

  const categoryMeta = getCategoryById(career.category);

  return (
    <div className="w-full text-foreground transition-colors duration-400 pb-20">
      {/* ------------------------------------------------------------------ */}
      {/* TOP HEADER / BACK NAVIGATION                                       */}
      {/* ------------------------------------------------------------------ */}
      <div className="border-b border-border bg-card/80 backdrop-blur-xl sticky top-0 z-30 transition-colors duration-400">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>// BACK TO REGISTRY</span>
          </Link>

          <div className="flex items-center gap-2 font-mono">
            {career.isSampleData && (
              <span className="inline-flex items-center text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-muted/60 text-muted-foreground border border-border">
                SAMPLE PATHWAY // VERIFIED SPEC
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        {/* ------------------------------------------------------------------ */}
        {/* HERO TITLE & STATS OVERVIEW                                        */}
        {/* ------------------------------------------------------------------ */}
        <section className="rounded-[32px] border border-border bg-card text-card-foreground p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
          {/* Category Chip */}
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="tape-label text-[10px] uppercase tracking-wider font-mono">
              // {(categoryMeta?.label || career.category).toUpperCase()}
            </span>

            {career.demandLevel && (
              <span className="inline-flex items-center gap-1.5 font-mono text-xs px-2.5 py-0.5 rounded-full bg-muted border border-border text-foreground">
                <span className="red-dot" />
                {career.demandLevel.toUpperCase()} DEMAND
              </span>
            )}
          </div>

          {/* Career Title */}
          <h1 className="text-2xl sm:text-4xl font-sans font-bold text-foreground tracking-tight leading-tight">
            {career.title}
          </h1>

          {/* Key Metrics Grid */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6 border-t border-border">
            {/* Salary Range */}
            <div className="rounded-[22px] bg-muted/60 p-4 border border-border">
              <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground mb-1">
                <IndianRupee className="h-3.5 w-3.5 text-[#00dc82]" />
                <span>BENCHMARK SALARY //</span>
              </div>
              <div className="text-base sm:text-lg font-bold text-foreground font-mono">
                {career.salaryRange || "₹1,80,000 - ₹3,60,000"}
              </div>
              <div className="text-[11px] font-mono text-muted-foreground mt-0.5">
                Entry to experienced benchmark
              </div>
            </div>

            {/* Growth Outlook */}
            <div className="rounded-[22px] bg-muted/60 p-4 border border-border">
              <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground mb-1">
                <TrendingUp className="h-3.5 w-3.5 text-[#eb0028]" />
                <span>GROWTH INDEX //</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-foreground line-clamp-1 font-mono">
                {career.growthOutlook || "High industry adoption"}
              </div>
              <div className="text-[11px] font-mono text-muted-foreground mt-0.5">
                Rural & Tier-2/3 priority
              </div>
            </div>

            {/* Entry Qualification */}
            <div className="rounded-[22px] bg-muted/60 p-4 border border-border sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground mb-1">
                <GraduationCap className="h-3.5 w-3.5 text-foreground" />
                <span>MIN PREREQUISITE //</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-foreground line-clamp-1 font-mono">
                {requiredQualifications[0] || "Class 10 / ITI pass"}
              </div>
              <div className="text-[11px] font-mono text-muted-foreground mt-0.5">
                Accessible via govt skilling
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <Link
              href={`/roadmap?career=${career.slug}`}
              className="inline-flex"
            >
              <Button
                variant="red"
                size="lg"
                className="w-full sm:w-auto font-mono text-xs tracking-wider shadow-[0_0_20px_rgba(235,0,40,0.3)] cursor-pointer"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                <span>GENERATE ROADMAP // EXECUTE</span>
              </Button>
            </Link>

            <Link
              href={`/chat?topic=career&id=${career.slug}`}
              className="inline-flex"
            >
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto font-mono text-xs tracking-wider border-border hover:border-foreground/30 text-foreground cursor-pointer bg-muted/40"
              >
                <Bot className="h-4 w-4 mr-2 text-[#eb0028]" />
                <span>AI ADVISOR // CONSULT</span>
              </Button>
            </Link>

            {career.sourceUrl && (
              <a
                href={career.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground sm:ml-auto px-2 py-1"
              >
                <span>OFFICIAL PORTAL</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* CAREER DESCRIPTION & OVERVIEW                                      */}
        {/* ------------------------------------------------------------------ */}
        <section className="rounded-[28px] border border-border bg-card text-card-foreground p-6 sm:p-8 backdrop-blur-xl">
          <div className="flex items-center gap-2 font-mono text-[#eb0028] text-xs uppercase tracking-widest mb-2">
            <BookOpen className="h-4 w-4" />
            <span>ROLE OVERVIEW //</span>
          </div>
          <h2 className="text-xl font-sans font-bold text-foreground mb-4">
            About the Career
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
            {career.description}
          </p>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* WHY THIS CAREER MIGHT SUIT YOU                                     */}
        {/* ------------------------------------------------------------------ */}
        <section className="rounded-[28px] border border-border bg-card text-card-foreground p-6 sm:p-8 backdrop-blur-xl">
          <div className="flex items-center gap-2 font-mono text-[#eb0028] text-xs uppercase tracking-widest mb-2">
            <Sparkles className="h-4 w-4" />
            <span>SUITABILITY INSIGHTS //</span>
          </div>
          <h2 className="text-xl font-sans font-bold text-foreground mb-5">
            Why This Career Might Suit You
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-[22px] bg-muted/60 p-5 border border-border shadow-sm">
              <div className="h-8 w-8 rounded-xl bg-muted border border-border text-foreground font-mono flex items-center justify-center font-bold text-sm mb-3">
                01
              </div>
              <h3 className="font-semibold text-foreground mb-1.5 text-sm">
                Local Market Opportunity
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                Strong grassroots demand in district headquarters, common service centers, and rural enterprises.
              </p>
            </div>

            <div className="rounded-[22px] bg-muted/60 p-5 border border-border shadow-sm">
              <div className="h-8 w-8 rounded-xl bg-muted border border-border text-[#eb0028] font-mono flex items-center justify-center font-bold text-sm mb-3">
                02
              </div>
              <h3 className="font-semibold text-foreground mb-1.5 text-sm">
                Government & Skilling Backing
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                Eligible for government subsidies, PMKVY certifications, and low-interest MUDRA microloans.
              </p>
            </div>

            <div className="rounded-[22px] bg-muted/60 p-5 border border-border shadow-sm">
              <div className="h-8 w-8 rounded-xl bg-muted border border-border text-[#00dc82] font-mono flex items-center justify-center font-bold text-sm mb-3">
                03
              </div>
              <h3 className="font-semibold text-foreground mb-1.5 text-sm">
                Multiple Growth Ladders
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                Provides flexibility between salaried employment, independent service, or village enterprise ownership.
              </p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* REQUIRED SKILLS & PROFICIENCY PROGRESS                             */}
        {/* ------------------------------------------------------------------ */}
        <section className="rounded-[28px] border border-border bg-card text-card-foreground p-6 sm:p-8 backdrop-blur-xl">
          <div className="flex items-center gap-2 font-mono text-[#eb0028] text-xs uppercase tracking-widest mb-2">
            <Award className="h-4 w-4" />
            <span>CAPABILITY CHECKLIST //</span>
          </div>
          <h2 className="text-xl font-sans font-bold text-foreground mb-2">
            Required Skills
          </h2>
          <p className="text-sm text-muted-foreground mb-6 font-sans">
            Master these core technical and interpersonal proficiencies to qualify for entry roles.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {requiredSkills.map((skillName, idx) => {
              const benchmark = Math.min(95, 75 + (idx % 4) * 6);
              return (
                <div
                  key={idx}
                  className="rounded-[22px] border border-border bg-muted/60 p-4 transition-all hover:border-foreground/20"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-medium text-foreground text-sm">
                      {skillName}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-muted text-foreground border border-border shrink-0">
                      REQUIRED
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-1.5">
                    <span>TARGET BENCHMARK //</span>
                    <span className="text-foreground font-bold">{benchmark}%</span>
                  </div>

                  <div className="h-1.5 w-full bg-muted/80 rounded-full overflow-hidden border border-border">
                    <div
                      className="h-full bg-foreground rounded-full shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                      style={{ width: `${benchmark}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* REQUIRED QUALIFICATIONS & ELIGIBILITY CRITERIA                     */}
        {/* ------------------------------------------------------------------ */}
        <section className="rounded-[28px] border border-border bg-card text-card-foreground p-6 sm:p-8 backdrop-blur-xl">
          <div className="flex items-center gap-2 font-mono text-[#eb0028] text-xs uppercase tracking-widest mb-2">
            <GraduationCap className="h-4 w-4" />
            <span>ELIGIBILITY CRITERIA //</span>
          </div>
          <h2 className="text-xl font-sans font-bold text-foreground mb-2">
            Required Qualifications
          </h2>
          <p className="text-sm text-muted-foreground mb-6 font-sans">
            Minimum educational background and recommended skilling credentials.
          </p>

          <div className="space-y-3">
            {requiredQualifications.map((qualification, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-[18px] bg-muted/60 border border-border"
              >
                <CheckCircle2 className="h-4 w-4 text-[#00dc82] shrink-0 mt-0.5" />
                <span className="text-sm text-foreground font-sans">
                  {qualification}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* FIRST STEPS TIMELINE                                               */}
        {/* ------------------------------------------------------------------ */}
        <section className="rounded-[28px] border border-border bg-card text-card-foreground p-6 sm:p-8 backdrop-blur-xl">
          <div className="flex items-center gap-2 font-mono text-[#eb0028] text-xs uppercase tracking-widest mb-2">
            <Clock className="h-4 w-4" />
            <span>ACTION SEQUENCE //</span>
          </div>
          <h2 className="text-xl font-sans font-bold text-foreground mb-2">
            First Steps Timeline
          </h2>
          <p className="text-sm text-muted-foreground mb-8 font-sans">
            Follow this chronological step-by-step checklist to start preparing immediately.
          </p>

          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-border">
            {firstSteps.map((step, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-6 sm:-left-8 top-0 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-card border border-border text-foreground font-mono text-xs shadow-md">
                  0{idx + 1}
                </div>
                <div className="rounded-[20px] border border-border bg-muted/60 p-4 sm:p-5 transition-all group-hover:border-foreground/20">
                  <h3 className="text-[10px] font-mono uppercase tracking-widest text-[#eb0028] mb-1">
                    STEP 0{idx + 1} //
                  </h3>
                  <p className="text-sm sm:text-base text-foreground font-sans">
                    {step}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* EDUCATION PATHWAYS                                                 */}
        {/* ------------------------------------------------------------------ */}
        <section className="rounded-[28px] border border-border bg-card text-card-foreground p-6 sm:p-8 backdrop-blur-xl">
          <div className="flex items-center gap-2 font-mono text-[#eb0028] text-xs uppercase tracking-widest mb-2">
            <Layers className="h-4 w-4" />
            <span>PROGRESSION ROUTES //</span>
          </div>
          <h2 className="text-xl font-sans font-bold text-foreground mb-2">
            Education & Career Pathways
          </h2>
          <p className="text-sm text-muted-foreground mb-6 font-sans">
            Choose the education track that aligns with your timeline, budget, and learning style.
          </p>

          <div className="space-y-4">
            {educationPaths.map((path, idx) => {
              const segments = path.split("→").map((s) => s.trim());
              return (
                <div
                  key={idx}
                  className="rounded-[22px] border border-border bg-muted/60 p-5"
                >
                  <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">
                    // OPTION 0{idx + 1} ROUTE
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {segments.map((segment, sIdx) => (
                      <React.Fragment key={sIdx}>
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-muted border border-border text-xs sm:text-sm font-mono text-foreground">
                          {segment}
                        </span>
                        {sIdx < segments.length - 1 && (
                          <ArrowRight className="h-3.5 w-3.5 text-[#eb0028] shrink-0" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* RELATED CAREERS                                                    */}
        {/* ------------------------------------------------------------------ */}
        {relatedCareersData.length > 0 && (
          <section className="pt-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-sans font-bold text-foreground">
                  Related Careers to Explore
                </h2>
                <p className="text-sm text-muted-foreground">
                  Similar roles sharing overlapping skills and entry requirements.
                </p>
              </div>
              <Link
                href="/careers"
                className="hidden sm:inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground"
              >
                <span>VIEW ALL //</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedCareersData.map((relCareer) => (
                <CareerCard key={relCareer.id} career={relCareer} />
              ))}
            </div>
          </section>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* BOTTOM CALL TO ACTION                                              */}
        {/* ------------------------------------------------------------------ */}
        <section className="rounded-[32px] border border-border bg-card text-card-foreground p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-[#eb0028]/10 border border-[#eb0028]/30 mb-4">
            <Sparkles className="h-6 w-6 text-[#eb0028]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-sans font-bold mb-3 tracking-tight text-foreground">
            Ready to Begin in {career.title}?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed font-sans">
            Generate a personalized step-by-step learning roadmap with curated free courses, practical hands-on exercises, and verified scholarship schemes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={`/roadmap?career=${career.slug}`}>
              <Button
                variant="red"
                size="lg"
                className="w-full sm:w-auto font-mono text-xs tracking-wider shadow-[0_0_25px_rgba(235,0,40,0.4)] px-8 cursor-pointer"
              >
                <span>GENERATE ROADMAP NOW //</span>
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>
            <Link href={`/chat?topic=career&id=${career.slug}`}>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto font-mono text-xs tracking-wider border-border text-foreground hover:border-foreground/40 bg-muted/40 cursor-pointer"
              >
                <span>CONSULT AI ADVISOR</span>
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
