"use client";

import { cx } from "@/lib/utils";

interface Tab {
  key: string;
  label: string;
}

interface SegTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
  style?: React.CSSProperties;
}

export default function SegTabs({ tabs, activeTab, onTabChange, style }: SegTabsProps) {
  return (
    <div className="seg-tabs" style={style}>
      {tabs.map((tab) => (
        <span
          key={tab.key}
          className={cx("seg-tab", activeTab === tab.key && "active")}
          onClick={() => onTabChange(tab.key)}
        >
          {tab.label}
        </span>
      ))}
    </div>
  );
}
