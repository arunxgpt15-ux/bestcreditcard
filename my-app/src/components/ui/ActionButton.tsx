import type { ReactNode } from "react";

type ActionButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
};

export function ActionButton({
  children,
  variant = "primary",
  disabled = false,
  className = "",
  type = "button",
  onClick,
}: ActionButtonProps) {
  const base =
    "rounded-xl px-5 py-3 text-sm font-semibold transition duration-300 active:scale-[0.98] focus:outline-none focus:ring-2";

  const variants = {
    primary:
      "bg-teal-400 text-slate-950 hover:bg-teal-300 focus:ring-teal-300 disabled:cursor-not-allowed disabled:opacity-40",
    secondary:
      "border border-white/15 bg-white/[0.03] text-white hover:border-amber-300/40 hover:bg-amber-300/10 focus:ring-amber-300 disabled:cursor-not-allowed disabled:opacity-40",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
