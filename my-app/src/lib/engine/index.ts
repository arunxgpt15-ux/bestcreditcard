/**
 * ENGINE INDEX
 * ============
 * Main orchestrator: ties together earn, redeem, benefits, costs modules.
 * Evaluates a single card and ranks a card pool.
 */

import crypto from "crypto";
import type { CreditCard } from "@/lib/schema/card";
import type { CardEvaluation, LineItem, RankedCard, UserProfile } from "./types";
import { computeEarnings } from "./earn";
import { valuePoints } from "./redeem";
import { computeLoungeValue, computeMilestoneValue, computeSoftBenefitValue } from "./benefits";
import { computeFeeCosts, computeForexCosts, computeAddOnCardCosts } from "./costs";
import { hardEligibility } from "./eligibility";
import { approvalLikelihood } from "./approval";
import { worstConfidence } from "@/lib/schema/card";

/**
 * Hash a user profile for caching purposes.
 */
function hashProfile(profile: UserProfile): string {
  const profileStr = JSON.stringify(profile);
  return crypto.createHash("sha256").update(profileStr).digest("hex").slice(0, 16);
}

/**
 * Main evaluation function: compute NAV for a card given a user profile.
 * Returns a complete breakdown with line items.
 */
export function evaluateCard(card: CreditCard, profile: UserProfile): CardEvaluation {
  const profileHash = hashProfile(profile);
  const allLineItems: LineItem[] = [];
  const warnings: string[] = [];

  // Step 1: Compute earnings (with caps & surcharges)
  const { lineItems: earnLineItems, totalEarningsInr } = computeEarnings(card, profile);
  allLineItems.push(...earnLineItems);

  // Step 2: Value points/miles (if applicable)
  // Extract total points earned from line items (heuristic: they're stored as 100x paise)
  const pointLineItems = earnLineItems.filter((l) => l.label.includes("points"));
  const totalPointsEarned = pointLineItems.reduce((sum, l) => sum + l.cappedValueInr / 100, 0);

  let pointValueInr = 0;
  if (totalPointsEarned > 0 && card.pointValue) {
    const { netValueInr, lineItems: pointValueItems } = valuePoints(card, totalPointsEarned, profile);
    pointValueInr = netValueInr;
    allLineItems.push(...pointValueItems);
  }

  // Step 3: Lounge value
  const { valueInr: loungeValueInr, lineItems: loungeLineItems } = computeLoungeValue(card, profile);
  allLineItems.push(...loungeLineItems);

  // Step 4: Milestone value
  const { valueInr: milestoneValueInr, lineItems: milestoneLineItems } = computeMilestoneValue(
    card,
    profile
  );
  allLineItems.push(...milestoneLineItems);

  // Step 5: Soft benefits
  const { valueInr: softBenefitValueInr, lineItems: softBenefitLineItems } = computeSoftBenefitValue(
    card,
    profile
  );
  allLineItems.push(...softBenefitLineItems);

  // Step 6: Costs — fees, forex, add-ons
  const { year1CostInr, steadyStateCostInr, lineItems: feeLineItems } = computeFeeCosts(
    card,
    profile
  );
  const { costInr: forexCostInr, lineItems: forexLineItems } = computeForexCosts(card, profile);
  const { costInr: addOnCostInr, lineItems: addOnLineItems } = computeAddOnCardCosts(card);

  allLineItems.push(...feeLineItems, ...forexLineItems, ...addOnLineItems);

  // Step 7: Compute totals
  const grossBenefits =
    totalEarningsInr + pointValueInr + loungeValueInr + milestoneValueInr + softBenefitValueInr;
  const year1TotalCosts = year1CostInr + forexCostInr + addOnCostInr;
  const steadyStateTotalCosts = steadyStateCostInr + forexCostInr + addOnCostInr;

  const netAnnualValueYear1Inr = grossBenefits - year1TotalCosts;
  const netAnnualValueSteadyStateInr = grossBenefits - steadyStateTotalCosts;

  // Step 8: Compute clipped value (sum of negative line items that represent lost value)
  const clippedValueInr = allLineItems
    .filter((l) => l.category === "surcharge" || l.category === "forex_cost" || l.category === "fee")
    .reduce((sum, l) => sum + Math.abs(l.cappedValueInr), 0);

  // Step 9: Compute effective reward rate
  let annualSpendInr = 0;
  for (const spend of Object.values(profile.spends)) {
    annualSpendInr += spend.monthlyInr * 12;
  }
  const effectiveRewardRatePercent =
    annualSpendInr > 0 ? (netAnnualValueSteadyStateInr / annualSpendInr) * 100 : 0;

  // Step 10: Compute break-even spend (binary search)
  const breakEvenMonthlySpend = computeBreakEvenSpend(card, profile, netAnnualValueSteadyStateInr);

  // Step 11: Data confidence (worst across all line items)
  const dataConfidence = worstConfidence(allLineItems);

  // Step 12: Generate warnings
  if (dataConfidence === "unverified") {
    warnings.push(
      "This card's data is not yet verified against official sources. Treat numbers as estimates."
    );
  }
  if (dataConfidence === "partial") {
    warnings.push(
      "Some of this card's terms are derived from unofficial sources. Verify before applying."
    );
  }

  // Verify line item sum equals NAV (invariant check)
  const lineItemSum = allLineItems.reduce((sum, l) => sum + l.cappedValueInr, 0);
  if (Math.abs(lineItemSum - netAnnualValueSteadyStateInr) > 1) {
    // Allow 1 paise rounding error
    warnings.push(
      `[INTERNAL] Line item sum (₹${(lineItemSum / 100).toFixed(2)}) ≠ NAV (₹${(netAnnualValueSteadyStateInr / 100).toFixed(2)})`
    );
  }

  return {
    cardId: card.identity.id,
    profileHash,
    netAnnualValueYear1Inr,
    netAnnualValueSteadyStateInr,
    grossBenefitsInr: grossBenefits,
    totalCostsInr: steadyStateTotalCosts,
    clippedValueInr,
    effectiveRewardRatePercent,
    breakEvenMonthlySpendInr: breakEvenMonthlySpend,
    lineItems: allLineItems,
    dataConfidence,
    warnings,
  };
}

