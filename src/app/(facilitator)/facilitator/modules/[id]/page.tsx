import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/db";
import { getAuthenticatedFacilitator } from "@/lib/facilitator-auth";
import { ModuleEditorClient } from "./module-editor-client";


interface ModuleEditorPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function FacilitatorModuleEditorPage({
  params,
}: ModuleEditorPageProps) {
  const auth = await getAuthenticatedFacilitator();
  if (!auth.user || auth.error || !auth.facilitatorProfile) {
    redirect("/auth/login?callbackUrl=/facilitator/modules");
  }

  const { id: moduleId } = await params;
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
    notFound();
  }

  const parseJsonArray = (val: string | null): string[] => {
    if (!val) return [];
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const initialModule = {
    id: moduleRecord.id,
    title: moduleRecord.title,
    description: moduleRecord.description || "",
    targetLevel: moduleRecord.targetLevel || "class_10",
    objectives: parseJsonArray(moduleRecord.objectives),
    status: moduleRecord.status,
    accessType: moduleRecord.accessType,
    estimatedDuration: moduleRecord.estimatedDuration || "",
    createdAt: moduleRecord.createdAt.toISOString(),
    updatedAt: moduleRecord.updatedAt.toISOString(),
    lessons: moduleRecord.lessons.map((l) => ({
      id: l.id,
      moduleId: l.moduleId,
      order: l.order,
      title: l.title,
      content: l.content || "",
      resourceUrl: l.resourceUrl || "",
      duration: l.duration || "",
      activityType: l.activityType || "lesson",
      createdAt: l.createdAt.toISOString(),
    })),
  };

  return (
    <ModuleEditorClient
      initialModule={initialModule}
      initialLessons={initialModule.lessons}
    />
  );
}
