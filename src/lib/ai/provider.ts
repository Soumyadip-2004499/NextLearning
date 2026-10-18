import { GoogleGenAI } from '@google/genai';
import {
  CAREER_ADVISOR_PROMPT,
  ROADMAP_GENERATOR_PROMPT,
  GENERAL_ASSISTANT_PROMPT,
} from './prompts';
import {
  FALLBACK_NOTICE,
  getFallbackChatResponse,
  getFallbackRoadmap,
} from './fallback';

export interface AIProvider {
  generateText(prompt: string, context?: string, userMessage?: string): Promise<string>;
  generateStructured<T>(prompt: string, schema: string, context?: string): Promise<T>;
  generateStream?(prompt: string, context?: string, userMessage?: string): AsyncIterable<string>;
}

export interface GeminiConfigOptions {
  model?: string;
  temperature?: number;
  topP?: number;
}

const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
const DEFAULT_TEMPERATURE = process.env.GEMINI_TEMPERATURE
  ? parseFloat(process.env.GEMINI_TEMPERATURE)
  : 0.75;
const DEFAULT_TOP_P = process.env.GEMINI_TOP_P
  ? parseFloat(process.env.GEMINI_TOP_P)
  : 0.95;

export class GeminiProvider implements AIProvider {
  private client: GoogleGenAI;
  private model: string;
  private temperature: number;
  private topP: number;

  constructor(apiKey: string, options?: GeminiConfigOptions | string) {
    this.client = new GoogleGenAI({ apiKey });
    if (typeof options === 'string') {
      this.model = options;
      this.temperature = DEFAULT_TEMPERATURE;
      this.topP = DEFAULT_TOP_P;
    } else {
      this.model = options?.model || DEFAULT_MODEL;
      this.temperature = options?.temperature ?? DEFAULT_TEMPERATURE;
      this.topP = options?.topP ?? DEFAULT_TOP_P;
    }
  }

  async generateText(prompt: string, context?: string): Promise<string> {
    try {
      const response = await this.client.models.generateContent({
        model: this.model,
        contents: prompt,
        config: {
          systemInstruction: context || CAREER_ADVISOR_PROMPT,
          temperature: this.temperature,
          topP: this.topP,
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error('Gemini API returned an empty response.');
      }
      return text;
    } catch (error: unknown) {
      return this.handleError(error, prompt);
    }
  }

  async generateStructured<T>(
    prompt: string,
    schema: string,
    context?: string
  ): Promise<T> {
    try {
      const structuredPrompt = `${prompt}

IMPORTANT: You must return ONLY a valid JSON object matching this schema:
${schema}

Do not include any surrounding markdown fences like \`\`\`json or explanatory text before/after. Return raw valid JSON.`;

      const response = await this.client.models.generateContent({
        model: this.model,
        contents: structuredPrompt,
        config: {
          systemInstruction: context || ROADMAP_GENERATOR_PROMPT,
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const text = response.text?.trim() || '';
      // Strip potential markdown code fences if model returned them
      const cleanJson = text
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/, '')
        .replace(/\s*```$/, '')
        .trim();

      return JSON.parse(cleanJson) as T;
    } catch (error: unknown) {
      console.warn('Gemini structured generation failed, using fallback:', error);
      // Fallback structured generation
      return getFallbackRoadmap(prompt) as unknown as T;
    }
  }

  async *generateStream(prompt: string, context?: string): AsyncIterable<string> {
    try {
      const responseStream = await this.client.models.generateContentStream({
        model: this.model,
        contents: prompt,
        config: {
          systemInstruction: context || CAREER_ADVISOR_PROMPT,
          temperature: this.temperature,
          topP: this.topP,
        },
      });

      for await (const chunk of responseStream) {
        if (chunk.text) {
          yield chunk.text;
        }
      }
    } catch (error: unknown) {
      const message = this.handleError(error, prompt);
      yield message;
    }
  }

  private handleError(error: unknown, prompt: string): string {
    const errMessage = error instanceof Error ? error.message : String(error);
    console.error('GeminiProvider Error:', errMessage);

    if (errMessage.includes('RESOURCE_EXHAUSTED') || errMessage.includes('429')) {
      return `*(AI Rate Limit Reached)*\n\nThe AI service is currently experiencing heavy traffic. Here is a helpful answer in the meantime:\n\n${getFallbackChatResponse(
        prompt
      )}`;
    }

    if (errMessage.includes('DEADLINE_EXCEEDED') || errMessage.includes('timeout')) {
      return `*(Request Timeout)*\n\nThe network connection timed out. Here is offline guidance:\n\n${getFallbackChatResponse(
        prompt
      )}`;
    }

    return `*(AI Service Notice)*\n\n${FALLBACK_NOTICE}\n\n${getFallbackChatResponse(
      prompt
    )}`;
  }
}

export class FallbackProvider implements AIProvider {
  async generateText(prompt: string, context?: string, userMessage?: string): Promise<string> {
    const studentNameMatch = context?.match(/- Name:\s*([^\n\r]+)/);
    const studentName = studentNameMatch ? studentNameMatch[1].trim() : undefined;
    return getFallbackChatResponse(userMessage || prompt, studentName);
  }

  async generateStructured<T>(prompt: string, _schema?: string, _context?: string): Promise<T> {
    // Generate structured roadmap using fallback data
    return getFallbackRoadmap(prompt) as unknown as T;
  }

  async *generateStream(prompt: string, context?: string, userMessage?: string): AsyncIterable<string> {
    const studentNameMatch = context?.match(/- Name:\s*([^\n\r]+)/);
    const studentName = studentNameMatch ? studentNameMatch[1].trim() : undefined;
    const fullText = getFallbackChatResponse(userMessage || prompt, studentName);
    // Split into simulated typing chunks
    const chunks = fullText.split(/(\s+)/);
    for (const chunk of chunks) {
      yield chunk;
      // Small tick for realistic streaming feel
      await new Promise((resolve) => setTimeout(resolve, 15));
    }
  }
}

/**
 * Factory function to retrieve the active AI provider.
 * Checks GEMINI_API_KEY environment variable.
 */
export function getAIProvider(): AIProvider {
  const apiKey = process.env.GEMINI_API_KEY;

  if (
    !apiKey ||
    apiKey === 'your-gemini-api-key-here' ||
    apiKey.trim().length === 0
  ) {
    return new FallbackProvider();
  }

  return new GeminiProvider(apiKey);
}

export { CAREER_ADVISOR_PROMPT, ROADMAP_GENERATOR_PROMPT, GENERAL_ASSISTANT_PROMPT };
