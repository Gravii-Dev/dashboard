import { cx } from "@/lib/utils";

interface SummaryItem {
  title: string;
  value: string;
}

interface SummaryGridProps {
  items: SummaryItem[];
  hasFilter?: boolean;
  cardStyle?: React.CSSProperties;
  className?: string;
}

export default function SummaryGrid({ items, hasFilter, cardStyle, className }: SummaryGridProps) {
  return (
    <div className={className ?? cx("summary-grid", hasFilter && "has-filter")}>
      {items.map((item, i) => (
        <div key={i} className="card" style={cardStyle}>
          <div className="card-title glow-sm">{item.title}</div>
          <div className="kpi-value glow" style={{ fontSize: "28px" }}>
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}
