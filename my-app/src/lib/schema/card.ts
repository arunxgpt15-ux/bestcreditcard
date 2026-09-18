/**
 * CREDIT CARD DATA SCHEMA
 * ======================
 * Zod schemas for Indian credit cards with full auditability.
 * Every number must have a source_url, last_verified_at, and confidence.
 * Build-time validation will FAIL if required fields are missing or stale.
 *
 * Principle: Never invent T&C numbers. If unverified, mark confidence: 'unverified'.
 */

import { z } from "zod";

/**
 * SOURCED<T>: Metadata wrapper for any datapoint a user-facing number depends on.
 * Ensures full traceability from the engine output back to a source.
 */
export const SourcedSchema = <T extends z.ZodTypeAny>(schema: T) =>
  z.object({
    value: schema,
    sourceUrl: z.string().url().optional(),
    lastVerifiedAt: z.string().datetime().optional(), // ISO 8601
    confidence: z.enum(["verified", "partial", "unverified"]).default("unverified"),
  });

/**
 * Helper: Create a Sourced<T> instance
 */
export function sourced<T>(
  value: T,
  opts?: {
    sourceUrl?: string;
    lastVerifiedAt?: string;
    confidence?: "verified" | "partial" | "unverified";
  }
) {
  return {
    value,
    sourceUrl: opts?.sourceUrl,
    lastVerifiedAt: opts?.lastVerifiedAt,
    confidence: opts?.confidence ?? "unverified" as const,
  };
}

/**
 * Helper: Extract worst confidence from a list of Sourced items
 */
export function worstConfidence(
  items: Array<{ confidence: "verified" | "partial" | "unverified" }>
): "verified" | "partial" | "unverified" {
  if (items.some((i) => i.confidence === "unverified")) return "unverified";
  if (items.some((i) => i.confidence === "partial")) return "partial";
  return "verified";
}

// ============================================================================
// ENUMS
// ============================================================================

export const SpendCategorySchema = z.enum([
  "online_shopping",
  "offline_retail",
  "groceries",
  "dining",
  "food_delivery",
  "fuel",
  "utilities",
  "rent",
  "education",
  "insurance",
  "travel_flights",
  "travel_hotels",
  "ott_subscriptions",
  "wallet_load",
  "govt_payments",
  "telecom",
  "healthcare",
  "ecommerce_partner",
  "international",
  "other",
]);
export type SpendCategory = z.infer<typeof SpendCategorySchema>;

export const CardChannelSchema = z.enum([
  "online",
  "offline",
  "app",
  "partner_portal",
  "any",
]);
export type CardChannel = z.infer<typeof CardChannelSchema>;

export const EarnRateTypeSchema = z.enum([
  "points_per_x",
  "percent_cashback",
  "miles_per_x",
]);
export type EarnRateType = z.infer<typeof EarnRateTypeSchema>;

export const CapTypeSchema = z.enum([
  "points",
  "value",
  "spend",
]);
export type CapType = z.infer<typeof CapTypeSchema>;

export const SurchargeTypeSchema = z.enum([
  "fee_percent",
  "no_rewards",
  "capped_rewards",
  "blocked",
]);
export type SurchargeType = z.infer<typeof SurchargeTypeSchema>;

export const LoungeProgammeSchema = z.enum([
  "priority_pass",
  "dreamfolks",
  "visa",
  "mastercard",
  "issuer",
]);
export type LoungeProgamme = z.infer<typeof LoungeProgammeSchema>;

export const SoftBenefitTypeSchema = z.enum([
  "golf",
  "insurance",
  "concierge",
  "hotel_status",
  "memberships",
  "movie",
  "dining_programme",
]);
export type SoftBenefitType = z.infer<typeof SoftBenefitTypeSchema>;

export const CardStatusSchema = z.enum([
  "active",
  "discontinued",
  "invite_only",
]);
export type CardStatus = z.infer<typeof CardStatusSchema>;

export const EmploymentTypeSchema = z.enum([
  "salaried",
  "self_employed",
  "student",
  "freelancer",
]);
export type EmploymentType = z.infer<typeof EmploymentTypeSchema>;

export const ValidationCriteriaSchema = z.enum([
  "approval",
  "dispatch",
  "activation",
  "first_txn",
  "fee_payment",
]);
export type ValidationCriteria = z.infer<typeof ValidationCriteriaSchema>;

export const CibilBandSchema = z.enum([
  "<650",
  "650-699",
  "700-749",
  "750-799",
  "800+",
  "unknown",
]);
export type CibilBand = z.infer<typeof CibilBandSchema>;

// ============================================================================
// IDENTITY & METADATA
// ============================================================================

export const CardIdentitySchema = z.object({
  id: z.string().describe("Unique slug: e.g. 'hdfc-infinia', 'icici-apex'"),
  issuer: z.string().describe("Bank name: HDFC Bank, ICICI Bank, etc."),
  name: z.string().describe("Official card name"),
  network: z.array(z.enum(["visa", "mastercard", "rupay"])).min(1),
  variantOf: z.string().optional().describe("If this is a variant of another card (e.g. -v2)"),
  status: CardStatusSchema.default("active"),
});

