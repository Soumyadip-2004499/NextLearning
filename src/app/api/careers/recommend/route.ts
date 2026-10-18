import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseJsonField } from "@/lib/utils";
import { matchCareers, MatchInput, CareerMatch } from "@/lib/career-engine/matcher";
import { CareerCard } from "@/types";

export interface RecommendedCareerItem {
  career: CareerCard & {
    salaryRange: string | null;
    demandLevel: string | null;
    growthOutlook: string | null;
  };
  score: number;
  breakdown: CareerMatch["breakdown"];
  reasons: string[];
}

export async function POST(request: NextRequest) {
  try {
    let body: Partial<MatchInput & { userId?: string }> = {};
    try {
      body = await request.json();
    } catch {
      // Empty or invalid JSON
      body = {};
    }

    let interests = Array.isArray(body.interests) ? body.interests : [];
    let skills = Array.isArray(body.skills) ? body.skills : [];
    let careerAspirations = Array.isArray(body.careerAspirations) ? body.careerAspirations : [];
    let educationLevel = body.educationLevel || "class_10";
    let careerPreference = body.careerPreference || "employment";
    const learningStyle = body.learningStyle;

    // If userId provided and fields are missing, supplement from student profile
    if (body.userId && interests.length === 0 && skills.length === 0) {
      const profile = await prisma.studentProfile.findFirst({
        where: {
          OR: [{ userId: body.userId }, { id: body.userId }],
        },
      });

      if (profile) {
        interests = parseJsonField<string[]>(profile.interests, interests);
        skills = parseJsonField<string[]>(profile.skills, skills);
        careerAspirations = parseJsonField<string[]>(profile.careerAspirations, careerAspirations);
        if (profile.educationLevel) educationLevel = profile.educationLevel;
        if (profile.careerPreference) careerPreference = profile.careerPreference;
      }
    }

    const matchInput: MatchInput = {
      interests,
      skills,
      careerAspirations,
      educationLevel,
      careerPreference,
      learningStyle,
    };

    // Fetch all careers from DB
    const allCareers = await prisma.career.findMany();

    if (!allCareers || allCareers.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        total: 0,
        message: "No careers available in the system.",
      });
    }

    // Format careers for matcher
    const candidateCareers = allCareers.map((c) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      category: c.category,
      description: c.description,
      requiredSkills: c.requiredSkills,
      requiredQualifications: c.requiredQualifications,
      educationPaths: c.educationPaths,
      demandLevel: c.demandLevel,
      growthOutlook: c.growthOutlook,
    }));

    // Run matching algorithm
    const matchResults = matchCareers(matchInput, candidateCareers);

    // Map career records by ID for quick access
    const careerMap = new Map(allCareers.map((c) => [c.id, c]));

    // Top 10 recommendations
    const top10Matches = matchResults.slice(0, 10);

    const recommended: RecommendedCareerItem[] = top10Matches.map((m) => {
      const c = careerMap.get(m.careerId)!;
      return {
        career: {
          id: c.id,
          title: c.title,
          slug: c.slug,
          category: c.category,
          description: c.description,
          requiredSkills: parseJsonField<string[]>(c.requiredSkills, []),
          salaryRange: c.salaryRange,
          demandLevel: c.demandLevel,
          growthOutlook: c.growthOutlook,
          isSampleData: c.isSampleData,
        },
        score: m.score,
        breakdown: m.breakdown,
        reasons: m.reasons,
      };
    });

    return NextResponse.json({
      success: true,
      data: recommended,
      total: recommended.length,
    });
  } catch (error) {
    console.error("Error in POST /api/careers/recommend:", error);

    // Resilient fallback: fetch high-demand careers with default guidance
    try {
      const fallbackCareers = await prisma.career.findMany({
        where: { demandLevel: "high" },
        take: 10,
      });

      const fallbackRecommended: RecommendedCareerItem[] = fallbackCareers.map((c, idx) => ({
        career: {
          id: c.id,
          title: c.title,
          slug: c.slug,
          category: c.category,
          description: c.description,
          requiredSkills: parseJsonField<string[]>(c.requiredSkills, []),
          salaryRange: c.salaryRange,
          demandLevel: c.demandLevel,
          growthOutlook: c.growthOutlook,
          isSampleData: c.isSampleData,
        },
        score: Math.max(65, 85 - idx * 2),
        breakdown: {
          interestAlignment: 0.75,
          skillAlignment: 0.7,
          goalAlignment: 0.7,
          educationCompatibility: 0.8,
        },
        reasons: [
          "High-growth livelihood sector with strong market demand across rural and semi-urban regions.",
          "Accessible progression pathways with government skilling and certification support.",
        ],
      }));

      return NextResponse.json({
        success: true,
        data: fallbackRecommended,
        total: fallbackRecommended.length,
        fallback: true,
      });
    } catch (fallbackError) {
      console.error("Critical error in recommend fallback:", fallbackError);
      return NextResponse.json(
        { success: false, error: "Failed to generate career recommendations" },
        { status: 500 }
      );
    }
  }
}
