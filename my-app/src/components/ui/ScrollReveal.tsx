"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { fadeUp } from "@/src/lib/motion";

export type ScrollRevealProps = { children: ReactNode; className?: string; delay?: number };

export function ScrollReveal({ children, className = "", delay = 0 }: ScrollRevealProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={reduced ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.2 } } } : fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay }}
    >{children}</motion.div>
  );
}
