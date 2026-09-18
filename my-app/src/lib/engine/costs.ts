/**
 * COSTS ENGINE
 * ============
 * Computes all costs: annual fee, joining fee, forex, surcharges.
 * Shows both Year 1 (with joining fee) and steady-state costs.
 */

import type { CreditCard } from "@/lib/schema/card";
import type { UserProfile, LineItem } from "./types";

/**
 * Compute annual fee with waiver logic and GST.
 */
export function computeFeeCosts(
  card: CreditCard,
  profile: UserProfile
): { year1CostInr: number; steadyStateCostInr: number; lineItems: LineItem[] } {
  const lineItems: LineItem[] = [];
  let year1Cost = 0;
  let steadyStateCost = 0;

  const gstRate = card.fees.gstRate || 0.18;

  // Compute annual spend for waiver check
  let annualSpendInr = 0;
  for (const spend of Object.values(profile.spends)) {
    annualSpendInr += spend.monthlyInr * 12;
  }

  // Joining fee (Year 1 only)
  if (card.fees.joiningFee) {
    const feeBeforeTax = card.fees.joiningFee.value;
    const tax = Math.ceil(feeBeforeTax * gstRate);
    const totalFee = feeBeforeTax + tax;

    year1Cost += totalFee;

    lineItems.push({
      id: "joining_fee",
      label: "Joining fee (Year 1 only)",
      category: "fee",
      formula: `₹${(feeBeforeTax / 100).toFixed(0)} + ${(gstRate * 100).toFixed(0)}% GST`,
      inputs: { feeBeforeTax, gstRate, tax },
      grossValueInr: totalFee,
      cappedValueInr: totalFee,
      confidence: card.fees.joiningFee.confidence,
      sourceUrl: card.fees.joiningFee.source,
    });
  }

  // Annual fee
  if (card.fees.annualFee) {
    const feeBeforeTax = card.fees.annualFee.value;
    const tax = Math.ceil(feeBeforeTax * gstRate);
    const totalFee = feeBeforeTax + tax;

    let isWaivedYear1 = false;
    let isWaivedSteadyState = false;

    // Check waiver condition
    if (card.fees.feeWaiverSpendThreshold && annualSpendInr >= card.fees.feeWaiverSpendThreshold) {
      isWaivedYear1 = true;
      isWaivedSteadyState = true;
    }

    if (!isWaivedYear1) year1Cost += totalFee;
    if (!isWaivedSteadyState) steadyStateCost += totalFee;

    const waiveredLabel = isWaivedYear1 ? " (waived)" : "";
    lineItems.push({
      id: "annual_fee",
      label: `Annual fee${waiveredLabel}`,
      category: "fee",
      formula: isWaivedYear1
        ? `Waived at ₹${(annualSpendInr / 100).toFixed(0)} spend`
        : `₹${(feeBeforeTax / 100).toFixed(0)} + ${(gstRate * 100).toFixed(0)}% GST`,
      inputs: {
        feeBeforeTax,
        gstRate,
        tax,
        waiverThreshold: card.fees.feeWaiverSpendThreshold,
        annualSpend: annualSpendInr,
      },
      grossValueInr: isWaivedYear1 ? 0 : totalFee,
      cappedValueInr: isWaivedYear1 ? 0 : totalFee,
      confidence: card.fees.annualFee.confidence,
      sourceUrl: card.fees.annualFee.source,
      notes: isWaivedYear1
        ? `Waived condition met (spend ≥ ₹${(card.fees.feeWaiverSpendThreshold / 100).toFixed(0)})`
        : undefined,
    });
  }

  return { year1CostInr: year1Cost, steadyStateCostInr: steadyStateCost, lineItems };
}

/**
 * Compute forex costs.
 */
export function computeForexCosts(
  card: CreditCard,
  profile: UserProfile
): { costInr: number; lineItems: LineItem[] } {
  const lineItems: LineItem[] = [];

  if (!card.forex) {
    return { costInr: 0, lineItems: [] };
  }

  const travel = profile.travel || {};
  const forexSpendInr = travel.forexSpendPerYearInr || 0;

  if (forexSpendInr === 0) {
    return { costInr: 0, lineItems: [] };
  }

  const gstRate = card.fees.gstRate || 0.18;
  const markupPercent = card.forex.markupPercent || 0;
  const crossMarkup = card.forex.crossCurrencyMarkupPercent || 0;
  const totalMarkup = markupPercent + crossMarkup;

  const markupCost = Math.ceil((totalMarkup / 100) * forexSpendInr);
  const tax = Math.ceil(markupCost * gstRate);
  const totalCost = markupCost + tax;

  lineItems.push({
    id: "forex_cost",
    label: "Forex markup",
    category: "forex_cost",
    formula: `₹${(forexSpendInr / 100).toFixed(0)} × ${totalMarkup.toFixed(1)}% + ${(gstRate * 100).toFixed(0)}% GST`,
    inputs: {
      forexSpend: forexSpendInr,
      markupPercent,
      crossMarkup,
      gstRate,
      tax,
    },
    grossValueInr: -markupCost,
    cappedValueInr: -totalCost,
    confidence: card.forex.confidence,
    sourceUrl: card.forex.source,
  });

  return { costInr: totalCost, lineItems };
}

/**
 * Compute add-on card fees.
 */
export function computeAddOnCardCosts(
  card: CreditCard
): { costInr: number; lineItems: LineItem[] } {
  const lineItems: LineItem[] = [];

  // For now, simplified — assume 1 add-on card
  if (!card.fees.addOnCardFee) {
    return { costInr: 0, lineItems: [] };
  }

  const gstRate = card.fees.gstRate || 0.18;
  const feeBeforeTax = card.fees.addOnCardFee.value;
  const tax = Math.ceil(feeBeforeTax * gstRate);
  const totalCost = feeBeforeTax + tax;

  lineItems.push({
    id: "addon_fee",
    label: "Add-on card annual fee",
    category: "fee",
    formula: `₹${(feeBeforeTax / 100).toFixed(0)} + ${(gstRate * 100).toFixed(0)}% GST (1 add-on card)`,
    inputs: { feeBeforeTax, gstRate, tax },
    grossValueInr: -totalCost,
    cappedValueInr: -totalCost,
    confidence: card.fees.addOnCardFee.confidence,
    sourceUrl: card.fees.addOnCardFee.source,
  });

  return { costInr: totalCost, lineItems };
}
