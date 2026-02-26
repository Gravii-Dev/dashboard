"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type SidebarOpenContextValue = {
  open: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
};

const SidebarOpenContext = createContext<SidebarOpenContextValue | null>(null);

export function SidebarOpenProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openSidebar = useCallback(() => setOpen(true), []);
  const closeSidebar = useCallback(() => setOpen(false), []);

  return (
    <SidebarOpenContext.Provider value={{ open, openSidebar, closeSidebar }}>
      {children}
    </SidebarOpenContext.Provider>
  );
}

export function useSidebarOpen() {
  const ctx = useContext(SidebarOpenContext);
  if (!ctx) throw new Error("useSidebarOpen must be used within SidebarOpenProvider");
  return ctx;
}
