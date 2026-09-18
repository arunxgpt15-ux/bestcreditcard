# ARCHITECTURE: End-to-End Card Recommendation System

## System Overview

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         USER-FACING LAYER                                    │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  Quiz Component (7 steps) → User Profile Collection                         │
│         ↓                                                                      │
│  Results Page → Ranked Cards (with NAV breakdown)                           │
│         ↓                                                                      │
│  Detail Pages → Full card disclosure + what-if scenarios                    │
│         ↓                                                                      │
│  Tools → Lounge checker, fee waiver tracker, milestone planner              │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌──────────────────────────────────────────────────────────────────────────────┐
│                         API LAYER (Prompt 12)                                │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  POST /api/v1/recommend      → Core ranking endpoint                         │
│  GET /api/v1/cards            → Catalogue                                    │
│  POST /api/v1/feedback         → User reports (Prompt 13)                    │
│  GET /api/v1/changes           → Rule change feed (Prompt 7)                 │
│                                                                               │
│  Rate limiting + logging (no PII)                                            │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌──────────────────────────────────────────────────────────────────────────────┐
│                    DETERMINISTIC ENGINE LAYER (Prompts 2-5)                  │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  evaluateCard(card, profile):                                                │
│    1. Compute earnings (earn.ts)        → LineItem[]                        │
│       - Apply earning rules per category                                    │
│       - Apply caps (monthly/annual)                                         │
│       - Apply surcharges (rent, wallet)                                     │
│                                                                               │
│    2. Value points (redeem.ts)          → LineItem                          │
│       - Conservative point valuation                                        │
│       - Apply breakage (10%)                                                │
│       - Apply redemption fees                                               │
│       - Apply time discount                                                 │
│                                                                               │
│    3. Add benefits (benefits.ts)        → LineItem[]                        │
│       - Lounge (visit count × per-visit value)                              │
│       - Milestone (probability × bonus)                                     │
│       - Soft benefits (utilization rate × nominal)                          │
│                                                                               │
│    4. Compute costs (costs.ts)          → LineItem[]                        │
│       - Annual fee + GST                                                    │
│       - Forex surcharge                                                     │
│       - Add-on card fees                                                    │
│                                                                               │
│    5. Verify invariant:                                                      │
│       sum(lineItems.cappedValue) == netAnnualValue ±1 paise                 │
│                                                                               │
│    6. Return CardEvaluation {                                                │
│       navInr,                                                                │
│       lineItems[],                                                           │
│       confidence,                                                            │
│       warnings[]                                                             │
│    }                                                                          │
│                                                                               │
│  rankCards(cards, profile):                                                  │
│    1. Evaluate every card                                                    │
│    2. Filter by hardEligibility() (eligibility.ts)                          │
│    3. Compute approvalLikelihood() (approval.ts) for eligible cards        │
│    4. Sort by NAV (descending)                                              │
│    5. Demote "low" approval below "moderate+"                              │
│    6. Return RankedCard[] with approvalBand attached                        │
│                                                                               │
│  scenarios(card, profile) → [worst, expected, best] scenarios               │
│  tornado(card, profile) → sensitivity chart                                 │
│  bestPortfolio(cards, profile) → multi-card combo                           │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌──────────────────────────────────────────────────────────────────────────────┐
│                      DATA LAYER (Prompt 1)                                   │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  /data/cards/                                                                 │
│    ├─ hdfc-infinia.ts        → CreditCard object (schema-validated)         │
│    ├─ icici-apex.ts                                                         │
│    ├─ axis-lifetime-free.ts                                                 │
│    └─ index.ts               → CARD_CATALOGUE export                        │
│                                                                               │
│  Each card carries:                                                          │
│    - Identity (id, issuer, name, network)                                   │
│    - Fees (joining, annual, waiver condition)                               │
│    - Earning rules (20+ combinations of category × channel × conditions)    │
│    - Caps (monthly, annual, per-category)                                   │
│    - Surcharges (rent, wallet, forex, etc.)                                 │
│    - Lounge (domestic, international, eligibility)                          │
│    - Milestones (spend threshold → bonus)                                   │
│    - Eligibility (min income, CIBIL, employment, etc.)                      │
│    - Affiliate payout (NTB, ETB, payout, last_update)                       │
│    - Metadata (source URL, confidence, last_verified_at)                    │
│                                                                               │
│  /src/lib/schema/card.ts    → Zod schemas (single source of truth)          │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌──────────────────────────────────────────────────────────────────────────────┐
│                   BUILD-TIME VALIDATION (Prompt 9)                           │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  npm run validate:cards → scripts/validate-cards.mjs                        │
│    - Check: No card with lastVerifiedAt > 120 days old                      │
│    - Warn: No card with lastVerifiedAt > 90 days old                        │
│    - Fail: Affiliate payout without metadata                                │
│    - Warn: >5 fields marked "unverified"                                    │
│    - Alert: Placeholder dates (2025-01-01)                                  │
│                                                                               │
│  npm run build = npm run validate:cards && next build                       │
│    - If validation fails, entire build fails                                │
│    - Ensures no stale data reaches production                               │
│                                                                               │
│  Compliance linter                                                           │
│    - Check for banned claims (guaranteed, best, risk-free, etc.)            │
│    - Suggest compliant alternatives                                         │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow: User to Recommendation

