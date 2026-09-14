"use client";

import { useMemo, useState } from "react";
import {
  Armchair,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Check,
  CheckCircle2,
  Gem,
  GitCompareArrows,
  Globe2,
  GraduationCap,
  IndianRupee,
  Laptop,
  Plane,
  Instagram,
  Linkedin,
  Sparkles,
  Twitter,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const featuredCards = [
  {
    name: "HDFC Regalia Gold",
    fee: "₹2,500/year",
    gradient: "bg-gradient-to-br from-teal-500/70 via-slate-900 to-slate-950",
    perks: ["Complimentary lounge visits", "Reward points on travel"],
  },
  {
    name: "Axis Atlas",
    fee: "₹5,000/year",
    gradient: "bg-gradient-to-br from-amber-300/50 via-slate-800 to-slate-950",
    perks: ["Airline and hotel transfer partners", "High travel reward rate"],
  },
  {
    name: "Premium Travel Card",
    fee: "₹3,500/year",
    gradient: "bg-gradient-to-br from-cyan-400/50 via-slate-900 to-slate-950",
    perks: ["Low foreign-currency markup", "Airport dining privileges"],
  },
];

const features = [
  {
    number: "01",
    title: "Smart matching",
    description: "Tell us where and how you spend, then get cards aligned to your travel goals.",
    icon: Sparkles,
  },
  {
    number: "02",
    title: "Hidden perks",
    description: "See lounge access, transfer partners, milestone rewards, and benefits that are easy to miss.",
    icon: Gem,
  },
  {
    number: "03",
    title: "Instant comparison",
    description: "Compare annual fees, reward rates, and travel value without opening ten tabs.",
    icon: GitCompareArrows,
  },
];

type Recommendation = {
  category: string;
  subtitle: string;
  reasons: string[];
  badges: string[];
};

const primaryButtonClass = "rounded-xl bg-teal-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-300";
const secondaryButtonClass = "rounded-xl border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:border-amber-300/40 hover:bg-amber-300/10";

function OptionButton({
  value,
  label,
  selected,
  onSelect,
  icon: Icon,
}: {
  value: string;
  label: string;
  selected: boolean;
  onSelect: (value: string) => void;
  icon?: LucideIcon;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(value)}
      className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all duration-300 ${selected ? "border-teal-400/70 bg-teal-400/15 text-white shadow-lg shadow-teal-400/10" : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-teal-400/40 hover:bg-teal-400/10"}`}
    >
      {Icon && <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-teal-400" />}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

export default function Home() {
  const [step, setStep] = useState(1);
  const [ageGroup, setAgeGroup] = useState("");
  const [occupation, setOccupation] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [travelFrequency, setTravelFrequency] = useState("");
  const [travelType, setTravelType] = useState("");
  const [primaryGoal, setPrimaryGoal] = useState("");
  const [loungeNeed, setLoungeNeed] = useState("");
  const [forexNeed, setForexNeed] = useState("");
  const [annualFeeComfort, setAnnualFeeComfort] = useState("");
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [spendingSource, setSpendingSource] = useState("");
  const [householdSpending, setHouseholdSpending] = useState("");

  const computedRecommendation = useMemo<Recommendation>(() => {
    let category = "Balanced Travel Rewards Card";
    let subtitle = "A practical fit for your travel rhythm, spending pattern, and reward priorities.";

    if (ageGroup === "18-24" && occupation === "Student") {
      if (primaryGoal === "No/low annual fee" || travelFrequency === "Rarely") {
        category = "Starter Rewards / Low-Fee Card";
      } else if (primaryGoal === "Domestic travel rewards" && travelFrequency !== "Rarely") {
        category = "Entry Travel Rewards Card";
      } else if (primaryGoal === "Lounge access" && travelFrequency === "4+ trips a year") {
        category = "Entry Lounge-Focused Card";
      }
      subtitle = "Built for students who want useful travel benefits without overcomplicating their first card choice.";
    } else if (ageGroup === "18-24" && (occupation === "Early-career professional" || occupation === "Between jobs or building a career")) {
      if (monthlyIncome === "Under ₹30k" && annualFeeComfort === "Zero fee") {
        category = "Low-Fee Starter Rewards Card";
      } else if (travelType === "Domestic" && primaryGoal === "Rewards" && travelFrequency !== "Rarely") {
        category = "Domestic Travel Rewards Card";
      } else if (travelType === "International" && primaryGoal === "Low forex") {
        category = "International Spend / Forex-Friendly Card";
      } else if (travelFrequency === "4+ trips" && loungeNeed === "Important" && annualFeeComfort !== "Zero fee") {
        category = "Lounge and Travel Rewards Card";
      }
      subtitle = "Built for growing income, regular spends, and a travel routine that is starting to become more intentional.";
    } else if (ageGroup === "18-24" && occupation === "Freelancer / creator / self-employed") {
      if (travelType === "International" && forexNeed === "Yes") {
        category = "International Spend Card";
      } else if (travelFrequency === "4+ trips" && loungeNeed === "Important") {
        category = "Premium Travel and Lounge Card";
      } else if (annualFeeComfort === "Zero fee" || annualFeeComfort === "Under ₹2,500") {
        category = "Flexible Low-Fee Rewards Card";
      }
      subtitle = "Built for variable income and flexible work spending that can span tools, clients, and travel.";
    } else if (ageGroup === "25-40") {
      if (householdSpending === "High" && travelType === "Domestic") {
        category = "Everyday Spend + Domestic Travel Rewards Card";
      } else if (travelFrequency === "6+ trips per year" && travelType === "International" && primaryGoal === "Zero/low forex") {
        category = "International Travel / Lower Forex Card";
      } else if (travelFrequency === "6+ trips per year" && loungeNeed === "Every trip" && annualFeeComfort === "Premium fee is okay") {
        category = "Premium Lounge and Travel Rewards Card";
      } else if ((primaryGoal === "Flights" || primaryGoal === "Hotels" || primaryGoal === "Reward points") && householdSpending === "High") {
        category = "Airline and Hotel Transfer Rewards Card";
      } else if (occupation === "Business owner" && travelType !== "Domestic") {
        category = "Business Spend and Travel Rewards Card";
      } else if (occupation === "Family-focused traveler" && travelType === "Domestic") {
        category = "Family Travel Rewards Card";
      }
      subtitle = "Built for a fuller lifestyle where household value, travel comfort, and flexible rewards need to work together.";
    }

    const reasons = [
      travelType ? `${travelType} travel is part of your card decision.` : "Your travel pattern helps shape the right reward structure.",
      primaryGoal ? `You prioritised ${primaryGoal.toLowerCase()} as a key benefit.` : "Your stated priorities guide the recommendation.",
      annualFeeComfort ? `The profile respects your ${annualFeeComfort.toLowerCase()} annual-fee comfort level.` : "The profile keeps fees and value in view.",
    ];
    const badges = [
      travelType === "International" ? "International travel" : travelType === "Domestic" ? "Domestic travel" : "Flexible travel",
      loungeNeed === "Important" || loungeNeed === "Every trip" || primaryGoal === "Lounge access" ? "Lounge access" : "Reward flexibility",
      annualFeeComfort === "Premium fee is okay" ? "Higher annual-fee value" : forexNeed === "Yes" || primaryGoal === "Low forex" || primaryGoal === "Zero/low forex" ? "Lower forex priority" : "Fee-conscious value",
    ];

    return { category, subtitle, reasons, badges };
  }, [ageGroup, annualFeeComfort, forexNeed, householdSpending, loungeNeed, monthlyIncome, occupation, primaryGoal, travelFrequency, travelType]);

  const isStepThreeComplete = ageGroup === "18-24"
    ? occupation === "Student"
      ? Boolean(travelFrequency && primaryGoal && forexNeed && spendingSource)
      : occupation === "Early-career professional" || occupation === "Between jobs or building a career"
        ? Boolean(monthlyIncome && travelFrequency && travelType && primaryGoal && annualFeeComfort)
        : Boolean(monthlyIncome && travelType && primaryGoal && forexNeed && loungeNeed && annualFeeComfort)
    : Boolean(monthlyIncome && travelFrequency && travelType && primaryGoal && householdSpending && annualFeeComfort && loungeNeed);

  const resetQuiz = () => {
    setStep(1);
    setAgeGroup("");
    setOccupation("");
    setMonthlyIncome("");
    setTravelFrequency("");
    setTravelType("");
    setPrimaryGoal("");
    setLoungeNeed("");
    setForexNeed("");
    setAnnualFeeComfort("");
    setRecommendation(null);
    setSpendingSource("");
    setHouseholdSpending("");
  };

  const renderOptions = (
    options: { value: string; label: string; icon?: LucideIcon }[],
    value: string,
    onSelect: (nextValue: string) => void,
  ) => (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((option) => (
        <OptionButton key={option.value} {...option} selected={value === option.value} onSelect={onSelect} />
      ))}
    </div>
  );

  return (
    <>
    <main className="relative isolate min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(13,148,136,0.22),transparent_30%),radial-gradient(circle_at_85%_80%,rgba(245,158,11,0.12),transparent_28%)]" />

      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <p className="text-lg font-bold tracking-tight text-white">BestCreditCard<span className="text-teal-400">.dev</span></p>
        <p className="hidden text-sm font-medium text-slate-400 sm:block">Smart travel, better rewards</p>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-88px)] w-full max-w-7xl items-center gap-14 px-6 pb-16 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pb-24">
        <div className="max-w-2xl">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-sm font-semibold text-teal-300">
            <span className="h-2 w-2 rounded-full bg-teal-300" /> Built for your next departure
          </p>
          <h1 className="text-5xl font-black leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Find the Perfect Credit Card for Your Next Journey
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300 sm:text-xl">
            Compare travel rewards, lounge access, and real-world perks in one clear place, so every mile takes you further.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button className="rounded-xl bg-teal-400 px-6 py-4 text-base font-bold text-slate-950 shadow-lg shadow-teal-950/40 transition hover:bg-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-slate-950">
              Explore Cards
            </button>
            <button className="rounded-xl border border-slate-600 bg-slate-900/60 px-6 py-4 text-base font-bold text-white transition hover:border-amber-300 hover:text-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-950">
              Travel Deals
            </button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:mr-8">
          <div className="absolute -inset-5 rounded-[2rem] border border-teal-300/10 bg-teal-300/5 blur-2xl" />
          <div className="relative rotate-2 overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-950 p-7 shadow-2xl shadow-black/40 transition-transform duration-500 hover:rotate-0">
            <div className="flex items-start justify-between">
              <span className="text-sm font-semibold text-slate-300">TRAVEL CARD</span>
              <span className="text-lg font-black tracking-widest text-amber-300">BC</span>
            </div>
            <div className="mt-16 h-10 w-14 rounded-lg border border-amber-200/50 bg-gradient-to-br from-amber-200 to-amber-500 shadow-inner" />
            <div className="mt-10 flex items-end justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Your next adventure</p>
                <p className="mt-2 text-lg font-bold text-white">Rewards that go places</p>
              </div>
              <span className="text-3xl text-teal-300">+</span>
            </div>
          </div>
          <div className="absolute -bottom-8 -left-8 rounded-2xl border border-white/10 bg-slate-900/90 p-4 shadow-xl backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Worth discovering</p>
            <p className="mt-1 text-xl font-black text-white">3.2x <span className="text-sm font-medium text-teal-300">travel points</span></p>
          </div>
        </div>
      </section>

      <section id="top-picks" className="relative overflow-hidden bg-slate-950 px-6 py-24 sm:px-10 lg:px-16">
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-teal-400/10 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-amber-300/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-400">CURATED FOR TRAVELERS</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Top Picks for You</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
              Explore standout cards selected for travelers who want more from every journey, from airport lounges to flexible rewards.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredCards.map((card) => (
              <article
                key={card.name}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-teal-400/40 hover:bg-white/[0.07]"
              >
                <div className={`relative min-h-48 overflow-hidden rounded-2xl border border-white/15 p-5 ${card.gradient}`}>
                  <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                  <div className="absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-teal-300/10 blur-2xl" />
                  <div className="relative flex h-full min-h-48 flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">TRAVEL REWARDS</p>
                        <h3 className="mt-3 text-xl font-bold text-white">{card.name}</h3>
                      </div>
                      <span className="text-sm font-black tracking-widest text-amber-200">BC</span>
                    </div>
                    <div>
                      <div className="h-8 w-11 rounded-md border border-amber-100/40 bg-gradient-to-br from-amber-100/80 to-amber-500/70 shadow-inner" />
                      <p className="mt-5 text-sm font-medium tracking-[0.18em] text-white/70">••••  4821</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-b border-white/10 pb-5">
                  <span className="text-sm text-slate-400">Annual fee</span>
                  <span className="font-semibold text-white">{card.fee}</span>
                </div>

                <ul className="mt-5 space-y-3">
                  {card.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-3 text-sm text-slate-300">
                      <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-teal-400" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>

                <button
                  aria-label={`Apply now for ${card.name}`}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-slate-950"
                >
                  Apply Now
                  <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="card-match" className="relative overflow-hidden bg-slate-900/40 px-6 py-24 sm:px-10 lg:px-16">
        <div className="absolute -left-32 top-24 h-80 w-80 rounded-full bg-teal-400/10 blur-3xl" />
        <div className="absolute -right-24 bottom-10 h-96 w-96 rounded-full bg-amber-300/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-400">PERSONALISED CARD FINDER</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Find Your Perfect Card Match</h2>
            </div>
            <span className="shrink-0 text-sm font-medium text-slate-400">Step {step} of 4</span>
          </div>

          <div className="mb-10 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-teal-400 to-amber-300 transition-all duration-300" style={{ width: `${(step / 4) * 100}%` }} />
          </div>

          {step === 1 && (
            <div className="transition-all duration-300">
              <h3 className="text-2xl font-bold text-white">Where are you in your journey?</h3>
              <p className="mt-3 text-slate-400">A little context helps us focus your results on cards that fit your stage of life.</p>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {[
                  ["18-24", "18–24", "Starting your career, studying, or building your first credit profile"],
                  ["25-40", "25–40", "Growing your income, travel goals, family plans, or business spends"],
                ].map(([value, label, description]) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={ageGroup === value}
                    onClick={() => setAgeGroup(value)}
                    className={ageGroup === value ? "rounded-2xl border border-teal-400/70 bg-teal-400/15 p-6 text-left shadow-lg shadow-teal-400/10 transition-all duration-300" : "rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left transition-all duration-300 hover:border-teal-400/40 hover:bg-teal-400/10"}
                  >
                    <span className="text-xl font-bold text-white">{label}</span>
                    <span className="mt-3 block text-sm leading-6 text-slate-400">{description}</span>
                  </button>
                ))}
              </div>
              <div className="mt-8 flex justify-end">
                <button type="button" disabled={!ageGroup} onClick={() => setStep(2)} className={`${primaryButtonClass} disabled:cursor-not-allowed disabled:opacity-40`}>Continue</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="transition-all duration-300">
              <h3 className="text-2xl font-bold text-white">{ageGroup === "18-24" ? "What best describes you right now?" : "What best describes your current lifestyle?"}</h3>
              <p className="mt-3 text-slate-400">Choose the profile that feels closest. You can refine the details on the next step.</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {ageGroup === "18-24" && renderOptions([
                  { value: "Student", label: "Student", icon: GraduationCap },
                  { value: "Early-career professional", label: "Early-career professional", icon: BriefcaseBusiness },
                  { value: "Freelancer / creator / self-employed", label: "Freelancer / creator / self-employed", icon: Laptop },
                  { value: "Between jobs or building a career", label: "Between jobs or building a career", icon: Laptop },
                ], occupation, setOccupation)}
                {ageGroup === "25-40" && renderOptions([
                  { value: "Salaried professional", label: "Salaried professional", icon: BriefcaseBusiness },
                  { value: "Business owner", label: "Business owner", icon: Building2 },
                  { value: "Consultant / freelancer", label: "Consultant / freelancer", icon: Laptop },
                  { value: "Family-focused traveler", label: "Family-focused traveler", icon: Plane },
                ], occupation, setOccupation)}
              </div>
              <div className="mt-8 flex justify-between gap-4">
                <button type="button" onClick={() => setStep(1)} className={secondaryButtonClass}>Back</button>
                <button type="button" disabled={!occupation} onClick={() => setStep(3)} className={`${primaryButtonClass} disabled:cursor-not-allowed disabled:opacity-40`}>Continue</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="transition-all duration-300">
              <h3 className="text-2xl font-bold text-white">Tell us what matters most</h3>
              <p className="mt-3 text-slate-400">These preferences help make your recommendation explainable and useful.</p>

              <div className="mt-8 space-y-8">
                {ageGroup === "18-24" && occupation === "Student" && (
                  <>
                    <div><p className="mb-3 font-semibold text-white">How often do you travel?</p>{renderOptions([
                      { value: "Rarely", label: "Rarely", icon: Plane },
                      { value: "1–3 trips a year", label: "1–3 trips a year", icon: Plane },
                      { value: "4+ trips a year", label: "4+ trips a year", icon: Plane },
                    ], travelFrequency, setTravelFrequency)}</div>
                    <div><p className="mb-3 font-semibold text-white">What matters most?</p>{renderOptions([
                      { value: "No/low annual fee", label: "No/low annual fee", icon: IndianRupee },
                      { value: "First credit-card experience", label: "First credit-card experience", icon: CheckCircle2 },
                      { value: "Domestic travel rewards", label: "Domestic travel rewards", icon: Plane },
                      { value: "Lounge access", label: "Lounge access", icon: Armchair },
                    ], primaryGoal, setPrimaryGoal)}</div>
                    <div><p className="mb-3 font-semibold text-white">Will you use the card internationally?</p>{renderOptions([
                      { value: "Yes", label: "Yes", icon: Globe2 },
                      { value: "No", label: "No", icon: Plane },
                      { value: "Sometimes", label: "Sometimes", icon: Globe2 },
                    ], forexNeed, setForexNeed)}</div>
                    <div><p className="mb-3 font-semibold text-white">What is your spending source?</p>{renderOptions([
                      { value: "Family support", label: "Family support" },
                      { value: "Part-time income", label: "Part-time income" },
                      { value: "Scholarship/stipend", label: "Scholarship/stipend" },
                      { value: "Other", label: "Other" },
                    ], spendingSource, setSpendingSource)}</div>
                  </>
                )}

                {ageGroup === "18-24" && (occupation === "Early-career professional" || occupation === "Between jobs or building a career") && (
                  <>
                    <div><p className="mb-3 font-semibold text-white">Monthly take-home income</p>{renderOptions([
                      { value: "Under ₹30k", label: "Under ₹30k", icon: IndianRupee },
                      { value: "₹30k–₹60k", label: "₹30k–₹60k", icon: IndianRupee },
                      { value: "₹60k+", label: "₹60k+", icon: IndianRupee },
                    ], monthlyIncome, setMonthlyIncome)}</div>
                    <div><p className="mb-3 font-semibold text-white">Travel frequency</p>{renderOptions([
                      { value: "Rarely", label: "Rarely", icon: Plane },
                      { value: "1–3 trips", label: "1–3 trips", icon: Plane },
                      { value: "4+ trips", label: "4+ trips", icon: Plane },
                    ], travelFrequency, setTravelFrequency)}</div>
                    <div><p className="mb-3 font-semibold text-white">Main travel type</p>{renderOptions([
                      { value: "Domestic", label: "Domestic", icon: Plane },
                      { value: "International", label: "International", icon: Globe2 },
                      { value: "Both", label: "Both", icon: Globe2 },
                    ], travelType, setTravelType)}</div>
                    <div><p className="mb-3 font-semibold text-white">Most important benefit</p>{renderOptions([
                      { value: "Rewards", label: "Rewards", icon: CheckCircle2 },
                      { value: "Lounge access", label: "Lounge access", icon: Armchair },
                      { value: "Airline/hotel points", label: "Airline/hotel points", icon: Plane },
                      { value: "Low forex", label: "Low forex", icon: Globe2 },
                    ], primaryGoal, setPrimaryGoal)}</div>
                    <div><p className="mb-3 font-semibold text-white">Annual fee comfort</p>{renderOptions([
                      { value: "Zero fee", label: "Zero fee", icon: IndianRupee },
                      { value: "Under ₹2,500", label: "Under ₹2,500", icon: IndianRupee },
                      { value: "Up to ₹5,000", label: "Up to ₹5,000", icon: IndianRupee },
                    ], annualFeeComfort, setAnnualFeeComfort)}</div>
                  </>
                )}

                {ageGroup === "18-24" && occupation === "Freelancer / creator / self-employed" && (
                  <>
                    <div><p className="mb-3 font-semibold text-white">Monthly business income range</p>{renderOptions([
                      { value: "Under ₹30k", label: "Under ₹30k", icon: IndianRupee },
                      { value: "₹30k–₹60k", label: "₹30k–₹60k", icon: IndianRupee },
                      { value: "₹60k+", label: "₹60k+", icon: IndianRupee },
                    ], monthlyIncome, setMonthlyIncome)}</div>
                    <div><p className="mb-3 font-semibold text-white">Client or travel spending</p>{renderOptions([
                      { value: "Domestic", label: "Domestic", icon: Plane },
                      { value: "International", label: "International", icon: Globe2 },
                      { value: "Both", label: "Both", icon: Globe2 },
                    ], travelType, setTravelType)}</div>
                    <div><p className="mb-3 font-semibold text-white">Main spend category</p>{renderOptions([
                      { value: "Ads/tools", label: "Ads/tools", icon: Laptop },
                      { value: "Travel", label: "Travel", icon: Plane },
                      { value: "Dining", label: "Dining", icon: CheckCircle2 },
                      { value: "Shopping", label: "Shopping", icon: CheckCircle2 },
                      { value: "Mixed", label: "Mixed", icon: CheckCircle2 },
                    ], primaryGoal, setPrimaryGoal)}</div>
                    <div><p className="mb-3 font-semibold text-white">Do you need lower forex costs for international spends?</p>{renderOptions([
                      { value: "Yes", label: "Yes", icon: Globe2 },
                      { value: "No", label: "No", icon: Plane },
                    ], forexNeed, setForexNeed)}</div>
                    <div><p className="mb-3 font-semibold text-white">Lounge need</p>{renderOptions([
                      { value: "Not important", label: "Not important", icon: Armchair },
                      { value: "Occasional", label: "Occasional", icon: Armchair },
                      { value: "Important", label: "Important", icon: Armchair },
                    ], loungeNeed, setLoungeNeed)}</div>
                    <div><p className="mb-3 font-semibold text-white">Fee comfort</p>{renderOptions([
                      { value: "Zero fee", label: "Zero fee", icon: IndianRupee },
                      { value: "Under ₹2,500", label: "Under ₹2,500", icon: IndianRupee },
                      { value: "Up to ₹5,000", label: "Up to ₹5,000", icon: IndianRupee },
                    ], annualFeeComfort, setAnnualFeeComfort)}</div>
                  </>
                )}

                {ageGroup === "25-40" && (
                  <>
                    <div><p className="mb-3 font-semibold text-white">Monthly income or business-spend range</p>{renderOptions([
                      { value: "Under ₹60k", label: "Under ₹60k", icon: IndianRupee },
                      { value: "₹60k–₹1.25L", label: "₹60k–₹1.25L", icon: IndianRupee },
                      { value: "₹1.25L+", label: "₹1.25L+", icon: IndianRupee },
                    ], monthlyIncome, setMonthlyIncome)}</div>
                    <div><p className="mb-3 font-semibold text-white">Travel frequency</p>{renderOptions([
                      { value: "0–1 trips", label: "0–1 trips", icon: Plane },
                      { value: "2–5 trips", label: "2–5 trips", icon: Plane },
                      { value: "6+ trips per year", label: "6+ trips per year", icon: Plane },
                    ], travelFrequency, setTravelFrequency)}</div>
                    <div><p className="mb-3 font-semibold text-white">Travel type</p>{renderOptions([
                      { value: "Domestic", label: "Domestic", icon: Plane },
                      { value: "International", label: "International", icon: Globe2 },
                      { value: "Both", label: "Both", icon: Globe2 },
                    ], travelType, setTravelType)}</div>
                    <div><p className="mb-3 font-semibold text-white">Main travel priority</p>{renderOptions([
                      { value: "Flights", label: "Flights", icon: Plane },
                      { value: "Hotels", label: "Hotels", icon: Plane },
                      { value: "Lounge access", label: "Lounge access", icon: Armchair },
                      { value: "Zero/low forex", label: "Zero/low forex", icon: Globe2 },
                      { value: "Reward points", label: "Reward points", icon: CheckCircle2 },
                    ], primaryGoal, setPrimaryGoal)}</div>
                    <div><p className="mb-3 font-semibold text-white">Household spending level</p>{renderOptions([
                      { value: "Basic", label: "Basic", icon: IndianRupee },
                      { value: "Moderate", label: "Moderate", icon: IndianRupee },
                      { value: "High", label: "High", icon: IndianRupee },
                    ], householdSpending, setHouseholdSpending)}</div>
                    <div><p className="mb-3 font-semibold text-white">Annual fee comfort</p>{renderOptions([
                      { value: "Zero fee", label: "Zero fee", icon: IndianRupee },
                      { value: "Under ₹2,500", label: "Under ₹2,500", icon: IndianRupee },
                      { value: "Up to ₹5,000", label: "Up to ₹5,000", icon: IndianRupee },
                      { value: "Premium fee is okay", label: "Premium fee is okay", icon: IndianRupee },
                    ], annualFeeComfort, setAnnualFeeComfort)}</div>
                    <div><p className="mb-3 font-semibold text-white">Lounge requirement</p>{renderOptions([
                      { value: "Not important", label: "Not important", icon: Armchair },
                      { value: "Occasional", label: "Occasional", icon: Armchair },
                      { value: "Important", label: "Important", icon: Armchair },
                      { value: "Every trip", label: "Every trip", icon: Armchair },
                    ], loungeNeed, setLoungeNeed)}</div>
                  </>
                )}
              </div>

              <div className="mt-10 flex justify-between gap-4">
                <button type="button" onClick={() => setStep(2)} className={secondaryButtonClass}>Back</button>
                <button type="button" disabled={!isStepThreeComplete} onClick={() => { setRecommendation(computedRecommendation); setStep(4); }} className={`${primaryButtonClass} disabled:cursor-not-allowed disabled:opacity-40`}>See my card match</button>
              </div>
            </div>
          )}

          {step === 4 && recommendation && (
            <div className="transition-all duration-300">
              <div className="rounded-3xl border border-teal-400/30 bg-gradient-to-br from-teal-400/10 via-slate-950 to-amber-300/5 p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-400">YOUR BEST MATCH</p>
                <h3 className="mt-4 text-3xl font-bold text-white">{recommendation.category}</h3>
                <p className="mt-3 max-w-2xl text-slate-300">{recommendation.subtitle}</p>

                <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto]">
                  <div>
                    <h4 className="text-lg font-semibold text-white">Why this fits you</h4>
                    <ul className="mt-4 space-y-3">
                      {recommendation.reasons.map((reason) => (
                        <li key={reason} className="flex gap-3 text-sm leading-6 text-slate-300">
                          <CheckCircle2 aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-teal-400" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-wrap content-start gap-2 lg:max-w-xs lg:justify-end">
                    {recommendation.badges.map((badge) => <span key={badge} className="rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1.5 text-xs font-medium text-teal-200">{badge}</span>)}
                  </div>
                </div>

                <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <h4 className="font-semibold text-white">What to compare before applying</h4>
                  <ul className="mt-4 grid gap-3 text-sm text-slate-400 sm:grid-cols-2">
                    {[
                      "Annual fee and waiver rules",
                      "Income and issuer eligibility",
                      "Reward redemption and transfer value",
                      "Lounge guest access and visit limits",
                      "Forex markup and foreign-transaction fees",
                    ].map((item) => <li key={item} className="flex gap-2"><span className="text-amber-300">•</span>{item}</li>)}
                  </ul>
                </div>

                <p className="mt-6 text-xs leading-5 text-slate-500">Recommendations are based on your preferences. Check issuer eligibility, fees, and current terms before applying.</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button type="button" className={primaryButtonClass}>Compare matching cards <ArrowRight aria-hidden="true" className="ml-2 inline h-4 w-4" /></button>
                  <button type="button" onClick={resetQuiz} className={secondaryButtonClass}>Start over</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      <section id="why-us" className="relative overflow-hidden border-t border-white/5 bg-slate-950 px-6 py-24 sm:px-10 lg:px-16">
        <div className="absolute left-1/2 top-0 h-80 w-[32rem] -translate-x-1/2 rounded-full bg-teal-400/5 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-400">A SMARTER WAY TO CHOOSE</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Why use our engine?</h2>
            <p className="mt-4 text-base text-slate-400">Clear recommendations built around how you actually travel.</p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {features.map(({ number, title, description, icon: Icon }) => (
              <article key={title} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition duration-300 hover:-translate-y-1 hover:border-teal-400/30 hover:bg-white/[0.05]">
                <p className="text-sm font-semibold tracking-[0.2em] text-amber-300/80">{number}</p>
                <div className="mt-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-400/10 text-teal-400 ring-1 ring-inset ring-teal-400/20">
                  <Icon aria-hidden="true" className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{description}</p>
                <div className="absolute inset-x-7 bottom-0 h-px bg-gradient-to-r from-teal-400 to-amber-300 opacity-0 transition duration-300 group-hover:opacity-80" />
              </article>
            ))}
          </div>

          <p className="mt-12 text-center text-sm text-slate-500">Built for travelers who want more value from every swipe.</p>
        </div>
      </section>
    </main>

    <footer className="border-t border-white/10 bg-slate-950 px-6 py-14 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="text-xl font-bold tracking-tight text-white">Journey<span className="text-teal-400">Card</span></p>
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">Find the travel card that turns everyday spending into your next journey.</p>
            <div className="mt-6 flex gap-3">
              <button type="button" aria-label="JourneyCard on Twitter" className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:border-teal-400/40 hover:bg-teal-400/10 hover:text-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-400">
                <Twitter aria-hidden="true" className="h-4 w-4" />
              </button>
              <button type="button" aria-label="JourneyCard on Instagram" className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:border-teal-400/40 hover:bg-teal-400/10 hover:text-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-400">
                <Instagram aria-hidden="true" className="h-4 w-4" />
              </button>
              <button type="button" aria-label="JourneyCard on LinkedIn" className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:border-teal-400/40 hover:bg-teal-400/10 hover:text-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-400">
                <Linkedin aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          </div>

          <nav aria-label="Explore navigation">
            <h2 className="text-sm font-semibold text-white">Explore</h2>
            <ul className="mt-4 space-y-3">
              {["Compare Cards", "Travel Rewards", "Lounge Access", "Zero Forex Cards"].map((label) => <li key={label}><a href="#" className="text-sm text-slate-400 transition hover:text-teal-300 focus:outline-none focus:text-teal-300">{label}</a></li>)}
            </ul>
          </nav>

          <nav aria-label="Resources navigation">
            <h2 className="text-sm font-semibold text-white">Resources</h2>
            <ul className="mt-4 space-y-3">
              {["Card Guides", "Miles Calculator", "Credit Score Guide", "FAQs"].map((label) => <li key={label}><a href="#" className="text-sm text-slate-400 transition hover:text-teal-300 focus:outline-none focus:text-teal-300">{label}</a></li>)}
            </ul>
          </nav>

          <nav aria-label="Company navigation">
            <h2 className="text-sm font-semibold text-white">Company</h2>
            <ul className="mt-4 space-y-3">
              {["About Us", "Contact", "Privacy Policy", "Terms of Use"].map((label) => <li key={label}><a href="#" className="text-sm text-slate-400 transition hover:text-teal-300 focus:outline-none focus:text-teal-300">{label}</a></li>)}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 JourneyCard. All rights reserved.</p>
          <p>For educational purposes only. Card terms and benefits <span className="text-amber-300/80">may change</span>.</p>
        </div>
      </div>
    </footer>
    </>
  );
}