/**
 * SENSITIVITY ANALYSIS ENGINE
 * ============================
 * Prompt 3: Break-even, scenarios, tornado chart analysis
 */

import type { CreditCard } from "@/lib/schema/card";
import type { UserProfile } from "./types";
import { evaluateCard } from "./index";

export interface BreakEvenResult {
  monthlySpendInr: number | null;
  reasoning: string;
}

export interface Scenario {
  name: "worst" | "expected" | "best";
  navInr: number;
  assumptions: Partial<UserProfile["assumptions"]>;
  keyDriver: string;
}

export interface TornadoFactor {
  factor: string;
  baselineNav: number;
  navIfIncreased: number;
  navIfDecreased: number;
  impactRange: number;
}

/**
 * Compute three scenarios: worst, expected, best
 */
export function scenarios(
  card: CreditCard,
  profile: UserProfile
): Scenario[] {
  const baseEval = evaluateCard(card, profile);

  // Conservative scenario: low point value, high breakage, no milestones
  const conservativeProfile = {
    ...profile,
    assumptions: {
      ...profile.assumptions,
      pointValuationMode: "conservative" as const,
      breakageRate: 0.2,
      loungeValueInr: (profile.assumptions?.loungeValueInr || 120000) * 0.67,
    },
  };
  const conservativeEval = evaluateCard(card, conservativeProfile);

  // Optimistic scenario: high point value, low breakage, all milestones hit
  const optimisticProfile = {
    ...profile,
    assumptions: {
      ...profile.assumptions,
      pointValuationMode: "optimistic" as const,
      breakageRate: 0.05,
      loungeValueInr: (profile.assumptions?.loungeValueInr || 120000) * 1.33,
    },
  };
  const optimisticEval = evaluateCard(card, optimisticProfile);

  return [
    {
      name: "worst",
      navInr: conservativeEval.netAnnualValueSteadyStateInr,
      assumptions: conservativeProfile.assumptions,
      keyDriver: "Conservative point valuation + high breakage",
    },
    {
      name: "expected",
      navInr: baseEval.netAnnualValueSteadyStateInr,
      assumptions: profile.assumptions,
      keyDriver: "Realistic assumptions",
    },
    {
      name: "best",
      navInr: optimisticEval.netAnnualValueSteadyStateInr,
      assumptions: optimisticProfile.assumptions,
      keyDriver: "Optimistic point valuation + milestone hits",
    },
  ];
}

/**
 * Tornado chart: sensitivity to ±25% changes in key factors
 */
export function tornado(
  card: CreditCard,
  profile: UserProfile
): TornadoFactor[] {
  const baseEval = evaluateCard(card, profile);
  const baselineNav = baseEval.netAnnualValueSteadyStateInr;

  const factors: TornadoFactor[] = [];

  // Factor 1: Point valuation
  const pointValuationModes = ["conservative", "realistic", "optimistic"] as const;
  const pointEvals = pointValuationModes.map((mode) => {
    const testProfile = { ...profile, assumptions: { ...profile.assumptions, pointValuationMode: mode } };
    return evaluateCard(card, testProfile).netAnnualValueSteadyStateInr;
  });
  factors.push({
    factor: "Point valuation mode",
    baselineNav,
    navIfIncreased: Math.max(...pointEvals),
    navIfDecreased: Math.min(...pointEvals),
    impactRange: Math.max(...pointEvals) - Math.min(...pointEvals),
  });

  // Factor 2: Lounge value (±33%)
  const loungeUp = {
    ...profile,
    assumptions: {
      ...profile.assumptions,
      loungeValueInr: ((profile.assumptions?.loungeValueInr || 120000) * 1.33),
    },
  };
  const loungeDown = {
    ...profile,
    assumptions: {
      ...profile.assumptions,
      loungeValueInr: ((profile.assumptions?.loungeValueInr || 120000) * 0.67),
    },
  };
  factors.push({
    factor: "Lounge value per visit",
    baselineNav,
    navIfIncreased: evaluateCard(card, loungeUp).netAnnualValueSteadyStateInr,
    navIfDecreased: evaluateCard(card, loungeDown).netAnnualValueSteadyStateInr,
    impactRange: Math.abs(
      evaluateCard(card, loungeUp).netAnnualValueSteadyStateInr -
        evaluateCard(card, loungeDown).netAnnualValueSteadyStateInr
    ),
  });

  // Factor 3: Breakage rate
  const breakageUp = {
    ...profile,
    assumptions: { ...profile.assumptions, breakageRate: Math.min((profile.assumptions?.breakageRate || 0.1) * 1.5, 1) },
  };
  const breakageDown = {
    ...profile,
    assumptions: { ...profile.assumptions, breakageRate: Math.max((profile.assumptions?.breakageRate || 0.1) * 0.5, 0) },
  };
  factors.push({
    factor: "Breakage rate",
    baselineNav,
    navIfIncreased: evaluateCard(card, breakageUp).netAnnualValueSteadyStateInr,
    navIfDecreased: evaluateCard(card, breakageDown).netAnnualValueSteadyStateInr,
    impactRange: Math.abs(
      evaluateCard(card, breakageUp).netAnnualValueSteadyStateInr -
        evaluateCard(card, breakageDown).netAnnualValueSteadyStateInr
    ),
  });

  // Sort by impact (largest first)
  return factors.sort((a, b) => b.impactRange - a.impactRange);
}
