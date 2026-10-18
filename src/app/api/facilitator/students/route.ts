import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAuthenticatedFacilitator } from "@/lib/facilitator-auth";


export async function GET() {
  try {
    const auth = await getAuthenticatedFacilitator();
    if (auth.error === "unauthenticated") {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }
    if (auth.error === "unauthorized" || !auth.facilitatorProfile) {
      return NextResponse.json(
        { success: false, error: "Access denied. Facilitator role required." },
        { status: 403 }
      );
    }

    const facilitatorId = auth.facilitatorProfile.id;

    // Ensure any newly created students in the backend are linked to this facilitator
    try {
      const unassignedStudents = await prisma.studentProfile.findMany({
        where: {
          facilitatorAssignments: {
            none: { facilitatorId },
          },
        },
      });

      for (const unassigned of unassignedStudents) {
        await prisma.facilitatorStudentAssignment.upsert({
          where: {
            facilitatorId_studentId: {
              facilitatorId,
              studentId: unassigned.id,
            },
          },
          update: {},
          create: {
            facilitatorId,
            studentId: unassigned.id,
            notes: "Registered student in jurisdiction",
          },
        });
      }
    } catch (syncErr) {
      console.warn("Student assignment auto-sync notice:", syncErr);
    }

    // Fetch assignments for this facilitator with student profile and relations
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
                language: true,
              },
            },
            roadmaps: {
              include: {
                steps: {
                  select: {
                    id: true,
                    status: true,
                  },
                },
              },
            },
            savedOpportunities: {
              select: { id: true },
            },
            applicationRecords: {
              select: { id: true, status: true },
            },
            progressRecords: {
              orderBy: { createdAt: "desc" },
              take: 5,
            },
          },
        },
      },
      orderBy: { assignedAt: "desc" },
    });

    const students = assignments.map((assignment) => {
      const student = assignment.student;

      // Safe JSON parsing helpers
      const parseJsonArray = (val: string | null): string[] => {
        if (!val) return [];
        try {
          const parsed = JSON.parse(val);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      };

      // Calculate roadmap progress across all steps
      let totalSteps = 0;
      let completedSteps = 0;
      student.roadmaps.forEach((rm) => {
        rm.steps.forEach((step) => {
          totalSteps += 1;
          if (step.status === "completed") {
            completedSteps += 1;
          }
        });
      });
      const roadmapProgress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

      // Determine last active timestamp
      const latestProgress = student.progressRecords[0]?.createdAt;
      const lastActive = latestProgress || student.updatedAt || assignment.assignedAt;

      return {
        id: student.id,
        assignmentId: assignment.id,
        displayName: student.displayName || student.user.name || "Student",
        email: student.user.email,
        educationLevel: student.educationLevel || "Not specified",
        state: student.state,
        district: student.district,
        interests: parseJsonArray(student.interests),
        skills: parseJsonArray(student.skills),
        careerAspirations: parseJsonArray(student.careerAspirations),
        notes: assignment.notes,
        assignedAt: assignment.assignedAt,
        roadmapCount: student.roadmaps.length,
        activeRoadmaps: student.roadmaps.filter((r) => r.status === "active").length,
        roadmapProgress,
        savedOpportunitiesCount: student.savedOpportunities.length,
        applicationsCount: student.applicationRecords.length,
        lastActive,
        progressEventsCount: student.progressRecords.length,
      };
    });

    return NextResponse.json({
      success: true,
      data: students,
      count: students.length,
    });
  } catch (error) {
    console.error("Error fetching facilitator students:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve student assignments" },
      { status: 500 }
    );
  }
}
