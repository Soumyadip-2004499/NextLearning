import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAuthenticatedFacilitator } from "@/lib/facilitator-auth";
import { z } from "zod";


interface RouteParams {
  params: Promise<{ id: string }>;
}

const updateNotesSchema = z.object({
  notes: z.string().max(2000, "Notes cannot exceed 2000 characters"),
});

export async function GET(
  _request: NextRequest,
  context: RouteParams
) {
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

    const { id: studentId } = await context.params;
    const facilitatorId = auth.facilitatorProfile.id;

    // Check authorization: Facilitator must be assigned to this student
    const assignment = await prisma.facilitatorStudentAssignment.findUnique({
      where: {
        facilitatorId_studentId: {
          facilitatorId,
          studentId,
        },
      },
    });

    if (!assignment) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: You are not assigned to this student",
        },
        { status: 403 }
      );
    }

    // Fetch detailed student info
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
          orderBy: { createdAt: "desc" },
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
        progressRecords: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!student) {
      return NextResponse.json(
        { success: false, error: "Student not found" },
        { status: 404 }
      );
    }

    // Fetch recommendations given to this student by this facilitator
    const recommendations = await prisma.facilitatorRecommendation.findMany({
      where: {
        facilitatorId,
        studentId,
      },
      orderBy: { createdAt: "desc" },
    });

    const parseJsonArray = (val: string | null): string[] => {
      if (!val) return [];
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    };

    return NextResponse.json({
      success: true,
      data: {
        id: student.id,
        displayName: student.displayName || student.user.name || "Student",
        email: student.user.email,
        educationLevel: student.educationLevel,
        state: student.state,
        district: student.district,
        interests: parseJsonArray(student.interests),
        hobbies: parseJsonArray(student.hobbies),
        favoriteSubjects: parseJsonArray(student.favoriteSubjects),
        skills: parseJsonArray(student.skills),
        careerAspirations: parseJsonArray(student.careerAspirations),
        learningStyle: student.learningStyle,
        careerPreference: student.careerPreference,
        availableHours: student.availableHours,
        deviceAccess: student.deviceAccess,
        assignment: {
          id: assignment.id,
          notes: assignment.notes,
          assignedAt: assignment.assignedAt,
        },
        roadmaps: student.roadmaps.map((r) => ({
          id: r.id,
          careerTitle: r.careerTitle,
          description: r.description,
          status: r.status,
          createdAt: r.createdAt,
          steps: r.steps.map((s) => ({
            id: s.id,
            order: s.order,
            title: s.title,
            description: s.description,
            type: s.type,
            status: s.status,
            duration: s.duration,
            completedAt: s.completedAt,
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
          savedAt: s.savedAt,
          notes: s.notes,
          applicationUrl: s.opportunity.applicationUrl,
        })),
        applicationRecords: student.applicationRecords.map((app) => ({
          id: app.id,
          opportunityId: app.opportunity.id,
          opportunityTitle: app.opportunity.title,
          category: app.opportunity.category,
          status: app.status,
          notes: app.notes,
          nextAction: app.nextAction,
          updatedAt: app.updatedAt,
          statusHistory: parseJsonArray(app.statusHistory),
        })),
        recentProgress: student.progressRecords.map((p) => ({
          id: p.id,
          eventType: p.eventType,
          eventData: p.eventData,
          createdAt: p.createdAt,
        })),
        recommendations,
      },
    });
  } catch (error) {
    console.error("Error fetching student details:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load student details" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: RouteParams
) {
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

    const { id: studentId } = await context.params;
    const facilitatorId = auth.facilitatorProfile.id;

    const body = await request.json();
    const validation = updateNotesSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.issues[0]?.message || "Invalid input",
        },
        { status: 400 }
      );
    }

    // Verify assignment exists
    const assignment = await prisma.facilitatorStudentAssignment.findUnique({
      where: {
        facilitatorId_studentId: {
          facilitatorId,
          studentId,
        },
      },
    });

    if (!assignment) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: You are not assigned to this student",
        },
        { status: 403 }
      );
    }

    const updatedAssignment = await prisma.facilitatorStudentAssignment.update({
      where: {
        id: assignment.id,
      },
      data: {
        notes: validation.data.notes,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Facilitator notes updated successfully",
      data: {
        notes: updatedAssignment.notes,
      },
    });
  } catch (error) {
    console.error("Error updating student notes:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update facilitator notes" },
      { status: 500 }
    );
  }
}