// ============================================================================
// FEES & COSTS
// ============================================================================

export const FeeWaiverConditionSchema = z.object({
  condition: z.string().describe("E.g., '₹X annual spend', 'First year complimentary'"),
  source: z.string().url().optional(),
});

export const FeesSchema = z.object({
  joiningFee: z
    .object({
      value: z.number().describe("In paise (₹5,000 = 500000)"),
      source: z.string().url().optional(),
      lastVerifiedAt: z.string().datetime().optional(),
      confidence: z.enum(["verified", "partial", "unverified"]),
    })
    .optional()
    .nullable(),

  annualFee: z
    .object({
      value: z.number().describe("In paise (₹12,500 = 1250000)"),
      source: z.string().url().optional(),
      lastVerifiedAt: z.string().datetime().optional(),
      confidence: z.enum(["verified", "partial", "unverified"]),
    })
    .optional()
    .nullable(),

  gstRate: z.number().default(0.18).describe("Tax on fees, typically 18%"),

  feeWaiverSpendThreshold: z.number().optional().describe("In paise"),
  waiverConditions: z.array(FeeWaiverConditionSchema).default([]),

  addOnCardFee: z
    .object({
      value: z.number().describe("In paise"),
      source: z.string().url().optional(),
      confidence: z.enum(["verified", "partial", "unverified"]),
    })
    .optional(),
});

// ============================================================================
// REWARDS
// ============================================================================

export const EarnRuleSchema = z.object({
  id: z.string().describe("Unique ID for this rule, e.g., 'earn_online_5x'"),
  categories: z.array(SpendCategorySchema).describe("Which spend categories this rule applies to"),
  channel: CardChannelSchema.optional().default("any"),

  rate: z.object({
    type: EarnRateTypeSchema,
    value: z.number().describe("Points, miles, or percent value"),
    per: z.number().optional().describe("Per ₹X spend (e.g., rate=5, per=150 => 5 pts per ₹150)"),
  }),

  monthlyCapType: CapTypeSchema.optional(),
  monthlyCapValue: z.number().optional().describe("In paise or points, depending on capType"),

  statementCycleCap: z.number().optional().describe("In paise or points"),
  annualCap: z.number().optional().describe("In paise or points"),

  minTxnValue: z.number().optional().describe("Minimum transaction value in paise to earn"),
  maxTxnValue: z.number().optional().describe("Maximum transaction value in paise to earn"),

  excludedCategories: z.array(SpendCategorySchema).optional(),

  notes: z.string().optional(),
  source: z.string().url().optional(),
  lastVerifiedAt: z.string().datetime().optional(),
  confidence: z.enum(["verified", "partial", "unverified"]).default("unverified"),
});

export const PointValueRedemptionChannelSchema = z.object({
  name: z.string().describe("E.g., 'travel redemption', 'cashback'"),
  valuePerPoint: z.number().describe("₹ per point, in paise"),
  monthlyPointCap: z.number().optional(),
  redemptionFeeInr: z.number().optional().describe("In paise"),
  feeIsPerRedemption: z.boolean().optional(),
  minPoints: z.number().optional(),
  source: z.string().url().optional(),
  lastVerifiedAt: z.string().datetime().optional(),
  confidence: z.enum(["verified", "partial", "unverified"]),
});

export const PointValueSchema = z.object({
  baseValueInr: z.number().describe("Conservative ₹ per point, in paise"),
  bestCaseValueInr: z.number().describe("Optimistic ₹ per point, in paise"),
  redemptionChannels: z.array(PointValueRedemptionChannelSchema),
  source: z.string().url().optional(),
  lastVerifiedAt: z.string().datetime().optional(),
  confidence: z.enum(["verified", "partial", "unverified"]),
});

// ============================================================================
// SURCHARGES & EXCLUSIONS
// ============================================================================

export const SurchargeRuleSchema = z.object({
  category: z.enum([
    "rent",
    "utility",
    "education",
    "wallet_load",
    "fuel",
    "govt",
    "insurance",
    "ecom_aggregator",
  ]),
  type: SurchargeTypeSchema,
  value: z.number().optional().describe("Fee % or reward cap in paise/points"),
  thresholdInr: z.number().optional().describe("Only applies above this spend in paise"),
  source: z.string().url().optional(),
  lastVerifiedAt: z.string().datetime().optional(),
  confidence: z.enum(["verified", "partial", "unverified"]),
});

// ============================================================================
// LOUNGE
// ============================================================================

export const LoungeSchema = z.object({
  domesticVisitsPerYear: z.number().optional().describe("e.g., 4 or 'unlimited' => use null"),
  domesticPerQuarter: z.number().optional(),
  internationalVisitsPerYear: z.number().optional(),
  guestVisits: z.number().optional(),
  programme: LoungeProgammeSchema.optional(),
  spendConditionInr: z.number().optional().describe("Must spend this much to activate, in paise"),
  source: z.string().url().optional(),
  lastVerifiedAt: z.string().datetime().optional(),
  confidence: z.enum(["verified", "partial", "unverified"]),
});

