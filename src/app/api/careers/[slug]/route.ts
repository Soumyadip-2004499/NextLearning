import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseJsonField } from "@/lib/utils";
import { CareerCard, CareerDetail } from "@/types";

export interface CareerSkillInfo {
  id: string;
  name: string;
  category: string;
  description: string | null;
  importance: string;
}

export interface CareerDetailResponse extends CareerDetail {
  relatedCareersData: CareerCard[];
  relatedSkills: CareerSkillInfo[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Career slug is required" },
        { status: 400 }
      );
    }

    const career = await prisma.career.findUnique({
      where: { slug },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });

    if (!career) {
      return NextResponse.json(
        { success: false, error: "Career not found" },
        { status: 404 }
      );
    }

    const parsedRelatedSlugs = parseJsonField<string[]>(career.relatedCareers, []);

    // Fetch related careers records
    const relatedCareersRecords = await prisma.career.findMany({
      where: {
        OR: [
          { slug: { in: parsedRelatedSlugs } },
          { category: career.category, id: { not: career.id } },
        ],
      },
      take: 4,
    });

    const relatedCareersData: CareerCard[] = relatedCareersRecords.map((rc) => ({
      id: rc.id,
      title: rc.title,
      slug: rc.slug,
      category: rc.category,
      description: rc.description,
      requiredSkills: parseJsonField<string[]>(rc.requiredSkills, []),
      isSampleData: rc.isSampleData,
    }));

    const relatedSkills: CareerSkillInfo[] = career.skills.map((cs) => ({
      id: cs.skill.id,
      name: cs.skill.name,
      category: cs.skill.category,
      description: cs.skill.description,
      importance: cs.importance,
    }));

    const careerDetail: CareerDetailResponse = {
      id: career.id,
      title: career.title,
      slug: career.slug,
      category: career.category,
      description: career.description,
      requiredSkills: parseJsonField<string[]>(career.requiredSkills, []),
      requiredQualifications: parseJsonField<string[]>(career.requiredQualifications, []),
      salaryRange: career.salaryRange,
      demandLevel: career.demandLevel,
      growthOutlook: career.growthOutlook,
      firstSteps: parseJsonField<string[]>(career.firstSteps, []),
      educationPaths: parseJsonField<string[]>(career.educationPaths, []),
      relatedCareers: parsedRelatedSlugs,
      sourceUrl: career.sourceUrl,
      isSampleData: career.isSampleData,
      relatedCareersData,
      relatedSkills,
    };

    return NextResponse.json({
      success: true,
      data: careerDetail,
    });
  } catch (error) {
    console.error("Error in GET /api/careers/[slug]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve career detail" },
      { status: 500 }
    );
  }
}
