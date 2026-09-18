/**
 * APPROVAL PROBABILITY ESTIMATOR
 * ===============================
 * Transparent, configurable rubric for estimating approval likelihood.
 * Based on published weights, not a black box.
 *
 * IMPORTANT: This is an ESTIMATE based on self-reported data.
 * Only the bank decides approval.
 */

import type { UserProfile } from "./types";

/**
 * Approval rubric weights — configuration file
 * Update these based on calibration against actual approval rates
 */
const APPROVAL_WEIGHTS = {
  income_headroom: { weight: 0.25, description: "How much income they have above card minimum" },
  cibil_band: { weight: 0.20, description: "CIBIL score band" },
  card_history: { weight: 0.20, description: "Existing cards & vintage" },
  recent_enquiries: { weight: 0.15, description: "Hard enquiries in last 6 months" },
  employment_type: { weight: 0.10, description: "Card preference for employment type" },
  ntb_status: { weight: 0.10, description: "NTB vs ETB preference" },
};

interface ApprovalDriver {
  factor: string;
  score: number; // 0-100
  impact: number; // -10 to +10 (contribution to final score)
  reasoning: string;
}

export interface ApprovalEstimate {
  band: "low" | "moderate" | "good" | "strong";
  score: number; // 0-100
  drivers: ApprovalDriver[];
  disclaimer: string;
}

/**
 * Estimate approval likelihood
 */
export function approvalLikelihood(profile: UserProfile): ApprovalEstimate {
  const drivers: ApprovalDriver[] = [];
  let totalWeightedScore = 0;
  let totalWeight = 0;

  const p = profile.profile || {};

  // 1. Income headroom (biggest factor)
  const incomeScore = computeIncomeHeadroom(p.monthlyIncomeInr, p.employmentType);
  drivers.push({
    factor: "Income headroom",
    score: incomeScore,
    impact: (incomeScore - 50) * (APPROVAL_WEIGHTS.income_headroom.weight / 0.5),
    reasoning:
      incomeScore > 75
        ? "Strong income relative to card minimums"
        : incomeScore > 50
          ? "Adequate income"
          : incomeScore > 25
            ? "Income is tight; may struggle with other cards"
            : "Income below most card requirements",
  });
  totalWeightedScore += incomeScore * APPROVAL_WEIGHTS.income_headroom.weight;
  totalWeight += APPROVAL_WEIGHTS.income_headroom.weight;

  // 2. CIBIL band
  const cibilScore = computeCibilScore(p.cibilBand);
  drivers.push({
    factor: "CIBIL band",
    score: cibilScore,
    impact: (cibilScore - 50) * (APPROVAL_WEIGHTS.cibil_band.weight / 0.5),
    reasoning:
      p.cibilBand === "unknown"
        ? "Not provided; banks may request manual review"
        : cibilScore > 75
          ? "Excellent credit history"
          : cibilScore > 50
            ? "Good credit standing"
            : "Below-average credit; higher risk perception",
  });
  totalWeightedScore += cibilScore * APPROVAL_WEIGHTS.cibil_band.weight;
  totalWeight += APPROVAL_WEIGHTS.cibil_band.weight;

  // 3. Card history & vintage
  const historyScore = computeCardHistoryScore(
    p.existingCardsCount || 0,
    p.oldestCardVintageMonths || 0
  );
  drivers.push({
    factor: "Credit history",
    score: historyScore,
    impact: (historyScore - 50) * (APPROVAL_WEIGHTS.card_history.weight / 0.5),
    reasoning:
      historyScore > 75
        ? "Established credit user with good track record"
        : historyScore > 50
          ? "Moderate credit experience"
          : historyScore > 25
            ? "Limited credit history; may be seen as risky"
            : "No credit history or many recent cards (high-risk pattern)",
  });
  totalWeightedScore += historyScore * APPROVAL_WEIGHTS.card_history.weight;
  totalWeight += APPROVAL_WEIGHTS.card_history.weight;

  // 4. Recent enquiries
  const enquiriesScore = computeEnquiriesScore(p.recentEnquiries6m || 0);
  drivers.push({
    factor: "Recent enquiries",
    score: enquiriesScore,
    impact: (enquiriesScore - 50) * (APPROVAL_WEIGHTS.recent_enquiries.weight / 0.5),
    reasoning:
      enquiriesScore > 75
        ? "No recent enquiries; shows restraint"
        : enquiriesScore > 50
          ? "Moderate enquiry activity"
          : "Multiple recent enquiries; banks may perceive desperation",
  });
  totalWeightedScore += enquiriesScore * APPROVAL_WEIGHTS.recent_enquiries.weight;
  totalWeight += APPROVAL_WEIGHTS.recent_enquiries.weight;

  // 5. Employment type (card may prefer salaried)
  const employmentScore = p.employmentType === "salaried" ? 60 : p.employmentType === "self_employed" ? 50 : 40;
  drivers.push({
    factor: "Employment type",
    score: employmentScore,
    impact: (employmentScore - 50) * (APPROVAL_WEIGHTS.employment_type.weight / 0.5),
    reasoning:
      p.employmentType === "salaried"
        ? "Stable salaried income (preferred by most banks)"
        : p.employmentType === "self_employed"
          ? "Self-employed; banks may require additional documents"
          : "Non-traditional employment; may face scrutiny",
  });
  totalWeightedScore += employmentScore * APPROVAL_WEIGHTS.employment_type.weight;
  totalWeight += APPROVAL_WEIGHTS.employment_type.weight;

  // 6. NTB/ETB (bonus for NTB if eligible, but not penalty for ETB)
  const ntbScore = 50; // Neutral for now
  drivers.push({
    factor: "NTB vs ETB",
    score: ntbScore,
    impact: 0,
    reasoning:
      "New-to-bank users may have higher approval odds for welcome offers, but existing customers have proven payment history",
  });

  // Compute final score
  const finalScore = Math.round(totalWeightedScore / totalWeight);

  // Map score to band
  let band: "low" | "moderate" | "good" | "strong";
  if (finalScore < 30) {
    band = "low";
  } else if (finalScore < 50) {
    band = "moderate";
  } else if (finalScore < 75) {
    band = "good";
  } else {
    band = "strong";
  }

  const disclaimer =
    "Estimated on the information you gave us. Only the bank can decide. This is not a pre-approval and does not guarantee approval.";

  return {
    band,
    score: finalScore,
    drivers,
    disclaimer,
  };
}

