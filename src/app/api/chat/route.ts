import { NextRequest, NextResponse } from 'next/server';
import { getAIProvider, CAREER_ADVISOR_PROMPT } from '@/lib/ai/provider';
import { prisma } from '@/lib/db';

// TODO: Implement rate limiting per IP or authenticated user session
// e.g., using Upstash Redis sliding window (10 requests per minute per IP)
// or an in-memory token bucket for development.

interface ChatRequestMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface StudentProfileContext {
  displayName?: string | null;
  educationLevel?: string | null;
  state?: string | null;
  district?: string | null;
  interests?: string[] | string | null;
  skills?: string[] | string | null;
  careerAspirations?: string[] | string | null;
  learningStyle?: string | null;
  careerPreference?: string | null;
  class10Marks?: string | null;
  class12Marks?: string | null;
  favoriteSubjects?: string[] | string | null;
  academicPerformance?: string | null;
}

interface ChatRequestBody {
  message: string;
  conversationHistory?: ChatRequestMessage[];
  studentProfile?: StudentProfileContext | null;
}

function formatStudentContext(profile?: StudentProfileContext | null): string {
  if (!profile) return '';

  const formatList = (val: string[] | string | null | undefined): string => {
    if (!val) return 'None specified';
    if (Array.isArray(val)) return val.join(', ');
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed.join(', ');
    } catch {
      return String(val);
    }
    return String(val);
  };

  return `
CURRENT STUDENT PROFILE & ACADEMIC STANDING:
- Name: ${profile.displayName || 'Student'}
- Current Education Level: ${profile.educationLevel || 'Class 10 / High School'}
- Location: ${profile.district || 'Rural/Semi-urban'}, ${profile.state || 'India'}
- Field of Interest: ${formatList(profile.interests)}
- Favorite Subjects: ${formatList(profile.favoriteSubjects)}
- Existing Skills: ${formatList(profile.skills)}
- Career Aspirations: ${formatList(profile.careerAspirations)}
- Class 10th Marks: ${profile.class10Marks || 'Passed Class 10 (First Division ~75-80%)'}
- Class 12th Marks: ${profile.class12Marks || (profile.educationLevel?.includes('12') ? 'Class 12 Pass (~75%)' : 'Class 10 completed, preparing for Higher Secondary / Vocational Track')}
- Academic Strengths & Eligibility: ${profile.academicPerformance ? profile.academicPerformance : 'Eligible for degree courses, polytechnic diplomas, and certified vocational specializations'}
- Career Preference: ${profile.careerPreference || 'Vocational / Employment'}
- Preferred Learning Style: ${profile.learningStyle || 'Hands-on / Practical'}

Always tailor course and career recommendations strictly to this student's stated field of interest and their Class 10th/12th marks.
`.trim();
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequestBody = await req.json();
    const { message, conversationHistory = [], studentProfile } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message content is required.' },
        { status: 400 }
      );
    }

    const customApiKey = req.headers.get('x-gemini-api-key');
    const provider =
      customApiKey && customApiKey.trim().length > 10
        ? new (await import('@/lib/ai/provider')).GeminiProvider(customApiKey.trim())
        : getAIProvider();

    // Grounding: Retrieve verified matching careers, training modules, and courses from database
    let groundingContext = '';
    try {
      const queryClean = message.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');

      // Extract interest keywords from student profile + message
      const interestList: string[] = [];
      if (studentProfile?.interests) {
        if (Array.isArray(studentProfile.interests)) {
          interestList.push(...studentProfile.interests);
        } else {
          try {
            const parsed = JSON.parse(studentProfile.interests);
            if (Array.isArray(parsed)) interestList.push(...parsed);
            else interestList.push(String(studentProfile.interests));
          } catch {
            interestList.push(String(studentProfile.interests));
          }
        }
      }

      // Query Facilitator Kavya's Training Modules & Learning Resources
      const [allModules, allResources, matchedCareers] = await Promise.all([
        prisma.trainingModule.findMany({
          where: { status: 'published' },
          select: { id: true, title: true, description: true, targetLevel: true, estimatedDuration: true, accessType: true },
        }),
        prisma.learningResource.findMany({
          take: 40,
          select: { id: true, title: true, provider: true, duration: true, educationLevel: true, subjects: true },
        }),
        prisma.career.findMany({
          take: 6,
          select: { title: true, category: true, salaryRange: true, demandLevel: true, growthOutlook: true },
        }),
      ]);

      // Filter courses matching student interest keywords
      const interestTokens = [
        ...interestList.map((i) => i.toLowerCase().split(/\s+/)).flat(),
        ...queryClean.split(/\s+/).filter(
          (w) =>
            w.length >= 4 &&
            !['what', 'when', 'where', 'which', 'about', 'after', 'please', 'tell', 'want', 'need', 'with', 'help', 'career', 'careers', 'options', 'course', 'courses', 'recommend', 'give', 'different'].includes(w)
        ),
      ];

      const matchingModules = allModules.filter((m) => {
        const text = `${m.title} ${m.description || ''} ${m.targetLevel || ''}`.toLowerCase();
        return interestTokens.some((token) => text.includes(token));
      });

      const matchingResources = allResources.filter((r) => {
        const text = `${r.title} ${r.subjects || ''}`.toLowerCase();
        return interestTokens.some((token) => text.includes(token));
      });

      // Non-deterministic shuffle of matching courses so different courses are surfaced on repeated requests!
      const candidateCourses = [
        ...(matchingModules.length > 0 ? matchingModules : allModules).map((m) => ({
          title: m.title,
          provider: 'NextLearning / Facilitator G. Sai Kavya',
          duration: m.estimatedDuration || '4-5 hours',
          level: m.targetLevel || 'Class 10 - Class 12',
          type: 'Practical Training Module',
        })),
        ...(matchingResources.length > 0 ? matchingResources : allResources).map((r) => ({
          title: r.title,
          provider: r.provider || 'Diksha / Skill India Hub',
          duration: r.duration || 'Self-paced',
          level: r.educationLevel || 'Secondary / Higher Secondary',
          type: 'Curated Resource',
        })),
      ].sort(() => Math.random() - 0.5);

      const selectedCourses = candidateCourses.slice(0, 5);

      if (selectedCourses.length > 0) {
        groundingContext +=
          `\nVERIFIED AVAILABLE COURSES & MODULES (Matched to Student Interests - Randomly Sampled Catalog Pool):\n` +
          selectedCourses
            .map((c, i) => `${i + 1}. "${c.title}" [${c.type}] by ${c.provider} (Duration: ${c.duration}, Target: ${c.level})`)
            .join('\n') +
          `\nMandate: When recommending courses, select from these verified offerings or related accredited Indian degrees/certifications, and explicitly explain how the student's Class 10th and 12th marks fulfill the entry requirements.\n`;
      }

      if (matchedCareers.length > 0) {
        const shuffledCareers = [...matchedCareers].sort(() => Math.random() - 0.5).slice(0, 2);
        groundingContext +=
          `\nVERIFIED CAREER PATHWAY EVIDENCE (NextLearning Catalog):\n` +
          shuffledCareers
            .map(
              (c) =>
                `- ${c.title} (${c.category}): Typical starting salary ${c.salaryRange || '₹18,000 - ₹35,000/mo'}. Demand: ${c.demandLevel || 'High'}. Outlook: ${c.growthOutlook || 'Strong'}.`
            )
            .join('\n') +
          `\nRule: Strictly preserve factual salary figures and scheme criteria while varying explanations and perspectives naturally.\n`;
      }
    } catch {
      // Non-blocking failsafe
    }

    // Build conversation prompt with recent history (up to 8 turns)
    const recentHistory = conversationHistory.slice(-8);
    const hasPriorAssistantTurn = recentHistory.some((t) => t.role === 'assistant');

    let antiRepetitionDirective = '';
    if (hasPriorAssistantTurn) {
      antiRepetitionDirective = `\n[CONTINUITY & ANTI-REPETITION DIRECTIVE:
- This is an ongoing conversation. DO NOT repeat greetings (such as 'Namaste' or 'Hello') or stock introductory phrases.
- DO NOT re-ask questions for information the student has already shared earlier in the chat.
- Answer the student's question directly. If this is a repeated or follow-up question, use fresh phrasing, varied sentence structures, and alternative explanatory angles while keeping core verified facts strictly consistent.]\n`;
    }

    // Prepare system prompt with student context, grounding, and anti-repetition directive
    const studentContextString = formatStudentContext(studentProfile);
    let systemContext = CAREER_ADVISOR_PROMPT;
    if (studentContextString) {
      systemContext += `\n\n${studentContextString}`;
    }
    if (groundingContext) {
      systemContext += `\n\n${groundingContext}`;
    }
    if (antiRepetitionDirective) {
      systemContext += `\n\n${antiRepetitionDirective}`;
    }

    let promptWithHistory = '';
    if (recentHistory.length > 0) {
      promptWithHistory += 'CONVERSATION HISTORY:\n';
      for (const turn of recentHistory) {
        const speaker = turn.role === 'user' ? 'Student' : 'NextLearning AI';
        promptWithHistory += `${speaker}: ${turn.content}\n`;
      }
      promptWithHistory += '\nCURRENT USER MESSAGE:\n';
    }

    promptWithHistory += `Student: ${message.trim()}\n\nNextLearning AI:`;

    // Stream the response back to client
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          if (provider.generateStream) {
            for await (const chunk of provider.generateStream(promptWithHistory, systemContext, message.trim())) {
              controller.enqueue(encoder.encode(chunk));
            }
          } else {
            const fullResponse = await provider.generateText(promptWithHistory, systemContext, message.trim());
            controller.enqueue(encoder.encode(fullResponse));
          }
          controller.close();
        } catch (streamError) {
          console.error('Error in chat stream generation:', streamError);
          const fallbackChunk = `\n\n*(An error occurred while generating the complete response. Please try again or rephrase your question.)*`;
          controller.enqueue(encoder.encode(fallbackChunk));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Transfer-Encoding': 'chunked',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error: unknown) {
    console.error('POST /api/chat error:', error);
    const errorMsg = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    );
  }
}
