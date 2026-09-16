"use client";

import type { ReactNode } from "react";

export type MarqueeProps = { children: ReactNode; className?: string };

export function Marquee({ children, className = "" }: MarqueeProps) {
  return <div className={`marquee-mask overflow-hidden ${className}`}><div className="marquee-track motion-safe:animate-marquee hover:[animation-play-state:paused]">{children}{children}</div></div>;
}
