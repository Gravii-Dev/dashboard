"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.css";

const navItems = [
  { 
    href: "/", 
    label: "Overview", 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    )
  },
  { 
    href: "/analytics", 
    label: "User analytics", 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    )
  },
  { 
    href: "/labels", 
    label: "User Segments", 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
  },
  { 
    href: "/risk", 
    label: "Risk & Sybil", 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    )
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarLogo}>
        <span className="glow">Gravii</span>
      </div>

      <nav className={styles.sidebarNav}>
        {navItems.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className={`${styles.navItem} ${pathname === href ? styles.active : ""}`}
            aria-label={label}
          >
            <span className={styles.icon}>{icon}</span>
            {label}
          </Link>
        ))}
        <div className={styles.navDivider} />
        <Link href="/campaigns" className={styles.navCta} aria-label="Create your campaigns">
          <span className={styles.icon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </span>
          Create your campaigns
        </Link>
      </nav>

      <div className={styles.sidebarBot}>
        <div className={styles.botLabel}>Gravii Assistant</div>
        <div className={styles.botBox}>
          <div className={styles.botPlaceholder}>
            e.g. I want to increase TVL. Give me some campaign ideas
          </div>
        </div>
      </div>

      <div className={styles.sidebarProject}>Project name</div>
    </aside>
  );
}
