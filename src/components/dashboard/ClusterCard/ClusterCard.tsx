import { RiskBadge, type RiskBadgeVariant } from "@/components/dashboard/RiskBadge";
import type { ClusterCardData } from "@/lib/risk-data";
import styles from "./ClusterCard.module.css";

const ACCENT_CLASS: Record<RiskBadgeVariant, string> = {
  critical: styles.criticalAccent,
  high: styles.highAccent,
  medium: styles.mediumAccent,
  low: styles.lowAccent,
};

export function ClusterCard({ data }: { data: ClusterCardData }) {
  return (
    <div className={`${styles.clusterCard} ${ACCENT_CLASS[data.riskVariant]}`}>
      <div className={styles.clusterCardHeader}>
        <div>
          <span className={styles.clusterName}>{data.name}</span>
          <RiskBadge label={data.riskLabel} variant={data.riskVariant} />
        </div>
        <div className={styles.clusterWallets}>
          <span className="kpi-value glow" style={{ fontSize: 22 }}>{data.wallets}</span>
          <span className="bar-meta">wallets</span>
        </div>
      </div>
      <div className={styles.clusterCardBody}>
        {data.details.map((d, i) => (
          <div key={i} className={styles.clusterDetail}>{d}</div>
        ))}
        <div className={styles.clusterDetail}>
          Entropy: {(data.entropyPct / 100).toFixed(2)}{" "}
          <span className="entropy-bar">
            <span className="entropy-fill" style={{ width: `${data.entropyPct}%`, background: data.entropyColor }} />
          </span>
        </div>
      </div>
    </div>
  );
}
