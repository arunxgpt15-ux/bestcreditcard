/**
 * REDEMPTION & POINT VALUE ENGINE
 * ================================
 * Converts points/miles/cashback into rupee value.
 * Applies breakage, redemption fees, delayed reward discount.
 */

import type { CreditCard } from "@/lib/schema/card";
import type { UserProfile, LineItem } from "./types";

/**
 * Compute the INR value of points earned.
 */
export function valuePoints(
  card: CreditCard,
  totalPointsEarned: number,
  profile: UserProfile
): { netValueInr: number; lineItems: LineItem[] } {
  const lineItems: LineItem[] = [];

  if (!card.pointValue) {
    // Card uses direct cashback, not points
    return { netValueInr: 0, lineItems: [] };
  }

  const assumptions = profile.assumptions || {};
  const valMode = assumptions.pointValuationMode || "realistic";

  // Pick redemption channel based on valuation mode
  const channel = card.pointValue.redemptionChannels.find(
    (c) =>
      (valMode === "conservative" && c.name.includes("Cashback")) ||
      (valMode === "optimistic" && c.name.includes("Travel")) ||
      true // realistic/fallback to first channel
  );

  if (!channel) {
    return { netValueInr: 0, lineItems: [] };
  }

  let valuePerPoint = channel.valuePerPoint;
  let totalValue = totalPointsEarned * valuePerPoint;
  let clippedPoints = 0;

  // Apply monthly cap if present
  if (channel.monthlyPointCap) {
    const monthlyAllowance = channel.monthlyPointCap * 12;
    if (totalPointsEarned > monthlyAllowance) {
      clippedPoints = totalPointsEarned - monthlyAllowance;
      totalValue = monthlyAllowance * valuePerPoint;
    }
  }

  // Subtract redemption fee
  const redemptionFees = (channel.redemptionFeeInr || 0) * (channel.feeIsPerRedemption ? 12 : 1);
  totalValue -= redemptionFees;

  // Apply breakage (% of points never redeemed)
  const breakageRate = assumptions.breakageRate || 0.1;
  const breakageAmount = Math.ceil(totalValue * breakageRate);
  totalValue -= breakageAmount;

  // Discount delayed rewards (time value of money)
  const discountRate = assumptions.discountRateForDelayedRewards || 0.08;
  const discountAmount = Math.ceil(totalValue * discountRate);
  totalValue -= discountAmount;

  // Create line items
  const mainItem: LineItem = {
    id: "point_value",
    label: `Point value (${valMode} mode)`,
    category: "earning",
    formula: `${totalPointsEarned} points × ₹${(valuePerPoint / 100).toFixed(2)}/point`,
    inputs: {
      pointsEarned: totalPointsEarned,
      valuePerPoint,
      channel: channel.name,
      valMode,
    },
    grossValueInr: totalPointsEarned * valuePerPoint,
    cappedValueInr: totalValue,
    confidence: channel.confidence,
    sourceUrl: channel.source,
    notes: clippedPoints > 0 ? `${clippedPoints} points clipped by monthly cap` : undefined,
  };

  lineItems.push(mainItem);

  if (breakageAmount > 0) {
    lineItems.push({
      id: "breakage",
      label: "Breakage (unused points)",
      category: "surcharge",
      formula: `${breakageRate * 100}% breakage on ₹${(totalValue / 100).toFixed(2)}`,
      inputs: { breakageRate },
      grossValueInr: 0,
      cappedValueInr: -breakageAmount,
      confidence: "verified",
      notes: "Conservative assumption for unused rewards",
    });
  }

  if (redemptionFees > 0) {
    lineItems.push({
      id: "redemption_fee",
      label: "Redemption fees",
      category: "surcharge",
      formula: `₹${(redemptionFees / 100).toFixed(2)} annual redemption cost`,
      inputs: { redemptionFeePerInstance: channel.redemptionFeeInr, frequency: channel.feeIsPerRedemption ? 12 : 1 },
      grossValueInr: 0,
      cappedValueInr: -redemptionFees,
      confidence: channel.confidence,
      sourceUrl: channel.source,
    });
  }

  if (discountAmount > 0) {
    lineItems.push({
      id: "time_discount",
      label: "Time value discount",
      category: "surcharge",
      formula: `${discountRate * 100}% discount on delayed rewards`,
      inputs: { discountRate },
      grossValueInr: 0,
      cappedValueInr: -discountAmount,
      confidence: "partial",
      notes: "Conservative: rewards earned later are worth less",
    });
  }

  return { netValueInr: totalValue, lineItems };
}
