"use client";

import { useState } from "react";
import type { Profile, ScoredCard } from "@/src/lib/types";
import { Quiz } from "@/src/components/quiz/Quiz";
import { Container } from "@/src/components/layout/Container";
import { SectionHeading } from "@/src/components/ui/SectionHeading";

export type QuizSectionProps = { onComplete: (profile: Profile, matches: ScoredCard[]) => void; getMatches: (profile: Profile) => ScoredCard[] };

export function QuizSection({ onComplete, getMatches }: QuizSectionProps) {
  const [crunching, setCrunching] = useState(false);
  const complete = (profile: Profile) => { setCrunching(true); const matches = getMatches(profile); window.setTimeout(() => { onComplete(profile, matches); setCrunching(false); document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" }); }, 700); };
  return <section id="card-match" className="border-y border-border bg-surface-1 py-20 md:py-28"><Container><SectionHeading eyebrow="Personalized card finder" title="A better answer than a generic list." description="Four quick steps. A shortlist that understands your spend, travel, and appetite for annual fees." align="center" /><div className="relative mt-12"><div className="absolute -top-5 left-1/2 hidden w-full max-w-3xl -translate-x-1/2 items-center justify-between px-10 text-[10px] font-bold uppercase tracking-[.18em] text-muted sm:flex"><span>Profile</span><span>Spend</span><span>Priorities</span><span>Match</span></div>{crunching ? <div className="glass-card mx-auto flex min-h-[22rem] max-w-5xl flex-col items-center justify-center p-10 text-center"><div className="h-12 w-12 animate-spin rounded-full border-2 border-teal-400 border-t-transparent" /><h3 className="display-heading mt-6 text-3xl text-ink">Crunching the numbers</h3><p className="mt-3 text-muted">Comparing fees, perks, and the way you travel.</p></div> : <Quiz onComplete={complete} />}</div></Container></section>;
}
