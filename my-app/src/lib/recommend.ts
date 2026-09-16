import { CARD_DB } from "./cards";
import type {
  CardTag,
  CreditCard,
  Profile,
  ScoredCard,
  ScoreLine,
} from "./types";

const priorityWeight: Record<CardTag, number> = {
  travel: 18,
  lounge: 20,
  forex: 24,
  cashback: 16,
  rewards: 18,
  "lifetime-free": 14,
  premium: 10,
  starter: 10,
  shopping: 12,
  milestone: 12,
  domestic: 12,
  international: 16,
  business: 16,
};

const feeComfortBias = (fee: number | null, comfort: number) => {
  if (fee === null) return 0;
  if (fee <= comfort) return 8;
  if (fee <= comfort * 1.5) return 2;
  return -8;
};

export function recommendCards(profile: Profile): ScoredCard[] {
  const scored = CARD_DB.map((card) => {
    let score = 0;
    const matchedPriorities: CardTag[] = [];
    const breakdown: ScoreLine[] = [];
    const warnings: string[] = [];

    card.tags.forEach((tag) => {
      if (profile.priorities.includes(tag)) {
        const weight = priorityWeight[tag] ?? 0;
        score += weight;
        matchedPriorities.push(tag);
        breakdown.push({
          label: `Matches ${tag}`,
          amount: weight,
          confident: card.dataConfidence !== "unverified",
        });
      }
    });

    if (profile.travelType === "international") {
      if (card.tags.includes("forex")) {
        score += 18;
        breakdown.push({ label: "Strong international forex fit", amount: 18, confident: true });
      }
      if (card.tags.includes("international")) {
        score += 10;
        breakdown.push({ label: "International travel fit", amount: 10, confident: true });
      }
    }

    if (profile.travelType === "domestic") {
      if (card.tags.includes("domestic")) {
        score += 10;
        breakdown.push({ label: "Domestic travel fit", amount: 10, confident: true });
      }
    }

    if (profile.loungeNeed !== "" && profile.loungeNeed !== "none") {
      const loungeScore =
        profile.loungeNeed === "every-trip"
          ? 22
          : profile.loungeNeed === "important"
            ? 14
            : 8;

      if (card.tags.includes("lounge")) {
        score += loungeScore;
        breakdown.push({ label: "Lounge relevance", amount: loungeScore, confident: true });
      } else {
        warnings.push("Lounge benefit is not a strong fit for your use case.");
      }
    }

    if (profile.spends.travel > 0 && card.tags.includes("travel")) {
      score += 12;
      breakdown.push({ label: "Travel spend alignment", amount: 12, confident: true });
    }

    if (
      profile.spends.international > 0 &&
      card.forexMarkupPct !== null &&
      card.forexMarkupPct <= 1
    ) {
      score += 18;
      breakdown.push({
        label: "Low forex cost",
        amount: 18,
        confident: card.dataConfidence === "verified" || card.dataConfidence === "partial",
      });
    }

    if (profile.feeComfort > 0) {
      const feeAdj = feeComfortBias(card.annualFee, profile.feeComfort);
      score += feeAdj;
      breakdown.push({
        label: "Annual fee fit",
        amount: feeAdj,
        confident: card.dataConfidence !== "unverified",
      });
    }

    if (card.dataConfidence === "unverified") {
      score -= 10;
      warnings.push("This card has unverified data; verify before applying.");
    }

    const annualValue = score * 12;
    const confidence = card.dataConfidence;

    return {
      card,
      score: Math.round(score),
      netAnnualValue: Math.round(annualValue),
      breakdown,
      matchedPriorities,
      warnings,
      confidence,
    };
  });

  return scored
    .sort((a, b) => b.score - a.score || b.netAnnualValue - a.netAnnualValue)
    .slice(0, 6);
}

export function getTopMatches(profile: Profile): ScoredCard[] {
  return recommendCards(profile);
}

export function getCardSummary(card: CreditCard): string {
  return `${card.name} • ${card.issuer}`;
}
