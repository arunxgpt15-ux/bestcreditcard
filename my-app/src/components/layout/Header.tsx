"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { SITE } from "@/src/lib/site";
import { Container } from "./Container";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => { const onScroll = () => { const max = document.documentElement.scrollHeight - window.innerHeight; setScrolled(window.scrollY > 24); setProgress(max > 0 ? window.scrollY / max : 0); }; onScroll(); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll); }, []);
  return <header className={`site-header ${scrolled ? "site-header-scrolled" : ""}`}><div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} /><Container className="flex h-20 items-center justify-between gap-8"><Link href="/" className="focus-ring flex items-center gap-2 text-lg font-black tracking-tight text-ink"><span className="brand-mark">J</span><span>Journey<span className="text-teal-400">Card</span></span></Link><nav aria-label="Primary navigation" className="hidden items-center gap-7 md:flex">{SITE.nav.map((item) => <Link key={item.href} href={item.href} className="focus-ring text-sm font-semibold text-muted transition hover:text-ink">{item.label}</Link>)}</nav><div className="flex items-center gap-3"><div className="hidden md:block"><ThemeToggle /></div><Link href="#card-match" className="focus-ring hidden min-h-10 items-center gap-2 rounded-lg bg-teal-400 px-4 text-xs font-bold text-slate-950 transition hover:bg-teal-300 sm:inline-flex">Find my card<ArrowUpRight aria-hidden="true" className="h-4 w-4" /></Link><MobileMenu /></div></Container></header>;
}
