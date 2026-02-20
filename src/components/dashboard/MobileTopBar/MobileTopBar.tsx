"use client";

import Link from "next/link";
import { useHeaderVisible } from "@/hooks/useHeaderVisible";
import { cn } from "@/lib/utils";
import styles from "./MobileTopBar.module.css";

export function MobileTopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const isVisible = useHeaderVisible();

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className={cn(styles.bar, !isVisible && styles.hidden)}>
      <button
        type="button"
        className={styles.menuBtn}
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      <Link href="/" className={cn(styles.logo, "glow")} onClick={scrollToTop}>
        Gravii
      </Link>
    </header>
  );
}
