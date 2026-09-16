"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ActionButton } from "@/src/components/ui/ActionButton";
import { Badge } from "@/src/components/ui/Badge";
import type { ScoredCard } from "@/src/lib/types";

type CompareTrayProps = {
  items: ScoredCard[];
};

export function CompareTray({ items }: CompareTrayProps) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="space-y-6">
      {items.map((item) => (
        <article
          key={item.card.id}
          className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-teal-400">
                {item.card.issuer}
              </p>
              <h3 className="mt-2 text-2xl font-bold text-white">{item.card.name}</h3>
              <p className="mt-2 max-w-xl text-sm text-slate-300">{item.card.tagline}</p>
            </div>

            <div className="flex flex-col items-start gap-2">
              <Badge tone="teal">{item.card.dataConfidence}</Badge>
              <span className="text-2xl font-black text-white">{item.score} pts</span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {item.card.tags.map((tag) => (
              <Badge key={tag} tone="slate">{tag}</Badge>
            ))}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold text-white">Why it fits</h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                {item.card.highlights.slice(0, 3).map((highlight) => (
                  <li key={highlight} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white">Watch-outs</h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-400">
                {item.card.watchOuts.slice(0, 2).map((warning) => (
                  <li key={warning} className="flex gap-2">
                    <span className="text-amber-300">•</span>
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-400">
              Estimated annual value: <span className="font-semibold text-white">₹{item.netAnnualValue.toLocaleString("en-IN")}</span>
            </div>

            <ActionButton variant="primary">
              Compare card
              <ArrowRight className="ml-2 inline h-4 w-4" />
            </ActionButton>
          </div>
        </article>
      ))}
    </div>
  );
}