/**
 * Binary search to find the monthly spend level at which NAV reaches 0.
 */
function computeBreakEvenSpend(
  card: CreditCard,
  profile: UserProfile,
  steadyStateNAV: number
): number | null {
  if (steadyStateNAV > 0) {
    // Already profitable at user's current spend level
    // To find break-even, scale down spend until NAV hits 0

    let lowerBound = 0;
    let upperBound = 10000000; // ₹1,00,000 per month
    let iterations = 0;
    const maxIterations = 50;

    while (iterations < maxIterations && upperBound - lowerBound > 100) {
      const midSpend = (lowerBound + upperBound) / 2;
      const testProfile = { ...profile };

      // Scale all spends proportionally
      for (const category in testProfile.spends) {
        const originalSpend = profile.spends[category as keyof typeof profile.spends];
        testProfile.spends[category as keyof typeof profile.spends] = {
          monthlyInr: (originalSpend.monthlyInr * midSpend) / 1000000,
          channelSplit: originalSpend.channelSplit,
        };
      }

      const testEval = evaluateCard(card, testProfile);
      const testNAV = testEval.netAnnualValueSteadyStateInr;

      if (testNAV > 0) {
        lowerBound = midSpend;
      } else {
        upperBound = midSpend;
      }

      iterations++;
    }

    return Math.round(lowerBound) === 0 ? null : Math.round(lowerBound);
  } else {
    // Currently unprofitable; no break-even point (always negative)
    return null;
  }
}

/**
 * Rank a card pool based on NAV + eligibility + approval.
 * Applies tie-breaking by affiliate payout within ±5% band.
 */
export function rankCards(
  cards: CreditCard[],
  profile: UserProfile,
  maxResults?: number
): RankedCard[] {
  // Step 1: Evaluate all cards
  const evaluations = cards.map((card) => ({
    card,
    evaluation: evaluateCard(card, profile),
  }));

  // Step 2: Filter by hard eligibility
  const eligibleCards = evaluations.filter(({ card }) => {
    const { eligible } = hardEligibility(card, profile);
    return eligible;
  });

  const ineligibleCards = evaluations.filter(({ card }) => {
    const { eligible } = hardEligibility(card, profile);
    return !eligible;
  });

  // Step 3: Compute approval likelihood for eligible cards
  const approvalEstimate = approvalLikelihood(profile);

  const withApproval = eligibleCards.map(({ card, evaluation }) => ({
    card,
    evaluation,
    approvalBand: approvalEstimate.band,
    approvalScore: approvalEstimate.score,
  }));

  // Step 4: Sort by NAV (steady-state)
  const sorted = withApproval.sort(
    (a, b) => b.evaluation.netAnnualValueSteadyStateInr - a.evaluation.netAnnualValueSteadyStateInr
  );

  // Step 5: Apply tie-breaking within ±5% NAV band
  // For simplicity, this is a placeholder; in production, you'd:
  // - Group cards by NAV band
  // - Within each band, check affiliate payout
  // - Mark tieBreakByPartner where applicable
  // For now, no tie-breaking

  // Step 6: Demote "low" approval band below "moderate+" cards
  const strong = sorted.filter((s) => s.approvalBand === "strong" || s.approvalBand === "good");
  const moderate = sorted.filter((s) => s.approvalBand === "moderate");
  const low = sorted.filter((s) => s.approvalBand === "low");

  const finalSorted = [...strong, ...moderate, ...low];

  // Step 7: Map to RankedCard with position
  const ranked: RankedCard[] = finalSorted.map((item, index) => ({
    ...item.evaluation,
    rankPosition: index + 1,
    approvalBand: item.approvalBand,
    approvalScore: item.approvalScore,
    tieBreakByPartner: false, // TODO: implement tie-breaking
  }));

  // Step 8: Include ineligible cards in a separate section (marked with negative rank)
  const ineligibleRanked: RankedCard[] = ineligibleCards.map(({ card, evaluation }) => ({
    ...evaluation,
    rankPosition: -1, // Marker for ineligible
    approvalBand: "low" as const,
    approvalScore: 0,
    tieBreakByPartner: false,
  }));

  const allResults = [...ranked, ...ineligibleRanked];

  return maxResults ? allResults.slice(0, maxResults) : allResults;
}

/**
 * Export utility: get a single ranked card
 */
export function getSingleRankedCard(card: CreditCard, profile: UserProfile): RankedCard {
  const evaluation = evaluateCard(card, profile);
  const approvalEstimate = approvalLikelihood(profile);
  const { eligible } = hardEligibility(card, profile);

  return {
    ...evaluation,
    rankPosition: 1,
    approvalBand: eligible ? approvalEstimate.band : "low",
    approvalScore: eligible ? approvalEstimate.score : 0,
    tieBreakByPartner: false,
  };
}
