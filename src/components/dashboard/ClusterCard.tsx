import { RiskBadge } from "./RiskBadge";
import type { RiskBadgeVariant } from "./RiskBadge";
import type { ClusterCardData } from "@/lib/risk-data";

const ACCENT_CLASS: Record<RiskBadgeVariant, string> = {
  critical: "critical-accent",
  high: "high-accent",
  medium: "medium-accent",
  low: "low-accent",
};

export function ClusterCard({ data }: { data: ClusterCardData }) {
  return (
    <div className={`cluster-card ${ACCENT_CLASS[data.riskVariant]}`}>
      <div className="cluster-card-header">
        <div>
          <span className="cluster-name">{data.name}</span>
          <RiskBadge label={data.riskLabel} variant={data.riskVariant} />
        </div>
        <div className="cluster-wallets">
          <span className="kpi-value glow" style={{ fontSize: 22 }}>{data.wallets}</span>
          <span className="bar-meta">wallets</span>
        </div>
      </div>
      <div className="cluster-card-body">
        {data.details.map((d, i) => (
          <div key={i} className="cluster-detail">{d}</div>
        ))}
        <div className="cluster-detail">
          Entropy: {(data.entropyPct / 100).toFixed(2)}{" "}
          <span className="entropy-bar">
            <span className="entropy-fill" style={{ width: `${data.entropyPct}%`, background: data.entropyColor }} />
          </span>
        </div>
      </div>
    </div>
  );
}
