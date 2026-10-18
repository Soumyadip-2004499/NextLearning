import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { cookies } from "next/headers";

export interface AuthenticatedFacilitatorResult {
  error: "unauthenticated" | "unauthorized" | null;
  status?: number;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    role: string;
    language: string;
    image: string | null;
  } | null;
  facilitatorProfile: {
    id: string;
    userId: string;
    displayName: string | null;
    organization: string | null;
    expertise: string | null;
    state: string | null;
    district: string | null;
    verifiedAt: Date | null;
  } | null;
}

/**
 * Server-side helper to verify facilitator authentication and retrieve the facilitator profile.
 * Strictly enforces that students cannot access the facilitator portal without facilitator credentials.
 */
export async function getAuthenticatedFacilitator(): Promise<AuthenticatedFacilitatorResult> {
  const cookieStore = await cookies();
  const roleCookie =
    cookieStore.get("nextlearning_role")?.value ||
    cookieStore.get("udaan_role")?.value;
  const userCookie =
    cookieStore.get("nextlearning_user")?.value ||
    cookieStore.get("udaan_user")?.value;

  let user = await getCurrentUser();

  // If currently authenticated as a student, strictly deny access to the facilitator account
  if (user && user.role === "STUDENT") {
    return {
      error: "unauthorized",
      status: 403,
      user,
      facilitatorProfile: null,
    };
  }

  // If role cookie is explicitly STUDENT, block facilitator access
  if (roleCookie === "STUDENT") {
    return {
      error: "unauthorized",
      status: 403,
      user: null,
      facilitatorProfile: null,
    };
  }

  // If user is not yet in next-auth session but has valid facilitator credentials cookie
  if (!user && (roleCookie === "FACILITATOR" || userCookie === "demo@teacher.com")) {
    const teacherEmail = userCookie || "demo@teacher.com";
    const teacher = await prisma.user.findFirst({
      where: { email: teacherEmail },
    });
    if (teacher && teacher.role === "FACILITATOR") {
      user = {
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        role: "FACILITATOR",
        language: teacher.language,
        image: teacher.image,
      };
    }
  }

  if (!user) {
    return {
      error: "unauthenticated",
      status: 401,
      user: null,
      facilitatorProfile: null,
    };
  }

  if (user.role !== "FACILITATOR") {
    return {
      error: "unauthorized",
      status: 403,
      user,
      facilitatorProfile: null,
    };
  }

  let profile = await prisma.facilitatorProfile.findUnique({
    where: { userId: user.id },
  });

  // If user is demo facilitator account, resolve to the canonical G. Sai Kavya profile
  if (user.email === "demo@teacher.com" || user.name?.includes("Kavya")) {
    const canonicalKavya = await prisma.user.findFirst({
      where: { email: "kavya@facilitator.com" },
      include: { facilitatorProfile: true },
    });
    if (canonicalKavya?.facilitatorProfile) {
      profile = canonicalKavya.facilitatorProfile;
    }
  }

  if (!profile) {
    profile = await prisma.facilitatorProfile.create({
      data: {
        userId: user.id,
        displayName: user.name || "G. Sai Kavya",
        organization: "Pratham Rural Career Guidance Center",
        expertise: JSON.stringify([
          "Career Counseling",
          "Vocational Guidance",
          "Scholarship Navigation",
        ]),
        state: "Andhra Pradesh",
        district: "Anantapur",
        verifiedAt: new Date(),
      },
    });
  }

  return {
    error: null,
    user,
    facilitatorProfile: profile,
  };
}
