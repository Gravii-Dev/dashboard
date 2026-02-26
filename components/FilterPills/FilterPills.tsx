"use client";

import { type PillItem, toggleSetValue, cx } from "@/lib/utils";

interface FilterPillsProps {
  items: PillItem[];
  activeSet: Set<string>;
  onChange: (next: Set<string>) => void;
}

export default function FilterPills({ items, activeSet, onChange }: FilterPillsProps) {
  function handleClick(val: string) {
    onChange(toggleSetValue(activeSet, val));
  }

  return (
    <>
      {items.map((item) => (
        <span
          key={item.key}
          className={cx(
            "fpill",
            item.key === "all"
              ? activeSet.size === 0 && "active"
              : activeSet.has(item.key) && "active",
          )}
          onClick={() => handleClick(item.key)}
        >
          {item.label}
        </span>
      ))}
    </>
  );
}
