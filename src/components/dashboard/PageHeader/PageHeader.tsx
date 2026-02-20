import Link from "next/link";
import styles from "./PageHeader.module.css";

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
    <div className={styles.mainHeader}>
      <h1 className={`${styles.mainTitle} glow`}>{title}</h1>
      {ctaLabel && ctaHref && (
        <Link href={ctaHref} className={styles.headerCta}>
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}

export function PageHeaderPlain({ title }: { title: string }) {
  return (
    <div className={styles.mainHeader}>
      <h1 className={`${styles.mainTitle} glow`}>{title}</h1>
    </div>
  );
}
