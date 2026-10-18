/**
 * Career Matching Engine for NextLearning Platform
 * 
 * ============================================================================
 * SCORING METHODOLOGY & DESIGN PRINCIPLES
 * ============================================================================
 * 
 * The matching algorithm computes a holistic compatibility score (0-100)
 * between a student's profile and each career path, based on four weighted pillars:
 * 
 * 1. Interest Alignment (Weight: 0.30):
 *    - Tokenizes student interests and evaluates overlap against career category,
 *      description, and required skills.
 *    - Direct category matches provide strong confidence (1.0).
 *    - Contextual keyword presence in career descriptions provides semantic alignment.
 *    - Generates personalized human-readable reason strings.
 * 
 * 2. Skill Alignment (Weight: 0.25):
 *    - Matches student's existing skills against career required and recommended skills.
 *    - Uses normalized token matching to account for phrasing differences
 *      (e.g., "Computer" matches "Basic Computer Operations").
 *    - Generates reasons celebrating transferable skills.
 * 
 * 3. Goal Alignment (Weight: 0.25):
 *    - Compares student's career aspirations against career titles and sectors.
 *    - Cross-references student's `careerPreference` (employment, education,
 *      vocational, entrepreneurship) with career archetypes.
 *    - Generates reasons explaining pathway synergy.
 * 
 * 4. Education Compatibility (Weight: 0.20):
 *    - Maps Indian education levels (Class 8 to Postgraduate / NIOS) to an ordinal scale.
 *    - Analyzes career prerequisites from `requiredQualifications` and `educationPaths`.
 *    - Awards full points if the student meets/exceeds the prerequisites, partial points
 *      if a viable bridge pathway (e.g. diploma/ITI) exists from their current level.
 *    - Generates reasons highlighting accessibility from current schooling.
 */

import { parseJsonField } from "@/lib/utils";

export interface MatchInput {
  interests: string[];
  skills: string[];
  careerAspirations: string[];
  educationLevel: string;
  careerPreference: string;
  learningStyle?: string;
}

export interface CareerMatch {
  careerId: string;
  score: number;
  breakdown: {
    interestAlignment: number; // 0-1
    skillAlignment: number; // 0-1  
    goalAlignment: number; // 0-1
    educationCompatibility: number; // 0-1
  };
  reasons: string[];
}

export interface CareerCandidate {
  id: string;
  title: string;
  slug?: string;
  category: string;
  description: string;
  requiredSkills: string[] | string;
  requiredQualifications?: string[] | string | null;
  educationPaths?: string[] | string | null;
  demandLevel?: string | null;
  growthOutlook?: string | null;
}

/**
 * Configurable weights for each matching dimension.
 * Must sum to 1.0.
 */
export const MATCH_WEIGHTS = {
  interest: 0.30,
  skills: 0.25,
  goals: 0.25,
  education: 0.20,
} as const;

// Common English/Hinglish stop words to remove for token matching
const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "in", "on", "at", "to", "for", "of", "with",
  "by", "from", "as", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "per", "annum", "level", "pass",
  "any", "etc", "such", "other", "into", "over", "after", "before", "between",
]);

/**
 * Tokenize a text string into normalized lowercase keyword tokens
 */
function tokenize(text: string | null | undefined): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

/**
 * Maps category IDs and synonym keywords for enhanced interest matching
 */
const CATEGORY_SYNONYMS: Record<string, string[]> = {
  technology: ["tech", "coding", "computers", "software", "hardware", "web", "internet", "electronics", "programming", "it", "data", "cyber"],
  healthcare: ["health", "medical", "doctor", "nurse", "nursing", "medicine", "pharmacy", "clinic", "hospital", "patient", "wellness", "care"],
  education: ["teaching", "teacher", "school", "students", "children", "tutoring", "training", "instruction", "learning", "classroom"],
  agriculture: ["farming", "farmer", "crops", "soil", "agritech", "organic", "plants", "horticulture", "dairy", "drone", "irrigation"],
  environment: ["clean energy", "solar", "sustainability", "green", "nature", "conservation", "water", "ecology", "waste", "renewable"],
  trades: ["mechanic", "electrician", "electrical", "plumbing", "welding", "automotive", "repair", "fitter", "machining", "technical", "wiring"],
  business: ["business", "entrepreneurship", "retail", "shop", "sales", "marketing", "store", "kirana", "trade", "commerce", "startup"],
  creative: ["art", "design", "graphic", "media", "video", "drawing", "painting", "craft", "handicraft", "animation", "photography"],
  hospitality: ["hotel", "tourism", "cooking", "chef", "culinary", "restaurant", "food", "travel", "homestay", "catering", "tour"],
  finance: ["banking", "accounts", "accounting", "gst", "tally", "finance", "money", "loan", "microfinance", "insurance", "bank"],
  community: ["social work", "ngo", "panchayat", "village", "community", "welfare", "women", "shg", "counseling", "help"],
  manufacturing: ["factory", "industry", "production", "warehouse", "logistics", "supply chain", "packaging", "operations", "assembly"],
};

/**
 * Education level ranking (ordinal value from 8 to 17)
 */
