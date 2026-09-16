import Link from "next/link";
import type { ReactNode } from "react";

export type ButtonProps = { children: ReactNode; href?: string; variant?: "primary" | "ghost"; className?: string; onClick?: () => void; type?: "button" | "submit" };

const styles = {
  primary: "bg-teal-400 text-slate-950 hover:bg-teal-300 shadow-glow",
  ghost: "border border-border-strong bg-surface-1 text-ink hover:border-teal-300/60 hover:bg-surface-2",
};

export function Button({ children, href, variant = "primary", className = "", onClick, type = "button" }: ButtonProps) {
  const classes = `focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold transition duration-300 active:scale-[.98] ${styles[variant]} ${className}`;
  if (href) return <Link href={href} className={classes}>{children}</Link>;
  return <button type={type} onClick={onClick} className={classes}>{children}</button>;
}
