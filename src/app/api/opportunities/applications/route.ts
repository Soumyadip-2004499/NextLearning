import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentStudentProfile } from "@/lib/auth";
import { parseJsonField } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const student = await getCurrentStudentProfile();

    if (!student) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const applications = await prisma.applicationRecord.findMany({
      where: {
        studentId: student.id,
      },
      include: {
        opportunity: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const data = applications.map((app) => ({
      id: app.id,
      opportunityId: app.opportunityId,
      opportunityTitle: app.opportunity.title,
      category: app.opportunity.category,
      provider: app.opportunity.provider,
      status: app.status,
      notes: app.notes,
      nextAction: app.nextAction,
      statusHistory: parseJsonField<unknown[]>(app.statusHistory, []),
      closeDate: app.opportunity.closeDate ? app.opportunity.closeDate.toISOString() : null,
      verificationStatus: app.opportunity.verificationStatus,
      isSampleData: app.opportunity.isSampleData,
      applicationUrl: app.opportunity.applicationUrl,
      updatedAt: app.updatedAt.toISOString(),
      createdAt: app.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET /api/opportunities/applications error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
