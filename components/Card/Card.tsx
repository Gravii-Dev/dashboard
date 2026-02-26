interface CardProps {
  title: string | React.ReactNode;
  children: React.ReactNode;
  className?: string;
  infoTooltip?: React.ReactNode;
}

export default function Card({
  title,
  children,
  className = "",
  infoTooltip,
}: CardProps) {
  return (
    <div className={`card ${className}`}>
      <div className="card-title glow-sm">
        {title}
        {infoTooltip && (
          <span className="info-icon">
            ⓘ<div className="info-tooltip">{infoTooltip}</div>
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
