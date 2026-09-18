/**
 * ELIGIBILITY & HARD FILTERS
 * ===========================
 * Determines if a user can even apply for a card.
 * Hard rules based on official eligibility criteria.
 */

import type { CreditCard } from "@/lib/schema/card";
import type { UserProfile } from "./types";

export interface EligibilityResult {
  eligible: boolean;
  reasons: string[]; // Blocking reasons if ineligible
  recommendations: string[]; // How to become eligible
}

/**
 * Check if a user meets hard eligibility criteria.
 */
export function hardEligibility(
  card: CreditCard,
  profile: UserProfile
): EligibilityResult {
  const reasons: string[] = [];
  const recommendations: string[] = [];

  if (!card.eligibility) {
    // No eligibility criteria defined, assume eligible
    return { eligible: true, reasons: [], recommendations: [] };
  }

  const elig = card.eligibility;
  const p = profile.profile;

  // Age check
  if (elig.minAgeYears && p.ageYears && p.ageYears < elig.minAgeYears) {
    reasons.push(`Minimum age requirement: ${elig.minAgeYears} years (you are ${p.ageYears})`);
    recommendations.push(`Apply after you turn ${elig.minAgeYears}`);
  }

  if (elig.maxAgeYears && p.ageYears && p.ageYears > elig.maxAgeYears) {
    reasons.push(`Maximum age requirement: ${elig.maxAgeYears} years (you are ${p.ageYears})`);
  }

  // Employment type check
  if (elig.employmentTypes && p.employmentType) {
    if (!elig.employmentTypes.includes(p.employmentType)) {
      reasons.push(`Card requires: ${elig.employmentTypes.join(", ")} (you are ${p.employmentType})`);
      recommendations.push(`This card is designed for ${elig.employmentTypes.join(" or ")}`);
    }
  }

  // Income check (salaried)
  if (elig.minMonthlyIncomeSalaried && p.employmentType === "salaried" && p.monthlyIncomeInr) {
    if (p.monthlyIncomeInr < elig.minMonthlyIncomeSalaried) {
      const minMonthly = elig.minMonthlyIncomeSalaried / 100;
      const userMonthly = p.monthlyIncomeInr / 100;
      reasons.push(
        `Minimum monthly salary: ₹${minMonthly.toFixed(0)} (you reported ₹${userMonthly.toFixed(0)})`
      );
      recommendations.push(
        `Increase salary or look for a card suited to ₹${userMonthly.toFixed(0)}/month`
      );
    }
  }

  // Income check (self-employed)
  if (elig.minAnnualIncomeSelfEmployed && p.employmentType === "self_employed" && p.monthlyIncomeInr) {
    const annualIncome = p.monthlyIncomeInr * 12;
    if (annualIncome < elig.minAnnualIncomeSelfEmployed) {
      const minAnnual = elig.minAnnualIncomeSelfEmployed / 100;
      const userAnnual = annualIncome / 100;
      reasons.push(
        `Minimum annual income: ₹${minAnnual.toFixed(0)} (you reported ₹${userAnnual.toFixed(0)})`
      );
      recommendations.push(`Increase annual income or look for a starter card`);
    }
  }

  // Credit score check
  if (elig.minCibil && p.cibilBand) {
    const bandsInOrder = ["<650", "650-699", "700-749", "750-799", "800+"];
    const userBandIndex = bandsInOrder.indexOf(p.cibilBand);
    const minBandIndex = bandsInOrder.indexOf(elig.minCibil.toString());

    if (userBandIndex < minBandIndex) {
      reasons.push(`Minimum CIBIL: ${elig.minCibil} (you are in ${p.cibilBand})`);
      recommendations.push(`Improve your credit score before applying`);
    }
  }

  // City tier check
  if (elig.cityTiers && p.cityTier && !elig.cityTiers.includes(p.cityTier)) {
    reasons.push(`Card available only in Tier ${elig.cityTiers.join(", ")} cities (you are Tier ${p.cityTier})`);
  }

  // NTB/ETB check
  if (elig.ntbOnly) {
    const bankIssuer = card.identity.issuer;
    const userBanks = profile.wallet?.issuersBankedWith || [];

    if (userBanks.includes(bankIssuer)) {
      reasons.push(`New-to-bank card only (you already bank with ${bankIssuer})`);
      recommendations.push(`Look for cards designed for existing customers`);
    }
  }

  // Existing card requirement
  if (elig.requiresExistingCard) {
    if ((profile.wallet?.existingCardIds?.length || 0) === 0) {
      reasons.push(`Requires at least one existing credit card`);
      recommendations.push(`Apply for a starter/lifetime-free card first`);
    }

    if (elig.requiresExistingCardLimitInr) {
      // Would need limit info, skip for now
    }
  }

  // Card vintage requirement
  if (elig.requiresCardVintageMonths && profile.profile.oldestCardVintageMonths) {
    if (profile.profile.oldestCardVintageMonths < elig.requiresCardVintageMonths) {
      reasons.push(
        `Requires ${elig.requiresCardVintageMonths} months of credit history (you have ${profile.profile.oldestCardVintageMonths} months)`
      );
      recommendations.push(
        `Apply again after ${elig.requiresCardVintageMonths - profile.profile.oldestCardVintageMonths} more months`
      );
    }
  }

  const eligible = reasons.length === 0;
  return { eligible, reasons, recommendations };
}
