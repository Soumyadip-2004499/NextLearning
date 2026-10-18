import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentStudentProfile } from "@/lib/auth";
import { parseJsonField } from "@/lib/utils";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category")?.trim();
    const search = searchParams.get("search")?.trim();
    const level = searchParams.get("level")?.trim();
    const location = searchParams.get("location")?.trim();
    const savedOnly = searchParams.get("saved") === "true";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get("pageSize") || "12", 10)));

    const student = await getCurrentStudentProfile();

    const where: Prisma.OpportunityWhereInput = {};

    if (category && category !== "all" && category !== "All") {
      where.category = category.toLowerCase();
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { provider: { contains: search } },
      ];
    }

    if (level && level !== "all") {
      where.eligibleLevels = {
        contains: level,
      };
    }

    if (location && location !== "all") {
      where.location = {
        contains: location,
      };
    }

    if (savedOnly) {
      if (student) {
        where.savedBy = {
          some: { studentId: student.id },
        };
      } else {
        return NextResponse.json({
          success: true,
          data: [],
          total: 0,
          page,
          pageSize,
        });
      }
    }

    const [total, rawOpportunities, savedRecords] = await Promise.all([
      prisma.opportunity.count({ where }),
      prisma.opportunity.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: [{ closeDate: "asc" }, { createdAt: "desc" }],
      }),
      student
        ? prisma.savedOpportunity.findMany({
            where: { studentId: student.id },
            select: { opportunityId: true },
          })
        : Promise.resolve([]),
    ]);

    const savedOppIds = new Set(savedRecords.map((r) => r.opportunityId));

    const data = rawOpportunities.map((opp) => ({
      id: opp.id,
      title: opp.title,
      category: opp.category,
      provider: opp.provider,
      description: opp.description,
      eligibleLevels: parseJsonField<string[]>(opp.eligibleLevels, []),
      eligibilityRules: parseJsonField<unknown[]>(opp.eligibilityRules, []),
      location: opp.location,
      skills: parseJsonField<string[]>(opp.skills, []),
      openDate: opp.openDate ? opp.openDate.toISOString() : null,
      closeDate: opp.closeDate ? opp.closeDate.toISOString() : null,
      requiredDocuments: parseJsonField<string[]>(opp.requiredDocuments, []),
      applicationUrl: opp.applicationUrl,
      sourceUrl: opp.sourceUrl,
      lastVerified: opp.lastVerified ? opp.lastVerified.toISOString() : null,
      verificationStatus: opp.verificationStatus || "unverified",
      isSampleData: opp.isSampleData,
      isSaved: savedOppIds.has(opp.id),
      createdAt: opp.createdAt.toISOString(),
      updatedAt: opp.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    console.error("GET /api/opportunities error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch opportunities" },
      { status: 500 }
    );
  }
}
