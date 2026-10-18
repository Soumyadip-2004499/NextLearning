import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { getCurrentStudentProfile } from "@/lib/auth";
import { parseJsonField } from "@/lib/utils";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const applySchema = z.object({
  status: z
    .enum([
      "interested",
      "checking_eligibility",
      "preparing_documents",
      "ready_to_apply",
      "submitted",
      "awaiting_response",
      "completed",
      "closed",
    ])
    .default("interested"),
  notes: z.string().optional().nullable(),
  nextAction: z.string().optional().nullable(),
});

const patchSchema = z.object({
  status: z
    .enum([
      "interested",
      "checking_eligibility",
      "preparing_documents",
      "ready_to_apply",
      "submitted",
      "awaiting_response",
      "completed",
      "closed",
    ])
    .optional(),
  notes: z.string().optional().nullable(),
  nextAction: z.string().optional().nullable(),
});

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id: opportunityId } = await params;
    const student = await getCurrentStudentProfile();

    if (!student) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const record = await prisma.applicationRecord.findUnique({
      where: {
        studentId_opportunityId: {
          studentId: student.id,
          opportunityId,
        },
      },
      include: {
        opportunity: true,
      },
    });

    if (!record) {
      return NextResponse.json({
        success: true,
        data: null,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: record.id,
        opportunityId: record.opportunityId,
        opportunityTitle: record.opportunity.title,
        status: record.status,
        notes: record.notes,
        nextAction: record.nextAction,
        statusHistory: parseJsonField<unknown[]>(record.statusHistory, []),
        createdAt: record.createdAt.toISOString(),
        updatedAt: record.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("GET /api/opportunities/[id]/apply error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch application record" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id: opportunityId } = await params;
    const student = await getCurrentStudentProfile();

    if (!student) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const opportunity = await prisma.opportunity.findUnique({
      where: { id: opportunityId },
    });

    if (!opportunity) {
      return NextResponse.json(
        { success: false, error: "Opportunity not found" },
        { status: 404 }
      );
    }

    let parsedBody = {};
    try {
      parsedBody = await req.json();
    } catch {
      // Empty body is allowed, defaults applied
    }

    const validation = applySchema.safeParse(parsedBody);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validation.error.format() },
        { status: 400 }
      );
    }

    const { status, notes, nextAction } = validation.data;

    // Check existing record
    const existing = await prisma.applicationRecord.findUnique({
      where: {
        studentId_opportunityId: {
          studentId: student.id,
          opportunityId,
        },
      },
    });

    const initialHistory = [
      {
        status,
        date: new Date().toISOString(),
        note: notes || "Started tracking opportunity",
      },
    ];

    let record;
    if (existing) {
      const prevHistory = parseJsonField<{ status: string; date: string; note?: string }[]>(
        existing.statusHistory,
        []
      );

      const updatedHistory = [
        ...prevHistory,
        {
          status,
          date: new Date().toISOString(),
          note: notes || undefined,
        },
      ];

      record = await prisma.applicationRecord.update({
        where: { id: existing.id },
        data: {
          status,
          notes: notes !== undefined ? notes : existing.notes,
          nextAction: nextAction !== undefined ? nextAction : existing.nextAction,
          statusHistory: JSON.stringify(updatedHistory),
        },
      });
    } else {
      record = await prisma.applicationRecord.create({
        data: {
          studentId: student.id,
          opportunityId,
          status,
          notes,
          nextAction,
          statusHistory: JSON.stringify(initialHistory),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Application tracked successfully",
      data: {
        id: record.id,
        opportunityId: record.opportunityId,
        status: record.status,
        notes: record.notes,
        nextAction: record.nextAction,
        statusHistory: parseJsonField<unknown[]>(record.statusHistory, []),
        updatedAt: record.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("POST /api/opportunities/[id]/apply error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to track application" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id: opportunityId } = await params;
    const student = await getCurrentStudentProfile();

    if (!student) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validation = patchSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validation.error.format() },
        { status: 400 }
      );
    }

    const { status, notes, nextAction } = validation.data;

    let record = await prisma.applicationRecord.findUnique({
      where: {
        studentId_opportunityId: {
          studentId: student.id,
          opportunityId,
        },
      },
    });

    if (!record) {
      // If not yet existing, create new record
      const initialHistory = [
        {
          status: status || "interested",
          date: new Date().toISOString(),
          note: notes || "Started application tracker",
        },
      ];

      record = await prisma.applicationRecord.create({
        data: {
          studentId: student.id,
          opportunityId,
          status: status || "interested",
          notes,
          nextAction,
          statusHistory: JSON.stringify(initialHistory),
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          id: record.id,
          opportunityId: record.opportunityId,
          status: record.status,
          notes: record.notes,
          nextAction: record.nextAction,
          statusHistory: initialHistory,
          updatedAt: record.updatedAt.toISOString(),
        },
      });
    }

    // Append history entry if status or note changed
    const prevHistory = parseJsonField<{ status: string; date: string; note?: string }[]>(
      record.statusHistory,
      []
    );

    const historyEntry = {
      status: status || record.status,
      date: new Date().toISOString(),
      note: notes || record.notes || undefined,
    };

    const updatedHistory = [...prevHistory, historyEntry];

    const updatedRecord = await prisma.applicationRecord.update({
      where: { id: record.id },
      data: {
        ...(status ? { status } : {}),
        ...(notes !== undefined ? { notes } : {}),
        ...(nextAction !== undefined ? { nextAction } : {}),
        statusHistory: JSON.stringify(updatedHistory),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Application status updated",
      data: {
        id: updatedRecord.id,
        opportunityId: updatedRecord.opportunityId,
        status: updatedRecord.status,
        notes: updatedRecord.notes,
        nextAction: updatedRecord.nextAction,
        statusHistory: updatedHistory,
        updatedAt: updatedRecord.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("PATCH /api/opportunities/[id]/apply error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update application" },
      { status: 500 }
    );
  }
}
