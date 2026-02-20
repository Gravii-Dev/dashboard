import { ChainBadge, type ChainBadgeVariant } from "@/components/dashboard/ChainBadge";
import { Card, CardTitle } from "@/components/dashboard/Card";
import styles from "./BarSection.module.css";

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
    <div className={styles.barSection}>
      <div className={styles.barHeader}>
        <ChainBadge label={data.chain} variant={data.chainVariant} />
        <span className={styles.barMeta}>{data.meta}</span>
      </div>
      <div className={styles.barTrack}>
        {data.segments.map((seg, i) => (
          <div
            key={i}
            className={styles.barSegment}
            style={{ width: `${seg.widthPct}%`, background: seg.color }}
          >
            <span className={styles.barSegmentLabel}>{seg.label}</span>
          </div>
        ))}
      </div>
      <div className={styles.barLegend}>
        {data.segments.map((seg, i) => (
          <span key={i} className={styles.barLegendItem}>
            <span
              className={styles.barLegendDot}
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
    <Card>
      <CardTitle glow>{title}</CardTitle>
      {sections.map((section) => (
        <BarSection key={section.chain} data={section} />
      ))}
    </Card>
  );
}
