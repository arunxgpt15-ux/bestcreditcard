/**
 * ENGINE TYPES
 * ============
 * Core data structures for the recommendation engine.
 * These types define the user profile, evaluation results, and line items.
 */

import { z } from "zod";
import { SpendCategorySchema, CibilBandSchema, EmploymentTypeSchema } from "@/lib/schema/card";

/**
 * USER PROFILE
 * Captures all information needed to evaluate a card.
 */
export const UserSpendSchema = z.object({
  monthlyInr: z.number().describe("Monthly spend in paise"),
  channelSplit: z
    .object({
      online: z.number().min(0).max(1).describe("0-1, fraction online"),
      offline: z.number().min(0).max(1).describe("0-1, fraction offline"),
    })
    .optional(),
});

export const UserTravelSchema = z.object({
  domesticTripsPerYear: z.number().default(0),
  internationalTripsPerYear: z.number().default(0),
  loungeVisitsPerTrip: z.number().default(2),
  avgLoungeValueInr: z.number().default(120000).describe("₹1,200 default"),
  forexSpendPerYearInr: z.number().default(0).describe("In paise"),
});

export const UserAssumptionsSchema = z.object({
  pointValuationMode: z.enum(["conservative", "realistic", "optimistic"]).default("realistic"),
  loungeValueInr: z.number().optional().describe("Override lounge value"),
  breakageRate: z.number().min(0).max(1).default(0.1).describe("10% default"),
  discountRateForDelayedRewards: z.number().min(0).max(1).default(0.08),
  softBenefitUtilisation: z.record(z.number().min(0).max(1)).optional(),
});

export const UserWalletSchema = z.object({
  existingCardIds: z.array(z.string()).default([]),
  issuersBankedWith: z.array(z.string()).default([]),
});

export const UserProfileSchema = z.object({
  spends: z.record(SpendCategorySchema, UserSpendSchema),
  travel: UserTravelSchema.optional(),
  assumptions: UserAssumptionsSchema.optional(),
  wallet: UserWalletSchema.optional(),

  profile: z.object({
    employmentType: EmploymentTypeSchema.optional(),
    monthlyIncomeInr: z.number().optional().describe("In paise"),
    cityTier: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
    ageYears: z.number().optional(),
    cibilBand: CibilBandSchema.optional(),
    existingCardsCount: z.number().default(0),
    oldestCardVintageMonths: z.number().default(0),
    recentEnquiries6m: z.number().default(0),
    hasItr: z.boolean().default(false),
  }),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;
export type UserSpend = z.infer<typeof UserSpendSchema>;
export type UserTravel = z.infer<typeof UserTravelSchema>;
export type UserAssumptions = z.infer<typeof UserAssumptionsSchema>;
export type UserWallet = z.infer<typeof UserWalletSchema>;

/**
 * LINE ITEM
 * Atomic unit in the engine output: a single earning, cost, or benefit.
 * The sum of all line items must equal the final NAV.
 */
export const LineItemSchema = z.object({
  id: z.string().describe("Unique ID for this line item"),
  label: z.string().describe("Human-readable label"),
  category: z.enum([
    "earning",
    "lounge",
    "milestone",
    "soft_benefit",
    "fee",
    "surcharge",
    "forex_cost",
  ]),
  formula: z.string().describe("Human-readable formula, e.g., '5 pts/₹150 × 12 months'"),
  inputs: z.record(z.any()).describe("Input values used in the calculation"),
  grossValueInr: z.number().describe("Value before caps/surcharges in paise"),
  cappedValueInr: z.number().describe("Value after caps and exclusions in paise"),
  confidence: z.enum(["verified", "partial", "unverified"]),
  sourceUrl: z.string().url().optional(),
  notes: z.string().optional(),
});

export type LineItem = z.infer<typeof LineItemSchema>;

/**
 * CARD EVALUATION RESULT
 * Full breakdown of how a card performs for a user.
 */
export const CardEvaluationSchema = z.object({
  cardId: z.string(),
  profileHash: z.string().describe("SHA256 hash of the profile for caching"),

  // Main results
  netAnnualValueYear1Inr: z.number().describe("First year including joining fee"),
  netAnnualValueSteadyStateInr: z.number().describe("Ongoing years (no joining fee)"),

  // Breakdown
  grossBenefitsInr: z.number(),
  totalCostsInr: z.number(),
  clippedValueInr: z.number().describe("Value lost to caps, exclusions, breakage"),

  effectiveRewardRatePercent: z.number().describe("% of spend converted to value"),
  breakEvenMonthlySpendInr: z.number().nullable().describe("Monthly spend to reach 0 NAV"),

  // Line items (sum must equal netAnnualValue)
  lineItems: z.array(LineItemSchema),

  // Metadata
  dataConfidence: z.enum(["verified", "partial", "unverified"]),
  warnings: z.array(z.string()),
});

export type CardEvaluation = z.infer<typeof CardEvaluationSchema>;

/**
 * RANKED CARD
 * Card with its evaluation and ranking metadata.
 */
export const RankedCardSchema = CardEvaluationSchema.extend({
  rankPosition: z.number(),
  matchedPriorities: z.array(z.string()).optional(),
  approvalBand: z.enum(["low", "moderate", "good", "strong"]).optional(),
  approvalScore: z.number().optional(),
  tieBreakByPartner: z.boolean().default(false).describe("True if affiliate payout was used as tie-break"),
});

export type RankedCard = z.infer<typeof RankedCardSchema>;

/**
 * PORTFOLIO EVALUATION
 * Optimal spending allocation across multiple cards.
 */
export const PortfolioEvaluationSchema = z.object({
  cardIds: z.array(z.string()),
  totalNetAnnualValueInr: z.number(),
  perCardAllocation: z.record(
    z.string(),
    z.object({
      allocatedSpendInr: z.number(),
      earnedValueInr: z.number(),
      cardCostInr: z.number(),
      netValueInr: z.number(),
    })
  ),
  perCategoryBestCard: z.record(z.string(), z.string()).describe("Category → card ID"),
  totalFeesInr: z.number(),
  unusedEntitlements: z.array(
    z.object({
      cardId: z.string(),
      entitlement: z.string(),
      reason: z.string(),
    })
  ),
});

export type PortfolioEvaluation = z.infer<typeof PortfolioEvaluationSchema>;
