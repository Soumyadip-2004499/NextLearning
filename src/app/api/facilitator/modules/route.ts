import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAuthenticatedFacilitator } from "@/lib/facilitator-auth";
import { z } from "zod";


const createModuleSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(150, "Title is too long"),
  description: z.string().max(2000, "Description is too long").optional().nullable(),
  targetLevel: z.string().optional().nullable(),
  objectives: z.array(z.string().min(1)).optional().default([]),
  accessType: z.enum(["free", "paid"]).optional().default("free"),
  estimatedDuration: z.string().max(100).optional().nullable(),
  status: z.enum(["draft", "published", "archived"]).optional().default("draft"),
});

export async function GET(request: NextRequest) {
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
    const searchParams = request.nextUrl.searchParams;
    const statusFilter = searchParams.get("status");

    const whereClause: { facilitatorId: string; status?: string } = {
      facilitatorId,
    };
    if (statusFilter && statusFilter !== "all") {
      whereClause.status = statusFilter;
    }

    const modules = await prisma.trainingModule.findMany({
      where: whereClause,
      include: {
        _count: {
          select: { lessons: true },
        },
        lessons: {
          select: {
            id: true,
            title: true,
            duration: true,
            activityType: true,
            order: true,
          },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const parseObjectives = (val: string | null): string[] => {
      if (!val) return [];
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    };

    const formattedModules = modules.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      targetLevel: m.targetLevel,
      objectives: parseObjectives(m.objectives),
      status: m.status,
      accessType: m.accessType,
      estimatedDuration: m.estimatedDuration,
      lessonCount: m._count.lessons,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
      lessons: m.lessons,
    }));

    return NextResponse.json({
      success: true,
      data: formattedModules,
      count: formattedModules.length,
    });
  } catch (error) {
    console.error("Error fetching modules:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch training modules" },
      { status: 500 }
    );
  }
}

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

    const validation = createModuleSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.issues[0]?.message || "Invalid module data",
        },
        { status: 400 }
      );
    }

    const {
      title,
      description,
      targetLevel,
      objectives,
      accessType,
      estimatedDuration,
      status,
    } = validation.data;

    const newModule = await prisma.trainingModule.create({
      data: {
        facilitatorId,
        title,
        description: description?.trim() || null,
        targetLevel: targetLevel?.trim() || null,
        objectives: objectives ? JSON.stringify(objectives) : "[]",
        accessType,
        estimatedDuration: estimatedDuration?.trim() || null,
        status,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Training module created successfully",
        data: {
          ...newModule,
          objectives,
          lessonCount: 0,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating training module:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create training module" },
      { status: 500 }
    );
  }
}
