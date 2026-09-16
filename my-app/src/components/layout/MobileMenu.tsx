"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SITE } from "@/src/lib/site";
import { ThemeToggle } from "./ThemeToggle";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);
  useEffect(() => { const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); }; window.addEventListener("keydown", close); return () => window.removeEventListener("keydown", close); }, []);
  return <>
    <button type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)} className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-1 text-ink md:hidden">{open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
    {open && <div className="fixed inset-0 z-50 bg-bg/95 p-6 backdrop-blur-xl md:hidden"><div className="flex items-center justify-between"><span className="font-bold text-ink">Journey<span className="text-teal-400">Card</span></span><div className="flex items-center gap-3"><ThemeToggle /><button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-ink"><X aria-hidden="true" /></button></div></div><nav aria-label="Mobile navigation" className="mt-20 grid gap-5">{SITE.nav.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="display-heading text-4xl text-ink">{item.label}</Link>)}</nav></div>}
  </>;
}
