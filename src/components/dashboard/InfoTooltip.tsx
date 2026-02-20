export function InfoTooltip({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <span className="info-icon">
      ⓘ
      <div className="info-tooltip">
        <strong>{title}</strong> — {body}
      </div>
    </span>
  );
}
