import styles from "./ChainBadge.module.css";

const VARIANTS = ["ethereum", "bsc", "base"] as const;
export type ChainBadgeVariant = (typeof VARIANTS)[number];

export function ChainBadge({
  label,
  variant,
}: {
  label: string;
  variant: ChainBadgeVariant;
}) {
  return <span className={`${styles.chainBadge} ${styles[variant]}`}>{label}</span>;
}
