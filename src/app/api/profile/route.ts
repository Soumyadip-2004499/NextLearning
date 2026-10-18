import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { getCurrentUser, getCurrentStudentProfile } from "@/lib/auth";
import { parseJsonField } from "@/lib/utils";

const profileUpdateSchema = z.object({
  displayName: z.string().min(1, "Name is required").optional().nullable(),
  educationLevel: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  interests: z.union([z.array(z.string()), z.string()]).optional().nullable(),
  hobbies: z.union([z.array(z.string()), z.string()]).optional().nullable(),
  favoriteSubjects: z.union([z.array(z.string()), z.string()]).optional().nullable(),
  skills: z.union([z.array(z.string()), z.string()]).optional().nullable(),
  careerAspirations: z.union([z.array(z.string()), z.string()]).optional().nullable(),
  learningStyle: z.string().optional().nullable(),
  careerPreference: z.string().optional().nullable(),
  availableHours: z
    .union([z.number(), z.string().transform((v) => (v ? Number(v) : null))])
    .optional()
    .nullable(),
  deviceAccess: z.string().optional().nullable(),
  onboardingCompleted: z.boolean().optional(),
});

function serializeArray(val: string[] | string | null | undefined): string | null {
  if (!val) return null;
  if (Array.isArray(val)) {
    return JSON.stringify(val);
  }
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return val;
      return JSON.stringify([val]);
    } catch {
      return JSON.stringify([val]);
    }
  }
  return null;
}

export async function GET() {
  try {
    const student = await getCurrentStudentProfile();

    if (!student) {
      return NextResponse.json(
        { success: false, error: "Student profile not found" },
        { status: 404 }
      );
    }

    const formattedProfile = {
      id: student.id,
      userId: student.userId,
      displayName: student.displayName,
      educationLevel: student.educationLevel,
      state: student.state,
      district: student.district,
      interests: parseJsonField<string[]>(student.interests, []),
      hobbies: parseJsonField<string[]>(student.hobbies, []),
      favoriteSubjects: parseJsonField<string[]>(student.favoriteSubjects, []),
      skills: parseJsonField<string[]>(student.skills, []),
      careerAspirations: parseJsonField<string[]>(student.careerAspirations, []),
      learningStyle: student.learningStyle,
      careerPreference: student.careerPreference,
      availableHours: student.availableHours,
      deviceAccess: student.deviceAccess,
      onboardingCompleted: student.onboardingCompleted,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
    };

    return NextResponse.json({
      success: true,
      data: formattedProfile,
    });
  } catch (error) {
    console.error("GET /api/profile error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const student = await getCurrentStudentProfile();
    const user = await getCurrentUser();

    if (!student) {
      return NextResponse.json(
        { success: false, error: "Student profile not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const validation = profileUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation error",
          details: validation.error.format(),
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Update User name if displayName changed
    if (data.displayName && user) {
      await prisma.user
        .update({
          where: { id: user.id },
          data: { name: data.displayName },
        })
        .catch(() => {});
    }

    const updatePayload: Record<string, unknown> = {};

    if (data.displayName !== undefined) updatePayload.displayName = data.displayName;
    if (data.educationLevel !== undefined) updatePayload.educationLevel = data.educationLevel;
    if (data.state !== undefined) updatePayload.state = data.state;
    if (data.district !== undefined) updatePayload.district = data.district;
    if (data.interests !== undefined) updatePayload.interests = serializeArray(data.interests);
    if (data.hobbies !== undefined) updatePayload.hobbies = serializeArray(data.hobbies);
    if (data.favoriteSubjects !== undefined)
      updatePayload.favoriteSubjects = serializeArray(data.favoriteSubjects);
    if (data.skills !== undefined) updatePayload.skills = serializeArray(data.skills);
    if (data.careerAspirations !== undefined)
      updatePayload.careerAspirations = serializeArray(data.careerAspirations);
    if (data.learningStyle !== undefined) updatePayload.learningStyle = data.learningStyle;
    if (data.careerPreference !== undefined) updatePayload.careerPreference = data.careerPreference;
    if (data.availableHours !== undefined) updatePayload.availableHours = data.availableHours;
    if (data.deviceAccess !== undefined) updatePayload.deviceAccess = data.deviceAccess;
    if (data.onboardingCompleted !== undefined)
      updatePayload.onboardingCompleted = data.onboardingCompleted;

    const updated = await prisma.studentProfile.update({
      where: { id: student.id },
      data: updatePayload,
    });

    // Record milestone progress event if onboarding completed
    if (data.onboardingCompleted) {
      await prisma.studentProgress
        .create({
          data: {
            studentId: updated.id,
            eventType: "onboarding_completed",
            eventData: JSON.stringify({
              completedAt: new Date().toISOString(),
              educationLevel: updated.educationLevel,
              state: updated.state,
            }),
          },
        })
        .catch(() => {});
    }

    const formattedProfile = {
      id: updated.id,
      userId: updated.userId,
      displayName: updated.displayName,
      educationLevel: updated.educationLevel,
      state: updated.state,
      district: updated.district,
      interests: parseJsonField<string[]>(updated.interests, []),
      hobbies: parseJsonField<string[]>(updated.hobbies, []),
      favoriteSubjects: parseJsonField<string[]>(updated.favoriteSubjects, []),
      skills: parseJsonField<string[]>(updated.skills, []),
      careerAspirations: parseJsonField<string[]>(updated.careerAspirations, []),
      learningStyle: updated.learningStyle,
      careerPreference: updated.careerPreference,
      availableHours: updated.availableHours,
      deviceAccess: updated.deviceAccess,
      onboardingCompleted: updated.onboardingCompleted,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: formattedProfile,
    });
  } catch (error) {
    console.error("PUT /api/profile error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update student profile" },
      { status: 500 }
    );
  }
}
