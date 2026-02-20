const VARIANTS = ["critical", "high", "medium", "low"] as const;
export type RiskBadgeVariant = (typeof VARIANTS)[number];

export function RiskBadge({
  label,
  variant,
}: {
  label: string;
  variant: RiskBadgeVariant;
}) {
  return <span className={`risk-badge ${variant}`}>{label}</span>;
}
