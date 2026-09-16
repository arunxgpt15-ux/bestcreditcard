import type { LucideIcon } from "lucide-react";

type OptionButtonProps = {
  value: string;
  label: string;
  selected: boolean;
  onSelect: (value: string) => void;
  icon?: LucideIcon;
};

export function OptionButton({
  value,
  label,
  selected,
  onSelect,
  icon: Icon,
}: OptionButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(value)}
      className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all duration-300 ${
        selected
          ? "border-teal-400/70 bg-teal-400/15 text-white shadow-lg shadow-teal-400/10"
          : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-teal-400/40 hover:bg-teal-400/10"
      }`}
    >
      {Icon && <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-teal-400" />}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
