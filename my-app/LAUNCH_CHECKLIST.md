# JOURNEYCARD LAUNCH CHECKLIST

**Status**: 🟡 IN DEVELOPMENT

---

## ✅ PHASE 1: Foundation (COMPLETE)

### Card Data Layer (Prompt 1)
- [x] Zod schemas for credit cards with full domain coverage
- [x] `Sourced<T>` wrapper for all numerical claims
- [x] Three reference seed cards (HDFC Infinia, ICICI Apex, Axis Lifetime Free)
- [x] Build-time validation script (`npm run validate:cards`)
- [x] Card registry at `/data/cards/index.ts`
- [x] Developer documentation (CARD_DATA_GUIDE.md)

**Verification needed before launch:**
- [ ] All 30+ cards sourced from official MITC PDFs
- [ ] No placeholder dates (2025-01-01) remaining
- [ ] All unverified fields justified with reasons
- [ ] Validation script passes with 0 errors

---

## 🟡 PHASE 2: Engine & Ranking (IN PROGRESS)

### NAV Engine v2 (Prompt 2)
- [x] Modular architecture: earn.ts, redeem.ts, benefits.ts, costs.ts
- [x] LineItem invariant tests (sum = NAV exactly)
- [x] Comprehensive Zod types for UserProfile
- [x] Break-even calculation with binary search
- [x] Earnings calculation with caps and surcharges
- [x] Point/reward value computation with breakage
- [x] Lounge, milestone, soft benefit valuation
- [x] Fee calculations (year 1 vs steady-state)
- [x] Eligibility hard filters
- [x] Approval probability rubric (transparent weights)
- [x] Main ranking function with approval band demotion

**Tests needed:**
- [ ] 12+ test cases per module (golden fixtures)
- [ ] Edge cases: rent-heavy, travel-heavy, minimal-spend profiles
- [ ] Milestone hit/miss logic
- [ ] Cap application order (monthly → annual)
- [ ] Surcharge precedence

### Sensitivity & Scenarios (Prompt 3)
- [x] Break-even monthly spend calculation
- [x] Scenario analysis (worst / expected / best)
- [x] Tornado sensitivity chart (8 factors)

**Tests needed:**
- [ ] Sensitivity ranges validated against known thresholds
- [ ] Tornado chart factors sorted by impact
- [ ] Scenario output consistent across runs

### Quiz & Eligibility (Prompt 4)
- [x] Quiz schema with 7 steps
- [x] Hard eligibility rules
- [x] Approval probability transparent rubric
- [ ] UI: Quiz component (React) — 7-step progressive form
- [ ] UI: Results page with rank, NAV, approval band
- [ ] Quiz persistence (localStorage)
- [ ] Quiz resumption

**Tests needed:**
- [ ] Every eligibility rule tested with real/edge cases
- [ ] Approval rubric calibration against historical data
- [ ] UI keyboard accessibility (full path)
- [ ] Mobile responsiveness

### Portfolio Optimizer (Prompt 5)
- [x] Greedy spend allocation
- [x] Portfolio evaluation
- [x] Best N-card portfolio search

**Tests needed:**
- [ ] Allocation respects all caps
- [ ] Portfolio NAV ≥ best single card
- [ ] Marginal value never overstated

---

## 🔘 PHASE 3: Content & Tracking (QUEUED)

### Rule Change Tracker (Prompt 7)
- [ ] Content model with change history
- [ ] `/changes` listing page
- [ ] Automated MITC monitoring script (GitHub Actions)
- [ ] Weekly digest email template
- [ ] Change RSS feed

### Trust & Transparency (Prompt 8)
- [ ] `<ConfidenceChip>` component (verified/partial/unverified)
- [ ] `/methodology` long-form page with examples
- [ ] `<WhyThisCard>` template-based explanations
- [ ] `/data-health` internal admin page
- [ ] "Report an error" buttons on all card pages
- [ ] Point Value Index monthly page

### Compliance Pack (Prompt 9)
- [x] Banned claims linter + CI check
- [x] `<AffiliateDisclosure>` component
- [x] `<RegulatoryDisclaimer>` component
- [x] `<ApprovalDisclaimer>` component
- [x] DPDP-aligned consent architecture (types defined)
- [ ] Consent storage & withdrawal UI
- [ ] Email double opt-in + one-click unsubscribe
- [ ] Privacy notice page (full text)
- [ ] Runtime guard against storing PII

**Critical before launch:**
- [ ] Copy linter passes CI (0 banned phrases)
- [ ] Disclaimers visible on every money page
- [ ] Privacy policy live and comprehensive
- [ ] DPDP consent flows tested end-to-end

### Revenue Ops (Prompt 10)
- [ ] Click ledger logging (server-side)
- [ ] Conversion import workflow
- [ ] `/admin/revenue` dashboard
- [ ] EPC tracking and tie-break logic
- [ ] Approval band calibration loop

---

## ⭕ PHASE 4: SEO & Distribution (QUEUED)

### Programmatic Pages (Prompt 11)
- [ ] `/best-credit-card-for/[persona]` pages (engine-generated)
- [ ] `/compare/[cardA]-vs-[cardB]` pages
- [ ] Doorway page guards (no thin content)
- [ ] Interactive tools:
  - [ ] Lounge Access Checker
  - [ ] Fee Waiver Tracker
  - [ ] Forex Cost Calculator
  - [ ] Milestone Planner
  - [ ] Redemption Value Checker
