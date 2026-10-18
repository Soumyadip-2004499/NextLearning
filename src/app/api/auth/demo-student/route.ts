import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { Role } from "@prisma/client";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const guestNum = Math.floor(1000 + Math.random() * 9000);
    const timestamp = Date.now();
    const tempEmail = `temp_student_${timestamp}_${guestNum}@demo.nextlearning`;
    const tempName = "Guest Student";

    // Create temporary guest student account in Supabase
    const tempUser = await prisma.user.create({
      data: {
        name: tempName,
        email: tempEmail,
        passwordHash: "temp_guest_session_unusable",
        role: Role.STUDENT,
        language: "en",
        studentProfile: {
          create: {
            displayName: tempName,
            educationLevel: "class_10",
            state: "West Bengal",
            district: "Kolkata",
            interests: JSON.stringify(["technology", "clean_energy", "trades"]),
            skills: JSON.stringify([
              "Basic Computer Operations",
              "Smartphone Navigation & App Usage",
              "Foundational Mathematics & Calculations",
            ]),
            careerAspirations: JSON.stringify([
              "Solar PV Rooftop Technician & Installer",
              "Digital Services Center Operator",
            ]),
            class10Marks: "82%",
            class12Marks: "80%",
            onboardingCompleted: true,
          },
        },
      },
      include: {
        studentProfile: true,
      },
    });

    const profileId = tempUser.studentProfile?.id;

    if (profileId) {
      // Seed an interactive demo roadmap for this temporary student
      const roadmap = await prisma.learningRoadmap.create({
        data: {
          studentId: profileId,
          careerTitle: "Solar PV Rooftop Technician & Installer",
          description:
            "A hands-on vocational pathway exploring solar arrays, inverter wiring, and safety certifications.",
          status: "active",
        },
      });

      await prisma.roadmapStep.createMany({
        data: [
          {
            roadmapId: roadmap.id,
            order: 1,
            title: "Foundations of DC Electricity & Circuit Safety",
            description: "Understand voltage, current, resistance, and shock safety protocols.",
            type: "learn",
            status: "completed",
            duration: "4 hours",
            completedAt: new Date(),
          },
          {
            roadmapId: roadmap.id,
            order: 2,
            title: "Multimeter Diagnostics & Electrical Testing",
            description: "Practice measuring voltage, continuity, and current safely.",
            type: "practice",
            status: "in_progress",
            duration: "2 hours",
          },
          {
            roadmapId: roadmap.id,
            order: 3,
            title: "Solar Photovoltaic Cell Physics & Module Sizing",
            description: "Learn how solar panels generate DC electricity from sunlight.",
            type: "learn",
            status: "pending",
            duration: "6 hours",
          },
          {
            roadmapId: roadmap.id,
            order: 4,
            title: "Rooftop Array Mounting & Mechanical Rail Installation",
            description: "Attaching mounting rails, solar brackets, and conduit lines safely.",
            type: "practice",
            status: "pending",
            duration: "5 hours",
          },
        ],
      });

      // Link sample saved opportunity
      const opp = await prisma.opportunity.findFirst();
      if (opp) {
        await prisma.savedOpportunity.create({
          data: {
            studentId: profileId,
            opportunityId: opp.id,
            notes: "Bookmarked for demo exploration.",
          },
        }).catch(() => {});
      }
    }

    // Create session in Supabase database
    const sessionToken = crypto.randomUUID();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.session.create({
      data: {
        sessionToken,
        userId: tempUser.id,
        expires,
      },
    });

    const targetUrl = new URL("/dashboard", req.url);
    const response = NextResponse.redirect(targetUrl);

    const cookieBaseOptions = {
      path: "/",
      maxAge: 24 * 60 * 60, // 24 hours
      sameSite: "lax" as const,
      httpOnly: true,
    };

    response.cookies.set("nextlearning_session", sessionToken, cookieBaseOptions);
    response.cookies.set("udaan_session", sessionToken, cookieBaseOptions);
    response.cookies.set("next-auth.session-token", sessionToken, cookieBaseOptions);
    response.cookies.set("nextlearning_user", tempUser.id, {
      ...cookieBaseOptions,
      httpOnly: false,
    });
    response.cookies.set("nextlearning_role", "STUDENT", {
      ...cookieBaseOptions,
      httpOnly: false,
    });
    // Mark session as temporary guest account so logout deletes it
    response.cookies.set("nextlearning_is_temp", "true", {
      ...cookieBaseOptions,
      httpOnly: false,
    });
    response.cookies.set("nextlearning_temp_user_id", tempUser.id, {
      ...cookieBaseOptions,
      httpOnly: false,
    });

    return response;
  } catch (error) {
    console.error("Error creating temporary student demo account:", error);
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
