"use client";

import styles from "./SegTabs.module.css";

export type SegTabItem<T extends string> = { id: T; label: string };

export function SegTabs<T extends string>({
  tabs,
  activeId,
  onChange,
}: {
  tabs: SegTabItem<T>[];
  activeId: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className={styles.segTabs}>
      {tabs.map((tab) => (
        <span
          key={tab.id}
          role="button"
          tabIndex={0}
          className={`${styles.segTab} ${activeId === tab.id ? styles.active : ""}`}
          onClick={() => onChange(tab.id)}
          onKeyDown={(e) => e.key === "Enter" && onChange(tab.id)}
        >
          {tab.label}
        </span>
      ))}
    </div>
  );
}
