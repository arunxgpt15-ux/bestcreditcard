/**
 * Axis Bank Lifetime Free Cashback Card
 * Reference implementation #3: Lifetime-free entry card with simple structure.
 *
 * DATA POLICY: All marked 'unverified' until officially confirmed.
 */

import { CreditCardSchema } from "../schema/card";

const PLACEHOLDER_DATE = "2025-01-01T00:00:00Z";

export const axisLifetimeFree = CreditCardSchema.parse({
  identity: {
    id: "axis-lifetime-free",
    issuer: "Axis Bank",
    name: "Axis Bank Lifetime Free Cashback Card",
    network: ["visa"],
    status: "active",
  },

  fees: {
    joiningFee: null,
    annualFee: null, // Lifetime free
    gstRate: 0.18,
  },

  rewards: [
    {
      id: "earn_cashback_flat_1",
      categories: [
        "online_shopping",
        "offline_retail",
        "groceries",
        "dining",
        "fuel",
        "travel_flights",
        "travel_hotels",
      ],
      channel: "any",
      rate: {
        type: "percent_cashback",
        value: 1, // Flat 1% cashback
      },
      notes: "Flat 1% cashback on all spends except utilities and govt payments",
      source: "https://www.axisbank.com/lifetime-free",
      lastVerifiedAt: PLACEHOLDER_DATE,
      confidence: "unverified",
    },
  ],

  surcharges: [
    {
      category: "utility",
      type: "no_rewards",
      source: "https://www.axisbank.com/lifetime-free",
      lastVerifiedAt: PLACEHOLDER_DATE,
      confidence: "unverified",
    },
    {
      category: "govt",
      type: "no_rewards",
      source: "https://www.axisbank.com/lifetime-free",
      lastVerifiedAt: PLACEHOLDER_DATE,
      confidence: "unverified",
    },
  ],

  forex: {
    markupPercent: 2.5,
    source: "https://www.axisbank.com/lifetime-free",
    lastVerifiedAt: PLACEHOLDER_DATE,
    confidence: "unverified",
  },

  eligibility: {
    minMonthlyIncomeSalaried: 50000000, // ₹50,000 (entry-level)
    employmentTypes: ["salaried", "student"],
    minAgeYears: 21,
    requiresExistingCard: false,
    ntbOnly: false,
    source: "https://www.axisbank.com/lifetime-free",
    lastVerifiedAt: PLACEHOLDER_DATE,
    confidence: "unverified",
  },

  affiliate: {
    networkId: "cuelinks",
    campaignId: "axis-lifetime-2025",
    payoutNtbInr: 50000, // ₹500 NTB
    validationCriteria: "dispatch",
    validationRatePercent: 80,
    allowsSocial: true,
    allowsEmail: true,
    lastPayoutUpdatedAt: PLACEHOLDER_DATE,
  },

  meta: {
    mitcUrl: "https://www.axisbank.com/lifetime-free",
    lastVerifiedAt: PLACEHOLDER_DATE,
    confidence: "unverified",
  },
});

export default axisLifetimeFree;
