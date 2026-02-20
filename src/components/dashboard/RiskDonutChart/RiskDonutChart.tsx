import styles from "./RiskDonutChart.module.css";

export type DonutSegment = {
  color: string;
  count: number;
  label: string;
  pct: number;
};

type Props = {
  centerValue: string;
  centerLabel: string;
  segments: DonutSegment[];
};

function strokeDashArray(circumference: number, pct: number) {
  const value = (circumference * pct) / 100;
  return `${value} ${circumference - value}`;
}

function strokeDashOffset(circumference: number, offsetPct: number) {
  return -((circumference * offsetPct) / 100);
}

export function RiskDonutChart({ centerValue, centerLabel, segments }: Props) {
  const size = 140;
  const r = 56;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className={styles.wrapper}>
      <div className={styles.container} style={{ width: size, height: size }}>
        <svg className={styles.svg} width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth={16}
          />
          {segments.map((seg, i) => {
            const dashArray = strokeDashArray(circumference, seg.pct);
            const dashOffset = strokeDashOffset(circumference, offset);
            offset += seg.pct;
            return (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth={16}
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            );
          })}
        </svg>
        <div className={styles.center}>
          <div className={`${styles.centerValue} glow-sm`}>{centerValue}</div>
          <div className={styles.centerLabel}>{centerLabel}</div>
        </div>
      </div>
      <div className={styles.legend}>
        {segments.map((seg, i) => (
          <div key={i} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: seg.color }} />
            {seg.label}
            <span className={styles.legendValue}>{seg.count} · {seg.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
