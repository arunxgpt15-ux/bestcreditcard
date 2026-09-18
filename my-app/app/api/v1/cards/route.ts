/**
 * API: CARD CATALOGUE
 * ===================
 * Prompt 12: Public card catalogue endpoint
 * GET /api/v1/cards — returns all active cards with metadata
 */

import { NextResponse } from "next/server";
import { CARD_CATALOGUE } from "@/data/cards";

export async function GET() {
  try {
    const cards = (CARD_CATALOGUE as any).map((card: any) => ({
      id: card.identity.id,
      issuer: card.identity.issuer,
      name: card.identity.name,
      network: card.identity.network,
      status: card.identity.status,
      
      // Minimal fee info
      joiningFee: card.fees.joiningFee?.value || null,
      annualFee: card.fees.annualFee?.value || null,
      feeConfidence: card.fees.annualFee?.confidence || "unverified",
      
      // Summary
      rewards_summary: `${card.rewards.length} earning rules`,
      lounge: card.lounge ? "Yes" : "No",
      eligibility_min_income: card.eligibility?.minMonthlyIncomeSalaried || null,
      
      // Metadata
      confidence: card.meta.confidence,
      last_verified: card.meta.lastVerifiedAt,
      mitc_url: card.meta.mitcUrl,
    }));

    return NextResponse.json({
      success: true,
      count: cards.length,
      cards,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
