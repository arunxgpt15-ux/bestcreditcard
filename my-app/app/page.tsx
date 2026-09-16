"use client";

import { useState } from "react";
import { ArrowRight, Check, Gem, GitCompareArrows, Sparkles } from "lucide-react";
import { CompareTray } from "@/src/components/compare/CompareTray";
import { Quiz } from "@/src/components/quiz/Quiz";
import { AuthProvider } from "@/src/contexts/AuthContext";
import { CARD_DB } from "@/src/lib/cards";
import { recommendCards } from "@/src/lib/recommend";
import type { Profile, ScoredCard } from "@/src/lib/types";

const featuredCards = CARD_DB.slice(0, 3);

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

export default function Home() {
  const [matches, setMatches] = useState<ScoredCard[]>([]);

  const handleComplete = (profile: Profile) => {
    setMatches(recommendCards(profile));
  };

  return (
    <AuthProvider>
      <main className="relative isolate min-h-screen overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(13,148,136,0.22),transparent_30%),radial-gradient(circle_at_85%_80%,rgba(245,158,11,0.12),transparent_28%)]" />
        <div className="absolute left-1/4 top-0 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-teal-500/10 blur-[120px]" />
        <div className="absolute right-0 top-1/3 -z-10 h-[420px] w-[420px] translate-x-1/4 rounded-full bg-amber-500/10 blur-[120px]" />

        <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
          <p className="text-lg font-bold tracking-tight text-white">
            BestCreditCard<span className="text-teal-400">.dev</span>
          </p>
          <p className="hidden text-sm font-medium text-slate-400 sm:block">Smart travel, better rewards</p>
        </header>

        <section className="mx-auto grid min-h-[calc(100vh-88px)] w-full max-w-7xl items-center gap-14 px-6 pb-16 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pb-24">
          <div className="max-w-2xl">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-sm font-semibold text-teal-300">
              <span className="h-2 w-2 rounded-full bg-teal-300" /> Built for your next departure
            </p>
            <h1 className="text-5xl font-black leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Find the Perfect <span className="bg-gradient-to-r from-teal-300 to-amber-200 bg-clip-text text-transparent">Credit Card</span> for Your Next Journey
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

          <div className="relative mx-auto w-full max-w-md [perspective:1000px] lg:mr-8">
            <div className="absolute -inset-5 rounded-[2rem] border border-teal-300/10 bg-teal-300/5 blur-2xl" />
            <div className="relative transform-gpu overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-950 p-7 shadow-2xl shadow-black/40 [transform:rotateY(-10deg)_rotateX(5deg)] transition-all duration-700 hover:scale-105 hover:[transform:rotateY(0deg)_rotateX(0deg)_scale(1.05)]">
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
                  key={card.id}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl transition-all duration-500 hover:-translate-y-3 hover:border-teal-400/50 hover:bg-white/[0.04] hover:shadow-[0_20px_40px_rgba(45,212,191,0.1)]"
                >
                  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl transition-transform duration-700 group-hover:scale-150" />
                  <div className={`relative min-h-48 overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br ${card.gradient} p-5`}>
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
                        <p className="mt-5 text-sm font-medium tracking-[0.18em] text-white/70">•••• 4821</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-b border-white/10 pb-5">
                    <span className="text-sm text-slate-400">Annual fee</span>
                    <span className="font-semibold text-white">{card.annualFee ? `?${card.annualFee.toLocaleString("en-IN")}/year` : "Fee not confirmed"}</span>
                  </div>

                  <ul className="mt-5 space-y-3">
                    {card.highlights.slice(0, 2).map((perk) => (
                      <li key={perk} className="flex items-center gap-3 text-sm text-slate-300">
                        <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-teal-400" />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    aria-label={`Apply now for ${card.name}`}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-400 px-4 py-3 text-sm font-semibold text-slate-950 transition duration-300 hover:bg-teal-300 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-slate-950"
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
          <Quiz onComplete={handleComplete} />
        </section>

        {matches.length > 0 && (
          <section className="relative overflow-hidden bg-slate-950 px-6 py-24 sm:px-10 lg:px-16">
            <div className="mx-auto max-w-6xl">
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-400">MATCHED RESULTS</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Best card matches for you</h2>
              </div>
              <CompareTray items={matches} />
            </div>
          </section>
        )}

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
                  <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817-5.963 6.817H1.684l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
                  </svg>
                </button>
                <button type="button" aria-label="JourneyCard on Instagram" className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:border-teal-400/40 hover:bg-teal-400/10 hover:text-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-400">
                  <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
                  </svg>
                </button>
                <button type="button" aria-label="JourneyCard on LinkedIn" className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:border-teal-400/40 hover:bg-teal-400/10 hover:text-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-400">
                  <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5.164 3.5a2.164 2.164 0 1 1 0 4.328 2.164 2.164 0 0 1 0-4.328ZM3.25 9.5h3.828V21H3.25V9.5Zm6.25 0h3.672v1.57h.052c.511-.969 1.76-1.99 3.624-1.99 3.875 0 4.592 2.55 4.592 5.865V21h-3.828v-5.37c0-1.28-.024-2.927-1.784-2.927-1.787 0-2.061 1.395-2.061 2.835V21H9.5V9.5Z" />
                  </svg>
                </button>
              </div>
            </div>

            <nav aria-label="Explore navigation">
              <h2 className="text-sm font-semibold text-white">Explore</h2>
              <ul className="mt-4 space-y-3">
                {['Compare Cards', 'Travel Rewards', 'Lounge Access', 'Zero Forex Cards'].map((label) => (
                  <li key={label}><a href="#" className="text-sm text-slate-400 transition hover:text-teal-300 focus:outline-none focus:text-teal-300">{label}</a></li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Resources navigation">
              <h2 className="text-sm font-semibold text-white">Resources</h2>
              <ul className="mt-4 space-y-3">
                {['Card Guides', 'Miles Calculator', 'Credit Score Guide', 'FAQs'].map((label) => (
                  <li key={label}><a href="#" className="text-sm text-slate-400 transition hover:text-teal-300 focus:outline-none focus:text-teal-300">{label}</a></li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Company navigation">
              <h2 className="text-sm font-semibold text-white">Company</h2>
              <ul className="mt-4 space-y-3">
                {['About Us', 'Contact', 'Privacy Policy', 'Terms of Use'].map((label) => (
                  <li key={label}><a href="#" className="text-sm text-slate-400 transition hover:text-teal-300 focus:outline-none focus:text-teal-300">{label}</a></li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 JourneyCard. All rights reserved.</p>
            <p>For educational purposes only. Card terms and benefits <span className="text-amber-300/80">may change</span>.</p>
          </div>
        </div>
      </footer>
    </AuthProvider>
  );
}
