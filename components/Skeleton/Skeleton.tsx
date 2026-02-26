import s from "./Skeleton.module.css";

export function SkeletonCard({ tall }: { tall?: boolean }) {
  return <div className={tall ? s.cardTall : s.card} />;
}

export function SkeletonGrid({
  count = 4,
  columns = 4,
  tall,
}: {
  count?: number;
  columns?: 2 | 4;
  tall?: boolean;
}) {
  return (
    <div className={columns === 2 ? s.grid2 : s.grid4}>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} tall={tall} />
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className={s.tableRow}>
          <div className={s.tableCell} />
          <div className={s.tableCell} style={{ flex: 0.6 }} />
          <div className={s.tableCell} style={{ flex: 0.5 }} />
          <div className={s.tableCell} style={{ flex: 0.4 }} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonLine({ width }: { width?: string }) {
  return <div className={s.line} style={width ? { width } : undefined} />;
}
