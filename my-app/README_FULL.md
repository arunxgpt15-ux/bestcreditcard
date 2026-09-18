# JourneyCard — India's First Deterministic Credit Card Recommendation Engine

> **Deterministic Math + Auditable Sources + Conservative Defaults = Trustworthy Recommendations**

---

## What is JourneyCard?

JourneyCard is a **free, independent information service** that helps Indian credit card users:

1. **Discover the right card** for their spending patterns
2. **Understand the math** behind every recommendation (line-item breakdown)
3. **Compare portfolios** (single card vs. multi-card setups)
4. **Track rule changes** (when banks devalue benefits)

We are **NOT**:
- A bank or NBFC
- An RBI-regulated entity
- A DSA (Direct Selling Agent)
- Offering pre-approvals or guarantees

We are an **information layer** that makes credit card terms transparent and computable.

---

## How It Works

### The Engine

```
┌─────────────────────────────────────────────────────────────┐
│                      USER PROFILE                           │
│  (Spend: ₹X per category, Travel: Y trips/year, Age, etc.) │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                 CARD DATA (Sourced)                         │
│  (Fees, Earn Rules, Caps, Surcharges, Eligibility, etc.)   │
│  Every value: {value, source_url, confidence, last_verified}│
└─────────────────────────────────────────────────────────────┘
                          ↓
        ┌─────────────────────────────────────┐
        │   EVALUATION ENGINE (Pure Math)     │
        ├─────────────────────────────────────┤
        │  1. Earnings (with caps & charges)  │
        │  2. Reward value (with breakage)    │
        │  3. Lounge + milestones + benefits  │
        │  4. Costs (fees + forex + taxes)    │
        │  5. Line-item sum = Final NAV       │
        └─────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│         RANKED RESULTS + APPROVAL ESTIMATE                  │
│  1. Best cards by net annual value (NAV)                    │
│  2. Eligibility hard-filters (who can apply)                │
│  3. Approval likelihood (transparent rubric weights)        │
│  4. Sensitivity analysis (what-if scenarios)                │
└─────────────────────────────────────────────────────────────┘
```

### The Principle: Deterministic

**Same input → Same output, always.**

No LLM. No randomness. No "personalization" that changes between sessions.

This matters because:
- Users can verify the math independently
- Banks can audit our claims
- Rankings are reproducible
- Affiliate payout can't bias results

---

## Project Structure

```
my-app/
├── data/
│   └── cards/               # Card definitions (one file per card)
│       ├── hdfc-infinia.ts
│       ├── icici-apex.ts
│       ├── axis-lifetime-free.ts
│       └── index.ts         # Central catalogue + utilities
│
├── src/
│   ├── lib/
│   │   ├── schema/
│   │   │   └── card.ts      # Zod schemas + Sourced<T> wrapper
│   │   │
│   │   ├── engine/          # Pure math modules
│   │   │   ├── types.ts        # UserProfile, LineItem, CardEvaluation
│   │   │   ├── earn.ts         # Earnings calculation (caps, surcharges)
│   │   │   ├── redeem.ts       # Point/reward valuation
│   │   │   ├── benefits.ts     # Lounge, milestones, soft benefits
│   │   │   ├── costs.ts        # Fees, forex, taxes
│   │   │   ├── eligibility.ts  # Hard eligibility rules
│   │   │   ├── approval.ts     # Transparent approval rubric
│   │   │   ├── sensitivity.ts  # Break-even, scenarios, tornado
│   │   │   ├── portfolio.ts    # Multi-card optimization
│   │   │   └── index.ts        # Main orchestrator (evaluateCard, rankCards)
│   │   │
│   │   ├── quiz-types.ts     # Quiz schema & user input types
│   │   ├── compliance-linter.ts # Banned claims checker
│   │   └── sourcing.ts       # Re-exports for convenience
│   │
│   └── components/
│       ├── compliance.tsx    # Disclosures, chips, disclaimers
│       └── ...
│
├── app/
│   ├── api/v1/
│   │   ├── recommend/route.ts  # POST /api/v1/recommend
│   │   └── cards/route.ts      # GET /api/v1/cards
│   └── ...
│
├── scripts/
│   └── validate-cards.mjs   # Build-time validation
│
├── CARD_DATA_GUIDE.md       # How to add/update cards
├── LAUNCH_CHECKLIST.md      # Pre-launch QA gates
├── CLAUDE.md                # Copilot instructions
└── package.json
```

