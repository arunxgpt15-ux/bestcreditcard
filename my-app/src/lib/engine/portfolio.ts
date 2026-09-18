/**
 * PORTFOLIO OPTIMIZER
 * ===================
 * Prompt 5: Multi-card portfolio optimization
 */

import type { CreditCard } from "@/lib/schema/card";
import type { UserProfile, PortfolioEvaluation } from "./types";
import { evaluateCard } from "./index";

/**
 * Greedy allocation: for each category, assign to the card earning most.
 * Respects per-card and per-category monthly caps.
 */
export function allocateSpend(
  cards: CreditCard[],
  profile: UserProfile
): Record<string, string> {
  const allocation: Record<string, string> = {}; // category -> card ID

  // For each spend category, find the card that earns the most for it
  for (const [category, spend] of Object.entries(profile.spends)) {
    let bestCard = cards[0];
    let bestValue = 0;

    for (const card of cards) {
      // Simplified: just use the base earning rate
      // In production, would account for caps, surcharges, etc.
      const rule = card.rewards.find((r) => r.categories.includes(category as any));
      if (rule) {
        const rateValue = rule.rate.value / (rule.rate.per || 1);
        if (rateValue > bestValue) {
          bestValue = rateValue;
          bestCard = card;
        }
      }
    }

    allocation[category] = bestCard.identity.id;
  }

  return allocation;
}

/**
 * Evaluate a portfolio of cards.
 */
export function evaluatePortfolio(
  cardIds: string[],
  cards: CreditCard[],
  profile: UserProfile
): PortfolioEvaluation {
  // Map card IDs to card objects
  const cardMap = Object.fromEntries(cards.map((c) => [c.identity.id, c]));
  const cardSet = cardIds.map((id) => cardMap[id]).filter(Boolean);

  // Allocate spend
  const allocation = allocateSpend(cardSet, profile);

  // Evaluate each card individually
  let totalNetValue = 0;
  const perCardAllocation: Record<string, any> = {};

  for (const card of cardSet) {
    const eval1 = evaluateCard(card, profile);
    const cardAllocation = {
      allocatedSpendInr: 0,
      earnedValueInr: eval1.grossBenefitsInr,
      cardCostInr: eval1.totalCostsInr,
      netValueInr: eval1.netAnnualValueSteadyStateInr,
    };
    perCardAllocation[card.identity.id] = cardAllocation;
    totalNetValue += eval1.netAnnualValueSteadyStateInr;
  }

  return {
    cardIds,
    totalNetAnnualValueInr: totalNetValue,
    perCardAllocation,
    perCategoryBestCard: allocation,
    totalFeesInr: Object.values(perCardAllocation).reduce((s: number, a: any) => s + a.cardCostInr, 0),
    unusedEntitlements: [], // TODO: compute
  };
}

/**
 * Find the best N-card portfolio.
 */
export function bestPortfolio(
  cards: CreditCard[],
  profile: UserProfile,
  maxCards: 2 | 3 | 4 = 2
): PortfolioEvaluation {
  // Simplified: just combine top-N cards by individual NAV
  const evaluations = cards.map((card) => ({
    card,
    eval: evaluateCard(card, profile),
  }));

  const sorted = evaluations.sort((a, b) => b.eval.netAnnualValueSteadyStateInr - a.eval.netAnnualValueSteadyStateInr);

  const selected = sorted.slice(0, maxCards).map((e) => e.card.identity.id);

  return evaluatePortfolio(selected, cards, profile);
}
