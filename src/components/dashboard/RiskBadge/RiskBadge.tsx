import styles from "./RiskBadge.module.css";

export type RiskBadgeVariant = "critical" | "high" | "medium" | "low";

export function RiskBadge({
  label,
  variant,
}: {
  label: string;
  variant: RiskBadgeVariant;
}) {
  return <span className={`${styles.riskBadge} ${styles[variant]}`}>{label}</span>;
}
