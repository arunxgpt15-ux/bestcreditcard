"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

export type AccordionItem = { question: string; answer: string };
export type AccordionProps = { items: AccordionItem[] };

export function Accordion({ items }: AccordionProps) {
  const [open, setOpen] = useState<number | null>(null);
  return <div className="divide-y divide-border border-y border-border">{items.map((item, index) => <div key={item.question}>
    <button type="button" aria-expanded={open === index} onClick={() => setOpen(open === index ? null : index)} className="focus-ring flex w-full items-center justify-between gap-4 py-5 text-left text-base font-semibold text-ink">
      {item.question}<ChevronDown aria-hidden="true" className={`h-5 w-5 shrink-0 text-teal-400 transition-transform ${open === index ? "rotate-180" : ""}`} />
    </button>
    <div className={`grid transition-[grid-template-rows,opacity] duration-300 ${open === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}><div className="overflow-hidden"><p className="pb-5 pr-8 text-sm leading-7 text-muted">{item.answer}</p></div></div>
  </div>)}</div>;
}
