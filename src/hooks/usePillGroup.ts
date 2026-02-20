"use client";

import { useState, useCallback } from "react";

export function usePillGroup<T extends string>(allValue: T) {
  const [selected, setSelected] = useState<Set<T>>(new Set());

  const isActive = useCallback(
    (value: T) => (value === allValue ? selected.size === 0 : selected.has(value)),
    [allValue, selected]
  );

  const toggle = useCallback(
    (value: T) => {
      setSelected((prev) => {
        if (value === allValue) return new Set();
        const next = new Set(prev);
        if (next.has(value)) next.delete(value);
        else next.add(value);
        return next;
      });
    },
    [allValue]
  );

  return { selected, isActive, toggle };
}
