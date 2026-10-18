import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { getAuthenticatedFacilitator } from "@/lib/facilitator-auth";
import { FacilitatorDashboardClient } from "./facilitator-dashboard-client";


export const dynamic = "force-dynamic";

export default async function FacilitatorPage() {
  const auth = await getAuthenticatedFacilitator();
  if (!auth.user || auth.error || !auth.facilitatorProfile) {
    redirect("/auth/login?callbackUrl=/facilitator");
  }

  const facilitatorId = auth.facilitatorProfile.id;

  // 1. Fetch assigned students
  const assignments = await prisma.facilitatorStudentAssignment.findMany({
    where: { facilitatorId },
    include: {
      student: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          roadmaps: {
            include: {
              steps: {
                select: { id: true, status: true },
              },
            },
          },
          savedOpportunities: { select: { id: true } },
          applicationRecords: { select: { id: true, status: true } },
          progressRecords: {
            orderBy: { createdAt: "desc" },
            take: 3,
          },
        },
      },
    },
    orderBy: { assignedAt: "desc" },
  });

  // 2. Fetch stats
  const [modulesCount, publishedModulesCount, recommendationsCount] = await Promise.all([
    prisma.trainingModule.count({ where: { facilitatorId } }),
    prisma.trainingModule.count({ where: { facilitatorId, status: "published" } }),
    prisma.facilitatorRecommendation.count({ where: { facilitatorId } }),
  ]);

  // Compute active roadmaps across assigned students
  let activeRoadmapsCount = 0;
  const students = assignments.map((assignment) => {
    const student = assignment.student;

    let totalSteps = 0;
    let completedSteps = 0;
    student.roadmaps.forEach((rm) => {
      if (rm.status === "active") activeRoadmapsCount += 1;
      rm.steps.forEach((step) => {
        totalSteps += 1;
        if (step.status === "completed") completedSteps += 1;
      });
    });

    const roadmapProgress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

    const parseJsonArray = (val: string | null): string[] => {
      if (!val) return [];
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    };

    const latestEvent = student.progressRecords[0]?.createdAt;
    const lastActive = latestEvent
      ? new Date(latestEvent).toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Recently active";

    return {
      id: student.id,
      displayName: student.displayName || student.user.name || "Student",
      email: student.user.email,
      educationLevel: student.educationLevel || "Class 10",
      state: student.state || "West Bengal",
      district: student.district || "Kolkata",
      interests: parseJsonArray(student.interests),
      skills: parseJsonArray(student.skills),
      careerAspirations: parseJsonArray(student.careerAspirations),
      roadmapCount: student.roadmaps.length,
      activeRoadmaps: student.roadmaps.filter((r) => r.status === "active").length,
      roadmapProgress,
      savedOpportunitiesCount: student.savedOpportunities.length,
      applicationsCount: student.applicationRecords.length,
      lastActive,
      notes: assignment.notes,
    };
  });

  // 3. Fetch recent activity feed
  const recentRecommendations = await prisma.facilitatorRecommendation.findMany({
    where: { facilitatorId },
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  const recentProgressEvents = await prisma.studentProgress.findMany({
    where: {
      studentId: { in: students.map((s) => s.id) },
    },
    include: {
      student: {
        select: { displayName: true },
      },
    },
    take: 6,
    orderBy: { createdAt: "desc" },
  });

  const formattedActivity = [
    ...recentProgressEvents.map((pe) => ({
      id: pe.id,
      type: "progress",
      studentName: pe.student?.displayName || "Student",
      title: pe.eventType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      description: `Student achieved learning milestone`,
      timestamp: pe.createdAt.toISOString(),
    })),
    ...recentRecommendations.map((rec) => {
      const targetStudent = students.find((s) => s.id === rec.studentId);
      return {
        id: rec.id,
        type: "recommendation",
        studentName: targetStudent?.displayName || "Student",
        title: `Recommended ${rec.type}`,
        description: rec.message || `Shared ${rec.type} recommendation`,
        timestamp: rec.createdAt.toISOString(),
      };
    }),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <FacilitatorDashboardClient
      facilitatorName={auth.facilitatorProfile.displayName || auth.user.name || "Facilitator"}
      organization={auth.facilitatorProfile.organization || "Career Guidance Hub"}
      district={auth.facilitatorProfile.district || "Anantapur"}
      state={auth.facilitatorProfile.state || "Andhra Pradesh"}
      stats={{
        totalStudents: students.length,
        activeRoadmaps: activeRoadmapsCount,
        modulesPublished: publishedModulesCount,
        totalModules: modulesCount,
        recommendationsSent: recommendationsCount,
      }}
      initialStudents={students}
      initialActivity={formattedActivity}
    />
  );
}
