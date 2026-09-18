/**
 * COMPLIANCE: BANNED CLAIMS LINTER
 * =================================
 * Prompt 9: Enforce copy guardrails at build time
 */

const BANNED_PHRASES = [
  "guaranteed approval",
  "assured approval",
  "instant approval",
  "pre-approved",
  "100% approval",
  "no credit check",
  "best card in india",
  "best card in the country",
  "lowest interest guaranteed",
  "get rich",
  "free money",
  "risk-free",
  "100% cashback",
];

/**
 * Check if a string contains banned phrases (case-insensitive)
 */
export function hasBannedClaims(text: string): { hasBanned: boolean; violations: string[] } {
  const lowerText = text.toLowerCase();
  const violations: string[] = [];

  for (const phrase of BANNED_PHRASES) {
    if (lowerText.includes(phrase)) {
      violations.push(phrase);
    }
  }

  return {
    hasBanned: violations.length > 0,
    violations: [...new Set(violations)], // Deduplicate
  };
}

/**
 * Recommended compliant alternatives
 */
export const COMPLIANT_ALTERNATIVES: Record<string, string> = {
  "guaranteed approval": "High approval likelihood based on your profile",
  "instant approval": "Fast approval process",
  "pre-approved": "Estimated as a good fit for you",
  "best card in india": "Top-rated for [specific use case]",
  "100% cashback": "Up to [X]% cashback",
  "no credit check": "Available to users in [specific CIBIL range]",
  "risk-free": "Money-back guarantee",
};
