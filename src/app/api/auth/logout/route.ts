import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const sessionToken =
      req.cookies.get("nextlearning_session")?.value ||
      req.cookies.get("udaan_session")?.value ||
      req.cookies.get("next-auth.session-token")?.value;

    const isTemp = req.cookies.get("nextlearning_is_temp")?.value === "true";
    const tempUserId = req.cookies.get("nextlearning_temp_user_id")?.value;
    const userIdCookie = req.cookies.get("nextlearning_user")?.value;

    let targetUserId = tempUserId || (isTemp ? userIdCookie : undefined);

    // If sessionToken exists, check if associated user is a temporary demo student
    if (sessionToken && !targetUserId) {
      try {
        const sessionRecord = await prisma.session.findUnique({
          where: { sessionToken },
          include: { user: true },
        });

        if (sessionRecord?.user?.email?.startsWith("temp_student_")) {
          targetUserId = sessionRecord.user.id;
        }
      } catch (err) {
        console.warn("Session lookup during logout:", err);
      }
    }

    // If this is a temporary demo student, delete their entire profile and account from Supabase
    if (targetUserId) {
      try {
        const user = await prisma.user.findUnique({
          where: { id: targetUserId },
          include: { studentProfile: true },
        });

        if (user && ((user.email && user.email.startsWith("temp_student_")) || isTemp)) {
          const profileId = user.studentProfile?.id;

          if (profileId) {
            // Delete associated roadmaps & steps
            const roadmaps = await prisma.learningRoadmap.findMany({
              where: { studentId: profileId },
              select: { id: true },
            });

            for (const rm of roadmaps) {
              await prisma.roadmapStep.deleteMany({
                where: { roadmapId: rm.id },
              });
            }

            await prisma.learningRoadmap.deleteMany({
              where: { studentId: profileId },
            });

            // Delete saved opportunities & application records
            await prisma.savedOpportunity.deleteMany({
              where: { studentId: profileId },
            });

            await prisma.applicationRecord.deleteMany({
              where: { studentId: profileId },
            });

            await prisma.studentProgress.deleteMany({
              where: { studentId: profileId },
            });

            await prisma.facilitatorStudentAssignment.deleteMany({
              where: { studentId: profileId },
            });

            await prisma.facilitatorRecommendation.deleteMany({
              where: { studentId: profileId },
            });

            await prisma.studentProfile.delete({
              where: { id: profileId },
            });
          }

          // Delete sessions
          await prisma.session.deleteMany({
            where: { userId: targetUserId },
          });

          // Delete user
          await prisma.user.delete({
            where: { id: targetUserId },
          });

          console.log(`🧹 Cleaned up temporary demo student account: ${user.email ?? targetUserId} (${targetUserId})`);
        }
      } catch (tempCleanErr) {
        console.warn("Temporary demo cleanup notice:", tempCleanErr);
      }
    } else if (sessionToken) {
      await prisma.session
        .deleteMany({
          where: { sessionToken },
        })
        .catch(() => {});
    }

    // Clean up stale temporary accounts older than 2 hours in the background
    cleanupOldGuestAccounts().catch(() => {});

    const response = NextResponse.json({
      success: true,
      redirectTo: "/",
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
    response.cookies.set("nextlearning_is_temp", "", clearOptions);
    response.cookies.set("nextlearning_temp_user_id", "", clearOptions);

    return response;
  } catch (error) {
    console.error("Logout error in /api/auth/logout:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const res = await POST(req);
  return NextResponse.redirect(new URL("/", req.url));
}

/**
 * Background garbage collection for temporary demo guest accounts older than 2 hours
 */
async function cleanupOldGuestAccounts() {
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
  const oldGuests = await prisma.user.findMany({
    where: {
      email: { startsWith: "temp_student_" },
      createdAt: { lt: twoHoursAgo },
    },
    include: { studentProfile: true },
    take: 10,
  });

  for (const guest of oldGuests) {
    try {
      if (guest.studentProfile) {
        const roadmaps = await prisma.learningRoadmap.findMany({
          where: { studentId: guest.studentProfile.id },
          select: { id: true },
        });
        for (const rm of roadmaps) {
          await prisma.roadmapStep.deleteMany({ where: { roadmapId: rm.id } });
        }
        await prisma.learningRoadmap.deleteMany({ where: { studentId: guest.studentProfile.id } });
        await prisma.savedOpportunity.deleteMany({ where: { studentId: guest.studentProfile.id } });
        await prisma.applicationRecord.deleteMany({ where: { studentId: guest.studentProfile.id } });
        await prisma.studentProgress.deleteMany({ where: { studentId: guest.studentProfile.id } });
        await prisma.facilitatorStudentAssignment.deleteMany({ where: { studentId: guest.studentProfile.id } });
        await prisma.facilitatorRecommendation.deleteMany({ where: { studentId: guest.studentProfile.id } });
        await prisma.studentProfile.delete({ where: { id: guest.studentProfile.id } });
      }
      await prisma.session.deleteMany({ where: { userId: guest.id } });
      await prisma.user.delete({ where: { id: guest.id } });
    } catch {}
  }
}
