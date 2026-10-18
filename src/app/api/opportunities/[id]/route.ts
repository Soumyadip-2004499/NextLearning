import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentStudentProfile } from "@/lib/auth";
import { parseJsonField } from "@/lib/utils";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Opportunity ID is required" },
        { status: 400 }
      );
    }

    const opportunity = await prisma.opportunity.findUnique({
      where: { id },
    });

    if (!opportunity) {
      return NextResponse.json(
        { success: false, error: "Opportunity not found" },
        { status: 404 }
      );
    }

    const student = await getCurrentStudentProfile();

    let isSaved = false;
    let applicationRecord = null;

    if (student) {
      const [savedRecord, appRecord] = await Promise.all([
        prisma.savedOpportunity.findUnique({
          where: {
            studentId_opportunityId: {
              studentId: student.id,
              opportunityId: id,
            },
          },
        }),
        prisma.applicationRecord.findUnique({
          where: {
            studentId_opportunityId: {
              studentId: student.id,
              opportunityId: id,
            },
          },
        }),
      ]);

      isSaved = !!savedRecord;
      if (appRecord) {
        applicationRecord = {
          id: appRecord.id,
          status: appRecord.status,
          notes: appRecord.notes,
          nextAction: appRecord.nextAction,
          statusHistory: parseJsonField<unknown[]>(appRecord.statusHistory, []),
          createdAt: appRecord.createdAt.toISOString(),
          updatedAt: appRecord.updatedAt.toISOString(),
        };
      }
    }

    const formattedData = {
      id: opportunity.id,
      title: opportunity.title,
      category: opportunity.category,
      provider: opportunity.provider,
      description: opportunity.description,
      eligibleLevels: parseJsonField<string[]>(opportunity.eligibleLevels, []),
      eligibilityRules: parseJsonField<unknown[]>(opportunity.eligibilityRules, []),
      location: opportunity.location,
      skills: parseJsonField<string[]>(opportunity.skills, []),
      openDate: opportunity.openDate ? opportunity.openDate.toISOString() : null,
      closeDate: opportunity.closeDate ? opportunity.closeDate.toISOString() : null,
      requiredDocuments: parseJsonField<string[]>(opportunity.requiredDocuments, []),
      applicationUrl: opportunity.applicationUrl,
      sourceUrl: opportunity.sourceUrl,
      lastVerified: opportunity.lastVerified ? opportunity.lastVerified.toISOString() : null,
      verificationStatus: opportunity.verificationStatus || "unverified",
      isSampleData: opportunity.isSampleData,
      isSaved,
      applicationRecord,
      createdAt: opportunity.createdAt.toISOString(),
      updatedAt: opportunity.updatedAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    console.error("GET /api/opportunities/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch opportunity" },
      { status: 500 }
    );
  }
}
