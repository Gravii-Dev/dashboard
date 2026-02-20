"use client";

import { useState } from "react";
import { MobileTopBar } from "@/components/dashboard/MobileTopBar";
import { Sidebar } from "@/components/dashboard/Sidebar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <MobileTopBar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="main">{children}</main>
    </>
  );
}
