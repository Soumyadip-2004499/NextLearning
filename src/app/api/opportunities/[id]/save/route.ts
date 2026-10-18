import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentStudentProfile } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id: opportunityId } = await params;
    const student = await getCurrentStudentProfile();

    if (!student) {
      return NextResponse.json(
        { success: false, error: "Authentication required to save opportunities" },
        { status: 401 }
      );
    }

    const opportunity = await prisma.opportunity.findUnique({
      where: { id: opportunityId },
    });

    if (!opportunity) {
      return NextResponse.json(
        { success: false, error: "Opportunity not found" },
        { status: 404 }
      );
    }

    let notes: string | null = null;
    try {
      const body = await req.json();
      if (body?.notes) notes = body.notes;
    } catch {
      // Body is optional
    }

    const saved = await prisma.savedOpportunity.upsert({
      where: {
        studentId_opportunityId: {
          studentId: student.id,
          opportunityId,
        },
      },
      update: {
        ...(notes !== null ? { notes } : {}),
      },
      create: {
        studentId: student.id,
        opportunityId,
        notes,
      },
    });

    // Record student progress event
    await prisma.studentProgress
      .create({
        data: {
          studentId: student.id,
          eventType: "opportunity_saved",
          eventData: JSON.stringify({
            opportunityId,
            title: opportunity.title,
            savedAt: saved.savedAt.toISOString(),
          }),
        },
      })
      .catch(() => {});

    return NextResponse.json({
      success: true,
      message: "Opportunity saved successfully",
      data: saved,
    });
  } catch (error) {
    console.error("POST /api/opportunities/[id]/save error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save opportunity" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id: opportunityId } = await params;
    const student = await getCurrentStudentProfile();

    if (!student) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    await prisma.savedOpportunity.deleteMany({
      where: {
        studentId: student.id,
        opportunityId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Opportunity removed from saved",
    });
  } catch (error) {
    console.error("DELETE /api/opportunities/[id]/save error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to unsave opportunity" },
      { status: 500 }
    );
  }
}
