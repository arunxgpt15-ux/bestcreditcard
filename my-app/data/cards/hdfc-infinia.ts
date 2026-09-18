/**
 * HDFC Bank Infinia (Premium Travel Card)
 * Reference implementation #1: Premium tier with lounge, forex, high annual fee.
 *
 * DATA POLICY: Every number marked 'unverified' until confirmed from official MITC PDF.
 * DO NOT guess T&C numbers. Use official issuer pages only.
 * Source: HDFC official MITC (to be verified against actual PDF)
 */

import { CreditCardSchema, sourced } from "../schema/card";

// IMPORTANT: ISO 8601 format. Replace with actual verification date when confirmed.
const PLACEHOLDER_DATE = "2025-01-01T00:00:00Z";

export const hdfcInfinia = CreditCardSchema.parse({
  identity: {
    id: "hdfc-infinia",
    issuer: "HDFC Bank",
    name: "HDFC Bank Infinia (Metal Edition)",
    network: ["visa", "mastercard"],
    status: "active",
  },

  fees: {
    joiningFee: null, // Lifetime free
    annualFee: {
      value: 1250000, // ₹12,500 in paise
      source: "https://www.hdfcbank.com/infinia",
      lastVerifiedAt: PLACEHOLDER_DATE,
      confidence: "unverified", // MUST verify against official MITC PDF
    },
    gstRate: 0.18,
    feeWaiverSpendThreshold: null, // No waiver condition
    waiverConditions: [],
  },

  rewards: [
    {
      id: "earn_base_5x",
      categories: ["online_shopping", "offline_retail", "dining", "travel_flights", "travel_hotels"],
      channel: "any",
      rate: {
        type: "points_per_x",
        value: 5,
        per: 150, // 5 points per ₹150
      },
      excludedCategories: ["utilities", "govt_payments", "insurance"],
      notes: "Core reward rate applies to most categories except utilities and govt payments",
      source: "https://www.hdfcbank.com/infinia",
      lastVerifiedAt: PLACEHOLDER_DATE,
      confidence: "unverified",
    },
    {
      id: "earn_fuel_3x",
      categories: ["fuel"],
      channel: "any",
      rate: {
        type: "points_per_x",
        value: 3,
        per: 150,
      },
      notes: "Fuel spending earns at lower rate",
      source: "https://www.hdfcbank.com/infinia",
      lastVerifiedAt: PLACEHOLDER_DATE,
      confidence: "unverified",
    },
  ],

  pointValue: {
    baseValueInr: 50, // 0.50 per point conservative
    bestCaseValueInr: 100, // ₹1 per point optimistic (travel redemption)
    redemptionChannels: [
      {
        name: "Travel (flights, hotels, transfers)",
        valuePerPoint: 100, // ₹1 per point
        source: "https://www.hdfcbank.com/infinia",
        lastVerifiedAt: PLACEHOLDER_DATE,
        confidence: "unverified",
      },
      {
        name: "Cashback (1:100 redemption)",
        valuePerPoint: 50, // ₹0.50 per point
        source: "https://www.hdfcbank.com/infinia",
        lastVerifiedAt: PLACEHOLDER_DATE,
        confidence: "unverified",
      },
    ],
    source: "https://www.hdfcbank.com/infinia",
    lastVerifiedAt: PLACEHOLDER_DATE,
    confidence: "unverified",
  },

  surcharges: [
    {
      category: "rent",
      type: "fee_percent",
      value: 2, // 2% surcharge
      thresholdInr: 0, // Always applies
      source: "https://www.hdfcbank.com/infinia",
      lastVerifiedAt: PLACEHOLDER_DATE,
      confidence: "unverified",
    },
    {
      category: "wallet_load",
      type: "no_rewards",
      source: "https://www.hdfcbank.com/infinia",
      lastVerifiedAt: PLACEHOLDER_DATE,
      confidence: "unverified",
    },
  ],

  lounge: {
    domesticVisitsPerYear: null, // Unlimited — represent as null
    internationalVisitsPerYear: null, // Unlimited
    guestVisits: null,
    programme: "issuer",
    notes: "Unlimited complimentary domestic and international lounge access",
    source: "https://www.hdfcbank.com/infinia",
    lastVerifiedAt: PLACEHOLDER_DATE,
    confidence: "unverified",
  },

  milestones: [
    {
      id: "milestone_annual_5lac",
      spendThresholdInr: 500000000, // ₹5,00,000 in paise
      period: "annual",
      rewardType: "bonus_points",
      rewardValueInr: 100000, // ₹1,000 value in paise
      description: "Bonus when you spend ₹5 lakhs in a year",
      source: "https://www.hdfcbank.com/infinia",
      lastVerifiedAt: PLACEHOLDER_DATE,
      confidence: "unverified",
    },
  ],

  forex: {
    markupPercent: 2.0,
    crossCurrencyMarkupPercent: 1.0,
    source: "https://www.hdfcbank.com/infinia",
    lastVerifiedAt: PLACEHOLDER_DATE,
    confidence: "unverified",
  },

  softBenefits: [
    {
      type: "concierge",
      nominalValueInr: 0, // Included, no separate value
      defaultUtilisationRate: 0, // User opt-in
      source: "https://www.hdfcbank.com/infinia",
      lastVerifiedAt: PLACEHOLDER_DATE,
      confidence: "unverified",
    },
    {
      type: "golf",
      nominalValueInr: 250000, // ₹2,500 estimated annual value
      defaultUtilisationRate: 0,
      source: "https://www.hdfcbank.com/infinia",
      lastVerifiedAt: PLACEHOLDER_DATE,
      confidence: "unverified",
    },
  ],

  eligibility: {
    minMonthlyIncomeSalaried: 200000000, // ₹2,00,000 per month (estimate)
    employmentTypes: ["salaried", "self_employed"],
    minAgeYears: 25,
    maxAgeYears: 65,
    requiresExistingCard: false,
    ntbOnly: false,
    source: "https://www.hdfcbank.com/infinia",
    lastVerifiedAt: PLACEHOLDER_DATE,
    confidence: "unverified",
  },

  affiliate: {
    networkId: "cuelinks",
    campaignId: "hdfc-infinia-2025",
    payoutNtbInr: 150000, // ₹1,500 NTB payout (estimate)
    validationCriteria: "activation",
    validationRatePercent: 65,
    allowsSocial: true,
    allowsDeeplink: true,
    allowsEmail: true,
    lastPayoutUpdatedAt: PLACEHOLDER_DATE,
  },

  meta: {
    mitcUrl: "https://www.hdfcbank.com/infinia",
    lastVerifiedAt: PLACEHOLDER_DATE,
    verifiedBy: null,
    confidence: "unverified",
  },
});

export default hdfcInfinia;
