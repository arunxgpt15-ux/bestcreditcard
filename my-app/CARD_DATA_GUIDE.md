# Card Data Layer — Prompt 1 Documentation

## Overview

This document describes the **Card Data Model** implementation for JourneyCard. Every credit card in our catalogue is strictly typed, auditable, and sourced.

## Core Principles

1. **DETERMINISTIC**: Same card data always produces the same recommendations
2. **AUDITABLE**: Every number is traceable to a source with metadata
3. **CONSERVATIVE**: Unverified data is marked as such; unverified claims never appear in top recommendations
4. **SOURCED**: Every datapoint carries `{ value, sourceUrl, lastVerifiedAt, confidence }`

## Directory Structure

```
data/
├── cards/
│   ├── index.ts              # Central catalogue export
│   ├── hdfc-infinia.ts       # Individual card files
│   ├── icici-apex.ts
│   └── axis-lifetime-free.ts
src/
├── lib/
│   ├── schema/
│   │   └── card.ts           # Zod schemas + Sourced<T> helper
│   └── sourcing.ts           # Convenience re-exports
scripts/
└── validate-cards.mjs        # Build-time validation
```

## Adding a New Card

### Step 1: Create a card file

Create `/data/cards/<issuer>-<slug>.ts`. Follow this template:

```typescript
import { CreditCardSchema } from "../schema/card";

const PLACEHOLDER_DATE = "2025-01-01T00:00:00Z"; // Replace with actual date

export const myNewCard = CreditCardSchema.parse({
  identity: {
    id: "issuer-slug",
    issuer: "Bank Name",
    name: "Full Card Name",
    network: ["visa", "mastercard"],
    status: "active",
  },
  
  fees: {
    joiningFee: null,
    annualFee: {
      value: 1000000, // In paise
      source: "https://...",
      lastVerifiedAt: PLACEHOLDER_DATE,
      confidence: "unverified", // Until confirmed
    },
    gstRate: 0.18,
  },

  rewards: [
    {
      id: "earn_online_5x",
      categories: ["online_shopping"],
      channel: "any",
      rate: {
        type: "points_per_x",
        value: 5,
        per: 150, // 5 points per ₹150
      },
      source: "https://...",
      lastVerifiedAt: PLACEHOLDER_DATE,
      confidence: "unverified",
    },
  ],

  // ... other fields (see full schema in src/lib/schema/card.ts)

  meta: {
    mitcUrl: "https://official-card-page.pdf",
    lastVerifiedAt: PLACEHOLDER_DATE,
    confidence: "unverified",
  },
});

export default myNewCard;
```

### Step 2: Register in the catalogue

Edit `/data/cards/index.ts` and add your card:

```typescript
import myNewCard from "./issuer-slug";

export const CARD_CATALOGUE = [
  hdfcInfinia,
  iciciApex,
  axisLifetimeFree,
  myNewCard, // ← Add here
] as const;
```

### Step 3: Verify and validate

```bash
npm run validate:cards
```

The script checks:
- ✅ No stale data (>120 days without re-verification)
- ✅ Affiliate payouts have `lastPayoutUpdatedAt`
- ✅ Critical fields are not all `unverified`

## Sourced<T> Metadata

Every numeric claim carries metadata:

```typescript
{
  value: number,           // The actual value (usually in paise)
  sourceUrl?: string,      // Link to where this came from
  lastVerifiedAt?: string, // ISO 8601 datetime
  confidence: "verified" | "partial" | "unverified"
}
```

**Confidence levels:**

- `verified`: Confirmed from official issuer MITC/T&C PDF
- `partial`: Derived from official sources but with some interpretation
- `unverified`: Community reports, estimates, or not yet confirmed

### Example: Annual Fee with Metadata

```typescript
annualFee: {
  value: 1250000, // ₹12,500 in paise
  source: "https://www.hdfcbank.com/cards/infinia/terms",
  lastVerifiedAt: "2025-06-15T10:30:00Z",
  confidence: "verified",
}
```

The engine will:
1. **Display** this fee without a warning
2. **Include** it in all NAV calculations
3. **Link** the source in the UI

```typescript
// Unverified: will show a ⚠️ badge in the UI
annualFee: {
  value: 1250000,
  source: "https://blog.random-reviewer.com/card-review",
  confidence: "unverified",
}
```

## Verification Workflow

### Adding Unverified Data (Seeding)

1. Create card with placeholder date: `"2025-01-01T00:00:00Z"`
2. Mark `confidence: "unverified"`
3. Add code comment: `// MUST verify against official MITC PDF before launch`

### Verification (Before Launch)

1. Open the official MITC PDF from the bank's website
2. Find the specific claim (fee, earn rate, exclusion, etc.)
3. Update the card file:
   ```typescript
   annualFee: {
     value: 1250000,
     source: "https://example.com/official-pdf#page=3",
     lastVerifiedAt: new Date().toISOString(), // Current date
     confidence: "verified",
   },
   ```
4. Run `npm run validate:cards` — should pass

### Re-Verification (Every 60 Days)

1. T&C changes happen often (especially fees, exclusions, caps)
2. Set a calendar reminder to re-verify each card
3. If `lastVerifiedAt` > 120 days, the build will fail
4. Update `lastVerifiedAt` to today and re-run

## Schema Reference

### Full Card Schema

See `/src/lib/schema/card.ts` for detailed field definitions:

- **identity**: Card name, issuer, network, status
- **fees**: Joining, annual, GST, waiver conditions
- **rewards**: Earn rules per category, with caps
- **pointValue**: Point redemption value across channels
- **surcharges**: Rules (fees, blocked, no rewards) per category
- **lounge**: Domestic/international visits, programme
- **milestones**: Spend thresholds and bonuses
- **forex**: Markup percentage
- **softBenefits**: Golf, insurance, concierge, etc.
- **eligibility**: Income, age, employment, credit score requirements
- **affiliate**: Payout details, validation criteria, cookie duration
- **meta**: MITC URL, last verified, overall confidence

## Utilities

### `sourced<T>(value, opts?)`

Quick helper to create a Sourced<T> object:

```typescript
import { sourced } from "@/lib/sourcing";

const fee = sourced(1250000, {
  sourceUrl: "https://...",
  lastVerifiedAt: "2025-01-15T00:00:00Z",
  confidence: "verified",
});
```

### `worstConfidence(items)`

Find the weakest confidence across multiple fields:

```typescript
import { worstConfidence } from "@/lib/sourcing";

const overallConfidence = worstConfidence([
  { confidence: "verified" },
  { confidence: "partial" },
  { confidence: "unverified" },
  // → returns "unverified"
]);
```

## Type Exports

All types are exported from `/src/lib/schema/card.ts`:

```typescript
import type {
  CreditCard,
  SpendCategory,
  CardChannel,
  CardStatus,
  EarnRateType,
  // ... more
} from "@/lib/schema/card";
```

## Next Steps

Once this foundation is solid:

1. **Prompt 2**: Build the NAV engine (`/src/lib/engine/`)
   - Modular functions for earn, redeem, benefits, costs
   - Line-item accountability
   - Test fixtures

2. **Prompt 3**: Sensitivity analysis and assumption tweaking
   - Break-even calculations
   - Scenario analysis
   - Tornado charts

3. **Prompt 4**: Quiz + Approval probability
   - Collect user profile
   - Filter by eligibility
   - Estimate approval likelihood

---

**Remember**: _Never invent T&C numbers. If unsure, mark it `unverified`. Better to be conservative than to confidently get it wrong._
