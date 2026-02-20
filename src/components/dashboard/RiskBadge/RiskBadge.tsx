import styles from "./RiskBadge.module.css";

const VARIANTS = ["critical", "high", "medium", "low"] as const;
export type RiskBadgeVariant = (typeof VARIANTS)[number];

export function RiskBadge({
  label,
  variant,
}: {
  label: string;
  variant: RiskBadgeVariant;
}) {
  return <span className={`${styles.riskBadge} ${styles[variant]}`}>{label}</span>;
}
