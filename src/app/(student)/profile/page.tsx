import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ProfileView } from "@/components/profile/profile-view";
import { parseJsonField } from "@/lib/utils";
import type { StudentProfileData } from "@/types";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login?callbackUrl=/profile");
  }

  let dbProfile = null;
  let mentorInfo: {
    name: string;
    organization: string;
    notes?: string;
  } | null = null;

  try {
    dbProfile = await prisma.studentProfile.findFirst({
      where: { userId: user.id },
      include: {
        facilitatorAssignments: {
          include: {
            facilitator: true,
          },
        },
      },
    });

    // In demo mode fallback to the seeded student if profile wasn't found by userId
    if (!dbProfile) {
      dbProfile = await prisma.studentProfile.findFirst({
        include: {
          facilitatorAssignments: {
            include: {
              facilitator: true,
            },
          },
        },
      });
    }

    if (dbProfile && dbProfile.facilitatorAssignments.length > 0) {
      const assignment = dbProfile.facilitatorAssignments[0];
      mentorInfo = {
        name: assignment.facilitator.displayName || "G. Sai Kavya",
        organization:
          assignment.facilitator.organization || "Pratham Rural Career Guidance Center",
        notes: assignment.notes || undefined,
      };
    }
  } catch (error) {
    console.error("Error fetching profile page data:", error);
  }

  const profileData: StudentProfileData = {
    id: dbProfile?.id || "demo-profile-soumyadip",
    displayName: dbProfile?.displayName || user.name || "Soumyadip Chattopadhyay",
    educationLevel: dbProfile?.educationLevel || "class_10",
    state: dbProfile?.state || "West Bengal",
    district: dbProfile?.district || "Kolkata",
    interests: parseJsonField<string[]>(dbProfile?.interests, [
      "technology",
      "clean_energy",
      "trades",
    ]),
    hobbies: parseJsonField<string[]>(dbProfile?.hobbies, [
      "tinkering",
      "gardening",
      "reading",
    ]),
    favoriteSubjects: parseJsonField<string[]>(dbProfile?.favoriteSubjects, [
      "Mathematics",
      "Physics",
      "Computer Science",
    ]),
    skills: parseJsonField<string[]>(dbProfile?.skills, [
      "Basic Computer Operations",
      "Smartphone Navigation & App Usage",
      "Domestic Electrical Wiring & Safety",
    ]),
    careerAspirations: parseJsonField<string[]>(dbProfile?.careerAspirations, [
      "Solar PV Rooftop Technician",
      "Junior Frontend Web Developer",
    ]),
    learningStyle: dbProfile?.learningStyle || "visual",
    careerPreference: dbProfile?.careerPreference || "vocational",
    availableHours: dbProfile?.availableHours || 10,
    deviceAccess: dbProfile?.deviceAccess || "smartphone",
    onboardingCompleted: dbProfile?.onboardingCompleted ?? true,
  };

  return (
    <ProfileView
      user={user}
      initialProfile={profileData}
      mentorInfo={mentorInfo}
    />
  );
}
