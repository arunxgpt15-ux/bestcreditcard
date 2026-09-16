"use client";

import { useMemo, useState } from "react";
import {
  Armchair,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Globe2,
  GraduationCap,
  Laptop,
  Plane,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ActionButton } from "@/src/components/ui/ActionButton";
import { OptionButton } from "@/src/components/ui/OptionButton";
import type { Profile, SpendCategory } from "@/src/lib/types";

type QuizProps = {
  onComplete: (profile: Profile) => void;
};

const DEFAULT_SPENDS: Record<SpendCategory, number> = {
  online: 0,
  dining: 0,
  groceries: 0,
  travel: 0,
  fuel: 0,
  bills: 0,
  rent: 0,
  international: 0,
  other: 0,
};

const renderOptions = (
  options: { value: string; label: string; icon?: LucideIcon }[],
  value: string,
  onSelect: (nextValue: string) => void
) => (
  <div className="grid gap-3 sm:grid-cols-2">
    {options.map((option) => (
      <OptionButton
        key={option.value}
        value={option.value}
        label={option.label}
        selected={value === option.value}
        onSelect={onSelect}
        icon={option.icon}
      />
    ))}
  </div>
);

export function Quiz({ onComplete }: QuizProps) {
  const [step, setStep] = useState(1);
  const [ageGroup, setAgeGroup] = useState<Profile["ageGroup"]>("");
  const [occupation, setOccupation] = useState<Profile["occupation"]>("");
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [travelType, setTravelType] = useState<Profile["travelType"]>("");
  const [tripsPerYear, setTripsPerYear] = useState(0);
  const [loungeNeed, setLoungeNeed] = useState<Profile["loungeNeed"]>("");
  const [feeComfort, setFeeComfort] = useState(0);
  const [creditStage, setCreditStage] = useState<Profile["creditStage"]>("");
  const [priorities, setPriorities] = useState<string[]>([]);
  const [spends, setSpends] = useState<Record<SpendCategory, number>>(DEFAULT_SPENDS);

  const isStepValid = useMemo(() => {
    if (step === 1) return Boolean(ageGroup);
    if (step === 2) return Boolean(occupation);
    if (step === 3) return monthlyIncome > 0 && travelType !== "" && tripsPerYear > 0;
    if (step === 4) return Boolean(loungeNeed) && Boolean(creditStage) && priorities.length > 0;
    return false;
  }, [ageGroup, creditStage, loungeNeed, monthlyIncome, occupation, priorities.length, step, travelType, tripsPerYear]);

  const togglePriority = (tag: string) => {
    setPriorities((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag]
    );
  };

  const submitQuiz = () => {
    const profile: Profile = {
      ageGroup,
      occupation,
      monthlyIncome,
      spends,
      tripsPerYear,
      travelType,
      loungeNeed,
      priorities: priorities as any,
      feeComfort,
      creditStage,
    };

    onComplete(profile);
  };

  return (
    <div className="relative mx-auto max-w-5xl rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10">
      <div className="mb-10 flex items-end justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-400">PERSONALIZED CARD FINDER</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Find Your Perfect Card Match</h2>
        </div>
        <span className="shrink-0 text-sm font-medium text-slate-400">Step {step} of 4</span>
      </div>

      <div className="mb-10 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-teal-400 via-teal-300 to-amber-300 shadow-[0_0_15px_rgba(45,212,191,0.5)] transition-all duration-500 ease-out" style={{ width: `${(step / 4) * 100}%` }} />
      </div>

      {step === 1 && (
        <div>
          <h3 className="text-2xl font-bold text-white">Where are you in your journey?</h3>
          <p className="mt-3 text-slate-400">A little context helps us focus your results on cards that fit your stage of life.</p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              ["18-24", "18–24", "Starting your career, studying, or building your first credit profile"],
              ["25-40", "25–40", "Growing your income, travel goals, family plans, or business spends"],
              ["41-60", "41–60", "Established income and a more mature spending pattern"],
            ].map(([value, label, description]) => (
              <button
                key={value}
                type="button"
                aria-pressed={ageGroup === value}
                onClick={() => setAgeGroup(value as Profile["ageGroup"])}
                className={
                  ageGroup === value
                    ? "rounded-2xl border border-teal-400/70 bg-teal-400/15 p-6 text-left shadow-lg shadow-teal-400/10 transition-all duration-300"
                    : "rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left transition-all duration-300 hover:border-teal-400/40 hover:bg-teal-400/10"
                }
              >
                <span className="text-xl font-bold text-white">{label}</span>
                <span className="mt-3 block text-sm leading-6 text-slate-400">{description}</span>
              </button>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <ActionButton disabled={!ageGroup} onClick={() => setStep(2)}>Continue</ActionButton>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3 className="text-2xl font-bold text-white">What best describes you?</h3>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              { value: "student", label: "Student", icon: GraduationCap },
              { value: "early-career", label: "Early-career professional", icon: BriefcaseBusiness },
              { value: "salaried", label: "Salaried professional", icon: BriefcaseBusiness },
              { value: "business-owner", label: "Business owner", icon: Building2 },
              { value: "freelancer", label: "Freelancer / creator", icon: Laptop },
              { value: "between-jobs", label: "Between jobs", icon: Laptop },
              { value: "family-traveler", label: "Family-focused traveler", icon: Plane },
            ].map((option) => (
              <OptionButton
                key={option.value}
                value={option.value}
                label={option.label}
                selected={occupation === option.value}
                onSelect={(value) => setOccupation(value as Profile["occupation"])}
                icon={option.icon}
              />
            ))}
          </div>

          <div className="mt-8 flex justify-between">
            <ActionButton variant="secondary" onClick={() => setStep(1)}>Back</ActionButton>
            <ActionButton disabled={!occupation} onClick={() => setStep(3)}>Continue</ActionButton>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h3 className="text-2xl font-bold text-white">Tell us about your spending and travel</h3>

          <div className="mt-8 space-y-8">
            <div>
              <p className="mb-3 font-semibold text-white">Monthly income</p>
              <input type="number" min={0} value={monthlyIncome} onChange={(e) => setMonthlyIncome(Number(e.target.value))} className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500" placeholder="e.g. 60000" />
            </div>

            <div>
              <p className="mb-3 font-semibold text-white">How often do you travel?</p>
              {renderOptions([
                { value: "0", label: "0–1 trips", icon: Plane },
                { value: "2", label: "2–5 trips", icon: Plane },
                { value: "6", label: "6+ trips", icon: Plane },
              ], String(tripsPerYear), (nextValue) => setTripsPerYear(Number(nextValue)))}
            </div>

            <div>
              <p className="mb-3 font-semibold text-white">Main travel style</p>
              {renderOptions([
                { value: "domestic", label: "Domestic", icon: Plane },
                { value: "international", label: "International", icon: Globe2 },
                { value: "both", label: "Both", icon: Globe2 },
              ], travelType, (value) => setTravelType(value as Profile["travelType"]))}
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <ActionButton variant="secondary" onClick={() => setStep(2)}>Back</ActionButton>
            <ActionButton disabled={monthlyIncome <= 0 || travelType === "" || tripsPerYear <= 0} onClick={() => setStep(4)}>Continue</ActionButton>
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <h3 className="text-2xl font-bold text-white">What matters most to you?</h3>

          <div className="mt-8 space-y-8">
            <div>
              <p className="mb-3 font-semibold text-white">Lounge requirement</p>
              {renderOptions([
                { value: "none", label: "Not important", icon: Armchair },
                { value: "occasional", label: "Occasional", icon: Armchair },
                { value: "important", label: "Important", icon: Armchair },
                { value: "every-trip", label: "Every trip", icon: Armchair },
              ], loungeNeed, (value) => setLoungeNeed(value as Profile["loungeNeed"]))}
            </div>

            <div>
              <p className="mb-3 font-semibold text-white">Annual fee comfort</p>
              <input type="number" min={0} value={feeComfort} onChange={(e) => setFeeComfort(Number(e.target.value))} className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500" placeholder="e.g. 2500" />
            </div>

            <div>
              <p className="mb-3 font-semibold text-white">Credit stage</p>
              {renderOptions([
                { value: "first-card", label: "First card", icon: CheckCircle2 },
                { value: "building", label: "Building profile", icon: CheckCircle2 },
                { value: "experienced", label: "Experienced", icon: CheckCircle2 },
              ], creditStage, (value) => setCreditStage(value as Profile["creditStage"]))}
            </div>

            <div>
              <p className="mb-3 font-semibold text-white">Priority benefits</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {['travel', 'lounge', 'forex', 'cashback', 'rewards', 'shopping', 'domestic', 'international'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => togglePriority(tag)}
                    className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${priorities.includes(tag) ? "border-teal-400/70 bg-teal-400/15 text-white" : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-teal-400/40 hover:bg-teal-400/10"}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <ActionButton variant="secondary" onClick={() => setStep(3)}>Back</ActionButton>
            <ActionButton disabled={!isStepValid} onClick={submitQuiz}>See my card match</ActionButton>
          </div>
        </div>
      )}
    </div>
  );
}
