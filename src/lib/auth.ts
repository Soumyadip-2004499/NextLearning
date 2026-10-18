import { cookies } from "next/headers";
import prisma from "@/lib/db";
import type { UserSession, UserRole } from "@/types";

export interface SessionResult {
  user: UserSession;
}

/**
 * Retrieves the current authenticated user session.
 * Supports NextAuth/Auth.js session tokens, custom session tokens,
 * role-specific cookies, and falls back to seeded demo users in demo mode.
 */
export async function getCurrentUser(preferredRole?: UserRole): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken =
      cookieStore.get("next-auth.session-token")?.value ||
      cookieStore.get("__Secure-next-auth.session-token")?.value ||
      cookieStore.get("nextlearning_session")?.value ||
      cookieStore.get("udaan_session")?.value;

    const roleCookie =
      cookieStore.get("nextlearning_role")?.value ||
      cookieStore.get("udaan_role")?.value;
    const userCookie =
      cookieStore.get("nextlearning_user")?.value ||
      cookieStore.get("udaan_user")?.value;

    if (sessionToken) {
      // Find session in database
      const session = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      });

      if (session && session.expires > new Date() && session.user) {
        return {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          role: session.user.role as UserRole,
          language: session.user.language,
          image: session.user.image,
        };
      }
    }

    if (userCookie) {
      const explicitUser = await prisma.user.findFirst({
        where: {
          OR: [{ id: userCookie }, { email: userCookie }],
        },
      });

      if (explicitUser) {
        return {
          id: explicitUser.id,
          name: explicitUser.name,
          email: explicitUser.email,
          role: explicitUser.role as UserRole,
          language: explicitUser.language,
          image: explicitUser.image,
        };
      }
    }

    // Role-specific check or preferred role
    const effectiveRole = preferredRole || (roleCookie as UserRole);

    if (effectiveRole === "FACILITATOR") {
      const facilitatorUser = await prisma.user.findFirst({
        where: { role: "FACILITATOR" },
      });
      if (facilitatorUser) {
        return {
          id: facilitatorUser.id,
          name: facilitatorUser.name,
          email: facilitatorUser.email,
          role: facilitatorUser.role as UserRole,
          language: facilitatorUser.language,
          image: facilitatorUser.image,
        };
      }
    }

    // In demo mode, fallback to seeded demo student from SQLite DB
    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
    if (isDemoMode) {
      // If roleCookie explicitly set to FACILITATOR
      if (roleCookie === "FACILITATOR") {
        const demoFacilitator = await prisma.user.findFirst({
          where: { email: "demo@teacher.com" },
        });
        if (demoFacilitator) {
          return {
            id: demoFacilitator.id,
            name: demoFacilitator.name,
            email: demoFacilitator.email,
            role: demoFacilitator.role as UserRole,
            language: demoFacilitator.language,
            image: demoFacilitator.image,
          };
        }
      }

      const demoUser = await prisma.user.findFirst({
        where: { email: "demo@student.com" },
      });

      if (demoUser) {
        return {
          id: demoUser.id,
          name: demoUser.name,
          email: demoUser.email,
          role: demoUser.role as UserRole,
          language: demoUser.language,
          image: demoUser.image,
        };
      }
    }

    return null;
  } catch (error) {
    console.error("Error retrieving current user:", error);
    return null;
  }
}

/**
 * Returns auth session object compatible with NextAuth auth() helper
 */
export async function auth(): Promise<SessionResult | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  return { user };
}

/**
 * NextAuth route handler placeholders
 */
export const handlers = {
  GET: async () => {
    const user = await getCurrentUser();
    return new Response(JSON.stringify({ user, status: "authenticated" }), {
      headers: { "Content-Type": "application/json" },
    });
  },
  POST: async () =>
    new Response(JSON.stringify({ status: "ok" }), {
      headers: { "Content-Type": "application/json" },
    }),
};

/**
 * Retrieves the current student profile record
 */
export async function getCurrentStudentProfile() {
  const user = await getCurrentUser();
  if (!user) return null;

  let profile = await prisma.studentProfile.findFirst({
    where: { userId: user.id },
  });

  if (!profile && process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    profile = await prisma.studentProfile.findFirst();
  }

  return profile;
}

