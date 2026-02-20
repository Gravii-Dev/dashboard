import Link from "next/link";
import { type ReactNode } from "react";

export function PageHeader({
  title,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <div className="main-header">
      <h1 className="main-title glow">{title}</h1>
      {ctaLabel && ctaHref && (
        <Link href={ctaHref} className="header-cta">
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}

export function PageHeaderPlain({ title }: { title: string }) {
  return (
    <div className="main-header">
      <h1 className="main-title glow">{title}</h1>
    </div>
  );
}
