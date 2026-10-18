import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/db";
import { getAuthenticatedFacilitator } from "@/lib/facilitator-auth";
import { StudentDetailClient } from "./student-detail-client";


interface StudentDetailPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function FacilitatorStudentDetailPage({
  params,
}: StudentDetailPageProps) {
  const auth = await getAuthenticatedFacilitator();
  if (!auth.user || auth.error || !auth.facilitatorProfile) {
    redirect("/auth/login?callbackUrl=/facilitator");
  }

  const { id: studentId } = await params;
  const facilitatorId = auth.facilitatorProfile.id;

  // Authorization check: facilitator must be assigned to this student
  const assignment = await prisma.facilitatorStudentAssignment.findUnique({
    where: {
      facilitatorId_studentId: {
        facilitatorId,
        studentId,
      },
    },
  });

  if (!assignment) {
    // Return unauthorized / forbidden or redirect
    return (
      <div className="p-8 text-center max-w-md mx-auto my-12 bg-card rounded-[24px] border border-border shadow-2xl space-y-4 text-card-foreground">
        <div className="w-12 h-12 rounded-full bg-red-500/20 text-[#eb0028] border border-red-500/30 flex items-center justify-center mx-auto font-mono font-bold text-xl">
          !
        </div>
        <h2 className="text-xl font-bold font-mono text-foreground uppercase tracking-tight">Access Restricted //</h2>
        <p className="text-xs font-mono text-muted-foreground leading-relaxed">
          You are not currently assigned to this student. For student privacy and data protection, only designated mentors can inspect student learning plans and application records.
        </p>
        <a
          href="/facilitator"
          className="inline-block px-5 py-2.5 bg-[#eb0028] hover:bg-[#c50022] text-white rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-colors keep-white"
        >
          <span className="keep-white">Return to Dashboard //</span>
        </a>
      </div>
    );
  }

  // Fetch full student profile
  const student = await prisma.studentProfile.findUnique({
    where: { id: studentId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          language: true,
        },
      },
      roadmaps: {
        include: {
          steps: {
            orderBy: { order: "asc" },
            include: {
              resource: {
                select: {
                  id: true,
                  title: true,
                  provider: true,
                  url: true,
                  resourceType: true,
                },
              },
            },
          },
        },
      },
      savedOpportunities: {
        include: {
          opportunity: true,
        },
        orderBy: { savedAt: "desc" },
      },
      applicationRecords: {
        include: {
          opportunity: true,
        },
        orderBy: { updatedAt: "desc" },
      },
    },
  });

  if (!student) {
    notFound();
  }

  // Fetch recommendations sent to this student by this facilitator
  const recommendations = await prisma.facilitatorRecommendation.findMany({
    where: {
      facilitatorId,
      studentId,
    },
    orderBy: { createdAt: "desc" },
  });

  // Fetch available resources and opportunities for the recommend dialogs
  const [availableResources, availableOpportunities] = await Promise.all([
    prisma.learningResource.findMany({
      select: { id: true, title: true, provider: true, resourceType: true },
      take: 20,
      orderBy: { createdAt: "desc" },
    }),
    prisma.opportunity.findMany({
      select: { id: true, title: true, provider: true, category: true },
      take: 20,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const parseJsonArray = (val: string | null): string[] => {
    if (!val) return [];
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const studentData = {
    id: student.id,
    displayName: student.displayName || student.user.name || "Student",
    email: student.user.email,
    educationLevel: student.educationLevel || "Not specified",
    state: student.state || "Not specified",
    district: student.district || "Not specified",
    interests: parseJsonArray(student.interests),
    hobbies: parseJsonArray(student.hobbies),
    favoriteSubjects: parseJsonArray(student.favoriteSubjects),
    skills: parseJsonArray(student.skills),
    careerAspirations: parseJsonArray(student.careerAspirations),
    learningStyle: student.learningStyle || "visual",
    careerPreference: student.careerPreference || "vocational",
    availableHours: student.availableHours || 10,
    deviceAccess: student.deviceAccess || "smartphone",
    assignmentNotes: assignment.notes || "",
    assignedAt: assignment.assignedAt.toISOString(),
    roadmaps: student.roadmaps.map((r) => ({
      id: r.id,
      careerTitle: r.careerTitle,
      description: r.description,
      status: r.status,
      steps: r.steps.map((s) => ({
        id: s.id,
        order: s.order,
        title: s.title,
        description: s.description,
        type: s.type,
        status: s.status,
        duration: s.duration,
        completedAt: s.completedAt ? s.completedAt.toISOString() : null,
        resource: s.resource,
      })),
    })),
    savedOpportunities: student.savedOpportunities.map((s) => ({
      id: s.id,
      opportunityId: s.opportunity.id,
      title: s.opportunity.title,
      category: s.opportunity.category,
      provider: s.opportunity.provider,
      description: s.opportunity.description,
      location: s.opportunity.location,
      applicationUrl: s.opportunity.applicationUrl,
      savedAt: s.savedAt.toISOString(),
    })),
    applications: student.applicationRecords.map((a) => ({
      id: a.id,
      opportunityId: a.opportunity.id,
      title: a.opportunity.title,
      category: a.opportunity.category,
      provider: a.opportunity.provider,
      status: a.status,
      notes: a.notes,
      nextAction: a.nextAction,
      updatedAt: a.updatedAt.toISOString(),
      statusHistory: parseJsonArray(a.statusHistory),
    })),
    recommendations: recommendations.map((rec) => ({
      id: rec.id,
      type: rec.type,
      referenceId: rec.referenceId,
      message: rec.message,
      isRead: rec.isRead,
      createdAt: rec.createdAt.toISOString(),
    })),
  };

  return (
    <StudentDetailClient
      student={studentData}
      availableResources={availableResources}
      availableOpportunities={availableOpportunities}
    />
  );
}
