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

    const savedRecords = await prisma.savedOpportunity.findMany({
      where: {
        studentId: student.id,
      },
      include: {
        opportunity: true,
      },
      orderBy: {
        savedAt: "desc",
      },
    });

    const data = savedRecords.map((saved) => ({
      id: saved.opportunity.id,
      savedRecordId: saved.id,
      title: saved.opportunity.title,
      category: saved.opportunity.category,
      provider: saved.opportunity.provider,
      description: saved.opportunity.description,
      eligibleLevels: parseJsonField<string[]>(saved.opportunity.eligibleLevels, []),
      location: saved.opportunity.location,
      skills: parseJsonField<string[]>(saved.opportunity.skills, []),
      openDate: saved.opportunity.openDate ? saved.opportunity.openDate.toISOString() : null,
      closeDate: saved.opportunity.closeDate ? saved.opportunity.closeDate.toISOString() : null,
      applicationUrl: saved.opportunity.applicationUrl,
      sourceUrl: saved.opportunity.sourceUrl,
      lastVerified: saved.opportunity.lastVerified
        ? saved.opportunity.lastVerified.toISOString()
        : null,
      verificationStatus: saved.opportunity.verificationStatus,
      isSampleData: saved.opportunity.isSampleData,
      isSaved: true,
      savedAt: saved.savedAt.toISOString(),
      notes: saved.notes,
    }));

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET /api/opportunities/saved error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch saved opportunities" },
      { status: 500 }
    );
  }
}
