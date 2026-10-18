import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { RoadmapDetailView } from "@/components/roadmap/roadmap-detail-view";

interface RoadmapDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: RoadmapDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const roadmap = await prisma.learningRoadmap.findUnique({
    where: { id },
    select: { careerTitle: true },
  });

  return {
    title: roadmap ? `${roadmap.careerTitle} Roadmap | NextLearning` : "Roadmap Details | NextLearning",
    description: `Track and complete your step-by-step milestones for ${
      roadmap?.careerTitle || "your chosen career"
    }.`,
  };
}

export default async function RoadmapDetailPage({ params }: RoadmapDetailPageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const roadmap = await prisma.learningRoadmap.findUnique({
    where: { id },
    include: {
      steps: {
        orderBy: { order: "asc" },
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
          displayName: true,
          educationLevel: true,
        },
      },
    },
  });

  if (!roadmap) {
    notFound();
  }

  return (
    <RoadmapDetailView
      initialRoadmap={{
        id: roadmap.id,
        careerTitle: roadmap.careerTitle,
        description: roadmap.description,
        status: roadmap.status,
        createdAt: roadmap.createdAt.toISOString(),
        updatedAt: roadmap.updatedAt.toISOString(),
        student: roadmap.student,
        steps: roadmap.steps.map((s) => ({
          id: s.id,
          order: s.order,
          title: s.title,
          description: s.description,
          type: s.type,
          status: s.status,
          duration: s.duration,
          completedAt: s.completedAt ? s.completedAt.toISOString() : null,
          resourceId: s.resourceId,
          resource: s.resource,
        })),
      }}
    />
  );
}
