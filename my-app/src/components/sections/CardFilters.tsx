"use client";

import { useQueryState } from "nuqs";
import { useEffect, useMemo } from "react";
import type { CardTag, CreditCard } from "@/src/lib/types";

const filters: { label: string; tag: CardTag }[] = [{ label: "Lounge access", tag: "lounge" }, { label: "Zero forex", tag: "forex" }, { label: "Lifetime free", tag: "lifetime-free" }, { label: "Fuel", tag: "fuel" }, { label: "Premium", tag: "premium" }];
export type CardFiltersProps = { cards: CreditCard[]; onChange: (cards: CreditCard[]) => void };

export function CardFilters({ cards, onChange }: CardFiltersProps) {
  const [filter, setFilter] = useQueryState("filter", { defaultValue: "all" });
  const [sort, setSort] = useQueryState("sort", { defaultValue: "fee" });
  const visible = useMemo(() => { const filtered = filter === "all" ? cards : cards.filter((card) => card.tags.includes(filter as CardTag)); return [...filtered].sort((a, b) => sort === "reward" ? (b.rewards[0]?.valueBackPct ?? -1) - (a.rewards[0]?.valueBackPct ?? -1) : (a.annualFee ?? Number.MAX_SAFE_INTEGER) - (b.annualFee ?? Number.MAX_SAFE_INTEGER)); }, [cards, filter, sort]);
  useEffect(() => onChange(visible), [onChange, visible]);
  return <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div className="flex flex-wrap gap-2"><button type="button" onClick={() => setFilter("all")} className={`focus-ring rounded-full border px-3 py-2 text-xs font-bold ${filter === "all" ? "border-teal-400 bg-teal-400/10 text-teal-400" : "border-border text-muted"}`}>All cards</button>{filters.map((item) => <button key={item.tag} type="button" onClick={() => setFilter(item.tag)} className={`focus-ring rounded-full border px-3 py-2 text-xs font-bold ${filter === item.tag ? "border-teal-400 bg-teal-400/10 text-teal-400" : "border-border text-muted"}`}>{item.label}</button>)}</div><select aria-label="Sort cards" value={sort} onChange={(event) => setSort(event.target.value)} className="focus-ring min-h-10 rounded-lg border border-border bg-surface-1 px-3 text-sm text-ink"><option value="fee">Sort by annual fee</option><option value="reward">Sort by reward rate</option></select></div>;
}
