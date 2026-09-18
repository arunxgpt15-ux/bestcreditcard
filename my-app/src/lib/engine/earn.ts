/**
 * EARNINGS ENGINE
 * ===============
 * Computes gross rewards earned for each spend category.
 * Applies surcharges, caps, and exclusions.
 *
 * Output: LineItem[] where each item explains one earn rule.
 */

import type { CreditCard, SpendCategory } from "@/lib/schema/card";
import type { UserProfile, LineItem } from "./types";
import { SpendCategorySchema } from "@/lib/schema/card";

interface EarnRuleMatch {
  rule: CreditCard["rewards"][0];
  applicableRate: number; // Points, miles, or percent
  rateType: "points_per_x" | "percent_cashback" | "miles_per_x";
  perValue: number; // 150 for "5 pts per ₹150", 100 for "1% cashback"
}

/**
 * Find the best applicable earn rule for a spend category.
 * Respects channel, min/max txn value, excluded categories.
 */
function findBestEarnRule(
  card: CreditCard,
  category: SpendCategory,
  channel: "online" | "offline" = "any"
): EarnRuleMatch | null {
  const applicableRules = card.rewards.filter((rule) => {
    // Check if category is in this rule
    if (!rule.categories.includes(category)) return false;

    // Check if excluded
    if (rule.excludedCategories?.includes(category)) return false;

    // Check channel match
    if (rule.channel && rule.channel !== "any" && rule.channel !== channel) return false;

    return true;
  });

  if (applicableRules.length === 0) return null;

  // Sort by rate (highest first) and pick the best
  const sorted = applicableRules.sort((a, b) => {
    const rateA = a.rate.value / (a.rate.per || 1);
    const rateB = b.rate.value / (b.rate.per || 1);
    return rateB - rateA;
  });

  const best = sorted[0];
  return {
    rule: best,
    applicableRate: best.rate.value,
    rateType: best.rate.type,
    perValue: best.rate.per || 1,
  };
}

/**
 * Check if a surcharge applies to this category/spend.
 */
function applySurcharge(
  card: CreditCard,
  category: SpendCategory,
  grossEarningsInr: number
): { earningsAfterSurcharge: number; surchargeLineItem: LineItem | null } {
  const surcharge = card.surcharges.find((s) => s.category === category as any);

  if (!surcharge) {
    return { earningsAfterSurcharge: grossEarningsInr, surchargeLineItem: null };
  }

  let earningsAfterSurcharge = grossEarningsInr;
  let surchargeAmount = 0;

  if (surcharge.type === "blocked") {
    earningsAfterSurcharge = 0;
  } else if (surcharge.type === "no_rewards") {
    earningsAfterSurcharge = 0;
  } else if (surcharge.type === "capped_rewards") {
    earningsAfterSurcharge = (surcharge.value || 0) * 100; // Cap value in paise
  } else if (surcharge.type === "fee_percent") {
    surchargeAmount = Math.ceil((surcharge.value || 0) / 100 * grossEarningsInr);
    earningsAfterSurcharge = grossEarningsInr - surchargeAmount;
  }

  if (surchargeAmount > 0 || surcharge.type !== "fee_percent") {
    const surchargeLineItem: LineItem = {
      id: `surcharge_${category}`,
      label: `Surcharge: ${category}`,
      category: "surcharge",
      formula: `${surcharge.type} on ${category}`,
      inputs: { surchargeType: surcharge.type, amount: surchargeAmount },
      grossValueInr: -Math.abs(surchargeAmount),
      cappedValueInr: -Math.abs(surchargeAmount),
      confidence: surcharge.confidence,
      sourceUrl: surcharge.source,
      notes: surcharge.type === "blocked" ? "No earnings on this category" : undefined,
    };
    return { earningsAfterSurcharge, surchargeLineItem };
  }

  return { earningsAfterSurcharge, surchargeLineItem: null };
}

/**
 * Compute earnings for a single spend category.
 */
