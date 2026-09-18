/**
 * STATEMENT ANALYZER (Stub)
 * =========================
 * Prompt 6: Client-side credit card statement parsing
 * Extracts transactions, categories, totals from PDF or CSV
 */

// Note: Full implementation requires pdfjs-dist for production
// This stub shows the type structure

export interface ParsedTransaction {
  date: string;
  description: string;
  amount: number; // In paise
  category: string; // Inferred from description
  merchantName: string;
  confidence: number; // 0-1, confidence in categorization
}

export interface ParsedStatement {
  cardId?: string;
  cardName: string;
  statementPeriod: {
    from: string;
    to: string;
  };
  totalSpend: number; // In paise
  transactions: ParsedTransaction[];
  categoryBreakdown: Record<string, number>; // Category → spend in paise
  parseQuality: {
    totalRows: number;
    successfullyParsed: number;
    failedRows: number;
  };
}

/**
 * Stub: Parse CSV file
 * In production: Use PapaParse or custom CSV parser
 */
export async function parseStatementCSV(file: File): Promise<ParsedStatement> {
  // TODO: Implement
  throw new Error("Not implemented in stub");
}

/**
 * Stub: Parse PDF file
 * In production: Use pdfjs-dist to extract table
 */
export async function parseStatementPDF(file: File): Promise<ParsedStatement> {
  // TODO: Implement
  throw new Error("Not implemented in stub");
}

/**
 * Categorize a transaction description
 * In production: ML model or fuzzy matching
 */
export function categorizeTransaction(description: string): string {
  const lowerDesc = description.toLowerCase();

  if (lowerDesc.includes("amazon") || lowerDesc.includes("flipkart")) return "ecommerce_partner";
  if (lowerDesc.includes("dining") || lowerDesc.includes("restaurant")) return "dining";
  if (lowerDesc.includes("fuel") || lowerDesc.includes("petrol")) return "fuel";
  if (lowerDesc.includes("amazon prime") || lowerDesc.includes("netflix")) return "ott_subscriptions";

  return "other";
}

/**
 * Compare actual spend to card benefits
 * Output: Which card would have earned most on this statement
 */
export function compareStatementToCards(
  statement: ParsedStatement,
  cards: any[] // CreditCard[]
): Array<{ cardId: string; estimatedRewardsInr: number }> {
  // TODO: Implement
  return [];
}
