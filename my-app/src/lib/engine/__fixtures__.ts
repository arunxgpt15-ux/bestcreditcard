/**
 * ENGINE TEST FIXTURES
 * ====================
 * Golden data sets for deterministic engine testing.
 */

import type { UserProfile } from "../engine/types";
import { hdfcInfinia } from "../../data/cards/hdfc-infinia";

/**
 * Test profile: Rent-heavy Delhi salaried user
 * Should struggle on cards with rent exclusions
 */
export const profileRentHeavy: UserProfile = {
  spends: {
    online_shopping: { monthlyInr: 500000 },
    offline_retail: { monthlyInr: 300000 },
    groceries: { monthlyInr: 200000 },
    dining: { monthlyInr: 150000 },
    food_delivery: { monthlyInr: 100000 },
    fuel: { monthlyInr: 200000 },
    utilities: { monthlyInr: 50000 },
    rent: { monthlyInr: 300000 }, // 30% of spend is rent
    education: { monthlyInr: 0 },
    insurance: { monthlyInr: 0 },
    travel_flights: { monthlyInr: 100000 },
    travel_hotels: { monthlyInr: 100000 },
    ott_subscriptions: { monthlyInr: 30000 },
    wallet_load: { monthlyInr: 50000 },
    govt_payments: { monthlyInr: 0 },
    telecom: { monthlyInr: 30000 },
    healthcare: { monthlyInr: 20000 },
    ecommerce_partner: { monthlyInr: 0 },
    international: { monthlyInr: 50000 },
    other: { monthlyInr: 30000 },
  },
  travel: {
    domesticTripsPerYear: 2,
    internationalTripsPerYear: 1,
    loungeVisitsPerTrip: 2,
    avgLoungeValueInr: 120000,
    forexSpendPerYearInr: 500000,
  },
  assumptions: {
    pointValuationMode: "realistic",
    breakageRate: 0.1,
    discountRateForDelayedRewards: 0.08,
  },
  wallet: {
    existingCardIds: [],
    issuersBankedWith: [],
  },
  profile: {
    employmentType: "salaried",
    monthlyIncomeInr: 400000 * 100, // ₹4 lakhs
    cityTier: 1,
    ageYears: 35,
    cibilBand: "750-799",
    existingCardsCount: 0,
    oldestCardVintageMonths: 0,
    recentEnquiries6m: 0,
    hasItr: false,
  },
};

/**
 * Test profile: Travel-heavy international frequenter
 * Should love lounge-heavy cards
 */
export const profileTravelHeavy: UserProfile = {
  spends: {
    online_shopping: { monthlyInr: 200000 },
    offline_retail: { monthlyInr: 100000 },
    groceries: { monthlyInr: 100000 },
    dining: { monthlyInr: 150000 },
    food_delivery: { monthlyInr: 50000 },
    fuel: { monthlyInr: 100000 },
    utilities: { monthlyInr: 30000 },
    rent: { monthlyInr: 200000 },
    education: { monthlyInr: 0 },
    insurance: { monthlyInr: 0 },
    travel_flights: { monthlyInr: 300000 }, // High travel spend
    travel_hotels: { monthlyInr: 250000 },
    ott_subscriptions: { monthlyInr: 20000 },
    wallet_load: { monthlyInr: 20000 },
    govt_payments: { monthlyInr: 0 },
    telecom: { monthlyInr: 30000 },
    healthcare: { monthlyInr: 10000 },
    ecommerce_partner: { monthlyInr: 0 },
    international: { monthlyInr: 200000 }, // Significant forex
    other: { monthlyInr: 20000 },
  },
  travel: {
    domesticTripsPerYear: 4,
    internationalTripsPerYear: 4, // Heavy international traveller
    loungeVisitsPerTrip: 3,
    avgLoungeValueInr: 150000,
    forexSpendPerYearInr: 2400000, // ₹2.4L forex per year
  },
  assumptions: {
    pointValuationMode: "optimistic",
    breakageRate: 0.05,
    discountRateForDelayedRewards: 0.05,
  },
  wallet: {
    existingCardIds: [],
    issuersBankedWith: [],
  },
  profile: {
    employmentType: "salaried",
    monthlyIncomeInr: 600000 * 100, // ₹6 lakhs
    cityTier: 1,
    ageYears: 40,
    cibilBand: "800+",
    existingCardsCount: 2,
    oldestCardVintageMonths: 48,
    recentEnquiries6m: 1,
    hasItr: false,
  },
};

/**
 * Test profile: Minimal spender (below break-even for premium cards)
 * Should show negative NAV on high-fee cards
 */
export const profileMinimalSpend: UserProfile = {
  spends: {
    online_shopping: { monthlyInr: 50000 },
    offline_retail: { monthlyInr: 30000 },
    groceries: { monthlyInr: 30000 },
    dining: { monthlyInr: 20000 },
    food_delivery: { monthlyInr: 10000 },
    fuel: { monthlyInr: 30000 },
    utilities: { monthlyInr: 20000 },
    rent: { monthlyInr: 0 },
    education: { monthlyInr: 0 },
    insurance: { monthlyInr: 0 },
    travel_flights: { monthlyInr: 0 },
    travel_hotels: { monthlyInr: 0 },
    ott_subscriptions: { monthlyInr: 10000 },
    wallet_load: { monthlyInr: 0 },
    govt_payments: { monthlyInr: 0 },
    telecom: { monthlyInr: 10000 },
    healthcare: { monthlyInr: 5000 },
    ecommerce_partner: { monthlyInr: 0 },
    international: { monthlyInr: 0 },
    other: { monthlyInr: 5000 },
  },
  travel: {
    domesticTripsPerYear: 0,
    internationalTripsPerYear: 0,
    loungeVisitsPerTrip: 0,
    avgLoungeValueInr: 0,
    forexSpendPerYearInr: 0,
  },
  assumptions: {
    pointValuationMode: "conservative",
    breakageRate: 0.15,
    discountRateForDelayedRewards: 0.1,
  },
  wallet: {
    existingCardIds: [],
    issuersBankedWith: [],
  },
  profile: {
    employmentType: "salaried",
    monthlyIncomeInr: 150000 * 100, // ₹1.5 lakhs
    cityTier: 2,
    ageYears: 28,
    cibilBand: "700-749",
    existingCardsCount: 0,
    oldestCardVintageMonths: 0,
    recentEnquiries6m: 2,
    hasItr: false,
  },
};
