import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const sessionToken = req.cookies.get("nextlearning_session")?.value || req.cookies.get("udaan_session")?.value;
    if (sessionToken) {
      await prisma.session
        .deleteMany({
          where: { sessionToken },
        })
        .catch(() => {});
    }

    const response = NextResponse.json({
      success: true,
      redirectTo: "/auth/login",
    });

    const clearOptions = {
      path: "/",
      maxAge: 0,
      expires: new Date(0),
    };

    response.cookies.set("nextlearning_session", "", clearOptions);
    response.cookies.set("udaan_session", "", clearOptions);
    response.cookies.set("next-auth.session-token", "", clearOptions);
    response.cookies.set("__Secure-next-auth.session-token", "", clearOptions);
    response.cookies.set("authjs.session-token", "", clearOptions);
    response.cookies.set("nextlearning_user", "", clearOptions);
    response.cookies.set("udaan_user", "", clearOptions);
    response.cookies.set("nextlearning_role", "", clearOptions);
    response.cookies.set("udaan_role", "", clearOptions);

    return response;
  } catch (error) {
    console.error("Logout error in /api/auth/logout:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const res = await POST(req);
  return NextResponse.redirect(new URL("/auth/login", req.url));
}
