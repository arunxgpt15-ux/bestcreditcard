/**
 * BENEFITS ENGINE
 * ===============
 * Computes value from lounge, milestones, and soft benefits.
 * Never credits unused entitlements.
 */

import type { CreditCard } from "@/lib/schema/card";
import type { UserProfile, LineItem } from "./types";

/**
 * Compute lounge value based on expected usage.
 */
export function computeLoungeValue(
  card: CreditCard,
  profile: UserProfile
): { valueInr: number; lineItems: LineItem[] } {
  const lineItems: LineItem[] = [];

  if (!card.lounge) {
    return { valueInr: 0, lineItems: [] };
  }

  const travel = profile.travel || {};
  const assumptions = profile.assumptions || {};
  const loungeValuePerVisit = assumptions.loungeValueInr || travel.avgLoungeValueInr || 120000;

  let domesticValue = 0;
  let internationalValue = 0;

  // Domestic lounge
  if (card.lounge.domesticVisitsPerYear !== null) {
    const expectedDomesticVisits = Math.min(
      card.lounge.domesticVisitsPerYear || 0,
      (travel.domesticTripsPerYear || 0) * (travel.loungeVisitsPerTrip || 1)
    );
    domesticValue = expectedDomesticVisits * loungeValuePerVisit;

    if (expectedDomesticVisits > 0) {
      lineItems.push({
        id: "lounge_domestic",
        label: "Domestic lounge access",
        category: "lounge",
        formula: `${expectedDomesticVisits} visits × ₹${(loungeValuePerVisit / 100).toFixed(0)}`,
        inputs: {
          visitsPerYear: card.lounge.domesticVisitsPerYear,
          expectedVisits: expectedDomesticVisits,
          valuePerVisit: loungeValuePerVisit,
        },
        grossValueInr: domesticValue,
        cappedValueInr: domesticValue,
        confidence: card.lounge.confidence,
        sourceUrl: card.lounge.source,
        notes: `Based on ${travel.domesticTripsPerYear || 0} domestic trips/year`,
      });
    }
  }

  // International lounge
  if (card.lounge.internationalVisitsPerYear !== null) {
    const expectedIntlVisits = Math.min(
      card.lounge.internationalVisitsPerYear || 0,
      (travel.internationalTripsPerYear || 0) * (travel.loungeVisitsPerTrip || 1)
    );
    internationalValue = expectedIntlVisits * loungeValuePerVisit;

    if (expectedIntlVisits > 0) {
      lineItems.push({
        id: "lounge_international",
        label: "International lounge access",
        category: "lounge",
        formula: `${expectedIntlVisits} visits × ₹${(loungeValuePerVisit / 100).toFixed(0)}`,
        inputs: {
          visitsPerYear: card.lounge.internationalVisitsPerYear,
          expectedVisits: expectedIntlVisits,
          valuePerVisit: loungeValuePerVisit,
        },
        grossValueInr: internationalValue,
        cappedValueInr: internationalValue,
        confidence: card.lounge.confidence,
        sourceUrl: card.lounge.source,
        notes: `Based on ${travel.internationalTripsPerYear || 0} international trips/year`,
      });
    }
  }

  const totalValue = domesticValue + internationalValue;
  return { valueInr: totalValue, lineItems };
}

/**
 * Compute milestone bonus value based on spend probability.
 */
export function computeMilestoneValue(
  card: CreditCard,
  profile: UserProfile
): { valueInr: number; lineItems: LineItem[] } {
  const lineItems: LineItem[] = [];

  if (!card.milestones || card.milestones.length === 0) {
    return { valueInr: 0, lineItems: [] };
  }

  // Compute annual spend
  let annualSpendInr = 0;
  for (const spend of Object.values(profile.spends)) {
    annualSpendInr += spend.monthlyInr * 12;
  }

  let totalValue = 0;

  for (const milestone of card.milestones) {
    let milestoneValue = 0;

    if (annualSpendInr >= milestone.spendThresholdInr) {
      // Definitely hit
      milestoneValue = milestone.rewardValueInr;
    } else if (annualSpendInr >= milestone.spendThresholdInr * 0.85) {
      // "At risk" — within 85-100% of threshold
      milestoneValue = Math.ceil(milestone.rewardValueInr * 0.5);

      lineItems.push({
        id: `milestone_${milestone.id}_at_risk`,
        label: `${milestone.description} (at risk)`,
        category: "milestone",
        formula: `50% of ₹${(milestone.rewardValueInr / 100).toFixed(2)} (need ₹${((milestone.spendThresholdInr - annualSpendInr) / 100).toFixed(2)} more)`,
        inputs: {
          thresholdSpend: milestone.spendThresholdInr,
          actualSpend: annualSpendInr,
          rewardValue: milestone.rewardValueInr,
        },
        grossValueInr: milestoneValue,
        cappedValueInr: milestoneValue,
        confidence: "partial",
        sourceUrl: milestone.source,
        notes: "At risk of not hitting — consider discretionary spending",
      });

      totalValue += milestoneValue;
      continue;
    }

    if (milestoneValue > 0) {
      lineItems.push({
        id: `milestone_${milestone.id}`,
        label: milestone.description,
        category: "milestone",
        formula: `Bonus at ₹${(milestone.spendThresholdInr / 100).toFixed(0)} spend`,
        inputs: {
          thresholdSpend: milestone.spendThresholdInr,
          actualSpend: annualSpendInr,
          rewardValue: milestone.rewardValueInr,
        },
        grossValueInr: milestoneValue,
        cappedValueInr: milestoneValue,
        confidence: milestone.confidence,
        sourceUrl: milestone.source,
      });
      totalValue += milestoneValue;
    }
  }

  return { valueInr: totalValue, lineItems };
}

/**
 * Compute soft benefit value (golf, insurance, etc).
 */
export function computeSoftBenefitValue(
  card: CreditCard,
  profile: UserProfile
): { valueInr: number; lineItems: LineItem[] } {
  const lineItems: LineItem[] = [];

  if (!card.softBenefits || card.softBenefits.length === 0) {
    return { valueInr: 0, lineItems: [] };
  }

  const assumptions = profile.assumptions || {};
  const utilisation = assumptions.softBenefitUtilisation || {};

  let totalValue = 0;

  for (const benefit of card.softBenefits) {
    // Default utilisation is 0 unless user opts in
    const userUtilisation = utilisation[benefit.type] ?? benefit.defaultUtilisationRate ?? 0;
    const value = Math.ceil(benefit.nominalValueInr * userUtilisation);

    if (value > 0) {
      lineItems.push({
        id: `benefit_${benefit.type}`,
        label: `${benefit.type} benefit`,
        category: "soft_benefit",
        formula: `₹${(benefit.nominalValueInr / 100).toFixed(0)} × ${(userUtilisation * 100).toFixed(0)}% utilisation`,
        inputs: {
          nominalValue: benefit.nominalValueInr,
          utilisationRate: userUtilisation,
          benefitType: benefit.type,
        },
        grossValueInr: value,
        cappedValueInr: value,
        confidence: benefit.confidence,
        sourceUrl: benefit.source,
        notes:
          userUtilisation === 0
            ? "Not selected by user (default 0%)"
            : `User estimates ${(userUtilisation * 100).toFixed(0)}% utilisation`,
      });
      totalValue += value;
    }
  }

  return { valueInr: totalValue, lineItems };
}
