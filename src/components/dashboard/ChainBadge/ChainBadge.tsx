import styles from "./ChainBadge.module.css";

export type ChainBadgeVariant = "ethereum" | "bsc" | "base";

export function ChainBadge({
  label,
  variant,
}: {
  label: string;
  variant: ChainBadgeVariant;
}) {
  return <span className={`${styles.chainBadge} ${styles[variant]}`}>{label}</span>;
}
