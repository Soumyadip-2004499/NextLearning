import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAuthenticatedFacilitator } from "@/lib/facilitator-auth";
import { z } from "zod";


interface RouteParams {
  params: Promise<{ id: string }>;
}

const updateModuleSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(150).optional(),
  description: z.string().max(2000).optional().nullable(),
  targetLevel: z.string().optional().nullable(),
  objectives: z.array(z.string()).optional(),
  accessType: z.enum(["free", "paid"]).optional(),
  estimatedDuration: z.string().max(100).optional().nullable(),
  status: z.enum(["draft", "published", "archived"]).optional(),
});

export async function GET(
  _request: NextRequest,
  context: RouteParams
) {
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

    const { id: moduleId } = await context.params;
    const facilitatorId = auth.facilitatorProfile.id;

    const moduleRecord = await prisma.trainingModule.findFirst({
      where: {
        id: moduleId,
        facilitatorId,
      },
      include: {
        lessons: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!moduleRecord) {
      return NextResponse.json(
        { success: false, error: "Training module not found" },
        { status: 404 }
      );
    }

    const parseObjectives = (val: string | null): string[] => {
      if (!val) return [];
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    };

    return NextResponse.json({
      success: true,
      data: {
        ...moduleRecord,
        objectives: parseObjectives(moduleRecord.objectives),
        lessonCount: moduleRecord.lessons.length,
      },
    });
  } catch (error) {
    console.error("Error fetching module:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve training module" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteParams
) {
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

    const { id: moduleId } = await context.params;
    const facilitatorId = auth.facilitatorProfile.id;

    // Check ownership
    const existing = await prisma.trainingModule.findFirst({
      where: {
        id: moduleId,
        facilitatorId,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Module not found or not owned by you" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validation = updateModuleSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.issues[0]?.message || "Invalid update data",
        },
        { status: 400 }
      );
    }

    const dataToUpdate: {
      title?: string;
      description?: string | null;
      targetLevel?: string | null;
      objectives?: string;
      accessType?: string;
      estimatedDuration?: string | null;
      status?: string;
    } = {};

    if (validation.data.title !== undefined) dataToUpdate.title = validation.data.title;
    if (validation.data.description !== undefined) dataToUpdate.description = validation.data.description;
    if (validation.data.targetLevel !== undefined) dataToUpdate.targetLevel = validation.data.targetLevel;
    if (validation.data.objectives !== undefined) {
      dataToUpdate.objectives = JSON.stringify(validation.data.objectives);
    }
    if (validation.data.accessType !== undefined) dataToUpdate.accessType = validation.data.accessType;
    if (validation.data.estimatedDuration !== undefined) {
      dataToUpdate.estimatedDuration = validation.data.estimatedDuration;
    }
    if (validation.data.status !== undefined) dataToUpdate.status = validation.data.status;

    const updated = await prisma.trainingModule.update({
      where: { id: moduleId },
      data: dataToUpdate,
      include: {
        lessons: {
          orderBy: { order: "asc" },
        },
      },
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

    return NextResponse.json({
      success: true,
      message: "Training module updated successfully",
      data: {
        ...updated,
        objectives: parseObjectives(updated.objectives),
        lessonCount: updated.lessons.length,
      },
    });
  } catch (error) {
    console.error("Error updating module:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update training module" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteParams
) {
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

    const { id: moduleId } = await context.params;
    const facilitatorId = auth.facilitatorProfile.id;

    // Verify ownership
    const existing = await prisma.trainingModule.findFirst({
      where: {
        id: moduleId,
        facilitatorId,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Module not found or not owned by you" },
        { status: 404 }
      );
    }

    await prisma.trainingModule.delete({
      where: { id: moduleId },
    });

    return NextResponse.json({
      success: true,
      message: "Training module and associated lessons deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting module:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete training module" },
      { status: 500 }
    );
  }
}
