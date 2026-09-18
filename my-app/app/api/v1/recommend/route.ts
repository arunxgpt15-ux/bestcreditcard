/**
 * API: RECOMMENDATION ENGINE
 * ==========================
 * Prompt 12: B2B API for card recommendations
 * POST /api/v1/recommend — main endpoint
 */

import { NextRequest, NextResponse } from "next/server";
import { UserProfileSchema } from "@/lib/engine/types";
import { rankCards } from "@/lib/engine";
import { CARD_CATALOGUE } from "@/data/cards";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate profile against schema
    const profile = UserProfileSchema.parse(body);

    // Rank cards
    const ranked = rankCards(CARD_CATALOGUE as any, profile);

    // Return results
    return NextResponse.json({
      success: true,
      profile: { hash: require("crypto").createHash("sha256").update(JSON.stringify(profile)).digest("hex") },
      results: ranked.map((card) => ({
        cardId: card.cardId,
        rank: card.rankPosition,
        navInr: card.netAnnualValueSteadyStateInr,
        navYear1: card.netAnnualValueYear1Inr,
        approvalBand: card.approvalBand,
        approvalScore: card.approvalScore,
        confidence: card.dataConfidence,
        rewards: card.lineItems.filter((l) => l.category === "earning"),
        costs: card.lineItems.filter((l) => ["fee", "surcharge", "forex_cost"].includes(l.category)),
        benefits: card.lineItems.filter((l) => ["lounge", "milestone", "soft_benefit"].includes(l.category)),
      })),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Invalid request",
      },
      { status: 400 }
    );
  }
}
