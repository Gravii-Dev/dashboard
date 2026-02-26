"use client";

import { SidebarOpenProvider } from "@/lib/SidebarOpenContext";
import MobileHeader from "@/components/MobileHeader/MobileHeader";
import Sidebar from "@/components/Sidebar/Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarOpenProvider>
      <MobileHeader />
      <Sidebar />
      <main className="main">{children}</main>
    </SidebarOpenProvider>
  );
}
