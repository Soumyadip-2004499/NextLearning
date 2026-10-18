import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { getAuthenticatedFacilitator } from "@/lib/facilitator-auth";
import { ModulesListClient } from "./modules-list-client";


export const dynamic = "force-dynamic";

export default async function FacilitatorModulesPage() {
  const auth = await getAuthenticatedFacilitator();
  if (!auth.user || auth.error || !auth.facilitatorProfile) {
    redirect("/auth/login?callbackUrl=/facilitator/modules");
  }

  const facilitatorId = auth.facilitatorProfile.id;

  const modules = await prisma.trainingModule.findMany({
    where: { facilitatorId },
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

  const parseJsonArray = (val: string | null): string[] => {
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
    targetLevel: m.targetLevel || "Open to All",
    objectives: parseJsonArray(m.objectives),
    status: m.status,
    accessType: m.accessType,
    estimatedDuration: m.estimatedDuration || "Self-paced",
    lessonCount: m._count.lessons,
    createdAt: m.createdAt.toISOString(),
    updatedAt: m.updatedAt.toISOString(),
  }));

  return <ModulesListClient initialModules={formattedModules} />;
}
