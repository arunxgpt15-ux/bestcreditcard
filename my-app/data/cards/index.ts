/**
 * CARD DATABASE INDEX
 * ===================
 * Central export of all credit cards.
 * Each card is validated at build time against the schema.
 */

import { CreditCardSchema } from "../schema/card";
import hdfcInfinia from "./hdfc-infinia";
import iciciApex from "./icici-apex";
import axisLifetimeFree from "./axis-lifetime-free";

/**
 * All available cards, validated against CreditCardSchema.
 * Add new cards by importing them here and appending to the array.
 */
export const CARD_CATALOGUE = [
  hdfcInfinia,
  iciciApex,
  axisLifetimeFree,
] as const;

/**
 * Utility: Find a card by ID
 */
export function getCardById(id: string) {
  return CARD_CATALOGUE.find((card) => card.identity.id === id);
}

/**
 * Utility: Get all cards from a specific issuer
 */
export function getCardsByIssuer(issuer: string) {
  return CARD_CATALOGUE.filter((card) => card.identity.issuer === issuer);
}

/**
 * Utility: Get all active cards
 */
export function getActiveCards() {
  return CARD_CATALOGUE.filter((card) => card.identity.status === "active");
}

export default CARD_CATALOGUE;
