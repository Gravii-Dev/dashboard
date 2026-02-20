import { ChainBadge } from "@/components/dashboard/ChainBadge";
import type { FlaggedChainRow } from "@/lib/risk-data";
import styles from "./RiskFlaggedChains.module.css";

export function RiskFlaggedChains({ rows }: { rows: FlaggedChainRow[] }) {
  return (
    <>
      {rows.map((row) => (
        <div key={row.chain} className={styles.chain}>
          <div className={styles.chainHeader}>
            <ChainBadge label={row.chain} variant={row.chainVariant} />
            <span className={styles.meta}>{row.pct}%</span>
          </div>
          <div className={styles.track}>
            <div
              className={styles.segment}
              style={{ width: `${row.pct}%`, background: row.color }}
            />
          </div>
        </div>
      ))}
    </>
  );
}
