import { type CSSProperties, type ReactNode } from "react";

export function Card({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={className ? `card ${className}` : "card"} style={style}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  glow = false,
  style,
}: {
  children: ReactNode;
  glow?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div className={`card-title ${glow ? "glow-sm" : ""}`} style={style}>
      {children}
    </div>
  );
}
