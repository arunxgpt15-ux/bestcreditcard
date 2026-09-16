"use client";

import { Suspense, useCallback, useState } from "react";
import type { CreditCard, Profile, ScoredCard } from "@/src/lib/types";
import { CARD_DB } from "@/src/lib/cards";
import { recommendCards } from "@/src/lib/recommend";
import { Header } from "@/src/components/layout/Header";
import { Footer } from "@/src/components/layout/Footer";
import { Container } from "@/src/components/layout/Container";
import { SectionHeading } from "@/src/components/ui/SectionHeading";
import { Hero } from "@/src/components/sections/Hero";
import { LogoMarquee } from "@/src/components/sections/LogoMarquee";
import { TopPicks } from "@/src/components/sections/TopPicks";
import { CardFilters } from "@/src/components/sections/CardFilters";
import { QuizSection } from "@/src/components/sections/QuizSection";
import { ResultsSection } from "@/src/components/sections/ResultsSection";
import { ComparisonTable } from "@/src/components/sections/ComparisonTable";
import { BentoWhyUs } from "@/src/components/sections/BentoWhyUs";
import { Testimonials } from "@/src/components/sections/Testimonials";
import { Faq } from "@/src/components/sections/Faq";
import { CtaBand } from "@/src/components/sections/CtaBand";

const asScored = (card: CreditCard): ScoredCard => ({ card, score: 0, netAnnualValue: 0, breakdown: [], matchedPriorities: [], warnings: [], confidence: card.dataConfidence });

export function LandingPage() { const [selected, setSelected] = useState<ScoredCard[]>([]); const [visibleCards, setVisibleCards] = useState<CreditCard[]>(CARD_DB); const [matches, setMatches] = useState<ScoredCard[]>([]); const [profile, setProfile] = useState<Profile | null>(null); const toggle = (card: CreditCard) => setSelected((current) => current.some((item) => item.card.id === card.id) ? current.filter((item) => item.card.id !== card.id) : [...current, asScored(card)]); const updateVisibleCards = useCallback((cards: CreditCard[]) => setVisibleCards(cards), []); return <><Header /><main><Hero /><LogoMarquee /><section id="top-picks" className="py-20 md:py-28"><Container><SectionHeading eyebrow="Curated for travellers" title="Start with cards worth your attention." description="A sharper shortlist of travel, lounge, forex, and rewards cards across the Indian market." /><div className="mt-10"><TopPicks cards={CARD_DB.slice(0, 3)} selected={selected} onToggle={toggle} /></div><div className="mt-24" id="all-cards"><SectionHeading eyebrow="Explore the full set" title="Filter by what matters." description="Shareable filters, transparent data, and no popularity games." /><div className="mt-8"><Suspense fallback={<div className="h-10 rounded-lg bg-surface-1" />}><CardFilters cards={CARD_DB} onChange={updateVisibleCards} /></Suspense></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{visibleCards.map((card) => <button type="button" key={card.id} onClick={() => toggle(card)} className={`focus-ring glass-card p-5 text-left transition hover:-translate-y-1 hover:border-teal-400/50 ${selected.some((item) => item.card.id === card.id) ? "border-teal-400" : ""}`}><p className="text-xs font-bold uppercase tracking-[.16em] text-teal-400">{card.issuer}</p><h3 className="mt-3 font-bold text-ink">{card.name}</h3><p className="mt-2 text-xs leading-5 text-muted">{card.tagline}</p></button>)}</div></div></Container></section><QuizSection getMatches={recommendCards} onComplete={(nextProfile, nextMatches) => { setProfile(nextProfile); setMatches(nextMatches); }} /><ResultsSection matches={matches} profile={profile} /><ComparisonTable cards={(selected.length ? selected : matches).slice(0, 3).map((item) => item.card)} /><BentoWhyUs /><Testimonials /><Faq /><CtaBand /></main><Footer /></>; }
