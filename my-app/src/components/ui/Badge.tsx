type BadgeProps = {
  children: string;
  tone?: "teal" | "amber" | "slate";
};

export function Badge({ children, tone = "teal" }: BadgeProps) {
  const tones = {
    teal: "border border-teal-400/20 bg-teal-400/10 text-teal-200",
    amber: "border border-amber-300/20 bg-amber-300/10 text-amber-200",
    slate: "border border-white/10 bg-white/[0.03] text-slate-300",
  };

  return (
    <span className={`rounded-full px-3 py-1.5 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}
