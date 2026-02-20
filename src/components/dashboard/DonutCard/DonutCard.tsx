import { InfoTooltip } from "@/components/dashboard/InfoTooltip";
import { Card, CardTitle } from "@/components/dashboard/Card";
import styles from "./DonutCard.module.css";

export type DonutSegment = {
  color: string;
  value: number; // Percentage (0-100)
};

export type DonutLegendItem = {
  color: string;
  label: string;
  value: string; // Display string (e.g. "50%")
};

export function DonutCard({
  title,
  centerLabel,
  centerValue,
  segments,
  legend,
  tooltip,
}: {
  title: string;
  centerLabel: string;
  centerValue: string;
  segments: DonutSegment[];
  legend: DonutLegendItem[];
  tooltip?: { title: string; body: string };
}) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius; // ≈ 301.59

  return (
    <Card>
      <CardTitle glow>
        {title}
        {tooltip && <InfoTooltip title={tooltip.title} body={tooltip.body} />}
      </CardTitle>
      
      <div className={styles.donutWrapper}>
        <div className={styles.donutContainer}>
          <svg
            className={styles.donutSvg}
            width="120"
            height="120"
            viewBox="0 0 120 120"
          >
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="14"
            />
            {segments.map((seg, i) => {
              const offsetPct = segments.slice(0, i).reduce((s, x) => s + x.value, 0);
              const dashArray = `${(seg.value / 100) * circumference} ${circumference}`;
              const dashOffset = -(offsetPct / 100) * circumference;

              return (
                <circle
                  key={i}
                  className={styles.donutSegment}
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="14"
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                  style={{ ["--circumference" as string]: circumference }}
                />
              );
            })}
          </svg>
          <div className={styles.donutCenter}>
            <div className={styles.donutCenterLabel}>{centerLabel}</div>
            <div className={styles.donutCenterValue}>{centerValue}</div>
          </div>
        </div>
        
        <div className={styles.donutLegend}>
          {legend.map((item, i) => (
            <div key={i} className={styles.legendItem}>
              <span
                className={styles.legendDot}
                style={{ background: item.color }}
              />
              {item.label}
              <span className={styles.legendValue}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
