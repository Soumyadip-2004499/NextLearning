import { z } from "zod";

// Note: Zod v4 uses z.string(), z.email() etc. differently from v3
// Using z.string().email() pattern for compatibility

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  role: z.enum(["STUDENT", "FACILITATOR"]),
  language: z.string().default("en"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const profileUpdateSchema = z.object({
  displayName: z.string().optional(),
  educationLevel: z.string().optional(),
  state: z.string().optional(),
  district: z.string().optional(),
  interests: z.array(z.string()).optional(),
  hobbies: z.array(z.string()).optional(),
  favoriteSubjects: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  careerAspirations: z.array(z.string()).optional(),
  learningStyle: z.string().optional(),
  careerPreference: z.string().optional(),
  availableHours: z.number().min(0).max(168).optional(),
  deviceAccess: z.string().optional(),
  onboardingCompleted: z.boolean().optional(),
});

export const chatMessageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(2000, "Message too long"),
  conversationHistory: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string(),
  })).optional(),
});

export const applicationStatusSchema = z.object({
  status: z.enum([
    "interested",
    "checking_eligibility",
    "preparing_documents",
    "ready_to_apply",
    "submitted",
    "awaiting_response",
    "completed",
    "closed",
  ]),
  notes: z.string().max(1000).optional(),
  nextAction: z.string().max(500).optional(),
});

export const trainingModuleSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  targetLevel: z.string().optional(),
  objectives: z.array(z.string()).optional(),
  accessType: z.enum(["free", "paid"]).default("free"),
  estimatedDuration: z.string().optional(),
});

export const moduleLessonSchema = z.object({
  title: z.string().min(2, "Lesson title is required"),
  content: z.string().optional(),
  resourceUrl: z.string().url().optional().or(z.literal("")),
  duration: z.string().optional(),
  activityType: z.enum(["lesson", "quiz", "activity", "assignment"]).default("lesson"),
});

export const recommendationSchema = z.object({
  studentId: z.string().min(1),
  type: z.enum(["resource", "opportunity", "career"]),
  referenceId: z.string().min(1),
  message: z.string().max(500).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
export type ApplicationStatusInput = z.infer<typeof applicationStatusSchema>;
export type TrainingModuleInput = z.infer<typeof trainingModuleSchema>;
export type ModuleLessonInput = z.infer<typeof moduleLessonSchema>;
export type RecommendationInput = z.infer<typeof recommendationSchema>;
