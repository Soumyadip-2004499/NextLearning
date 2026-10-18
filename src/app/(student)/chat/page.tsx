import { Metadata } from 'next';
import prisma from '@/lib/db';
import { ChatInterface } from '@/components/chat/chat-interface';
import { parseJsonField } from '@/lib/utils';
import { Sparkles, MessageSquare, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AI Career Guide | NextLearning',
  description: 'Converse with your AI career advisor for personalized educational and vocational guidance in India.',
};

import { getCurrentUser } from '@/lib/auth';

export default async function StudentChatPage() {
  const user = await getCurrentUser();
  let student = null;

  if (user) {
    student = await prisma.studentProfile.findFirst({
      where: { userId: user.id },
      include: {
        user: true,
      },
    });
  }

  // Fallback to primary student if none logged in
  if (!student) {
    student = await prisma.studentProfile.findFirst({
      where: {
        user: { email: { in: ['soumya@student.com', 'demo@student.com'] } },
      },
      include: {
        user: true,
      },
    }) || await prisma.studentProfile.findFirst({
      include: {
        user: true,
      },
    });
  }

  const studentContext = student
    ? {
        id: student.id,
        displayName: student.displayName || student.user.name || 'Student',
        educationLevel: student.educationLevel,
        state: student.state,
        district: student.district,
        class10Marks: student.class10Marks || '88.5% (Distinction - Science & Math 92/100)',
        class12Marks: student.class12Marks || '86.2% (First Division - Science PCM)',
        favoriteSubjects: parseJsonField<string[]>(student.favoriteSubjects, []),
        interests: parseJsonField<string[]>(student.interests, []),
        skills: parseJsonField<string[]>(student.skills, []),
        careerAspirations: parseJsonField<string[]>(student.careerAspirations, []),
        careerPreference: student.careerPreference || 'technology',
        academicPerformance: student.academicPerformance,
      }
    : undefined;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-6xl mx-auto w-full px-2 sm:px-4 py-2 sm:py-4">
      {/* Top Breadcrumb & Status */}
      <div className="flex items-center justify-between pb-3 px-2">
        <div className="flex items-center gap-3">
          <Link
            href="/roadmap"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            // BACK TO ROADMAPS
          </Link>
          <span className="text-muted-foreground/30">/</span>
          <div className="flex items-center gap-1.5 text-xs font-mono text-foreground">
            <span className="red-dot" />
            <span>AI.ORACLE // CONVERSATION</span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-[#eb0028] animate-pulse" />
          <span>GEMINI-2.0 ACTIVE · 36 VOCATIONAL PATHWAYS</span>
        </div>
      </div>

      {/* Main Full-Height Chat Interface */}
      <div className="flex-1 min-h-0">
        <ChatInterface
          studentProfile={studentContext}
          className="h-full border-border/80 shadow-md"
        />
      </div>
    </div>
  );
}
