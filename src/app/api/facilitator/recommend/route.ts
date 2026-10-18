import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAuthenticatedFacilitator } from "@/lib/facilitator-auth";
import { z } from "zod";


const recommendSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  type: z.enum(["resource", "opportunity", "career"]),
  referenceId: z.string().min(1, "Reference ID is required"),
  message: z.string().max(1000, "Message cannot exceed 1000 characters").optional().nullable(),
});

export async function POST(request: NextRequest) {
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
    const body = await request.json();

    const validation = recommendSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.issues[0]?.message || "Invalid payload",
        },
        { status: 400 }
      );
    }

    const { studentId, type, referenceId, message } = validation.data;

    // Check that facilitator is assigned to this student
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
          error: "You can only send recommendations to students assigned to you",
        },
        { status: 403 }
      );
    }

    // Verify referenceId exists in respective table
    let referenceTitle = "";
    if (type === "resource") {
      const res = await prisma.learningResource.findUnique({
        where: { id: referenceId },
      });
      if (!res) {
        return NextResponse.json(
          { success: false, error: "Referenced learning resource was not found" },
          { status: 404 }
        );
      }
      referenceTitle = res.title;
    } else if (type === "opportunity") {
      const opp = await prisma.opportunity.findUnique({
        where: { id: referenceId },
      });
      if (!opp) {
        return NextResponse.json(
          { success: false, error: "Referenced opportunity was not found" },
          { status: 404 }
        );
      }
      referenceTitle = opp.title;
    } else if (type === "career") {
      const car = await prisma.career.findFirst({
        where: {
          OR: [{ id: referenceId }, { slug: referenceId }],
        },
      });
      if (!car) {
        return NextResponse.json(
          { success: false, error: "Referenced career was not found" },
          { status: 404 }
        );
      }
      referenceTitle = car.title;
    }

    // Create FacilitatorRecommendation record
    const recommendation = await prisma.facilitatorRecommendation.create({
      data: {
        facilitatorId,
        studentId,
        type,
        referenceId,
        message: message?.trim() || `Recommended ${type}: ${referenceTitle}`,
        isRead: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully recommended "${referenceTitle}" to the student`,
      data: recommendation,
    });
  } catch (error) {
    console.error("Error creating recommendation:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send recommendation" },
      { status: 500 }
    );
  }
}
