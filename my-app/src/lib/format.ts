export function formatINR(value: number | null): string {
  if (value === null) return "Fee not confirmed";
  if (value === 0) return "Lifetime Free";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatFee(value: number | null): string {
  const formatted = formatINR(value);
  return formatted === "Lifetime Free" ? formatted : `${formatted}/year`;
}
