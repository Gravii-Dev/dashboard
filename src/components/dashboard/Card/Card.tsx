import { type CSSProperties, type ReactNode } from "react";
import styles from "./Card.module.css";

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
    <div className={`${styles.card} ${className || ""}`} style={style}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  glow = false,
  style,
  className,
}: {
  children: ReactNode;
  glow?: boolean;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <div className={`${styles.cardTitle} ${glow ? "glow-sm" : ""} ${className || ""}`} style={style}>
      {children}
    </div>
  );
}
