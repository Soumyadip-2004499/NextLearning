import { auth } from "./auth";
import { redirect } from "next/navigation";
import type { UserRole } from "@/types";

export interface CurrentUser {
  id: string;
  name: string | null;
  email: string | null;
  role: UserRole;
  language: string;
  image: string | null;
}

/**
 * Retrieves the current authenticated user's session data server-side.
 * Returns null if the user is not authenticated.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const session = await auth();

    if (!session?.user) {
      return null;
    }

    const sessionUser = session.user as {
      id?: string;
      userId?: string;
      name?: string | null;
      email?: string | null;
      role?: UserRole | string;
      language?: string;
      image?: string | null;
    };

    const userId = sessionUser.userId || sessionUser.id;
    if (!userId) {
      return null;
    }

    return {
      id: userId,
      name: sessionUser.name ?? null,
      email: sessionUser.email ?? null,
      role: (sessionUser.role as UserRole) || "STUDENT",
      language: sessionUser.language || "en",
      image: sessionUser.image ?? null,
    };
  } catch (error) {
    console.error("Error retrieving user session:", error);
    return null;
  }
}

/**
 * Server-side guard requiring an authenticated session.
 * Redirects to the login page if not logged in.
 */
export async function requireAuth(
  redirectTo: string = "/auth/login"
): Promise<CurrentUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect(redirectTo);
  }

  return user;
}

/**
 * Server-side guard requiring a specific role (e.g. 'STUDENT', 'FACILITATOR', 'ADMIN').
 * Throws or redirects to dashboard if the user's role does not match.
 */
export async function requireRole(
  role: string,
  redirectTo: string = "/auth/login"
): Promise<CurrentUser> {
  const user = await requireAuth(redirectTo);

  if (user.role !== role) {
    redirect("/dashboard");
  }

  return user;
}
