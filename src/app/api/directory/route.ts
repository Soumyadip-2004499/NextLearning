import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";


export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const type = searchParams.get("type");
    const search = searchParams.get("search")?.trim();
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get("pageSize") || "12", 10)));
    const skip = (page - 1) * pageSize;

    const where: Prisma.OrganizationWhereInput = {};

    if (type && type !== "all") {
      where.type = type;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { location: { contains: search } },
        { expertise: { contains: search } },
      ];
    }

    const [total, organizations] = await Promise.all([
      prisma.organization.count({ where }),
      prisma.organization.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: [{ verified: "desc" }, { name: "asc" }],
      }),
    ]);

    // Parse expertise JSON safely
    const formattedOrganizations = organizations.map((org) => {
      let expertiseList: string[] = [];
      if (org.expertise) {
        try {
          const parsed = JSON.parse(org.expertise);
          expertiseList = Array.isArray(parsed) ? parsed : [];
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
        location: org.location,
        serviceArea: org.serviceArea,
        contactUrl: org.contactUrl,
        website: org.website,
        verified: org.verified,
        isSampleData: org.isSampleData,
        createdAt: org.createdAt,
      };
    });

    const totalPages = Math.ceil(total / pageSize);

    return NextResponse.json({
      success: true,
      data: formattedOrganizations,
      total,
      page,
      pageSize,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching organizations directory:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve organization directory" },
      { status: 500 }
    );
  }
}