// ============================================================================
// MILESTONES & BONUSES
// ============================================================================

export const MilestoneSchema = z.object({
  id: z.string(),
  spendThresholdInr: z.number().describe("In paise"),
  period: z.enum(["monthly", "quarterly", "annual"]),
  rewardType: z.string().describe("'points', 'cashback', etc."),
  rewardValueInr: z.number().describe("In paise"),
  description: z.string(),
  source: z.string().url().optional(),
  lastVerifiedAt: z.string().datetime().optional(),
  confidence: z.enum(["verified", "partial", "unverified"]),
});

// ============================================================================
// FOREX & INTERNATIONAL
// ============================================================================

export const ForexSchema = z.object({
  markupPercent: z.number().describe("E.g., 2.0 for 2%"),
  crossCurrencyMarkupPercent: z.number().optional(),
  source: z.string().url().optional(),
  lastVerifiedAt: z.string().datetime().optional(),
  confidence: z.enum(["verified", "partial", "unverified"]),
});

// ============================================================================
// SOFT BENEFITS
// ============================================================================

export const SoftBenefitSchema = z.object({
  type: SoftBenefitTypeSchema,
  nominalValueInr: z.number().describe("Asserted benefit value in paise"),
  defaultUtilisationRate: z.number().min(0).max(1).default(0).describe("0–1, default 0 (user must opt in)"),
  source: z.string().url().optional(),
  lastVerifiedAt: z.string().datetime().optional(),
  confidence: z.enum(["verified", "partial", "unverified"]),
});

// ============================================================================
// ELIGIBILITY
// ============================================================================

export const EligibilitySchema = z.object({
  minAgeYears: z.number().optional(),
  maxAgeYears: z.number().optional(),
  minMonthlyIncomeSalaried: z.number().optional().describe("In paise"),
  minAnnualIncomeSelfEmployed: z.number().optional().describe("In paise"),
  itrRequired: z.boolean().optional(),
  cityTiers: z.array(z.union([z.literal(1), z.literal(2), z.literal(3)])).optional(),
  minCibil: z.number().optional(),
  employmentTypes: z.array(EmploymentTypeSchema).optional(),
  requiresExistingCard: z.boolean().optional(),
  requiresExistingCardLimitInr: z.number().optional().describe("In paise"),
  requiresCardVintageMonths: z.number().optional(),
  ntbOnly: z.boolean().optional().describe("NTB = New-To-Bank"),
  source: z.string().url().optional(),
  lastVerifiedAt: z.string().datetime().optional(),
  confidence: z.enum(["verified", "partial", "unverified"]),
});

// ============================================================================
// AFFILIATE & TRACKING
// ============================================================================

export const AffiliateSchema = z.object({
  networkId: z.string().describe("E.g., 'impact', 'cuelinks', 'post_affiliate_pro'"),
  campaignId: z.string(),

  payoutNtbInr: z.number().optional().describe("NTB payout in paise"),
  payoutEtbInr: z.number().optional().describe("ETB payout in paise"),

  validationCriteria: ValidationCriteriaSchema,
  validationRatePercent: z.number().optional().describe("% of applications that validate"),

  cookieDays: z.number().optional(),
  allowsSocial: z.boolean().default(false),
  allowsDeeplink: z.boolean().default(false),
  allowsIncentive: z.boolean().default(false),
  allowsEmail: z.boolean().default(false),
  multiCardUsersRejected: z.boolean().optional(),

  lastPayoutUpdatedAt: z.string().datetime().optional(),
});

// ============================================================================
// METADATA
// ============================================================================

export const MetaSchema = z.object({
  mitcUrl: z.string().url().describe("Official Terms & Conditions PDF/page"),
  tncUrl: z.string().url().optional(),
  lastVerifiedAt: z.string().datetime().describe("When the entire card was last spot-checked"),
  verifiedBy: z.string().optional().describe("Who verified it (e.g., 'arun', 'team-verify')"),
  confidence: z.enum(["verified", "partial", "unverified"]).describe("Overall card data confidence"),
});

// ============================================================================
// MAIN CARD SCHEMA
// ============================================================================

export const CreditCardSchema = z.object({
  identity: CardIdentitySchema,
  fees: FeesSchema,
  rewards: z.array(EarnRuleSchema),
  pointValue: PointValueSchema.optional(),
  surcharges: z.array(SurchargeRuleSchema).default([]),
  lounge: LoungeSchema.optional(),
  milestones: z.array(MilestoneSchema).default([]),
  forex: ForexSchema.optional(),
  softBenefits: z.array(SoftBenefitSchema).default([]),
  eligibility: EligibilitySchema.optional(),
  affiliate: AffiliateSchema.optional(),
  meta: MetaSchema,
});

export type CreditCard = z.infer<typeof CreditCardSchema>;

// Re-exports for convenience
export type {
  SpendCategory,
  CardChannel,
  EarnRateType,
  CapType,
  SurchargeType,
  LoungeProgamme,
  SoftBenefitType,
  CardStatus,
  EmploymentType,
  ValidationCriteria,
  CibilBand,
};
