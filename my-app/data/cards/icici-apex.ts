/**
 * ICICI Bank Apex (Mid-Tier Rewards Card)
 * Reference implementation #2: Mid-tier with solid cashback and rewards balance.
 *
 * DATA POLICY: Everything marked 'unverified' until confirmed from official MITC.
 * Replace placeholders with actual verification dates and sources.
 */

import { CreditCardSchema } from "../schema/card";

const PLACEHOLDER_DATE = "2025-01-01T00:00:00Z";

export const iciciApex = CreditCardSchema.parse({
  identity: {
    id: "icici-apex",
    issuer: "ICICI Bank",
    name: "ICICI Bank Apex Travel Card",
    network: ["visa", "mastercard"],
    status: "active",
  },

  fees: {
    joiningFee: null,
    annualFee: {
      value: 99000, // ₹990 annual fee (low-entry premium)
      source: "https://www.icicibank.com/apex",
      lastVerifiedAt: PLACEHOLDER_DATE,
      confidence: "unverified",
    },
    gstRate: 0.18,
    feeWaiverSpendThreshold: 300000000, // ₹3,00,000 annual spend
    waiverConditions: [
      {
        condition: "Annual fee waived if you spend ₹3 lakhs or more in a year",
        source: "https://www.icicibank.com/apex",
      },
    ],
  },

  rewards: [
    {
      id: "earn_dining_4x",
      categories: ["dining", "food_delivery"],
      channel: "any",
      rate: {
        type: "percent_cashback",
        value: 4, // 4% cashback
      },
      monthlyCapType: "value",
      monthlyCapValue: 10000, // ₹100 max cashback per month
      notes: "4% cashback on dining, capped at ₹100/month",
      source: "https://www.icicibank.com/apex",
      lastVerifiedAt: PLACEHOLDER_DATE,
      confidence: "unverified",
    },
    {
      id: "earn_base_1x",
      categories: [
        "online_shopping",
        "offline_retail",
        "groceries",
        "fuel",
        "travel_flights",
        "travel_hotels",
      ],
      channel: "any",
      rate: {
        type: "percent_cashback",
        value: 1, // 1% cashback
      },
      annualCap: 500000, // ₹5,000 annual cashback cap
      notes: "1% cashback on all other categories, annual cap ₹5,000",
      source: "https://www.icicibank.com/apex",
      lastVerifiedAt: PLACEHOLDER_DATE,
      confidence: "unverified",
    },
  ],

  pointValue: null, // This card offers direct cashback, no point-based redemption

  surcharges: [
    {
      category: "wallet_load",
      type: "fee_percent",
      value: 2, // 2% surcharge on wallet loads
      source: "https://www.icicibank.com/apex",
      lastVerifiedAt: PLACEHOLDER_DATE,
      confidence: "unverified",
    },
    {
      category: "rent",
      type: "capped_rewards",
      value: 0, // No cashback on rent
      source: "https://www.icicibank.com/apex",
      lastVerifiedAt: PLACEHOLDER_DATE,
      confidence: "unverified",
    },
  ],

  lounge: {
    domesticVisitsPerYear: 4,
    internationalVisitsPerYear: 2,
    programme: "priority_pass",
    notes: "4 domestic lounge visits per year, 2 international",
    source: "https://www.icicibank.com/apex",
    lastVerifiedAt: PLACEHOLDER_DATE,
    confidence: "unverified",
  },

  forex: {
    markupPercent: 2.0,
    source: "https://www.icicibank.com/apex",
    lastVerifiedAt: PLACEHOLDER_DATE,
    confidence: "unverified",
  },

  softBenefits: [
    {
      type: "insurance",
      nominalValueInr: 50000, // ₹500 travel insurance value estimate
      defaultUtilisationRate: 0,
      source: "https://www.icicibank.com/apex",
      lastVerifiedAt: PLACEHOLDER_DATE,
      confidence: "unverified",
    },
  ],

  eligibility: {
    minMonthlyIncomeSalaried: 75000000, // ₹75,000 per month
    employmentTypes: ["salaried"],
    minAgeYears: 23,
    requiresExistingCard: false,
    source: "https://www.icicibank.com/apex",
    lastVerifiedAt: PLACEHOLDER_DATE,
    confidence: "unverified",
  },

  affiliate: {
    networkId: "cuelinks",
    campaignId: "icici-apex-2025",
    payoutNtbInr: 120000, // ₹1,200 NTB
    payoutEtbInr: 80000, // ₹800 ETB
    validationCriteria: "approval",
    validationRatePercent: 75,
    allowsSocial: true,
    allowsEmail: true,
    lastPayoutUpdatedAt: PLACEHOLDER_DATE,
  },

  meta: {
    mitcUrl: "https://www.icicibank.com/apex",
    lastVerifiedAt: PLACEHOLDER_DATE,
    confidence: "unverified",
  },
});

export default iciciApex;
