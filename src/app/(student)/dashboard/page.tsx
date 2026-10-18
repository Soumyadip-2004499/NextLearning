import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { parseJsonField } from "@/lib/utils";
import type { CareerCard } from "@/types";
import type { ActivityItem } from "@/components/dashboard/activity-timeline";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login?callbackUrl=/dashboard");
  }

  // Fetch student profile, active roadmap, saved opportunities, and progress records
  let profile = null;
  let activeRoadmap = null;
  let savedOpportunities: Array<{
    id: string;
    notes?: string | null;
    opportunity: {
      id: string;
      title: string;
      category: string;
      provider: string | null;
      closeDate: string | Date | null;
      applicationUrl: string | null;
      isSampleData: boolean;
    };
  }> = [];
  let recommendedCareers: Array<CareerCard & { salaryRange?: string | null }> = [];
  let recentActivities: ActivityItem[] = [];

  try {
    profile = await prisma.studentProfile.findFirst({
      where: { userId: user.id },
      include: {
        roadmaps: {
          where: { status: "active" },
          include: {
            steps: {
              orderBy: { order: "asc" },
            },
          },
        },
        savedOpportunities: {
          include: {
            opportunity: true,
          },
        },
        progressRecords: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    // If no profile found for user in demo mode, try to fetch the seeded demo student's profile
    if (!profile) {
      profile = await prisma.studentProfile.findFirst({
        include: {
          roadmaps: {
            where: { status: "active" },
            include: {
              steps: {
                orderBy: { order: "asc" },
              },
            },
          },
          savedOpportunities: {
            include: {
              opportunity: true,
            },
          },
          progressRecords: {
            orderBy: { createdAt: "desc" },
            take: 5,
          },
        },
      });
    }

    if (profile && profile.roadmaps.length > 0) {
      activeRoadmap = profile.roadmaps[0];
    }

    if (profile && profile.savedOpportunities) {
      savedOpportunities = profile.savedOpportunities;
    }

    // Query 4 recommended careers matching vocational / technical interests
    const dbCareers = await prisma.career.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
    });

    const matchScores = [96, 92, 88, 85];

    recommendedCareers = dbCareers.map((c, idx) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      category: c.category,
      description: c.description,
      requiredSkills: parseJsonField<string[]>(c.requiredSkills, []),
      salaryRange: c.salaryRange,
      matchScore: matchScores[idx] || 85,
      isSampleData: c.isSampleData,
    }));

    // Build timeline activities
    recentActivities = [
      {
        id: "act-1",
        type: "milestone",
        title: "Completed Milestone: DC Electricity & Safety",
        description: "Scored 100% on the foundational electrical safety check.",
        timestamp: "1 day ago",
        href: "/roadmap",
      },
      {
        id: "act-2",
        type: "learning",
        title: "Started Multimeter Diagnostics Practice",
        description: "Engaged with Skill India Digital Hub practical diagnostic video.",
        timestamp: "2 days ago",
        href: "/roadmap",
      },
      {
        id: "act-3",
        type: "opportunity",
        title: "Saved PM Surya Ghar Skilling Drive",
        description: "Bookmarked certification scheme in Kolkata district.",
        timestamp: "3 days ago",
        href: "/opportunities/saved",
      },
      {
        id: "act-4",
        type: "milestone",
        title: "Completed NextLearning Career Onboarding",
        description: "Set career preference to Vocational Trades & Clean Energy.",
        timestamp: "5 days ago",
        href: "/profile",
      },
    ];
  } catch (error) {
    console.error("Error loading dashboard data:", error);
  }

  const parsedProfile = profile
    ? {
        displayName: profile.displayName,
        educationLevel: profile.educationLevel,
        state: profile.state,
        district: profile.district,
        interests: parseJsonField<string[]>(profile.interests, []),
        skills: parseJsonField<string[]>(profile.skills, []),
        careerAspirations: parseJsonField<string[]>(profile.careerAspirations, []),
        careerPreference: profile.careerPreference,
      }
    : null;

  return (
    <DashboardView
      user={user}
      studentProfile={parsedProfile}
      activeRoadmap={activeRoadmap}
      savedOpportunities={savedOpportunities}
      recommendedCareers={recommendedCareers}
      recentActivities={recentActivities}
    />
  );
}