function computeCategoryEarnings(
  card: CreditCard,
  category: SpendCategory,
  monthlySpendInr: number,
  channel: "online" | "offline" = "any"
): LineItem[] {
  const lineItems: LineItem[] = [];

  // Step 1: Find applicable earn rule
  const match = findBestEarnRule(card, category, channel);
  if (!match) {
    // No earn rule, but might have surcharge
    if (card.surcharges.some((s) => s.category === category)) {
      const { surchargeLineItem } = applySurcharge(card, category, 0);
      if (surchargeLineItem) lineItems.push(surchargeLineItem);
    }
    return lineItems;
  }

  // Step 2: Compute raw earnings
  const annualSpendInr = monthlySpendInr * 12;
  let grossEarningsInr = 0;

  if (match.rateType === "percent_cashback") {
    grossEarningsInr = Math.ceil((match.applicableRate / 100) * annualSpendInr);
  } else if (match.rateType === "points_per_x") {
    const pointsEarned = Math.floor(annualSpendInr / (match.perValue * 100)) * match.applicableRate;
    // Points value will be computed in redeem.ts; store points as 100x paise
    grossEarningsInr = pointsEarned * 100;
  } else if (match.rateType === "miles_per_x") {
    const milesEarned = Math.floor(annualSpendInr / (match.perValue * 100)) * match.applicableRate;
    grossEarningsInr = milesEarned * 100; // Similar placeholder
  }

  // Step 3: Apply surcharge
  const { earningsAfterSurcharge, surchargeLineItem } = applySurcharge(card, category, grossEarningsInr);

  // Step 4: Apply caps (in order: monthly, statement cycle, annual)
  let cappedEarningsInr = earningsAfterSurcharge;
  let cappedAmount = 0;

  if (match.rule.monthlyCapValue && match.rule.monthlyCapType) {
    const monthlyCap =
      match.rule.monthlyCapType === "value"
        ? match.rule.monthlyCapValue * 100
        : match.rule.monthlyCapValue * 100;
    const monthlyMax = Math.min(earningsAfterSurcharge / 12, monthlyCap) * 12;
    cappedAmount += earningsAfterSurcharge - monthlyMax;
    cappedEarningsInr = monthlyMax;
  }

  if (match.rule.annualCap) {
    const annualMax = match.rule.annualCap * 100;
    if (cappedEarningsInr > annualMax) {
      cappedAmount += cappedEarningsInr - annualMax;
      cappedEarningsInr = annualMax;
    }
  }

  // Step 5: Create line item
  const mainLineItem: LineItem = {
    id: `earn_${category}`,
    label: `${category} earnings`,
    category: "earning",
    formula: `${match.applicableRate} ${match.rateType} on ₹${(monthlySpendInr / 100).toFixed(0)}/month × 12 months`,
    inputs: {
      monthlySpend: monthlySpendInr,
      rate: match.applicableRate,
      rateType: match.rateType,
      perValue: match.perValue,
    },
    grossValueInr: grossEarningsInr,
    cappedValueInr: cappedEarningsInr,
    confidence: match.rule.confidence,
    sourceUrl: match.rule.source,
    notes: cappedAmount > 0 ? `₹${(cappedAmount / 100).toFixed(2)} clipped by caps` : undefined,
  };

  lineItems.push(mainLineItem);
  if (surchargeLineItem) lineItems.push(surchargeLineItem);

  return lineItems;
}

/**
 * Main function: Compute all earnings for a user on a card.
 */
export function computeEarnings(
  card: CreditCard,
  profile: UserProfile
): { lineItems: LineItem[]; totalEarningsInr: number } {
  const lineItems: LineItem[] = [];
  let totalEarningsInr = 0;

  // Iterate over all spend categories in the profile
  for (const [categoryStr, spend] of Object.entries(profile.spends)) {
    const category = categoryStr as SpendCategory;

    // Validate it's a real category
    if (!SpendCategorySchema.safeParse(category).success) continue;

    // Compute for both channels if split provided, else use "any"
    if (spend.channelSplit) {
      const onlineSpend = spend.monthlyInr * spend.channelSplit.online;
      const offlineSpend = spend.monthlyInr * spend.channelSplit.offline;

      if (onlineSpend > 0) {
        const onlineItems = computeCategoryEarnings(card, category, onlineSpend, "online");
        lineItems.push(...onlineItems);
        totalEarningsInr += onlineItems.reduce((s, i) => s + i.cappedValueInr, 0);
      }

      if (offlineSpend > 0) {
        const offlineItems = computeCategoryEarnings(card, category, offlineSpend, "offline");
        lineItems.push(...offlineItems);
        totalEarningsInr += offlineItems.reduce((s, i) => s + i.cappedValueInr, 0);
      }
    } else {
      const items = computeCategoryEarnings(card, category, spend.monthlyInr, "any");
      lineItems.push(...items);
      totalEarningsInr += items.reduce((s, i) => s + i.cappedValueInr, 0);
    }
  }

  return { lineItems, totalEarningsInr };
}
