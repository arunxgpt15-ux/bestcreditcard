# Methodology

## How JourneyCard Works

JourneyCard is a **credit card recommendation engine** that uses pure math, not AI, to tell you which card is best for your spending patterns.

### The Three Principles

1. **Deterministic**: Same inputs always produce the same rankings
2. **Transparent**: Every number is traceable to a source
3. **Conservative**: When unsure, we underestimate benefits

### Step-by-Step: How We Evaluate a Card

#### 1. Capture Your Spending

You tell us your monthly spend in each category:
- Online shopping: ₹50,000
- Dining: ₹15,000
- Fuel: ₹20,000
- ... (19 categories total)

We also ask:
- How many trips/year (for lounge value)
- Your monthly income (to check eligibility)
- Your CIBIL score
- Existing credit cards

#### 2. Look Up Card Rules

We maintain detailed card data from official Terms & Conditions (MITC PDFs):

```
Card: HDFC Bank Infinia

Earning Rules:
- 5 points per ₹150 on most categories
- 3 points per ₹150 on fuel
- 1x earning on utilities (blocked on rent)

Fees:
- ₹12,500 annual fee
- No joining fee
- No fee waiver condition

Lounge:
- Unlimited domestic + international access

Surcharges:
- 2% fee on rent purchases
- No rewards on wallet loads
```

**Every number carries metadata:**
- Source: Official MITC PDF link
- Verified date: When we last confirmed it
- Confidence: Verified / Partial / Unverified

#### 3. Calculate Earnings (With Realism)

For your dining spend (₹15,000/month = ₹1.8L/year):

```
Gross earning:  1.8L × (1% earning rate) = ₹1,800
After surcharge:  1,800 (no surcharge on dining)
After caps:       1,800 (no monthly cap on dining)
Confidence:       Verified
```

**For all categories combined:**
Total annual earning: ₹X (in points or rupees)

**Important: We apply all surcharges, caps, and exclusions.**

If HDFC blocks rewards on rent, we don't count it.
If there's a ₹5,000/month cashback cap on dining, we apply it.

#### 4. Compute Point Value

If card earns points (not direct cashback):

```
Points earned:    1,800 points
Point value:      ₹0.50/point (conservative estimate)
Gross point value: ₹900

Breakage (-10%):  -₹90  (points you never redeem)
Redemption fee:   -₹20  (if any)
Time discount:    -₹50  (rewards are delayed)
_____________________
Net point value:  ₹740
```

**Why conservative?**
- Users breakage: Not everyone redeems every point
- Redemption takes effort and time
- Travel redemptions are often restricted

#### 5. Add Benefits

**Lounge:**
- You travel 2 domestic + 1 international trip/year
- 2 lounge visits per trip = 6 lounge visits total
- Each visit worth ₹1,200 (typical lounge meal)
- **Lounge value: ₹7,200/year**

(We never credit unused visits. If card has unlimited lounge but you only visit 6 times, we only count 6.)

**Milestones:**
- If you hit ₹5L annual spend: +₹1,000 bonus
- At your spending level, probability = 90%
- Expected value: ₹900

