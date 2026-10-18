import React from "react";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { StudentShell } from "@/components/layout/student-shell";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = await getCurrentUser("STUDENT");

  // In demo mode or if no session user is found, fallback to demo student user
  if (!user) {
    const demoStudent = await prisma.user.findFirst({
      where: { email: "demo@student.com" },
    });
    if (demoStudent) {
      user = {
        id: demoStudent.id,
        name: demoStudent.name,
        email: demoStudent.email,
        role: "STUDENT",
        language: demoStudent.language,
        image: demoStudent.image,
      };
    }
  }

  // Fetch student profile
  let studentProfile = user
    ? await prisma.studentProfile.findFirst({
        where: { userId: user.id },
      })
    : null;

  if (!studentProfile) {
    studentProfile = await prisma.studentProfile.findFirst({
      include: { user: true },
    });
  }

  const defaultUser = user || {
    id: "demo-student-id",
    name: "Demo Student",
    email: "demo@student.com",
    role: "STUDENT" as const,
    language: "en",
  };

  return (
    <StudentShell
      user={defaultUser}
      studentProfile={
        studentProfile
          ? {
              id: studentProfile.id,
              displayName:
                studentProfile.displayName ||
                defaultUser.name ||
                "Demo Student",
              educationLevel: studentProfile.educationLevel,
              careerPreference: studentProfile.careerPreference,
              district: studentProfile.district,
              state: studentProfile.state,
            }
          : null
      }
    >
      {children}
    </StudentShell>
  );
}
