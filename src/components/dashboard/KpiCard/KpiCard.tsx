import { type ReactNode } from "react";
import { Card, CardTitle } from "@/components/dashboard/Card";
import styles from "./KpiCard.module.css";

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
      <div className={`${styles.kpiValue} glow ${valueClassName ?? ""}`.trim()} style={valueStyle}>
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
      <div className={styles.kpiTags}>
        {tags.map((tag, i) => (
          <span key={i} className={styles.kpiTag}>
            {tag}
          </span>
        ))}
      </div>
    </Card>
  );
}
