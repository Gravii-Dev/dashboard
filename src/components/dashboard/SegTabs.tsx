"use client";

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
    <div className="seg-tabs">
      {tabs.map((tab) => (
        <span
          key={tab.id}
          role="button"
          tabIndex={0}
          className={`seg-tab ${activeId === tab.id ? "active" : ""}`}
          onClick={() => onChange(tab.id)}
          onKeyDown={(e) => e.key === "Enter" && onChange(tab.id)}
        >
          {tab.label}
        </span>
      ))}
    </div>
  );
}