- [ ] Shareable tool state (URL params)
- [ ] Embeddable iframe versions
- [ ] JSON-LD markup (Product, TechArticle, FAQPage, BreadcrumbList)
- [ ] Sitemap with per-section priorities
- [ ] `/llms.txt` and `/api/cards.json` (for citations)
- [ ] i18n scaffolding (next-intl, hi-IN first)

**SEO/Performance gates:**
- [ ] Lighthouse CI: INP < 200ms, LCP < 2.5s on 4G/mid-range Android
- [ ] 100+ pages in sitemap
- [ ] Mobile-first indexing ready
- [ ] hreflang tags for i18n

### B2B API (Prompt 12)
- [x] POST `/api/v1/recommend` — ranked recommendations
- [x] GET `/api/v1/cards` — catalogue
- [ ] Rate limiting per API key
- [ ] Request logging without PII
- [ ] White-label widget (React component)
- [ ] Multi-tenant support
- [ ] API docs (OpenAPI/Swagger)
- [ ] Contract tests

---

## 🟣 PHASE 5: Community & QA (QUEUED)

### Community Layer (Prompt 13)
- [ ] Approval report submission UI
- [ ] Behaviour report submission UI
- [ ] Aggregate display ("X of Y approved in your band")
- [ ] Anti-abuse: email verification, rate limits
- [ ] Admin moderation queue

### QA & Launch Gate (Prompt 14)
- [ ] 15 named personas with snapshotted NAV
- [ ] Invariant tests (4 core checks)
- [ ] Accessibility: axe-core CI, keyboard nav, prefers-reduced-motion
- [ ] Performance: Engine <50ms (40 cards), results page LCP <2.5s
- [ ] Error handling: Result types, no throws to user
- [ ] Data freshness: All cards verified within last 90 days
- [ ] Affiliate disclosure live
- [ ] Banned claims linter passes
- [ ] Click ledger firing
- [ ] Conversion reconciliation end-to-end (1 test conversion)
- [ ] Sitemap submitted to Google Search Console
- [ ] Data verification rota defined (who re-verifies what, every 60 days)

---

## 🚨 CRITICAL PRE-LAUNCH SIGN-OFFS

### Legal & Compliance
- [ ] Privacy policy reviewed and live
- [ ] Disclaimers visible to all users
- [ ] Banned claims linter enforced in CI
- [ ] No promises of approval, guarantee, or "best"
- [ ] DPDP consent flows tested
- [ ] Affiliate payout not shown in rankings (tie-break only)

### Data Accuracy
- [ ] **No card appears with confidence: "unverified"** in top 5 results
- [ ] All numeric claims traceable to official source
- [ ] Stale data (>120 days) re-verified before launch
- [ ] Zero divergence between engine output and displayed numbers
- [ ] Manual spot-check: 5 random cards verify fee/earning/exclusions against official MITC

### Technical
- [ ] Build passes: `npm run validate:cards && npm run build`
- [ ] Tests pass: `npm run test`
- [ ] Lighthouse CI green: LCP, INP, CLS targets met
- [ ] Error budget: <0.1% of requests result in 5xx
- [ ] Engine deterministic: same profile → same rank, always
- [ ] No N+1 queries in ranking path
- [ ] Session/cookie tests for auth flows (if needed)

### Launch Readiness
- [ ] Domain configured, DNS resolved
- [ ] SSL certificate valid
- [ ] Email sending tested (welcome, digest)
- [ ] Database backups enabled
- [ ] Monitoring/alerting configured
- [ ] Incident runbook written
- [ ] On-call rota assigned (if 24/7 support needed)
- [ ] Data verification calendar set (60-day intervals per card)

---

## 📋 DEPLOY GATES

### Before Staging
- [ ] All PHASE 1 & 2 items complete
- [ ] Compliance pack deployed
- [ ] API v1 endpoints functional

### Before Production
- [ ] All PHASE 1-3 items complete & tested
- [ ] PII guard active (blocks PAN, Aadhaar, DOB, etc.)
- [ ] Legal review sign-off
- [ ] First 30 cards sourced & verified
- [ ] Affiliate payout verified (1 conversion reconciled end-to-end)

### Post-Launch (First 7 Days)
- [ ] Error rate <0.05%
- [ ] User feedback monitored
- [ ] Approval band calibration data collecting
- [ ] No data privacy incidents reported
- [ ] All third-party APIs responding normally

---

## 📊 SUCCESS METRICS

- **Data Freshness**: 95%+ of cards re-verified within 60 days
- **Engine Accuracy**: ±5% variance on known user profiles vs. manual calculation
- **Approval Calibration**: Predicted band matches actual outcomes ≥70% in first 500 applications
- **Page Load**: LCP <2.5s, INP <200ms on 4G
- **Users**: 1,000+ active monthly users by month 3
- **Revenue**: Break-even on affiliate payout by month 6

---

## 🔗 Related Docs

- [CARD_DATA_GUIDE.md](../CARD_DATA_GUIDE.md) — Adding/updating cards
- [ENGINE_CHANGELOG.md](../ENGINE_CHANGELOG.md) — Version history & NAV changes
- [METHODOLOGY.md](../public/METHODOLOGY.md) — User-facing explanation
- [PRIVACY_POLICY.md](../public/PRIVACY_POLICY.md) — DPDP-aligned

---

**Last Updated**: 2026-09-18
**Owner**: Team JourneyCard