// Helper functions

function computeIncomeHeadroom(monthlyIncomeInr?: number, employmentType?: string): number {
  if (!monthlyIncomeInr) return 30; // Unknown income = risky

  // Rough minimum for premium cards: ₹2,00,000/month
  // Rough minimum for mid-tier: ₹75,000/month
  // Rough minimum for starter: ₹50,000/month

  const avgMinimum = 75000 * 100; // Use mid-tier as baseline

  if (monthlyIncomeInr > avgMinimum * 3) return 100; // 3x+ the average minimum
  if (monthlyIncomeInr > avgMinimum * 2) return 85;
  if (monthlyIncomeInr > avgMinimum) return 70;
  if (monthlyIncomeInr > avgMinimum * 0.5) return 40;
  return 20; // Below even starter card minimum
}

function computeCibilScore(cibilBand?: string): number {
  if (!cibilBand || cibilBand === "unknown") return 50; // Neutral
  switch (cibilBand) {
    case "800+":
      return 100;
    case "750-799":
      return 85;
    case "700-749":
      return 70;
    case "650-699":
      return 40;
    case "<650":
      return 15;
    default:
      return 50;
  }
}

function computeCardHistoryScore(existingCards: number, vintageMonths: number): number {
  // Ideal: 3-5 cards with 3+ years history
  if (existingCards === 0) return 20; // New user
  if (vintageMonths < 12) return 25; // Very new
  if (vintageMonths < 24) return 40; // Less than 2 years
  if (vintageMonths > 36 && existingCards >= 3) return 90; // Established user
  if (vintageMonths > 24 && existingCards >= 2) return 75;
  return 50; // Some history, moderate
}

function computeEnquiriesScore(recentEnquiries6m: number): number {
  if (recentEnquiries6m === 0) return 100; // No recent enquiries (best case)
  if (recentEnquiries6m === 1) return 80;
  if (recentEnquiries6m === 2) return 60;
  if (recentEnquiries6m === 3) return 40; // Hard limit for most banks
  return 20; // 4+ enquiries in 6 months = major red flag
}
