import s from "./DonutChart.module.css";

interface DonutSegment {
  colorVar: string;
  percentage: number;
  label: string;
  legendValue?: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  totalLabel?: string;
  totalValue?: React.ReactNode;
  size?: number;
  radius?: number;
  strokeWidth?: number;
  legendStyle?: React.CSSProperties;
}

export default function DonutChart({
  segments,
  totalLabel = "Total",
  totalValue,
  size = 120,
  radius = 48,
  strokeWidth = 14,
  legendStyle,
}: DonutChartProps) {
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  return (
    <div className={s.wrapper}>
      <div className={s.container} style={{ width: size, height: size }}>
        <svg className={s.svg} width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth={strokeWidth}
          />
          {segments.map((seg, idx, arr) => {
            const dashArrayLength = (seg.percentage / 100) * circumference;
            const previousLengths = arr
              .slice(0, idx)
              .reduce((sum, prev) => sum + (prev.percentage / 100) * circumference, 0);

            return (
              <circle
                key={idx}
                className={s.segment}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={`var(${seg.colorVar})`}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dashArrayLength} ${circumference}`}
                strokeDashoffset={-previousLengths}
                style={{ "--circumference": circumference } as React.CSSProperties}
              />
            );
          })}
        </svg>
        <div className={s.center}>
          <div className={s.centerLabel}>{totalLabel}</div>
          <div className={`${s.centerValue} glow-sm`}>{totalValue}</div>
        </div>
      </div>
      <div className={s.legend} style={legendStyle}>
        {segments.map((seg, idx) => (
          <div className={s.legendItem} key={idx}>
            <span className={s.legendDot} style={{ background: `var(${seg.colorVar})` }} />
            {seg.label}
            <span className={s.legendValue}>{seg.legendValue ?? `${seg.percentage}%`}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
