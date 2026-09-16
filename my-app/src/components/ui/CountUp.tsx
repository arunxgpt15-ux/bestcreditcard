"use client";

import { useEffect, useState } from "react";

export type CountUpProps = { value: number; prefix?: string; suffix?: string };

export function CountUp({ value, prefix = "", suffix = "" }: CountUpProps) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const started = performance.now();
    const frame = (now: number) => {
      const progress = Math.min((now - started) / 700, 1);
      setDisplay(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) requestAnimationFrame(frame);
    };
    const id = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(id);
  }, [value]);
  return <span>{prefix}{display.toLocaleString("en-IN")}{suffix}</span>;
}
