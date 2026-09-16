import type { CreditCard } from "./types";

/**
 * ⚠️ DATA POLICY
 * - Har numeric claim ke neeche ek source link hai (sources[]).
 * - Jo cheez verify nahi hui, wo `null` hai — guess karke number NAHI bhara.
 * - dataConfidence:
 *    "verified"   -> fee + kam se kam ek core benefit official issuer page se
 *    "partial"    -> fee official, benefit details third-party / incomplete
 *    "unverified" -> sirf community reports; UI mein warning dikhega
 * - Card terms badalte rehte hain. Production mein ye data CMS/DB se aana chahiye
 *   aur har entry pe `lastCheckedAt` timestamp hona chahiye.
 */

export const CARD_DB: CreditCard[] = [
  {
    id: "hdfc-infinia",
    name: "HDFC Bank Infinia (Metal Edition)",
    issuer: "HDFC Bank",
    tier: "super-premium",
    tagline: "Unlimited global lounge access, top-of-the-line rewards stack.",
    joiningFee: null,
    annualFee: 12500,
    feeWaiverSpend: null,
    forexMarkupPct: null,
    rewards: [
      {
        category: "base",
        valueBackPct: null,
        note: "5 reward points per ₹150 spent (point value depends on redemption route).",
      },
    ],
    lounge: {
      domesticPerYear: "unlimited",
      internationalPerYear: "unlimited",
      note: "Unlimited complimentary lounge access for primary and add-on cardholders, per HDFC's lounge program document.",
    },
    highlights: [
      "Unlimited complimentary global airport lounge access for primary and add-on cardholders.",
      "5 reward points per ₹150 spent, plus Club Marriott membership (third-party summary).",
      "Metal card with 24×7 global concierge.",
    ],
    watchOuts: [
      "Renewal fee is ₹12,500 + taxes — sabse bada annual commitment iss list mein.",
      "HDFC states membership availability is limited; check eligibility before applying.",
      "Reward point ka rupee value redemption option pe depend karta hai — humne assume nahi kiya.",
    ],
    tags: ["premium", "lounge", "travel", "rewards", "international"],
    dataConfidence: "partial",
    sources: [
      { label: "HDFC Infinia product page", url: "https://www.hdfc.bank.in/credit-cards/infinia-credit-card" },
      { label: "HDFC Infinia fees & charges", url: "https://www.hdfc.bank.in/credit-cards/infinia-credit-card/fees-and-charges" },
      { label: "1 Finance — Infinia benefits", url: "https://1finance.co.in/blog/hdfc-infinia-credit-card-benefits/" },
    ],
    gradient: "from-zinc-300/30 via-slate-800 to-slate-950",
    accent: "text-zinc-200",
  },

  {
    id: "axis-atlas",
    name: "Axis Bank Atlas",
    issuer: "Axis Bank",
    tier: "premium",
    tagline: "EDGE Miles earner built around flight and hotel transfers.",
    joiningFee: 5000,
    annualFee: 5000,
    feeWaiverSpend: null,
    forexMarkupPct: null,
    rewards: [
      {
        category: "base",
        valueBackPct: null,
        note: "Earns EDGE Miles with tier-based rates; mile value depends on transfer partner.",
      },
    ],
    lounge: {
      domesticPerYear: null,
      internationalPerYear: null,
      note: "Complimentary airport lounge access offered, but visit counts vary by tier — confirm on the Axis page.",
    },
    highlights: [
      "EDGE Miles credited on successful payment of the ₹5,000 + GST annual fee, per Axis T&C.",
      "Tier-based rewards plus milestone benefits on travel spends.",
      "Airline and hotel transfer partners for mile redemption.",
    ],
    watchOuts: [
      "Lounge visit counts tier-based hain — exact number Axis page pe verify karo.",
      "Miles ka value transfer partner pe depend karta hai, isliye engine ne rupee value estimate nahi kiya.",
    ],
    tags: ["travel", "rewards", "international", "milestone", "lounge"],
    dataConfidence: "partial",
    sources: [
      { label: "Axis Atlas product page", url: "https://www.axis.bank.in/cards/credit-card/axis-bank-atlas-credit-card" },
      { label: "Axis Atlas feature T&C (PDF)", url: "https://www.axis.bank.in/docs/default-source/default-document-library/credit-cards/terms-and-conditions-of-features-of-axis-bank-atlas-credit-card.pdf" },
    ],
    gradient: "from-amber-300/40 via-slate-800 to-slate-950",
    accent: "text-amber-200",
  },

  {
    id: "hdfc-regalia-gold",
    name: "HDFC Bank Regalia Gold",
    issuer: "HDFC Bank",
    tier: "mid",
    tagline: "Mid-tier travel card with a reachable fee waiver.",
    joiningFee: 2500,
    annualFee: 2500,
    feeWaiverSpend: 400000,
    forexMarkupPct: null,
    rewards: [
      { category: "base", valueBackPct: null, note: "Reward points programme — value depends on redemption route." },
    ],
    lounge: {
      domesticPerYear: 12,
      internationalPerYear: null,
      note: "Third-party review reports 3 domestic lounge visits per quarter, subject to a ₹60,000 spend condition. Verify on HDFC's lounge document.",
    },
    highlights: [
      "Joining and renewal fee ₹2,500 + taxes.",
      "Renewal fee waived on annual spends of ₹4,00,000 (per fee summary).",
      "Domestic airport lounge programme — card validated by swiping at lounge entry.",
    ],
    watchOuts: [
      "Lounge visits spend-condition ke saath aate hain — free-for-all nahi hai.",
      "₹4L ka waiver threshold har kisi ke liye realistic nahi hota.",
    ],
    tags: ["travel", "lounge", "domestic", "rewards"],
    dataConfidence: "partial",
    sources: [
      { label: "HDFC Regalia Gold product page", url: "https://www.hdfc.bank.in/credit-cards/regalia-gold-credit-card" },
      { label: "HDFC Regalia Gold lounge list (PDF)", url: "https://www.hdfc.bank.in/content/dam/hdfcbankpws/in/en/personal-banking/discover-products/cards/credit-cards/regalia-gold-credit-card/regalia-gold-lounges.pdf" },
      { label: "1 Finance — Regalia Gold review", url: "https://1finance.co.in/blog/hdfc-regalia-gold-credit-card-review/" },
    ],
    gradient: "from-teal-500/50 via-slate-900 to-slate-950",
    accent: "text-teal-200",
  },

  {
    id: "amex-platinum-travel",
    name: "American Express Platinum Travel",
    issuer: "American Express",
    tier: "premium",
    tagline: "Milestone-driven travel card from Amex.",
    joiningFee: 5000,
    annualFee: 5000,
    feeWaiverSpend: null,
    forexMarkupPct: 3.5,
    rewards: [
      { category: "base", valueBackPct: null, note: "Membership Rewards points; milestone-heavy structure." },
    ],
    lounge: { domesticPerYear: null, internationalPerYear: null, note: "Lounge details not confirmed in the sources checked." },
    highlights: [
      "First year fee ₹5,000 + taxes; second year onwards ₹5,000 + taxes.",
      "Amex's fee schedule lists a 3.5% foreign transaction markup.",
    ],
    watchOuts: [
      "3.5% forex markup — international spends ke liye ye card mehenga padta hai.",
      "Amex acceptance India mein sab jagah nahi hai; backup card rakhna padta hai.",
    ],
    tags: ["travel", "rewards", "milestone", "domestic"],
    dataConfidence: "partial",
    sources: [
      { label: "Amex Platinum Travel product page", url: "https://www.americanexpress.com/in/credit-cards/platinum-travel-credit-card/" },
      { label: "Amex India fees & charges", url: "https://www.americanexpress.com/in/credit-know-how/credit-card-fees/" },
    ],
    gradient: "from-sky-300/30 via-slate-800 to-slate-950",
    accent: "text-sky-200",
  },

  {
    id: "amex-mrcc",
    name: "American Express Membership Rewards Credit Card",
    issuer: "American Express",
    tier: "mid",
    tagline: "Low first-year cost with a spend-based fee waiver.",
    joiningFee: 1000,
    annualFee: 4500,
    feeWaiverSpend: 150000,
    forexMarkupPct: null,
    rewards: [
      { category: "base", valueBackPct: null, note: "Membership Rewards points; value varies by redemption." },
    ],
    lounge: { domesticPerYear: null, internationalPerYear: null, note: "Lounge benefit not confirmed in the sources checked." },
    highlights: [
      "First year fee ₹1,000; ₹4,500 from the second year (Amex fee schedule).",
      "100% renewal fee waiver on spends of ₹1,50,000+; 50% waiver between ₹90,000 and ₹1,49,999.",
    ],
    watchOuts: [
      "Renewal fee ₹4,500 hai — waiver miss hua to card mehenga ho jata hai.",
      "Merchant acceptance Visa/Mastercard jitni wide nahi.",
    ],
    tags: ["rewards", "starter", "shopping", "milestone"],
    dataConfidence: "verified",
    sources: [
      { label: "Amex MRCC product page", url: "https://www.americanexpress.com/in/credit-cards/membership-rewards-card/" },
      { label: "Amex MRCC benefits (fee waiver)", url: "https://www.americanexpress.com/in/benefits/membership-rewards-card/" },
    ],
    gradient: "from-indigo-400/30 via-slate-800 to-slate-950",
    accent: "text-indigo-200",
  },

  {
    id: "idfc-first-wealth",
    name: "IDFC FIRST Wealth",
    issuer: "IDFC FIRST Bank",
    tier: "mid",
    tagline: "No annual fee, zero forex markup, both-side lounge access.",
    joiningFee: 0,
    annualFee: 0,
    feeWaiverSpend: null,
    forexMarkupPct: 0,
    rewards: [
      { category: "base", valueBackPct: null, note: "Reward points programme — value varies by redemption." },
    ],
    lounge: {
      domesticPerYear: 4,
      internationalPerYear: 4,
      note: "IDFC lists 8 complimentary lounge visits annually (4 domestic + 4 international).",
    },
    highlights: [
      "No joining fee and no annual fee, per IDFC FIRST's product page.",
      "Zero forex markup positioning on international transactions.",
      "8 complimentary lounge visits a year (4 domestic + 4 international).",
    ],
    watchOuts: [
      "Zero-fee cards ke eligibility criteria strict hote hain — issuer se confirm karo.",
      "Reward point ka redemption value verify karna zaroori hai.",
    ],
    tags: ["lifetime-free", "forex", "lounge", "travel", "international"],
    dataConfidence: "verified",
    sources: [
      { label: "IDFC FIRST Wealth product page", url: "https://www.idfcfirst.bank.in/credit-card/wealth" },
      { label: "IDFC FIRST forex markup page", url: "https://www.idfcfirst.bank.in/credit-card/benefits/forex-mark-up" },
    ],
    gradient: "from-rose-400/30 via-slate-800 to-slate-950",
    accent: "text-rose-200",
  },

  {
    id: "idfc-first-select",
    name: "IDFC FIRST Select",
    issuer: "IDFC FIRST Bank",
    tier: "entry",
    tagline: "Lifetime free with zero forex markup.",
    joiningFee: 0,
    annualFee: 0,
    feeWaiverSpend: null,
    forexMarkupPct: 0,
    rewards: [
      { category: "base", valueBackPct: null, note: "Reward points programme — redemption value not verified." },
    ],
    lounge: { domesticPerYear: null, internationalPerYear: null, note: "Lounge details not confirmed in the sources checked." },
    highlights: [
      "Positioned as lifetime free by IDFC FIRST.",
      "Zero forex markup on international transactions.",
    ],
    watchOuts: ["Lounge details product page pe confirm karo — humne verify nahi kiya."],
    tags: ["lifetime-free", "forex", "starter", "international"],
    dataConfidence: "partial",
    sources: [{ label: "IDFC FIRST Select product page", url: "https://www.idfcfirst.bank.in/credit-card/select" }],
    gradient: "from-fuchsia-400/25 via-slate-800 to-slate-950",
    accent: "text-fuchsia-200",
  },

  {
    id: "scapia-federal",
    name: "Scapia Federal",
    issuer: "Federal Bank (Scapia)",
    tier: "entry",
    tagline: "Zero fee, zero forex, unlimited domestic lounge access.",
    joiningFee: 0,
    annualFee: 0,
    feeWaiverSpend: null,
    forexMarkupPct: 0,
    rewards: [
      {
        category: "base",
        valueBackPct: null,
        note: "Scapia markets 10% rewards (10–20% Scapia coins). Coins redeem inside Scapia's travel booking flow, so rupee value isn't 1:1.",
      },
    ],
    lounge: {
      domesticPerYear: "unlimited",
      internationalPerYear: 0,
      note: "Unlimited domestic lounge access; a third-party review notes international lounge access is not included.",
    },
    highlights: [
      "₹0 joining and ₹0 annual fee.",
      "Zero forex markup.",
      "Unlimited domestic airport lounge access.",
      "10% rewards on spends (10–20% Scapia coins) per Scapia's own marketing.",
    ],
    watchOuts: [
      "Coins Scapia app ke travel bookings mein hi kaam aate hain — flexibility limited hai.",
      "International lounge access included nahi hai (third-party review).",
      "Lounge access ke liye usually milestone/spend condition hoti hai — app pe check karo.",
    ],
    tags: ["lifetime-free", "forex", "lounge", "travel", "domestic", "starter"],
    dataConfidence: "partial",
    sources: [
      { label: "Scapia official site", url: "https://www.scapia.cards/" },
      { label: "1 Finance — Scapia review", url: "https://1finance.co.in/blog/scapia-federal-credit-card-review-travel/" },
    ],
    gradient: "from-emerald-400/35 via-slate-800 to-slate-950",
    accent: "text-emerald-200",
  },

  {
    id: "sbi-cashback",
    name: "Cashback SBI Card",
    issuer: "SBI Card",
    tier: "entry",
    tagline: "Flat 5% cashback on online spends, no merchant restriction.",
    joiningFee: 999,
    annualFee: 999,
    feeWaiverSpend: 200000,
    forexMarkupPct: 3.5,
    rewards: [
      {
        category: "online",
        valueBackPct: 5,
        note: "5% cashback on online spends without merchant restriction (monthly cap applies — confirm with issuer).",
        monthlyCapValue: null,
      },
      { category: "base", valueBackPct: 1, note: "1% cashback on offline spends." },
    ],
    lounge: { domesticPerYear: null, internationalPerYear: null, note: "Lounge benefit not confirmed in the sources checked." },
    highlights: [
      "5% cashback on online spends with no merchant restriction; 1% on offline spends.",
      "Annual fee ₹999 + taxes; third-party review reports waiver after ₹2,00,000 annual spends.",
      "1% fuel surcharge waiver.",
    ],
    watchOuts: [
      "3.5% forex fee — international trips ke liye ye card mat use karna.",
      "Cashback pe monthly cap hota hai; issuer T&C confirm karo.",
    ],
    tags: ["cashback", "shopping", "starter", "domestic"],
    dataConfidence: "verified",
    sources: [
      { label: "SBI Card — Cashback SBI Card", url: "https://www.sbicard.com/en/personal/credit-cards/cashback-sbi-card.html" },
      { label: "RewardMatrix review (forex, waiver)", url: "https://www.rewardmatrix.in/credit-cards/reviews/cashback-sbi" },
      { label: "Paisabazaar summary", url: "https://www.paisabazaar.com/sbi-bank/cashback-sbi-card/" },
    ],
    gradient: "from-blue-400/30 via-slate-800 to-slate-950",
    accent: "text-blue-200",
  },

  {
    id: "axis-ace",
    name: "Axis Bank ACE",
    issuer: "Axis Bank",
    tier: "entry",
    tagline: "Bill payments aur utilities pe strong cashback.",
    joiningFee: 499,
    annualFee: 499,
    feeWaiverSpend: 200000,
    forexMarkupPct: null,
    rewards: [
      {
        category: "bills",
        valueBackPct: 5,
        note: "5% cashback on bill payments — T&C list postpaid, prepaid, DTH, electricity, water, gas, LPG and broadband.",
      },
      { category: "base", valueBackPct: 1.5, note: "Unlimited 1.5% cashback tier per Axis cashback definition document." },
    ],
    lounge: { domesticPerYear: null, internationalPerYear: null, note: "Axis lists lounge access on the product page; visit count not confirmed." },
    highlights: [
      "5% cashback on bill payments across the listed utility categories.",
      "2% and unlimited 1.5% cashback tiers per Axis's cashback definition document.",
      "Annual fee ₹499 from the second year, waived on annual spends above ₹2,00,000.",
    ],
    watchOuts: [
      "Rent transactions waiver calculation se exclude ho sakte hain — T&C padho.",
      "Cash payment fee aur utility transaction fee alag se lagti hai.",
    ],
    tags: ["cashback", "starter", "domestic", "lounge"],
    dataConfidence: "verified",
    sources: [
      { label: "Axis ACE product page", url: "https://www.axis.bank.in/cards/credit-card/axis-bank-ace-credit-card" },
      { label: "Axis ACE cashback T&C (PDF)", url: "https://www.axis.bank.in/docs/default-source/default-document-library/credit-card/axis-bank-ace-credit-card-tncs.pdf" },
    ],
    gradient: "from-cyan-400/30 via-slate-800 to-slate-950",
    accent: "text-cyan-200",
  },

  {
    id: "tata-neu-infinity",
    name: "Tata Neu Infinity HDFC Bank",
    issuer: "HDFC Bank × Tata Neu",
    tier: "mid",
    tagline: "Tata ecosystem ke liye NeuCoins machine.",
    joiningFee: 1499,
    annualFee: 1499,
    feeWaiverSpend: 300000,
    forexMarkupPct: null,
    rewards: [
      { category: "base", valueBackPct: null, note: "NeuCoins; Tata Neu markets up to 10% savings on its own platforms." },
    ],
    lounge: { domesticPerYear: null, internationalPerYear: null, note: "Lounge details not confirmed in the sources checked." },
    highlights: [
      "Joining and renewal fee ₹1,499 + GST; renewal waived on ₹3,00,000 annual spends.",
      "1,499 NeuCoins credited as first-year fee reversal on first transaction within 30 days of issuance.",
      "Up to 10% savings positioning across the Tata Neu ecosystem.",
    ],
    watchOuts: [
      "Value tabhi milti hai jab tum Tata brands (BigBasket, Croma, AirAsia/Air India, 1mg) use karte ho.",
      "NeuCoins ka redemption Tata Neu app ke andar hi hota hai.",
    ],
    tags: ["shopping", "rewards", "domestic", "milestone"],
    dataConfidence: "verified",
    sources: [
      { label: "HDFC Tata Neu Infinity page", url: "https://www.hdfc.bank.in/credit-cards/tata-neu-infinity-hdfc-bank-credit-card" },
      { label: "HDFC fees & charges", url: "https://www.hdfc.bank.in/credit-cards/tata-neu-infinity-hdfc-bank-credit-card/fees-and-charges" },
      { label: "Tata Neu card page", url: "https://www.tataneu.com/creditcard/" },
    ],
    gradient: "from-violet-400/30 via-slate-800 to-slate-950",
    accent: "text-violet-200",
  },

  {
    id: "hsbc-travelone",
    name: "HSBC TravelOne",
    issuer: "HSBC India",
    tier: "premium",
    tagline: "Travel card launched by HSBC in India — details verify karo.",
    joiningFee: null,
    annualFee: null,
    feeWaiverSpend: null,
    forexMarkupPct: null,
    rewards: [{ category: "base", valueBackPct: null, note: "Reward points with travel transfer partners — rates not verified." }],
    lounge: { domesticPerYear: null, internationalPerYear: null, note: "Not verified." },
    highlights: ["HSBC launched the TravelOne credit card in India (community-reported)."],
    watchOuts: [
      "Is card ka India fee/benefit data humein official HSBC India page se nahi mila — sirf community posts.",
      "Engine isko rank karta hai lekin 'unverified' flag ke saath. Apply karne se pehle HSBC India se confirm karo.",
    ],
    tags: ["travel", "rewards", "international"],
    dataConfidence: "unverified",
    sources: [
      { label: "Community thread — HSBC TravelOne India launch", url: "https://www.reddit.com/r/CreditCardsIndia/comments/1i76ifa/hsbc_launched_hsbc_travel_one_credit_card_in_india/" },
    ],
    gradient: "from-red-400/25 via-slate-800 to-slate-950",
    accent: "text-red-200",
  },
];

export const getCardById = (id: string): CreditCard | undefined =>
  CARD_DB.find((card) => card.id === id);

export const formatINR = (value: number | null, fallback = "Not confirmed"): string => {
  if (value === null || Number.isNaN(value)) return fallback;
  if (value === 0) return "₹0";
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
};

export const formatFee = (card: CreditCard): string => {
  if (card.annualFee === null) return "Fee not confirmed";
  if (card.annualFee === 0) return "Lifetime free";
  return `${formatINR(card.annualFee)}/year + taxes`;
};