const EDUCATION_RANKS: Record<string, number> = {
  class_8: 8,
  class_9: 9,
  class_10: 10,
  open_school: 10,
  vocational_iti: 11,
  class_11: 11,
  class_12: 12,
  polytechnic_diploma: 13,
  undergraduate: 15,
  postgraduate: 17,
};

/**
 * Parses the minimum required education rank from qualification and education strings
 */
function inferRequiredEducationRank(qualifications: string[], educationPaths: string[]): number {
  const combinedText = [...qualifications, ...educationPaths].join(" ").toLowerCase();

  if (combinedText.includes("postgraduate") || combinedText.includes("master") || combinedText.includes("msc") || combinedText.includes("mcom") || combinedText.includes("mtech") || combinedText.includes("mca")) {
    return 17;
  }
  if (combinedText.includes("graduation") || combinedText.includes("bachelor") || combinedText.includes("bca") || combinedText.includes("btech") || combinedText.includes("bcom") || combinedText.includes("bsc") || combinedText.includes("bsw") || combinedText.includes("bba")) {
    // If it also says "Class 10 or Class 12 pass", favor lower entry requirement
    if (combinedText.includes("class 10 pass") || combinedText.includes("class 10 or 12")) {
      return 10;
    }
    if (combinedText.includes("class 12 in any stream") || combinedText.includes("class 12 pass")) {
      return 12;
    }
    return 15;
  }
  if (combinedText.includes("polytechnic diploma") || combinedText.includes("diploma")) {
    if (combinedText.includes("class 10")) return 10;
    return 12;
  }
  if (combinedText.includes("iti") || combinedText.includes("class 10 or class 12") || combinedText.includes("class 10 pass") || combinedText.includes("class 10")) {
    return 10;
  }
  if (combinedText.includes("class 12")) {
    return 12;
  }
  if (combinedText.includes("class 8")) {
    return 8;
  }

  // Default baseline entry for vocational careers
  return 10;
}

/**
 * Normalizes string or array fields to array of strings
 */
function toArray(value: string[] | string | null | undefined): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return parseJsonField<string[]>(value, []);
}

/**
 * Matches a single career candidate against student inputs
 */
