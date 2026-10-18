import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Routes that require authentication
const PROTECTED_ROUTES = [
  "/dashboard",
  "/careers",
  "/roadmap",
  "/opportunities",
  "/profile",
  "/facilitator",
];

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Check if current route requires authentication
  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtected) {
    const secret =
      process.env.AUTH_SECRET ||
      process.env.NEXTAUTH_SECRET ||
      "nextlearning-production-secret-key-change-in-production";

    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
    const hasSessionCookie =
      request.cookies.has("nextlearning_session") ||
      request.cookies.has("nextlearning_user") ||
      request.cookies.has("udaan_session") ||
      request.cookies.has("udaan_user") ||
      request.cookies.has("next-auth.session-token") ||
      request.cookies.has("__Secure-next-auth.session-token") ||
      request.cookies.has("authjs.session-token");

    if (!isDemoMode && !hasSessionCookie) {
      const token = await getToken({
        req: request,
        secret,
      });

      if (!token) {
        const loginUrl = new URL("/auth/login", request.url);
        const callbackUrl = `${pathname}${search}`;
        loginUrl.searchParams.set("callbackUrl", callbackUrl);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/careers/:path*",
    "/roadmap/:path*",
    "/opportunities/:path*",
    "/profile/:path*",
    "/facilitator/:path*",
  ],
};