---

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Validate Cards

```bash
npm run validate:cards
```

Checks for:
- Stale data (>120 days)
- Missing source URLs
- Affiliate payout metadata
- Placeholder dates

Fails the build if issues found.

### 3. Run Tests

```bash
npm test
```

Golden fixtures test:
- 3+ user profiles × 3 cards = invariant checks
- Line item sum = NAV exactly
- Eligibility filtering
- Approval band calibration

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Build & Deploy

```bash
npm run build    # Validates + builds
npm start        # Production server
```

---

## Adding a Card

See [CARD_DATA_GUIDE.md](./CARD_DATA_GUIDE.md) for detailed steps.

**TL;DR:**

1. Create `/data/cards/issuer-slug.ts`
2. Fill in card schema with Zod parse
3. Import in `/data/cards/index.ts`
4. Run `npm run validate:cards`

Example:

```typescript
import { CreditCardSchema } from "@/lib/schema/card";

export const myCard = CreditCardSchema.parse({
  identity: { id: "issuer-slug", issuer: "Bank", name: "Card Name", network: ["visa"] },
  fees: { annualFee: { value: 1000000, confidence: "unverified", source: "https://..." } },
  rewards: [ { id: "earn_1", categories: ["online_shopping"], rate: { type: "percent_cashback", value: 1 }, confidence: "unverified" } ],
  // ... other fields
  meta: { mitcUrl: "https://...", confidence: "unverified" }
});
```

---

## Using the Engine

### Example: Evaluate a Card

```typescript
import { evaluateCard } from "@/lib/engine";
import { hdfcInfinia } from "@/data/cards/hdfc-infinia";

const profile = {
  spends: {
    online_shopping: { monthlyInr: 500000 },
    dining: { monthlyInr: 150000 },
    // ... other categories
  },
  travel: {
    domesticTripsPerYear: 2,
    internationalTripsPerYear: 1,
    loungeVisitsPerTrip: 2,
  },
  profile: {
    employmentType: "salaried",
    monthlyIncomeInr: 400000 * 100,
    ageYears: 35,
    cibilBand: "750-799",
  },
};

const evaluation = evaluateCard(hdfcInfinia, profile);
console.log(evaluation.netAnnualValueSteadyStateInr); // ₹50,000 in paise
console.log(evaluation.lineItems); // [{ id, label, formula, grossValue, cappedValue, ... }]
```

### Example: Rank Cards

```typescript
import { rankCards } from "@/lib/engine";
import { CARD_CATALOGUE } from "@/data/cards";

const ranked = rankCards(CARD_CATALOGUE, profile);
// ranked[0] = best card
// ranked[i].rankPosition, .netAnnualValue, .approvalBand, etc.
```

### Example: Sensitivity Analysis

```typescript
import { scenarios, tornado } from "@/lib/engine/sensitivity";

const scenarios_list = scenarios(hdfcInfinia, profile);
// [ { name: "worst", nav, ... }, { name: "expected", ... }, { name: "best", ... } ]

const tornado_chart = tornado(hdfcInfinia, profile);
// [ { factor: "Point valuation", impactRange, ... }, ... ]
```

---

## API Reference

### POST `/api/v1/recommend`

Recommend cards for a user profile.