**Soft benefits (golf, insurance):**
- Default: 0% utilization (users usually don't use)
- User can opt in to use them

**Total benefits: ~₹8,100**

#### 6. Subtract Costs

**Fees:**
- Annual fee: ₹12,500
- GST (18%): +₹2,250
- **Total: ₹14,750/year**

**Forex markup** (if you travel internationally):
- ₹2,40,000 forex spend × 2% = ₹4,800
- GST: +₹864
- **Total: ₹5,664/year**

**Total costs: ~₹20,414**

#### 7. Compute Net Annual Value (NAV)

```
Benefits:  ₹60,000 (earnings + lounge + milestones + soft benefits)
Costs:     -₹20,414 (fees + forex + taxes)
_____________________________
NAV:       ₹39,586 per year
```

**This is the bottom line: How much better off you are with this card vs. baseline.**

#### 8. Compare to Other Cards

Repeat steps 2-7 for every card in the database.

Rank by NAV (highest first).

#### 9. Filter by Eligibility

Some cards require:
- Minimum ₹2L/month salary → HDFC Infinia
- Minimum CIBIL ≥750 → American Express
- NTB (new-to-bank) only → Axis Select

We remove cards you can't qualify for.

#### 10. Estimate Approval Likelihood

For eligible cards, we show approval likelihood (low / moderate / good / strong) based on:
- Your income vs. card minimum (25% weight)
- Your CIBIL score (20% weight)
- Credit history (vintage, # cards) (20% weight)
- Recent enquiries (15% weight)
- Employment type (10% weight)

**Important: This is an estimate.** Only the bank decides approval.

---

## Guarantees We Make

✅ **Accuracy**: ±5% variance on known profiles  
✅ **Transparency**: Every number traceable to official source  
✅ **Consistency**: Same input → same rank, always  
✅ **Freshness**: All card data re-verified every 60 days  

---

## Guarantees We DON'T Make

❌ Approval guarantee  
❌ "Best card in India"  
❌ "Highest rewards"  
❌ Instant approval  
❌ Risk-free  

---

## Examples

### Example 1: Travel-Heavy User

**Profile:**
- Spend: ₹50k online + ₹20k dining + ₹25k fuel + ₹50k travel
- Trips: 4 domestic + 4 international/year
- CIBIL: 800+
- Income: ₹6L/month

**Results:**
1. **HDFC Infinia**: NAV ₹1,20,000 (Approval: Strong)
   - Lounge access wins (+₹57,600)
   - Forex discount helps (+₹4,800 saved)
   - Annual fee hurt (-₹14,750)

2. **ICICI Apex**: NAV ₹85,000 (Approval: Strong)
   - Dining cashback wins
   - Lounge limited (4 domestic, 2 international)
   - Lower fee (-₹990)

3. **Axis Lifetime Free**: NAV ₹22,000 (Approval: Strong)
   - No lounge
   - No forex discount
   - But no fee = good baseline

**Recommendation: HDFC Infinia** (1.4x better than Axis, for this user)

### Example 2: Rent-Heavy Spender

**Profile:**
- Spend: ₹50k online + ₹20k dining + ₹30k rent
- CIBIL: 700-749
- Income: ₹3L/month

**Results:**
1. **ICICI Apex**: NAV ₹18,000 (Approval: Good)
   - Dining 4% cashback works
   - Rent blocked (no reward) = bad
   - But fee waiver kicks in at ₹3.6L spend

2. **Axis Lifetime Free**: NAV ₹15,000 (Approval: Good)
   - Simpler
   - No surprises

3. **HDFC Infinia**: NAV **-₹8,000** (Approval: Moderate)
   - Annual fee hurts
   - Rent surcharge compounds
   - Lounge unused
   - **Do not apply**

**Recommendation: ICICI Apex** (fee waiver makes it work)

---

## What We Assume

### Conservative Defaults

We assume **users are average** and apply conservative assumptions:

- **Breakage**: 10% of earned points never redeemed
- **Lounge value**: ₹1,200 per visit (not ₹2,000)
- **Milestone bonus**: Only counted if 85%+ prob of hitting
- **Soft benefits**: 0% utilization unless you select

### Spend Categories

We use 20 spend categories based on RBI data:
- online_shopping
- offline_retail
- groceries
- dining
- food_delivery
- fuel
- utilities
- rent
- education
- insurance
- travel_flights
- travel_hotels
- ott_subscriptions
- wallet_load
- govt_payments
- telecom
- healthcare
- ecommerce_partner
- international
- other

**Note**: Each category may have different earning rules per card.

### Caps & Exclusions

We strictly follow card rules:
- Monthly caps: Strictly enforced (no carryover)
- Annual caps: Strictly enforced
- Exclusions: Rent, utilities, govt payments often earn 0x
- Surcharges: 2% fees on rent, wallet loads, etc., are deducted

---

## Data Freshness

Every card's data is **verified against official MITC** every 60 days:

```
Card: HDFC Infinia
Last verified: 2025-01-15
Next review:   2025-03-15
Status:        ✅ Current
```

If data is older than 120 days, the build fails. No stale data reaches users.

---

## Transparency: How We Make Money

We earn a **commission when you apply** through our links (~₹500–₹2,000 per approval).

**How does this affect you?**
- ❌ It **doesn't** change card details we show
- ❌ It **doesn't** change rankings (same NAV ranking regardless)
- ✅ It **only** matters as a tie-breaker when 2 cards have identical NAV
- ✅ We disclose this prominently

We believe affiliate model is fairer than:
- Subscription (users can't afford to pay for card advice)
- Ads (distract from recommendations)
- Bank payments (would show bias to highest payout)

**Our incentive:** Recommend cards users actually apply for and approve.
**Your incentive:** Get unbiased recommendations that maximize your value.

Aligned incentives = trustworthy.

---

## Questions?

- **Is this a pre-approval?** No. Only banks decide approval.
- **Do you sell my data?** No. See [Privacy Policy](./PRIVACY_POLICY.md).
- **How often do you update?** Card data: every 60 days. Engine: as we learn.
- **Can I trust this?** Every calculation is auditable. Try the same input twice—you'll get the same rank.

---

**Last updated: 2025-01-18**