### Flow 1: User Takes Quiz

```
User starts quiz
    ↓
Quiz component (7 steps):
  1. "What's your goal?" → Filters cards by alignment
  2. "Tell us your spend" → Categories × monthly amount
  3. "Online or offline?" → Channel split
  4. "How often do you travel?" → Trip count, lounge visits
  5. "Your income & employment" → Eligibility checks
  6. "Your credit profile" → Approval likelihood
  7. "Soft benefits?" → Opt-in for golf, insurance, etc.
    ↓
quizResponseToProfile() → Converts to UserProfile
    ↓
POST /api/v1/recommend (with UserProfile)
    ↓
Server-side ranking:
  rankCards(CARD_CATALOGUE, profile) → RankedCard[]
    ↓
Results page renders:
  - Top 5 cards with NAV + approval band
  - Eligibility warnings for ineligible cards
  - "Why this card?" breakdown (top 3 factors)
  - Scenario slider (worst → expected → best)
    ↓
User clicks a card → Detail page with:
  - Full NAV breakdown (line items)
  - Tornado chart (what matters most)
  - Portfolio comparisons (with other cards)
  - Apply link → Affiliate partner
```

### Flow 2: Statement Upload (Bonus)

```
User uploads credit card statement (CSV or PDF)
    ↓
parseStatementCSV/PDF() → ParsedStatement
    ↓
categorizeTransaction() → Assigns spend to categories
    ↓
Reconstruct profile from statement:
  "You spent ₹50k on shopping, ₹20k dining..."
    ↓
Re-rank cards for this actual profile
    ↓
Show: "For your actual spend, here's the best card"
```

### Flow 3: Rule Change Detection

```
GitHub Actions cron job (weekly):
  1. Fetch all MITC PDFs from issuer websites
  2. Parse and diff against our cached versions
  3. If changes detected:
     - Create issue with diff
     - Assign to data team
     - Run engine on test profiles
     - Show NAV impact
    ↓
Data team verifies and updates card files
    ↓
Create RuleChange entry (Prompt 7)
    ↓
Users see "Recently updated" badge + changelog
    ↓
Newsletter: "5 cards changed terms this week"
```

---

## Key Invariants (Non-Negotiable)

### 1. Line Item Invariant

**INVARIANT**: For any card evaluation, `sum(lineItems[].cappedValueInr) == netAnnualValueSteadyStateInr` (within 1 paise)

Why matters: Proves the math is internally consistent. Every benefit and cost is accounted for.

Where enforced: `engine/index.ts` line ~250 (binary search + verification)

