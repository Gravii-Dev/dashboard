import { type ReactNode } from "react";
import { Card, CardTitle } from "./Card";

export function KpiCard({
  title,
  value,
  titleAsHtml,
  valueClassName,
  valueStyle,
  cardClassName,
}: {
  title: string;
  value: ReactNode;
  titleAsHtml?: boolean;
  valueClassName?: string;
  valueStyle?: React.CSSProperties;
  cardClassName?: string;
}) {
  return (
    <Card className={cardClassName}>
      <CardTitle glow>
        {titleAsHtml ? <span dangerouslySetInnerHTML={{ __html: title }} /> : title}
      </CardTitle>
      <div className={`kpi-value glow ${valueClassName ?? ""}`.trim()} style={valueStyle}>
        {value}
      </div>
    </Card>
  );
}

export function KpiTagsCard({
  title,
  tags,
}: {
  title: string;
  tags: string[];
}) {
  return (
    <Card>
      <CardTitle glow>{title}</CardTitle>
      <div className="kpi-tags">
        {tags.map((tag, i) => (
          <span key={i} className="kpi-tag">
            {tag}
          </span>
        ))}
      </div>
    </Card>
  );
}
