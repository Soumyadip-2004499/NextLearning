import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseJsonField } from "@/lib/utils";
import { matchCareers, MatchInput } from "@/lib/career-engine/matcher";
import { CareerCard } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const search = searchParams.get("search")?.trim().toLowerCase();
    const level = searchParams.get("level")?.trim();
    const match = searchParams.get("match") === "true";
    const userId = searchParams.get("userId")?.trim();

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.max(1, Math.min(100, parseInt(searchParams.get("pageSize") || "12", 10)));

    // Base query conditions
    const whereClause: Record<string, unknown> = {};

    if (category && category !== "all") {
      whereClause.category = category;
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { requiredSkills: { contains: search } },
      ];
    }

    if (level && level !== "all") {
      whereClause.requiredQualifications = { contains: level };
    }

    // If matching is requested and userId is supplied
    if (match && userId) {
      const studentProfile = await prisma.studentProfile.findFirst({
        where: {
          OR: [{ userId }, { id: userId }],
        },
      });

      if (studentProfile) {
        const matchInput: MatchInput = {
          interests: parseJsonField<string[]>(studentProfile.interests, []),
          skills: parseJsonField<string[]>(studentProfile.skills, []),
          careerAspirations: parseJsonField<string[]>(studentProfile.careerAspirations, []),
          educationLevel: studentProfile.educationLevel || "class_10",
          careerPreference: studentProfile.careerPreference || "employment",
          learningStyle: studentProfile.learningStyle || undefined,
        };

        // Fetch all careers matching filter criteria for scoring
        const allMatchingCareers = await prisma.career.findMany({
          where: whereClause,
        });

        // Score careers
        const scoredMap = new Map(
          matchCareers(
            matchInput,
            allMatchingCareers.map((c) => ({
              id: c.id,
              title: c.title,
              slug: c.slug,
              category: c.category,
              description: c.description,
              requiredSkills: c.requiredSkills,
              requiredQualifications: c.requiredQualifications,
              educationPaths: c.educationPaths,
            }))
          ).map((m) => [m.careerId, m])
        );

        // Sort by match score descending
        const sorted = [...allMatchingCareers].sort((a, b) => {
          const scoreA = scoredMap.get(a.id)?.score || 0;
          const scoreB = scoredMap.get(b.id)?.score || 0;
          return scoreB - scoreA;
        });

        const total = sorted.length;
        const totalPages = Math.ceil(total / pageSize);
        const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

        const data: CareerCard[] = paginated.map((c) => {
          const matchResult = scoredMap.get(c.id);
          return {
            id: c.id,
            title: c.title,
            slug: c.slug,
            category: c.category,
            description: c.description,
            requiredSkills: parseJsonField<string[]>(c.requiredSkills, []),
            matchScore: matchResult?.score,
            matchReasons: matchResult?.reasons,
            isSampleData: c.isSampleData,
          };
        });

        return NextResponse.json({
          success: true,
          data,
          total,
          page,
          pageSize,
          totalPages,
        });
      }
    }

    // Default flow: database pagination without user-specific matching
    const [total, careers] = await Promise.all([
      prisma.career.count({ where: whereClause }),
      prisma.career.findMany({
        where: whereClause,
        orderBy: { title: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    const data: CareerCard[] = careers.map((c) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      category: c.category,
      description: c.description,
      requiredSkills: parseJsonField<string[]>(c.requiredSkills, []),
      isSampleData: c.isSampleData,
    }));

    return NextResponse.json({
      success: true,
      data,
      total,
      page,
      pageSize,
      totalPages,
    });
  } catch (error) {
    console.error("Error in GET /api/careers:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve careers",
      },
      { status: 500 }
    );
  }
}
