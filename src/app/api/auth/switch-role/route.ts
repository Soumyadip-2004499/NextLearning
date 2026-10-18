import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const targetRole = body.role === "FACILITATOR" ? "FACILITATOR" : "STUDENT";

    // If attempting to switch to FACILITATOR, verify password-authenticated session
    if (targetRole === "FACILITATOR") {
      const currentUser = await getCurrentUser();
      
      // If user is not already an authenticated facilitator, block unauthorized role escalation
      if (!currentUser || currentUser.role !== "FACILITATOR") {
        return NextResponse.json(
          {
            success: false,
            error:
              "Facilitator access requires password authentication. Please sign in with your facilitator credentials.",
            redirectTo: "/auth/login?role=facilitator&callbackUrl=/facilitator",
          },
          { status: 403 }
        );
      }
    }

    // Only allow verified switching to Student mode for logged-in facilitators
    const destination = targetRole === "FACILITATOR" ? "/facilitator" : "/dashboard";
    const targetEmail = targetRole === "FACILITATOR" ? "demo@teacher.com" : "demo@student.com";

    const response = NextResponse.json({
      success: true,
      role: targetRole,
      redirectTo: destination,
    });

    const cookieOptions = {
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
    };

    response.cookies.set("nextlearning_role", targetRole, cookieOptions);
    response.cookies.set("nextlearning_user", targetEmail, cookieOptions);
    response.cookies.set("udaan_role", targetRole, cookieOptions);
    response.cookies.set("udaan_user", targetEmail, cookieOptions);

    return response;
  } catch (error) {
    console.error("Error in /api/auth/switch-role:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
