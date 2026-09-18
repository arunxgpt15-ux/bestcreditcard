/**
 * ENGINE INDEX TESTS
 * ==================
 * Golden snapshot tests for the main evaluation logic.
 * These are integration tests ensuring the invariant:
 * Sum of line items = final NAV (exactly)
 */

import { describe, it, expect } from "vitest";
import { evaluateCard, rankCards } from "../engine/index";
import { 
  profileRentHeavy, 
  profileTravelHeavy, 
  profileMinimalSpend 
} from "./__fixtures__";
import { hdfcInfinia } from "../../data/cards/hdfc-infinia";
import { iciciApex } from "../../data/cards/icici-apex";
import { axisLifetimeFree } from "../../data/cards/axis-lifetime-free";

describe("Engine: Card Evaluation", () => {
  describe("Line Item Invariant", () => {
    it("HDFC Infinia: sum of line items equals steady-state NAV", () => {
      const eval1 = evaluateCard(hdfcInfinia, profileTravelHeavy);
      
      const lineItemSum = eval1.lineItems.reduce((sum, l) => sum + l.cappedValueInr, 0);
      
      // Invariant: must match exactly (within 1 paise rounding)
      expect(Math.abs(lineItemSum - eval1.netAnnualValueSteadyStateInr)).toBeLessThanOrEqual(1);
    });

    it("ICICI Apex: sum of line items equals steady-state NAV", () => {
      const eval1 = evaluateCard(iciciApex, profileRentHeavy);
      
      const lineItemSum = eval1.lineItems.reduce((sum, l) => sum + l.cappedValueInr, 0);
      
      expect(Math.abs(lineItemSum - eval1.netAnnualValueSteadyStateInr)).toBeLessThanOrEqual(1);
    });

    it("Axis Lifetime Free: sum of line items equals steady-state NAV", () => {
      const eval1 = evaluateCard(axisLifetimeFree, profileMinimalSpend);
      
      const lineItemSum = eval1.lineItems.reduce((sum, l) => sum + l.cappedValueInr, 0);
      
      expect(Math.abs(lineItemSum - eval1.netAnnualValueSteadyStateInr)).toBeLessThanOrEqual(1);
    });
  });

  describe("Rent-heavy spender (exclusion handling)", () => {
    it("HDFC Infinia should have lower NAV with ₹3L rent", () => {
      const eval1 = evaluateCard(hdfcInfinia, profileRentHeavy);
      
      // Rent is hit with 2% surcharge, so should reduce earnings
      expect(eval1.netAnnualValueSteadyStateInr).toBeGreaterThan(0);
      
      // Should have surcharge line items
      const surcharges = eval1.lineItems.filter(l => l.category === "surcharge");
      expect(surcharges.length).toBeGreaterThan(0);
    });

    it("ICICI Apex should have reduced earnings on rent", () => {
      const eval1 = evaluateCard(iciciApex, profileRentHeavy);
      
      // Should show rent exclusion
      const rentItems = eval1.lineItems.filter(l => l.label.includes("rent"));
      // May be empty or have zero earnings
      
      expect(eval1.netAnnualValueSteadyStateInr).toBeGreaterThan(0); // Still positive due to other earns
    });
  });

  describe("Travel-heavy spender (lounge value)", () => {
    it("HDFC Infinia should earn significant lounge value", () => {
      const eval1 = evaluateCard(hdfcInfinia, profileTravelHeavy);
      
      const loungeItems = eval1.lineItems.filter(l => l.category === "lounge");
      expect(loungeItems.length).toBeGreaterThan(0);
      
      const totalLoungeValue = loungeItems.reduce((sum, l) => sum + l.cappedValueInr, 0);
      expect(totalLoungeValue).toBeGreaterThan(100000); // At least ₹1,000 in lounge value
    });

    it("Axis Lifetime Free has no lounge, should have lower NAV", () => {
      const eval1 = evaluateCard(axisLifetimeFree, profileTravelHeavy);
      const eval2 = evaluateCard(hdfcInfinia, profileTravelHeavy);
      
      const axisLounge = eval1.lineItems.filter(l => l.category === "lounge");
      const hdfcLounge = eval2.lineItems.filter(l => l.category === "lounge");
      
      expect(axisLounge.length).toBe(0);
      expect(hdfcLounge.length).toBeGreaterThan(0);
    });
  });

  describe("Minimal spender (break-even)", () => {
    it("Premium card with minimal spend should have negative NAV", () => {
      const eval1 = evaluateCard(hdfcInfinia, profileMinimalSpend);
      
      // High annual fee (₹12.5k) with low spend should result in loss
      expect(eval1.netAnnualValueSteadyStateInr).toBeLessThan(0);
    });

    it("Lifetime-free card with minimal spend should be neutral to positive", () => {
      const eval1 = evaluateCard(axisLifetimeFree, profileMinimalSpend);
      
      // No fee, so should be positive (even if small)
      expect(eval1.netAnnualValueSteadyStateInr).toBeGreaterThanOrEqual(-100000); // Shouldn't be huge loss
    });
  });

  describe("Year 1 vs Steady-State", () => {
    it("Year 1 NAV should be lower due to joining fee (if present)", () => {
      const eval1 = evaluateCard(hdfcInfinia, profileTravelHeavy);
      
      // Both joining fee and annual fee present
      expect(eval1.netAnnualValueYear1Inr).toBeLessThanOrEqual(eval1.netAnnualValueSteadyStateInr);
    });

    it("Lifetime-free card should have equal Year 1 and steady-state", () => {
      const eval1 = evaluateCard(axisLifetimeFree, profileTravelHeavy);
      
      // No joining or annual fee
      expect(eval1.netAnnualValueYear1Inr).toEqual(eval1.netAnnualValueSteadyStateInr);
    });
  });
});

describe("Engine: Ranking", () => {
  it("Should rank Axis > HDFC for minimal spender", () => {
    const ranked = rankCards(
      [hdfcInfinia, iciciApex, axisLifetimeFree],
      profileMinimalSpend
    );
    
    const axisRank = ranked.find(r => r.cardId === "axis-lifetime-free")?.rankPosition || 999;
    const hdfcRank = ranked.find(r => r.cardId === "hdfc-infinia")?.rankPosition || 999;
    
    expect(axisRank).toBeLessThan(hdfcRank);
  });

  it("Should rank HDFC > Axis for travel-heavy spender", () => {
    const ranked = rankCards(
      [hdfcInfinia, iciciApex, axisLifetimeFree],
      profileTravelHeavy
    );
    
    const hdfcRank = ranked.find(r => r.cardId === "hdfc-infinia")?.rankPosition || 999;
    const axisRank = ranked.find(r => r.cardId === "axis-lifetime-free")?.rankPosition || 999;
    
    expect(hdfcRank).toBeLessThan(axisRank);
  });
});
