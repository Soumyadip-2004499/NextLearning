import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/roadmap/[id]
 * Fetch a specific learning roadmap with all associated steps ordered by sequence.
 */
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: 'Roadmap ID is required.' },
        { status: 400 }
      );
    }

    const roadmap = await prisma.learningRoadmap.findUnique({
      where: { id },
      include: {
        steps: {
          orderBy: { order: 'asc' },
          include: {
            resource: {
              select: {
                id: true,
                title: true,
                url: true,
                resourceType: true,
                duration: true,
              },
            },
          },
        },
        student: {
          select: {
            id: true,
            displayName: true,
            educationLevel: true,
            district: true,
            state: true,
          },
        },
      },
    });

    if (!roadmap) {
      return NextResponse.json(
        { error: 'Roadmap not found.' },
        { status: 404 }
      );
    }

    // Calculate progress summary
    const totalSteps = roadmap.steps.length;
    const completedSteps = roadmap.steps.filter((s) => s.status === 'completed').length;
    const inProgressSteps = roadmap.steps.filter((s) => s.status === 'in_progress').length;
    const progressPercentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

    return NextResponse.json({
      success: true,
      data: {
        ...roadmap,
        progress: {
          total: totalSteps,
          completed: completedSteps,
          inProgress: inProgressSteps,
          percentage: progressPercentage,
        },
      },
    });
  } catch (error: unknown) {
    console.error('GET /api/roadmap/[id] error:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch roadmap';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * PATCH /api/roadmap/[id]
 * Update a step's status (pending, in_progress, completed, skipped) or the roadmap's status.
 */
export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { stepId, status, roadmapStatus } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Roadmap ID is required.' },
        { status: 400 }
      );
    }

    // Check that roadmap exists
    const existingRoadmap = await prisma.learningRoadmap.findUnique({
      where: { id },
      include: { steps: true },
    });

    if (!existingRoadmap) {
      return NextResponse.json(
        { error: 'Roadmap not found.' },
        { status: 404 }
      );
    }

    // Handle single step update
    if (stepId) {
      const validStatuses = ['pending', 'in_progress', 'completed', 'skipped'];
      if (!status || !validStatuses.includes(status)) {
        return NextResponse.json(
          { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
          { status: 400 }
        );
      }

      const existingStep = existingRoadmap.steps.find((s) => s.id === stepId);
      if (!existingStep) {
        return NextResponse.json(
          { error: 'Step not found in this roadmap.' },
          { status: 404 }
        );
      }

      const updatedStep = await prisma.roadmapStep.update({
        where: { id: stepId },
        data: {
          status,
          completedAt: status === 'completed' ? new Date() : null,
        },
      });

      // Check if all steps are now completed
      const allSteps = await prisma.roadmapStep.findMany({
        where: { roadmapId: id },
      });
      const allCompleted = allSteps.every((s) => s.status === 'completed');

      if (allCompleted && existingRoadmap.status !== 'completed') {
        await prisma.learningRoadmap.update({
          where: { id },
          data: { status: 'completed' },
        });
      } else if (!allCompleted && existingRoadmap.status === 'completed') {
        await prisma.learningRoadmap.update({
          where: { id },
          data: { status: 'active' },
        });
      }

      return NextResponse.json({
        success: true,
        data: updatedStep,
        message: `Step marked as ${status}.`,
      });
    }

    // Handle overall roadmap status update
    if (roadmapStatus) {
      const updatedRoadmap = await prisma.learningRoadmap.update({
        where: { id },
        data: { status: roadmapStatus },
        include: {
          steps: {
            orderBy: { order: 'asc' },
          },
        },
      });

      return NextResponse.json({
        success: true,
        data: updatedRoadmap,
        message: `Roadmap status updated to ${roadmapStatus}.`,
      });
    }

    return NextResponse.json(
      { error: 'Provide stepId & status, or roadmapStatus in request body.' },
      { status: 400 }
    );
  } catch (error: unknown) {
    console.error('PATCH /api/roadmap/[id] error:', error);
    const message = error instanceof Error ? error.message : 'Failed to update roadmap';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
