import prisma from "@/lib/db";
import { ResourcesClient } from "@/app/(student)/resources/resources-client";

export default async function FacilitatorLearningResourcesPage() {
  const resources = await prisma.learningResource.findMany({
    orderBy: [{ isSampleData: "asc" }, { createdAt: "desc" }],
    take: 60,
  });

  const parseJsonArray = (val: string | null): string[] => {
    if (!val) return [];
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [val];
    } catch {
      return [val];
    }
  };

  const formattedResources = resources.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    provider: r.provider || "National Open Repository",
    resourceType: r.resourceType || "course",
    url: r.url || "#",
    language: r.language || "en",
    educationLevel: parseJsonArray(r.educationLevel),
    subjects: parseJsonArray(r.subjects),
    skills: parseJsonArray(r.skills),
    duration: r.duration || "Self-paced",
    difficulty: r.difficulty || "beginner",
    isSampleData: r.isSampleData,
    verifiedAt: r.verifiedAt ? r.verifiedAt.toISOString() : null,
  }));

  return (
    <div className="space-y-6">
      <ResourcesClient initialResources={formattedResources} />
    </div>
  );
}
