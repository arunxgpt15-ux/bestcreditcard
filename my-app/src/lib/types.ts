/**
 * Central type definitions.
 * Purana code mein saari values loose strings thi ("4+ trips", "4+ trips a year")
 * jisse silent bugs aate the. Ab sab union types hain -> compile time pe pakda jayega.
 */

export type AgeGroup = "18-24" | "25-40" | "41-60";

export type Occupation =
  | "student"
  | "early-career"
  | "salaried"
  | "business-owner"
  | "freelancer"
  | "between-jobs"
  | "family-traveler";

export type SpendCategory =
  | "online"
  | "dining"
  | "groceries"
  | "travel"
  | "fuel"
  | "bills"
  | "rent"
  | "international"
  | "other";

export const SPEND_CATEGORIES: SpendCategory[] = [
  "online",
  "dining",
  "groceries",
  "travel",
  "fuel",
  "bills",
  "rent",
  "international",
  "other",
];

export const SPEND_LABELS: Record<SpendCategory, string> = {
  online: "Online shopping",
  dining: "Dining & food delivery",
  groceries: "Groceries",
  travel: "Flights / hotels / travel",
  fuel: "Fuel",
  bills: "Utility bills & recharges",
  rent: "Rent",
  international: "International / forex spends",
  other: "Everything else",
};

export type CardTier = "entry" | "mid" | "premium" | "super-premium";

export type CardTag =
  | "travel"
  | "lounge"
  | "forex"
  | "cashback"
  | "rewards"
  | "lifetime-free"
  | "premium"
  | "starter"
  | "shopping"
  | "milestone"
  | "domestic"
  | "international"
  | "business"
  | "fuel";

export const TAG_LABELS: Record<CardTag, string> = {
  travel: "Travel",
  lounge: "Lounge access",
  forex: "Low / zero forex",
  cashback: "Cashback",
  rewards: "Reward points",
  "lifetime-free": "Lifetime free",
  premium: "Premium",
  starter: "Starter friendly",
  shopping: "Shopping",
  milestone: "Milestone benefits",
  domestic: "Domestic travel",
  international: "International travel",
  business: "Business spends",
  fuel: "Fuel",
};

/** Source citation — har factual claim ke saath ek link. */
export type Source = { label: string; url: string };

/**
 * valueBackPct = 1 rupya kharch karne pe kitna % value wapas milti hai.
 * null ka matlab: humne verify nahi kiya (points ka value redemption pe depend karta hai).
 * Engine null ko "unknown" treat karta hai, zero nahi — warna galat ranking banegi.
 */
export type RewardRule = {
  category: SpendCategory | "base";
  valueBackPct: number | null;
  note?: string;
  monthlyCapValue?: number | null;
};

export type LoungeInfo = {
  domesticPerYear: number | "unlimited" | null;
  internationalPerYear: number | "unlimited" | null;
  note?: string;
};

export type DataConfidence = "verified" | "partial" | "unverified";

export type CreditCard = {
  id: string;
  name: string;
  issuer: string;
  tier: CardTier;
  tagline: string;
  /** Rupees, taxes extra. null = publicly confirm nahi kar paye. */
  joiningFee: number | null;
  annualFee: number | null;
  /** Annual spend jispe renewal fee waive hoti hai. */
  feeWaiverSpend: number | null;
  /** Foreign currency markup %. 0 = zero forex. null = unknown. */
  forexMarkupPct: number | null;
  rewards: RewardRule[];
  lounge: LoungeInfo;
  highlights: string[];
  watchOuts: string[];
  tags: CardTag[];
  dataConfidence: DataConfidence;
  sources: Source[];
  gradient: string;
  accent: string;
};

export type TravelType = "domestic" | "international" | "both";
export type LoungeNeed = "none" | "occasional" | "important" | "every-trip";
export type CreditStage = "first-card" | "building" | "experienced";

/** Quiz ka output — ye poora object recommendation engine ko jata hai. */
export type Profile = {
  ageGroup: AgeGroup | "";
  occupation: Occupation | "";
  monthlyIncome: number;
  spends: Record<SpendCategory, number>;
  tripsPerYear: number;
  travelType: TravelType | "";
  loungeNeed: LoungeNeed | "";
  priorities: CardTag[];
  feeComfort: number;
  creditStage: CreditStage | "";
};

export type ScoreLine = {
  label: string;
  /** Rupees per year. Positive = benefit, negative = cost. */
  amount: number;
  confident: boolean;
};

export type ScoredCard = {
  card: CreditCard;
  score: number;
  netAnnualValue: number;
  breakdown: ScoreLine[];
  matchedPriorities: CardTag[];
  warnings: string[];
  confidence: DataConfidence;
};

export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: number;
  salt: string;
  passwordHash: string;
};

export type PublicUser = Omit<User, "salt" | "passwordHash">;

export type AuthStatus = "loading" | "authenticated" | "anonymous";
