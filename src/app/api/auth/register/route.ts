import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { Role } from "@prisma/client";

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name cannot exceed 80 characters"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address")
    .max(120, "Email cannot exceed 120 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password cannot exceed 100 characters"),
  role: z.enum(["STUDENT", "FACILITATOR"]).default("STUDENT"),
  language: z.string().trim().min(2).max(10).default("en"),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and privacy policy",
  }),
});

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body. Expected JSON payload.",
        },
        { status: 400 }
      );
    }

    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Validation failed";
      return NextResponse.json(
        {
          success: false,
          error: firstError,
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, password, role, language } = validation.data;

    // Check if user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "An account with this email already exists. Please sign in instead.",
        },
        { status: 409 }
      );
    }

    // TODO: In production, hash the password using bcryptjs:
    // import bcrypt from "bcryptjs";
    // const passwordHash = await bcrypt.hash(password, 10);
    // For prototype demo: store password directly in passwordHash column
    const passwordHash = password;

    const prismaRole = role === "FACILITATOR" ? Role.FACILITATOR : Role.STUDENT;

    // Create user and associated profile in a transaction
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: prismaRole,
        language,
        ...(prismaRole === Role.STUDENT
          ? {
              studentProfile: {
                create: {
                  displayName: name,
                  interests: "[]",
                  hobbies: "[]",
                  favoriteSubjects: "[]",
                  skills: "[]",
                  careerAspirations: "[]",
                  onboardingCompleted: false,
                },
              },
            }
          : {
              facilitatorProfile: {
                create: {
                  displayName: name,
                  expertise: "[]",
                },
              },
            }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        language: true,
        createdAt: true,
      },
    });

    // Auto-link new student to active facilitators so they immediately appear in Facilitator Console
    if (prismaRole === Role.STUDENT) {
      try {
        const studentProfile = await prisma.studentProfile.findUnique({
          where: { userId: newUser.id },
        });

        if (studentProfile) {
          const facilitators = await prisma.facilitatorProfile.findMany();
          for (const fac of facilitators) {
            await prisma.facilitatorStudentAssignment.upsert({
              where: {
                facilitatorId_studentId: {
                  facilitatorId: fac.id,
                  studentId: studentProfile.id,
                },
              },
              update: {},
              create: {
                facilitatorId: fac.id,
                studentId: studentProfile.id,
                notes: `Auto-enrolled on registration (${new Date().toLocaleDateString("en-IN")})`,
              },
            });
          }
        }
      } catch (assignError) {
        console.warn("Facilitator auto-assignment notice:", assignError);
      }
    } else if (prismaRole === Role.FACILITATOR) {
      // Auto-assign existing students to newly registered facilitator
      try {
        const facilitatorProfile = await prisma.facilitatorProfile.findUnique({
          where: { userId: newUser.id },
        });

        if (facilitatorProfile) {
          const students = await prisma.studentProfile.findMany({ take: 20 });
          for (const std of students) {
            await prisma.facilitatorStudentAssignment.upsert({
              where: {
                facilitatorId_studentId: {
                  facilitatorId: facilitatorProfile.id,
                  studentId: std.id,
                },
              },
              update: {},
              create: {
                facilitatorId: facilitatorProfile.id,
                studentId: std.id,
                notes: `Assigned to ${name} on account setup`,
              },
            });
          }
        }
      } catch (facAssignError) {
        console.warn("New facilitator student assignment notice:", facAssignError);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful. You can now log in.",
        data: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred during registration. Please try again.",
      },
      { status: 500 }
    );
  }
}