export function matchCareer(input: MatchInput, career: CareerCandidate): CareerMatch {
  const reasons: string[] = [];
  const requiredSkills = toArray(career.requiredSkills);
  const requiredQualifications = toArray(career.requiredQualifications);
  const educationPaths = toArray(career.educationPaths);

  // --------------------------------------------------------------------------
  // 1. Interest Alignment (Weight: 0.30)
  // --------------------------------------------------------------------------
  let interestAlignment = 0;
  const studentInterests = (input.interests || []).map((i) => i.trim().toLowerCase());

  if (studentInterests.length === 0) {
    // Neutral fallback when student hasn't entered interests yet
    interestAlignment = 0.5;
  } else {
    const careerCategory = (career.category || "").toLowerCase();
    const categoryKeywords = CATEGORY_SYNONYMS[careerCategory] || [careerCategory];
    const careerTokens = new Set([
      ...tokenize(career.title),
      ...tokenize(career.description),
      ...tokenize(requiredSkills.join(" ")),
    ]);

    let matchedInterestsCount = 0;
    const matchedInterestNames: string[] = [];

    for (const interest of studentInterests) {
      const interestTokens = tokenize(interest);
      const isCategoryMatch = categoryKeywords.some((ck) => interest.includes(ck) || ck.includes(interest));
      const hasTokenMatch = interestTokens.some((tok) => careerTokens.has(tok));

      if (isCategoryMatch || hasTokenMatch) {
        matchedInterestsCount++;
        matchedInterestNames.push(interest);
      }
    }

    const hitRate = matchedInterestsCount / studentInterests.length;

    // Direct category synergy bonus
    const isDirectCategoryMatch = studentInterests.some((interest) =>
      categoryKeywords.some((ck) => interest.includes(ck) || ck.includes(interest))
    );

    if (isDirectCategoryMatch) {
      interestAlignment = Math.min(1.0, 0.45 + hitRate * 0.55);
      reasons.push(
        `Strongly aligns with your interest in ${matchedInterestNames.slice(0, 2).join(" & ") || "this field"}`
      );
    } else if (matchedInterestsCount > 0) {
      interestAlignment = Math.min(1.0, 0.35 + hitRate * 0.5);
      reasons.push(`Connects with your curiosity about ${matchedInterestNames[0]}`);
    } else {
      interestAlignment = 0.25;
    }
  }

  // --------------------------------------------------------------------------
  // 2. Skill Alignment (Weight: 0.25)
  // --------------------------------------------------------------------------
  let skillAlignment = 0;
  const studentSkills = (input.skills || []).map((s) => s.trim().toLowerCase());

  if (studentSkills.length === 0) {
    // Foundational baseline for entry-level learners
    skillAlignment = 0.45;
  } else {
    const matchedSkillsList: string[] = [];

    for (const reqSkill of requiredSkills) {
      const reqLower = reqSkill.toLowerCase();
      const reqTokens = tokenize(reqSkill);

      const hasMatch = studentSkills.some((sSkill) => {
        if (sSkill === reqLower || reqLower.includes(sSkill) || sSkill.includes(reqLower)) {
          return true;
        }
        const sTokens = tokenize(sSkill);
        return sTokens.some((st) => reqTokens.includes(st));
      });

      if (hasMatch) {
        matchedSkillsList.push(reqSkill);
      }
    }

    if (requiredSkills.length > 0) {
      const skillRatio = matchedSkillsList.length / requiredSkills.length;
      skillAlignment = Math.min(1.0, skillRatio * 0.7 + (matchedSkillsList.length > 0 ? 0.3 : 0.15));
    } else {
      skillAlignment = 0.5;
    }

    if (matchedSkillsList.length > 0) {
      reasons.push(
        `Your skills in "${matchedSkillsList[0]}" give you an initial head start`
      );
    }
  }

  // --------------------------------------------------------------------------
  // 3. Goal Alignment (Weight: 0.25)
  // --------------------------------------------------------------------------
  let goalAlignment = 0;
  const aspirations = (input.careerAspirations || []).map((a) => a.trim().toLowerCase());
  const preference = (input.careerPreference || "").toLowerCase();

  const titleTokens = tokenize(career.title);
  const categoryTokens = tokenize(career.category);

  let aspirationMatched = false;
  for (const aspiration of aspirations) {
    const aspTokens = tokenize(aspiration);
    const matchesTitle = aspTokens.some((t) => titleTokens.includes(t));
    const matchesCategory = aspTokens.some((t) => categoryTokens.includes(t));

    if (matchesTitle) {
      aspirationMatched = true;
      goalAlignment = 0.95;
      reasons.push(`Directly matches your stated career goal of "${aspiration}"`);
      break;
    } else if (matchesCategory) {
      aspirationMatched = true;
      goalAlignment = 0.78;
      reasons.push(`Supports your broader aspiration in ${career.category}`);
      break;
    }
  }

  if (!aspirationMatched) {
    if (aspirations.length === 0) {
      goalAlignment = 0.5;
    } else {
      goalAlignment = 0.35;
    }
  }

  // Career preference synergy check (employment, vocational, entrepreneurship, education)
  if (preference) {
    const isVocationalCareer = ["trades", "environment", "manufacturing"].includes(career.category);
    const isEntrepreneurialCareer = ["business", "agriculture"].includes(career.category) ||
      career.title.toLowerCase().includes("entrepreneur") ||
      career.title.toLowerCase().includes("retail");
    const isAcademicCareer = ["education", "technology"].includes(career.category);

    if (
      (preference.includes("vocational") && isVocationalCareer) ||
      (preference.includes("entrepreneur") && isEntrepreneurialCareer) ||
      (preference.includes("education") && isAcademicCareer) ||
      (preference.includes("employment"))
    ) {
      goalAlignment = Math.min(1.0, goalAlignment + 0.12);
      if (reasons.length < 3) {
        reasons.push(`Fits your preferred ${preference} learning track`);
      }
    }
  }

  // --------------------------------------------------------------------------
  // 4. Education Compatibility (Weight: 0.20)
  // --------------------------------------------------------------------------
  let educationCompatibility = 0;
  const studentRank = EDUCATION_RANKS[input.educationLevel] || 10;
  const requiredRank = inferRequiredEducationRank(requiredQualifications, educationPaths);

  if (studentRank >= requiredRank) {
    educationCompatibility = 1.0;
    reasons.push("Your current education level meets entry requirements");
  } else if (studentRank >= requiredRank - 2) {
    // Bridgeable gap (e.g., student is Class 10 and career requires Class 12 or ITI diploma)
    educationCompatibility = 0.72;
    reasons.push("Directly accessible through a recommended bridge course or short diploma");
  } else {
    // Requires extended academic pathway
    educationCompatibility = 0.45;
  }

  // Fallback reason if none were triggered
  if (reasons.length === 0) {
    reasons.push(`A strong practical career option in ${career.category}`);
  }

  // --------------------------------------------------------------------------
  // Final Weighted Score Calculation (0 - 100)
  // --------------------------------------------------------------------------
  const weightedSum =
    interestAlignment * MATCH_WEIGHTS.interest +
    skillAlignment * MATCH_WEIGHTS.skills +
    goalAlignment * MATCH_WEIGHTS.goals +
    educationCompatibility * MATCH_WEIGHTS.education;

  const score = Math.round(Math.min(100, Math.max(0, weightedSum * 100)));

  return {
    careerId: career.id,
    score,
    breakdown: {
      interestAlignment: Number(interestAlignment.toFixed(2)),
      skillAlignment: Number(skillAlignment.toFixed(2)),
      goalAlignment: Number(goalAlignment.toFixed(2)),
      educationCompatibility: Number(educationCompatibility.toFixed(2)),
    },
    reasons: reasons.slice(0, 3),
  };
}

/**
 * Matches an array of careers against student input and sorts them descending by score
 */
export function matchCareers(input: MatchInput, careers: CareerCandidate[]): CareerMatch[] {
  const matches = careers.map((career) => matchCareer(input, career));
  return matches.sort((a, b) => b.score - a.score);
}
