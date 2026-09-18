/**
 * QUIZ & USER INPUT TYPES
 * =======================
 * Prompt 4: Quiz structure and user interaction
 */

import { z } from "zod";
import { SpendCategorySchema, EmploymentTypeSchema, CibilBandSchema } from "@/lib/schema/card";

/**
 * Quiz progress tracking
 */
export const QuizStepSchema = z.enum([
  "goal",
  "spend",
  "channel",
  "travel",
  "eligibility",
  "credit",
  "benefits",
  "complete",
]);

/**
 * Quiz response for each step
 */
export const QuizResponseSchema = z.object({
  // Step 1: Goal
  goal: z.array(z.enum(["cashback", "travel_miles", "hotel_stays", "build_credit", "lifetime_free", "upgrade"])).optional(),

  // Step 2: Spend
  monthlySpends: z.record(SpendCategorySchema, z.number().min(0)).optional(),

  // Step 3: Channel split
  onlinePercentage: z.number().min(0).max(100).default(50).optional(),

  // Step 4: Travel
  domesticTripsPerYear: z.number().min(0).default(0).optional(),
  internationalTripsPerYear: z.number().min(0).default(0).optional(),
  loungeVisitsPerTrip: z.number().min(0).default(2).optional(),
  forexSpendPerYearInr: z.number().min(0).default(0).optional(),

  // Step 5: Eligibility
  employmentType: EmploymentTypeSchema.optional(),
  monthlyIncomeBand: z.enum(["<50k", "50-75k", "75-150k", "150-300k", "300k+", "unsure"]).optional(),
  cityTier: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
  ageBand: z.enum(["18-25", "25-35", "35-50", "50-65", "65+"]).optional(),
  hasItr: z.boolean().default(false).optional(),

  // Step 6: Credit context
  cibilBand: CibilBandSchema.optional(),
  existingCardsCount: z.number().min(0).default(0).optional(),
  oldestCardVintageMonths: z.number().min(0).default(0).optional(),
  recentEnquiries6m: z.number().min(0).default(0).optional(),
  issuersBankedWith: z.array(z.string()).optional(),

  // Step 7: Benefit usage
  softBenefitUtilisation: z.record(z.number().min(0).max(1)).optional(),

  // Metadata
  timestamp: z.string().datetime().optional(),
  sessionId: z.string().optional(),
});

export type QuizResponse = z.infer<typeof QuizResponseSchema>;

/**
 * Convert quiz response to UserProfile
 */
export function quizResponseToProfile(response: QuizResponse) {
  return {
    spends: response.monthlySpends || {},
    travel: {
      domesticTripsPerYear: response.domesticTripsPerYear || 0,
      internationalTripsPerYear: response.internationalTripsPerYear || 0,
      loungeVisitsPerTrip: response.loungeVisitsPerTrip || 2,
      forexSpendPerYearInr: response.forexSpendPerYearInr || 0,
    },
    assumptions: {
      softBenefitUtilisation: response.softBenefitUtilisation || {},
    },
    wallet: {
      issuersBankedWith: response.issuersBankedWith || [],
    },
    profile: {
      employmentType: response.employmentType,
      ageYears: response.ageBand ? parseAgeFromBand(response.ageBand) : undefined,
      cibilBand: response.cibilBand,
      existingCardsCount: response.existingCardsCount || 0,
      oldestCardVintageMonths: response.oldestCardVintageMonths || 0,
      recentEnquiries6m: response.recentEnquiries6m || 0,
      hasItr: response.hasItr,
    },
  };
}

function parseAgeFromBand(band: string): number {
  const bandMap: Record<string, number> = {
    "18-25": 21,
    "25-35": 30,
    "35-50": 42,
    "50-65": 57,
    "65+": 70,
  };
  return bandMap[band] || 30;
}

function parseIncomeFromBand(band: string): number {
  const bandMap: Record<string, number> = {
    "<50k": 4000 * 100, // ₹40k in paise
    "50-75k": 6250 * 100,
    "75-150k": 112500 * 100,
    "150-300k": 225000 * 100,
    "300k+": 400000 * 100,
    "unsure": 0,
  };
  return bandMap[band] || 0;
}
