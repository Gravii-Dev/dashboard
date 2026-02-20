import { ChainBadge, type ChainBadgeVariant } from "./ChainBadge";

export type BarSegment = {
  widthPct: number;
  color: string;
  label: string;
};

export type BarSectionData = {
  chain: string;
  chainVariant: ChainBadgeVariant;
  meta: string;
  segments: BarSegment[];
};

export function BarSection({ data }: { data: BarSectionData }) {
  return (
    <div className="bar-section">
      <div className="bar-header">
        <ChainBadge label={data.chain} variant={data.chainVariant} />
        <span className="bar-meta">{data.meta}</span>
      </div>
      <div className="bar-track">
        {data.segments.map((seg, i) => (
          <div
            key={i}
            className="bar-segment"
            style={{ width: `${seg.widthPct}%`, background: seg.color }}
          >
            <span className="bar-segment-label">{seg.label}</span>
          </div>
        ))}
      </div>
      <div className="bar-legend">
        {data.segments.map((seg, i) => (
          <span key={i} className="bar-legend-item">
            <span
              className="bar-legend-dot"
              style={{ background: seg.color }}
            />
            {seg.label} {seg.widthPct}%
          </span>
        ))}
      </div>
    </div>
  );
}

export function ValueByChainCard({
  title,
  sections,
}: {
  title: string;
  sections: BarSectionData[];
}) {
  return (
    <div className="card">
      <div className="card-title glow-sm">{title}</div>
      {sections.map((section) => (
        <BarSection key={section.chain} data={section} />
      ))}
    </div>
  );
}
