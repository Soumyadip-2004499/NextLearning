import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAIProvider, ROADMAP_GENERATOR_PROMPT } from '@/lib/ai/provider';
import { getFallbackRoadmap, FallbackRoadmapTemplate } from '@/lib/ai/fallback';

interface GenerateRoadmapBody {
  careerSlug?: string;
  careerTitle?: string;
  studentProfileId?: string;
}

const ROADMAP_SCHEMA_PROMPT = `{
  "careerTitle": "Exact name of the career",
  "description": "2-3 sentences overview of this learning roadmap tailored for an Indian youth",
  "steps": [
    {
      "order": 1,
      "title": "Clear concise step title",
      "description": "Practical details on what to learn or do",
      "type": "learn" | "practice" | "exam" | "milestone",
      "duration": "Estimated time like '2 weeks' or '40 hours'"
    }
  ]
}`;

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRoadmapBody = await req.json();
    const { careerSlug, careerTitle: rawCareerTitle, studentProfileId } = body;

    if (!careerSlug && !rawCareerTitle) {
      return NextResponse.json(
        { error: 'careerSlug or careerTitle is required to generate a roadmap.' },
        { status: 400 }
      );
    }

    // 1. Resolve Student Profile
    let student = null;
    if (studentProfileId) {
      student = await prisma.studentProfile.findUnique({
        where: { id: studentProfileId },
        include: { user: true },
      });
    }

    // If no student found by ID or ID omitted, fallback to first student in db (demo student)
    if (!student) {
      student = await prisma.studentProfile.findFirst({
        include: { user: true },
      });
    }

    if (!student) {
      return NextResponse.json(
        { error: 'No student profile found. Please complete profile setup first.' },
        { status: 404 }
      );
    }

    // 2. Resolve Career Details
    let career = null;
    if (careerSlug) {
      career = await prisma.career.findUnique({
        where: { slug: careerSlug },
      });
    }

    if (!career && rawCareerTitle) {
      career = await prisma.career.findFirst({
        where: {
          title: {
            contains: rawCareerTitle,
          },
        },
      });
    }

    const resolvedCareerTitle = career?.title || rawCareerTitle || careerSlug || 'Vocational Specialist';
    const careerCategory = career?.category || 'general';

    // 3. Generate Roadmap via AI or Fallback
    const provider = getAIProvider();
    let roadmapData: FallbackRoadmapTemplate;

    try {
      const studentContext = `Student Profile:
Name: ${student.displayName || 'Student'}
Education Level: ${student.educationLevel || 'Class 10'}
Interests: ${student.interests || '[]'}
Skills: ${student.skills || '[]'}
State: ${student.state || 'India'}`;

      const prompt = `Generate a realistic 5-to-6 step career learning roadmap for: "${resolvedCareerTitle}" (Category: ${careerCategory}).
${studentContext}

Focus on practical, affordable, accessible steps in India with recognized credentials.`;

      roadmapData = await provider.generateStructured<FallbackRoadmapTemplate>(
        prompt,
        ROADMAP_SCHEMA_PROMPT,
        ROADMAP_GENERATOR_PROMPT
      );

      // Validate that steps exist and are well-formed
      if (!roadmapData || !Array.isArray(roadmapData.steps) || roadmapData.steps.length === 0) {
        roadmapData = getFallbackRoadmap(resolvedCareerTitle, career?.slug, student.displayName || undefined);
      }
    } catch (aiErr) {
      console.warn('AI structured generation error, falling back to curated template:', aiErr);
      roadmapData = getFallbackRoadmap(resolvedCareerTitle, career?.slug, student.displayName || undefined);
    }

    // 4. Save to Database
    const createdRoadmap = await prisma.learningRoadmap.create({
      data: {
        studentId: student.id,
        careerTitle: roadmapData.careerTitle || resolvedCareerTitle,
        description:
          roadmapData.description ||
          `A step-by-step career development roadmap for ${resolvedCareerTitle}.`,
        status: 'active',
        steps: {
          create: roadmapData.steps.map((step, idx) => ({
            order: step.order || idx + 1,
            title: step.title,
            description: step.description || null,
            type: (['learn', 'practice', 'exam', 'milestone'].includes(step.type)
              ? step.type
              : 'learn') as string,
            status: idx === 0 ? 'in_progress' : 'pending',
            careerId: career?.id || null,
            duration: step.duration || '2 weeks',
          })),
        },
      },
      include: {
        steps: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: createdRoadmap,
        message: 'Roadmap generated successfully.',
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('POST /api/roadmap/generate error:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate roadmap';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
