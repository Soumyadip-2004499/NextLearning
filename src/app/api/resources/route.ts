import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";


export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const language = searchParams.get("language");
    const level = searchParams.get("level");
    const subject = searchParams.get("subject");
    const type = searchParams.get("type");
    const provider = searchParams.get("provider");
    const search = searchParams.get("search")?.trim();
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get("pageSize") || "12", 10)));
    const skip = (page - 1) * pageSize;

    const where: Prisma.LearningResourceWhereInput = {};

    if (language && language !== "all") {
      where.language = language;
    }

    if (type && type !== "all") {
      where.resourceType = type;
    }

    if (provider && provider !== "all") {
      where.provider = { contains: provider };
    }

    if (level && level !== "all") {
      where.educationLevel = { contains: level };
    }

    if (subject && subject !== "all") {
      where.subjects = { contains: subject };
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { provider: { contains: search } },
        { subjects: { contains: search } },
        { skills: { contains: search } },
      ];
    }

    const [total, resources] = await Promise.all([
      prisma.learningResource.count({ where }),
      prisma.learningResource.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: [{ isSampleData: "asc" }, { createdAt: "desc" }],
      }),
    ]);

    const parseJsonArray = (val: string | null): string[] => {
      if (!val) return [];
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [val];
      }
    };

    const formattedResources = resources.map((res) => ({
      id: res.id,
      title: res.title,
      description: res.description,
      provider: res.provider,
      resourceType: res.resourceType,
      url: res.url,
      language: res.language,
      educationLevel: parseJsonArray(res.educationLevel),
      subjects: parseJsonArray(res.subjects),
      skills: parseJsonArray(res.skills),
      duration: res.duration,
      difficulty: res.difficulty,
      isSampleData: res.isSampleData,
      verifiedAt: res.verifiedAt,
      createdAt: res.createdAt,
    }));

    const totalPages = Math.ceil(total / pageSize);

    return NextResponse.json({
      success: true,
      data: formattedResources,
      total,
      page,
      pageSize,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching learning resources:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve learning resources" },
      { status: 500 }
    );
  }
}