Test: `__tests__/index.test.ts` test cases check all 3 seed cards × 3 profiles = 9 cases minimum

### 2. Determinism Invariant

**INVARIANT**: `evaluateCard(card, profile) ===  evaluateCard(card, profile)` always (not probabilistic)

Why matters: Users can verify manually. Auditable. No hidden "personalization".

Where enforced: No Date.now(), no randomness, no network calls in evaluation path

Test: `describe("determinism")` in tests

### 3. Sourcing Invariant

**INVARIANT**: Every numeric claim in top 3 recommendations must have a source URL

Why matters: Users can verify. Regulators can audit.

Where enforced: Zod schema requires `source: string` on all Sourced<T> values

Test: Build fails if card has unverified fields in critical sections

### 4. Eligibility Invariant

**INVARIANT**: If `hardEligibility(card, profile).eligible == false`, that card never appears in ranked results (even if NAV > 0)

Why matters: Users can't apply for ineligible cards. Avoids rejections.

Where enforced: `rankCards()` filters before sorting

Test: Test case with low-income user checks HDFC Infinia (min ₹2L income) is excluded

---

## File Organization

```
my-app/
│
├── CODE FILES (What we built)
│   ├── data/cards/
│   │   ├── hdfc-infinia.ts ........................... Card data
│   │   ├── icici-apex.ts
│   │   ├── axis-lifetime-free.ts
│   │   └── index.ts
│   │
│   ├── src/lib/schema/
│   │   └── card.ts .................................. Zod schemas
│   │
│   ├── src/lib/engine/
│   │   ├── types.ts ................................. UserProfile, LineItem, etc.
│   │   ├── earn.ts ................................... Earnings calc
│   │   ├── redeem.ts ................................. Point value
│   │   ├── benefits.ts ............................... Lounge, milestones, soft
│   │   ├── costs.ts ................................... Fees, forex, taxes
│   │   ├── eligibility.ts ............................ Hard filters
│   │   ├── approval.ts ............................... Approval rubric
│   │   ├── sensitivity.ts ............................ Scenarios, tornado
│   │   ├── portfolio.ts ............................... Multi-card
│   │   ├── index.ts ................................... Main orchestrator
│   │   └── __tests__/
│   │       └── index.test.ts ......................... Golden tests
│   │
│   ├── src/lib/
│   │   ├── quiz-types.ts ............................. Quiz schema
│   │   ├── compliance-linter.ts ...................... Banned claims
│   │   ├── statement-analyzer.ts ..................... PDF/CSV parsing
│   │   └── rule-change-tracker.ts ................... Rule changes
│   │
│   ├── src/components/
│   │   └── compliance.tsx ............................ Disclosure components
│   │
│   ├── app/api/v1/
│   │   ├── recommend/route.ts ........................ POST /api/v1/recommend
│   │   ├── cards/route.ts ............................ GET /api/v1/cards
│   │   ├── feedback/route.ts ......................... (Stub)
│   │   └── changes/route.ts .......................... (Stub)
│   │
│   └── scripts/
│       └── validate-cards.mjs ....................... Build-time validation
│
├── DOCUMENTATION
│   ├── README_FULL.md ................................ Full documentation
│   ├── CARD_DATA_GUIDE.md ............................ How to add cards
│   ├── CLAUDE.md ..................................... AI instructions
│   ├── LAUNCH_CHECKLIST.md ........................... Pre-launch gates
│   ├── ARCHITECTURE.md (this file)
│   ├── ENGINE_CHANGELOG.md ........................... Version history
│   ├── public/METHODOLOGY.md ......................... User-facing
│   └── public/PRIVACY_POLICY.md ..................... DPDP-aligned
│
└── CONFIGURATION
    ├── next.config.ts
    ├── tsconfig.json
    ├── package.json
    └── eslint.config.mjs
```

---

## Testing Strategy

### Unit Tests (engine modules)

