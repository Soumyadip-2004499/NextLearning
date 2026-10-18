import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAuthenticatedFacilitator } from "@/lib/facilitator-auth";
import { z } from "zod";


interface RouteParams {
  params: Promise<{ id: string }>;
}

const addLessonSchema = z.object({
  title: z.string().min(2, "Lesson title must be at least 2 characters").max(200),
  content: z.string().optional().nullable(),
  resourceUrl: z.string().url("Resource URL must be a valid URL").optional().nullable().or(z.literal("")),
  duration: z.string().max(100).optional().nullable(),
  activityType: z.enum(["lesson", "quiz", "activity", "assignment"]).optional().default("lesson"),
});

const updateOrderSchema = z.object({
  orders: z.array(
    z.object({
      id: z.string().min(1),
      order: z.number().int().nonnegative(),
    })
  ).min(1, "Orders array cannot be empty"),
});

export async function POST(
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

    // Verify module belongs to facilitator
    const moduleRecord = await prisma.trainingModule.findFirst({
      where: {
        id: moduleId,
        facilitatorId,
      },
      include: {
        lessons: {
          select: { order: true },
          orderBy: { order: "desc" },
          take: 1,
        },
      },
    });

    if (!moduleRecord) {
      return NextResponse.json(
        { success: false, error: "Module not found or not owned by you" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validation = addLessonSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.issues[0]?.message || "Invalid lesson data",
        },
        { status: 400 }
      );
    }

    const { title, content, resourceUrl, duration, activityType } = validation.data;

    // Compute next order index
    const highestOrder = moduleRecord.lessons[0]?.order ?? 0;
    const nextOrder = highestOrder + 1;

    const newLesson = await prisma.moduleLesson.create({
      data: {
        moduleId,
        order: nextOrder,
        title,
        content: content?.trim() || null,
        resourceUrl: resourceUrl && resourceUrl.trim() !== "" ? resourceUrl.trim() : null,
        duration: duration?.trim() || null,
        activityType,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Lesson added successfully",
        data: newLesson,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating lesson:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add lesson" },
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

    // Verify module belongs to facilitator
    const moduleRecord = await prisma.trainingModule.findFirst({
      where: {
        id: moduleId,
        facilitatorId,
      },
    });

    if (!moduleRecord) {
      return NextResponse.json(
        { success: false, error: "Module not found or not owned by you" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validation = updateOrderSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.issues[0]?.message || "Invalid order payload",
        },
        { status: 400 }
      );
    }

    const { orders } = validation.data;

    // Run order updates in transaction
    await prisma.$transaction(
      orders.map((item) =>
        prisma.moduleLesson.updateMany({
          where: {
            id: item.id,
            moduleId,
          },
          data: {
            order: item.order,
          },
        })
      )
    );

    const reorderedLessons = await prisma.moduleLesson.findMany({
      where: { moduleId },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({
      success: true,
      message: "Lesson order updated successfully",
      data: reorderedLessons,
    });
  } catch (error) {
    console.error("Error updating lesson order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update lesson order" },
      { status: 500 }
    );
  }
}
