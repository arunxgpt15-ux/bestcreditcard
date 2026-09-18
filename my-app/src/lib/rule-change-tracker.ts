/**
 * RULE CHANGE TRACKER
 * ===================
 * Prompt 7: Content model for tracking card benefit changes
 * Example: HDFC removed 100k lounge cap in Jan 2025
 */

import { z } from "zod";

export const RuleChangeSchema = z.object({
  id: z.string().describe("Unique ID: card_id-timestamp"),
  cardId: z.string(),
  cardName: z.string(),
  issuer: z.string(),

  // What changed
  category: z.enum([
    "earning_rate",
    "cap_or_limit",
    "surcharge",
    "fee",
    "lounge_access",
    "milestone",
    "eligibility",
    "surcharge_removed",
    "benefit_added",
    "benefit_removed",
  ]),
  field: z.string().describe("What field changed: e.g., 'lounge.internationalVisitsPerYear'"),

  // Before & after
  valueBefore: z.string().describe("Human-readable: e.g., 'Unlimited'"),
  valueAfter: z.string().describe("e.g., 'Capped at 8/year'"),
  impact: z.enum(["positive", "neutral", "negative"]).describe("Impact on average user"),
  affectedUsers: z.string().describe("Who this affects: e.g., 'Users with <₹5L annual spend'"),

  // Metadata
  announcedAt: z.string().datetime().describe("When bank announced"),
  effectiveAt: z.string().datetime().describe("When it takes effect"),
  source: z.string().url().describe("Link to official announcement"),
  ourAnalysis: z.string().optional().describe("How we think about this change"),

  // Example impact
  exampleProfileImpact: z
    .object({
      profileDescription: z.string().describe("e.g., 'Frequent lounge user'"),
      navBefore: z.number().describe("In paise"),
      navAfter: z.number().describe("In paise"),
      navChange: z.number().describe("Percentage change"),
    })
    .optional(),

  verified: z.boolean().default(false).describe("Have we confirmed against MITC?"),
  verifiedAt: z.string().datetime().optional(),
  verifiedBy: z.string().optional(),
});

export type RuleChange = z.infer<typeof RuleChangeSchema>;

/**
 * Example: HDFC Infinia lounge devaluation (fictional)
 */
export const exampleRuleChange: RuleChange = {
  id: "hdfc-infinia-20250115-lounge",
  cardId: "hdfc-infinia",
  cardName: "HDFC Bank Infinia",
  issuer: "HDFC Bank",

  category: "lounge_access",
  field: "lounge.internationalVisitsPerYear",
  valueBefore: "Unlimited",
  valueAfter: "Capped at 12/year + 2 guests",
  impact: "negative",
  affectedUsers: "International frequent travelers (>1 trip/month)",

  announcedAt: "2025-01-10T00:00:00Z",
  effectiveAt: "2025-02-01T00:00:00Z",
  source: "https://www.hdfcbank.com/infinia/terms-update-jan-2025",
  ourAnalysis:
    "This change affects 15-20% of our user base. For travel-heavy users, this reduces Infinia's appeal. Cards like Amex Platinum compete now.",

  exampleProfileImpact: {
    profileDescription: "International traveller: 4 domestic + 4 international trips/year, 2 lounge visits per trip",
    navBefore: 9000000, // ₹90,000
    navAfter: 7500000, // ₹75,000
    navChange: -16.7,
  },

  verified: false,
  verifiedAt: undefined,
  verifiedBy: undefined,
};

/**
 * Store all rule changes in a database/file
 * This would be populated by:
 * 1. Manual tracking (data team)
 * 2. Automated MITC diff script (GitHub Actions)
 * 3. Community reports (user submissions)
 */
export const RULE_CHANGES: RuleChange[] = [
  // exampleRuleChange,
  // ... more changes
];

/**
 * Find all changes affecting a card
 */
export function getChangesForCard(cardId: string): RuleChange[] {
  return RULE_CHANGES.filter((change) => change.cardId === cardId).sort(
    (a, b) => new Date(b.effectiveAt).getTime() - new Date(a.effectiveAt).getTime()
  );
}

/**
 * Calculate cumulative NAV impact of all changes since a date
 */
export function cumulativeImpact(cardId: string, sinceDate: Date): number {
  const changes = getChangesForCard(cardId).filter((c) => new Date(c.effectiveAt) >= sinceDate);
  return changes.reduce((sum, c) => sum + (c.exampleProfileImpact?.navChange || 0), 0);
}