**Request:**
```json
{
  "spends": {
    "online_shopping": { "monthlyInr": 500000 },
    "dining": { "monthlyInr": 150000 }
  },
  "travel": {
    "domesticTripsPerYear": 2,
    "internationalTripsPerYear": 1
  },
  "profile": {
    "employmentType": "salaried",
    "monthlyIncomeInr": 40000000,
    "cibilBand": "750-799"
  }
}
```

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "cardId": "hdfc-infinia",
      "rank": 1,
      "navInr": 5000000,
      "approvalBand": "strong",
      "confidence": "partial",
      "rewards": [ { ... line items ... } ],
      "costs": [ ... ],
      "benefits": [ ... ]
    }
  ]
}
```

### GET `/api/v1/cards`

List all active cards.

**Response:**
```json
{
  "success": true,
  "count": 32,
  "cards": [
    {
      "id": "hdfc-infinia",
      "issuer": "HDFC Bank",
      "name": "HDFC Bank Infinia (Metal Edition)",
      "annualFee": 1250000,
      "feeConfidence": "verified",
      "confidence": "partial",
      "last_verified": "2025-01-15T00:00:00Z"
    }
  ]
}
```

---

## Data Quality & Sourcing

Every numeric claim carries metadata:

```typescript
{
  value: number,           // The number
  sourceUrl?: string,      // Official source
  lastVerifiedAt?: string, // ISO 8601
  confidence: "verified" | "partial" | "unverified"
}
```

**Confidence Levels:**
- `verified`: Confirmed from official issuer T&C/MITC PDF
- `partial`: Derived from official sources with some interpretation
- `unverified`: Estimates or community data (not yet confirmed)

**Re-verification Timeline:**
- Every 60 days per card (automation + manual spot checks)
- Build fails if `lastVerifiedAt` > 120 days old
- Data older than 90 days shows a visual warning in UI

---

## Compliance & Ethics

### What We Don't Say

❌ Guaranteed approval  
❌ Pre-approved  
❌ Instant approval  
❌ Best card in India  
❌ Risk-free  
❌ 100% cashback  

(Enforced by automated banned-claims linter in CI)

### What We Do Say

✅ High approval likelihood (with transparent rubric)  
✅ Estimated as a good fit for your profile  
✅ Top-rated for [specific use case]  
✅ Up to X% cashback  

### Disclosures

Every money page shows:
- 🏷️ **Affiliate Disclosure**: We earn commission; it doesn't change rankings (tie-break only)
- ⚖️ **Regulatory Disclaimer**: We're not a bank, NBFC, DSA, or RBI-regulated
- ✋ **Approval Disclaimer**: This is an estimate, not a pre-approval
- 🔒 **Privacy Notice**: DPDP-aligned, no PII storage

---

## Technical Decisions

### Why Deterministic Math?

1. **Reproducible**: Users can run the same calc manually
2. **Auditable**: Banks can verify claims
3. **Efficient**: Runs in <50ms for 40 cards client-side
4. **Fair**: No hidden personalization; affiliate payout can't bias ranking

### Why No LLM?

- Hallucinations could cost users real money
- T&C numbers are precise; LLMs are not
- Deterministic ensures compliance reviewers can test any input

### Why Conservative Defaults?

- Breakage: 10% of points never redeemed (not 0%)
- Lounge: Never credit unused visits
- Milestones: "At risk" gets 50% credit if you're 85-100% toward threshold
- Soft benefits: Default 0% utilization (user must opt in)

---

## Next Steps

1. **Fill in all 30+ cards** from official MITCs
2. **Launch** the recommendation engine + quiz
3. **Build trust** via transparent data & monthly verifications
4. **Expand** to portfolio optimizer + community feedback
5. **Monetize** via affiliate + B2B API

---

## Contributing

See [CLAUDE.md](./CLAUDE.md) for AI assistant instructions.

To add/update cards: [CARD_DATA_GUIDE.md](./CARD_DATA_GUIDE.md)  
Pre-launch checklist: [LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md)

---

## License

MIT

---

**Built with ❤️ for Indian credit card users**
