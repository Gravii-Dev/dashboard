import { InfoTooltip } from "./InfoTooltip";

export type DonutSegment = {
  color: string;
  dashArray: string;
  dashOffset: string;
};

export type DonutLegendItem = {
  color: string;
  label: string;
  value: string;
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
  const circumference = 301.6;
  return (
    <div className="card">
      <div className="card-title glow-sm">
        {title}
        {tooltip && <InfoTooltip title={tooltip.title} body={tooltip.body} />}
      </div>
      <div className="donut-wrapper">
        <div className="donut-container">
          <svg
            className="donut-svg"
            width="120"
            height="120"
            viewBox="0 0 120 120"
          >
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="14"
            />
            {segments.map((seg, i) => (
              <circle
                key={i}
                className="donut-segment"
                cx="60"
                cy="60"
                r="48"
                fill="none"
                stroke={seg.color}
                strokeWidth="14"
                strokeDasharray={seg.dashArray}
                strokeDashoffset={seg.dashOffset}
                style={{ ["--circumference" as string]: circumference }}
              />
            ))}
          </svg>
          <div className="donut-center">
            <div className="donut-center-label">{centerLabel}</div>
            <div className="donut-center-value glow-sm">{centerValue}</div>
          </div>
        </div>
        <div className="donut-legend">
          {legend.map((item, i) => (
            <div key={i} className="legend-item">
              <span
                className="legend-dot"
                style={{ background: item.color }}
              />
              {item.label}
              <span className="legend-value">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
