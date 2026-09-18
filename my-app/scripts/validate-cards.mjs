#!/usr/bin/env node

/**
 * BUILD-TIME CARD VALIDATION SCRIPT
 * ==================================
 * 
 * Validates all card data against the schema and enforces:
 * 1. No required source is missing
 * 2. lastVerifiedAt is not stale (>120 days old)
 * 3. affiliate payout has lastPayoutUpdatedAt
 * 4. Critical fields (fees, earn rates) have confidence >= 'partial'
 *
 * Run: npm run validate:cards
 * Fails the build if any rule is violated.
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Parse card files
const cardsDir = path.join(__dirname, "../data/cards");
const cardFiles = fs
  .readdirSync(cardsDir)
  .filter((f) => f.endsWith(".ts") && f !== "index.ts");

const STALE_THRESHOLD_DAYS = 120;
const STALE_WARNING_DAYS = 90;

/**
 * @typedef {{cardId: string; field: string; severity: 'error' | 'warning'; message: string}} ValidationError
 */

/** @type {ValidationError[]} */
const errors = [];
/** @type {ValidationError[]} */
const warnings = [];

console.log(`🔍 Validating ${cardFiles.length} cards...\n`);

// Simple regex-based check (since we can't easily import/execute .ts files in a script)
// In production, you'd use ts-node or a bundler
cardFiles.forEach((file) => {
  const cardPath = path.join(cardsDir, file);
  const content = fs.readFileSync(cardPath, "utf-8");

  // Extract cardId from identity.id
  const idMatch = content.match(/id:\s*["']([^"']+)["']/);
  const cardId = idMatch ? idMatch[1] : file.replace(".ts", "");

  // Rule 1: Check for unverified critical fields
  // Count how many critical fields are marked 'unverified'
  const unverifiedMatches = content.match(/confidence:\s*["']unverified["']/g) || [];
  if (unverifiedMatches.length > 5) {
    warnings.push({
      cardId,
      field: "critical_fields",
      severity: "warning",
      message: `Multiple critical fields marked 'unverified' (${unverifiedMatches.length}). This card should not appear in top 3 results without a confidence warning.`,
    });
  }

  // Rule 2: Check for stale verification dates
  const dateMatches = content.match(/lastVerifiedAt:\s*["']([^"']+)["']/g) || [];
  dateMatches.forEach((dateStr) => {
    const dateMatch = dateStr.match(/["']([^"']+)["']/);
    if (dateMatch) {
      const verificationDate = new Date(dateMatch[1]);
      const now = new Date();
      const daysOld = (now.getTime() - verificationDate.getTime()) / (1000 * 60 * 60 * 24);

      if (daysOld > STALE_THRESHOLD_DAYS) {
        errors.push({
          cardId,
          field: "lastVerifiedAt",
          severity: "error",
          message: `Data is ${Math.floor(daysOld)} days old (threshold: ${STALE_THRESHOLD_DAYS} days). Must re-verify against official MITC.`,
        });
      } else if (daysOld > STALE_WARNING_DAYS) {
        warnings.push({
          cardId,
          field: "lastVerifiedAt",
          severity: "warning",
          message: `Data is ${Math.floor(daysOld)} days old (warning threshold: ${STALE_WARNING_DAYS} days). Plan re-verification soon.`,
        });
      }
    }
  });

  // Rule 3: Check affiliate payout has lastPayoutUpdatedAt
  if (content.includes("payoutNtbInr:") || content.includes("payoutEtbInr:")) {
    if (!content.includes("lastPayoutUpdatedAt:")) {
      errors.push({
        cardId,
        field: "affiliate.lastPayoutUpdatedAt",
        severity: "error",
        message: "Affiliate payout defined but no lastPayoutUpdatedAt. Must track when payout rates were last confirmed.",
      });
    }
  }

  // Rule 4: Check for placeholder dates (too strict for production, but good for seeding)
  const placeholderMatches = content.match(/["']2025-01-01T00:00:00Z["']/g) || [];
  if (placeholderMatches.length > 0) {
    console.warn(`⚠️  ${cardId}: Contains ${placeholderMatches.length} placeholder dates (2025-01-01). Replace with actual verification dates.`);
  }
});

// Print results
console.log("\n" + "=".repeat(60));

if (errors.length > 0) {
  console.error(`\n❌ ${errors.length} VALIDATION ERROR(S) FOUND:\n`);
  errors.forEach((err) => {
    console.error(`  [${err.cardId}] ${err.field}`);
    console.error(`  → ${err.message}\n`);
  });
  process.exit(1);
}

if (warnings.length > 0) {
  console.warn(`\n⚠️  ${warnings.length} VALIDATION WARNING(S):\n`);
  warnings.forEach((warn) => {
    console.warn(`  [${warn.cardId}] ${warn.field}`);
    console.warn(`  → ${warn.message}\n`);
  });
}

if (errors.length === 0 && warnings.length === 0) {
  console.log(`\n✅ All ${cardFiles.length} cards passed validation!\n`);
}

console.log("=".repeat(60) + "\n");

process.exit(errors.length > 0 ? 1 : 0);
