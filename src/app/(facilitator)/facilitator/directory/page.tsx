import prisma from "@/lib/db";
import { DirectoryClient } from "@/app/(student)/directory/directory-client";

export default async function FacilitatorDirectoryPage() {
  const organizations = await prisma.organization.findMany({
    orderBy: [{ verified: "desc" }, { name: "asc" }],
    take: 50,
  });

  const formattedOrgs = organizations.map((org) => {
    let expertiseList: string[] = [];
    if (org.expertise) {
      try {
        const parsed = JSON.parse(org.expertise);
        expertiseList = Array.isArray(parsed) ? parsed : [org.expertise];
      } catch {
        expertiseList = [org.expertise];
      }
    }

    return {
      id: org.id,
      name: org.name,
      type: org.type,
      description: org.description,
      expertise: expertiseList,
      location: org.location || "Pan-India",
      serviceArea: org.serviceArea,
      contactUrl: org.contactUrl,
      website: org.website,
      verified: org.verified,
      isSampleData: org.isSampleData,
    };
  });

  return (
    <div className="space-y-6">
      <DirectoryClient initialOrganizations={formattedOrgs} />
    </div>
  );
}