Each module tested independently:
- `earn.ts`: Cap application, surcharge precedence
- `redeem.ts`: Breakage, time discount
- `benefits.ts`: Lounge probability, milestone logic
- `costs.ts`: Fee waiver conditions, GST
- `eligibility.ts`: Each rule tested with edge cases
- `approval.ts`: Rubric weights calibrated

### Golden Tests (e2e)

3 fixtures × 3 cards = 9 test cases:
- Line item invariant (sum = NAV)
- Ranking order (correctly identifies best card for profile)
- Eligibility filters (blocks ineligible cards)
- Approval bands (map to income/CIBIL rubric)

### Integration Tests (API endpoints)

- POST `/api/v1/recommend` with various profiles
- GET `/api/v1/cards` returns all 30+ cards
- Error handling (invalid profile → 400, not 500)

### Compliance Tests (CI)

- Banned claims linter passes
- No > 120-day-old card data
- All sources are URLs
- No PII in logs

### Performance Tests

- Engine <50ms for 40 cards
- Results page LCP <2.5s
- API response <200ms (p95)

---

## Deployment Pipeline

```
Developer push → GitHub
    ↓
Run CI checks:
  1. npm run lint
  2. npm run validate:cards       ← Build fails here if data stale
  3. npm run test                 ← Golden tests
  4. npm run build                ← Next.js build
  5. npm run performance-audit    ← Lighthouse CI
    ↓
If all pass → Deploy to staging
    ↓
Staging validation:
  - Manual smoke test (quiz → results)
  - API tests (POST /recommend with 5 profiles)
  - Data freshness check
    ↓
Approve → Deploy to production
    ↓
Post-deploy:
  - Error monitoring (Sentry)
  - Analytics (approval band calibration)
  - User feedback collection
```

---

## Scaling Considerations

### Adding More Cards (Prompt 1)

- Current: 3 seed cards
- Target: 30+ major cards
- Each card is 1 `.ts` file → Linear addition
- Build validation scales (still <1s)

### Handling More Users (Prompts 2-5)

- Engine is stateless → runs on client or server
- No database queries in ranking path
- Can run in Vercel Edge (geographically distributed)
- Estimate: 1 million profiles/day on single server

### Expanding to More Currencies (Future)

- Current: INR only (paise internally)
- To add USD/EUR: Add currency field to UserProfile + FX rates
- Most modules are currency-agnostic (just math)

### Integration with Banks (Prompt 12 B2B)

- Provide embed URL: `https://journeycard.ai/embed?issuer=hdfc&color=blue`
- White-label widget for bank websites
- API key + rate limiting for B2B partners

---

## Monitoring & Observability

### What We Track (No PII)

- API latency (p50, p95)
- Error rates by endpoint
- User approval band distribution (aggregate only)
- Top 10 user profiles by frequency (hashed)
- Click-through rates (card → affiliate)
- Conversion reconciliation (approved, rejected, declined)

### What We DON'T Track

- ❌ User names, emails, phone numbers (need explicit consent)
- ❌ Income details (aggregated only)
- ❌ CIBIL scores (never stored)
- ❌ PAN, Aadhaar, anything identifiable

### Alerts

- Build validation fails → Immediate notification
- Data >90 days old → Daily alert
- Engine throws exception → Sentry alert
- API latency >500ms → Alert
- Error rate >0.1% → Alert

---

## Security & Compliance

### Authentication

- None needed for public results
- Optional: Google OAuth for saved profiles (localStorage default)

### Data Storage

- No database of user profiles
- Card data read-only from `/data/`
- Affiliate conversion logs scrubbed after 30 days

### DPDP (Data Protection) Compliance

- Explicit opt-in for emails
- One-click unsubscribe + withdrawal of consent
- No tracking cookies (analytics only)
- Privacy policy live and comprehensive

### RBI Compliance

- Banned claims linter in CI
- No pre-approvals
- No promises of guaranteed approval
- Regulatory disclaimer on every money page

---

**Last updated: 2025-01-18**
**Owner: Team JourneyCard**
