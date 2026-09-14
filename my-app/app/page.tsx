export default function Home() {
  return (
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
    </main>
  );
}