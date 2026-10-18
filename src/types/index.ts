// ============================================
// NextLearning Platform Core Types
// ============================================

// --- User & Auth ---
export type UserRole = "STUDENT" | "FACILITATOR" | "ADMIN";

export interface UserSession {
  id: string;
  name: string | null;
  email: string | null;
  role: UserRole;
  language: string;
  image: string | null;
}

// --- Student Profile ---
export interface StudentProfileData {
  id: string;
  displayName: string | null;
  educationLevel: string | null;
  state: string | null;
  district: string | null;
  interests: string[];
  hobbies: string[];
  favoriteSubjects: string[];
  skills: string[];
  careerAspirations: string[];
  learningStyle: string | null;
  careerPreference: string | null;
  availableHours: number | null;
  deviceAccess: string | null;
  onboardingCompleted: boolean;
}

// --- Onboarding ---
export interface OnboardingStep {
  id: string;
  question: string;
  description?: string;
  type: "text" | "select" | "multi-select" | "chips";
  field: keyof StudentProfileData;
  options?: { label: string; value: string }[];
  required?: boolean;
}

// --- Career ---
export interface CareerCard {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  requiredSkills: string[];
  matchScore?: number;
  matchReasons?: string[];
  isSampleData: boolean;
}

export interface CareerDetail extends CareerCard {
  requiredQualifications: string[];
  salaryRange: string | null;
  demandLevel: string | null;
  growthOutlook: string | null;
  firstSteps: string[];
  educationPaths: string[];
  relatedCareers: string[];
  sourceUrl: string | null;
}

// --- Career Matching ---
export interface CareerMatchResult {
  career: CareerCard;
  score: number;
  breakdown: {
    interestAlignment: number;
    skillAlignment: number;
    goalAlignment: number;
    educationCompatibility: number;
  };
  reasons: string[];
}

// --- Learning Roadmap ---
export interface RoadmapData {
  id: string;
  careerTitle: string;
  description: string | null;
  status: string;
  steps: RoadmapStepData[];
  createdAt: string;
}

export interface RoadmapStepData {
  id: string;
  order: number;
  title: string;
  description: string | null;
  type: "learn" | "practice" | "exam" | "milestone";
  status: "pending" | "in_progress" | "completed" | "skipped";
  duration: string | null;
  resourceTitle?: string;
  resourceUrl?: string;
  completedAt: string | null;
}

// --- Opportunity ---
export interface OpportunityData {
  id: string;
  title: string;
  category: string;
  provider: string | null;
  description: string;
  eligibleLevels: string[];
  location: string | null;
  skills: string[];
  openDate: string | null;
  closeDate: string | null;
  applicationUrl: string | null;
  sourceUrl: string | null;
  lastVerified: string | null;
  verificationStatus: string;
  isSampleData: boolean;
}

export interface SavedOpportunityData extends OpportunityData {
  savedAt: string;
  notes: string | null;
}

// --- Application Tracking ---
export type ApplicationStatus =
  | "interested"
  | "checking_eligibility"
  | "preparing_documents"
  | "ready_to_apply"
  | "submitted"
  | "awaiting_response"
  | "completed"
  | "closed";

export interface ApplicationRecordData {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  status: ApplicationStatus;
  notes: string | null;
  nextAction: string | null;
  updatedAt: string;
}

// --- Learning Resource ---
export interface LearningResourceData {
  id: string;
  title: string;
  description: string | null;
  provider: string | null;
  resourceType: string | null;
  url: string | null;
  language: string;
  educationLevel: string[];
  subjects: string[];
  skills: string[];
  duration: string | null;
  difficulty: string | null;
  isSampleData: boolean;
}

// --- Training Module ---
export interface TrainingModuleData {
  id: string;
  title: string;
  description: string | null;
  targetLevel: string | null;
  objectives: string[];
  status: string;
  accessType: string;
  estimatedDuration: string | null;
  lessons: ModuleLessonData[];
}

export interface ModuleLessonData {
  id: string;
  order: number;
  title: string;
  content: string | null;
  resourceUrl: string | null;
  duration: string | null;
  activityType: string | null;
}

// --- Organization ---
export interface OrganizationData {
  id: string;
  name: string;
  type: string;
  description: string | null;
  expertise: string[];
  location: string | null;
  serviceArea: string | null;
  contactUrl: string | null;
  website: string | null;
  verified: boolean;
  isSampleData: boolean;
}

// --- Chat / AI ---
export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  sources?: ChatSource[];
  timestamp: Date;
}

export interface ChatSource {
  title: string;
  url?: string;
  type: string;
}

// --- Facilitator Dashboard ---
export interface FacilitatorStudentSummary {
  studentId: string;
  displayName: string;
  educationLevel: string | null;
  interests: string[];
  careerAspirations: string[];
  roadmapCount: number;
  lastActive: string | null;
  progressEvents: number;
}

// --- Offline Sync ---
export interface SyncQueueItem {
  id: string;
  action: string;
  endpoint: string;
  payload: Record<string, unknown>;
  createdAt: string;
  retryCount: number;
}

// --- API Responses ---
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
}
