import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import crypto from "crypto";

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please provide a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const DEMO_PASSWORD_HASH = "$2b$10$3euPFOt1xJgA5m.Yj6YpcuY0fF2Qc2o5eYk8Fv8O/i0/v9Q5b8qGu";

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Validation failed";
      return NextResponse.json(
        { success: false, error: firstError },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    // Find user in database by email
    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password. Please verify your credentials.",
        },
        { status: 401 }
      );
    }

    // Verify password:
    // 1. Direct password match (for registered prototype accounts or updated passwords)
    // 2. Demo password 'demo1234' for seeded demo accounts
    // 3. Match against DEMO_PASSWORD_HASH
    const isPasswordValid =
      user.passwordHash === password ||
      (password === "demo1234" &&
        (user.passwordHash === DEMO_PASSWORD_HASH ||
          user.email === "demo@student.com" ||
          user.email === "demo@teacher.com"));

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password. Please verify your credentials.",
        },
        { status: 401 }
      );
    }

    // Create session in SQLite database
    const sessionToken = crypto.randomUUID();
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await prisma.session.create({
      data: {
        sessionToken,
        userId: user.id,
        expires,
      },
    });

    const isFacilitator = user.role === "FACILITATOR";
    const redirectTo = isFacilitator ? "/facilitator" : "/dashboard";

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        language: user.language,
      },
      redirectTo,
    });

    const cookieBaseOptions = {
      path: "/",
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60,
    };

    // 1. Session tokens
    response.cookies.set("nextlearning_session", sessionToken, {
      ...cookieBaseOptions,
      httpOnly: true,
    });
    response.cookies.set("udaan_session", sessionToken, {
      ...cookieBaseOptions,
      httpOnly: true,
    });
    response.cookies.set("next-auth.session-token", sessionToken, {
      ...cookieBaseOptions,
      httpOnly: true,
    });

    // 2. Client-accessible user and role identifiers
    response.cookies.set("nextlearning_user", user.email || email, {
      ...cookieBaseOptions,
      httpOnly: false,
    });
    response.cookies.set("udaan_user", user.email || email, {
      ...cookieBaseOptions,
      httpOnly: false,
    });
    response.cookies.set("nextlearning_role", user.role, {
      ...cookieBaseOptions,
      httpOnly: false,
    });
    response.cookies.set("udaan_role", user.role, {
      ...cookieBaseOptions,
      httpOnly: false,
    });

    return response;
  } catch (error) {
    console.error("Authentication failure in /api/auth/login:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred during authentication. Please try again.",
      },
      { status: 500 }
    );
  }
}
