"use client";

import { useCallback, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BotWidget from "@/components/BotWidget/BotWidget";
import { cx } from "@/lib/utils";
import { useSidebarOpen } from "@/lib/SidebarOpenContext";
import s from "./Sidebar.module.css";

export default function Sidebar() {
  const pathname = usePathname();
  const { open, closeSidebar } = useSidebarOpen();

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  const close = useCallback(() => closeSidebar(), [closeSidebar]);

  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <>
      {open && (
        <div
          className={s.overlay}
          style={{ display: "block" }}
          onClick={close}
          aria-hidden="true"
        />
      )}

      <aside className={cx(s.sidebar, open && s.sidebarOpen)}>
        <div className={s.sidebarTop}>
          <div className={s.logo}>
            <span className="glow">Gravii</span>
          </div>
          <button className={s.closeBtn} onClick={close} aria-label="Close menu">✕</button>
        </div>

        <nav className={s.nav}>
          <Link href="/" className={cx(s.navItem, isActive("/") && "active")}>
            <span className={s.icon}>⊞</span> Overview
          </Link>
          <Link href="/analytics" className={cx(s.navItem, isActive("/analytics") && "active")}>
            <span className={s.icon}>◎</span> User analytics
          </Link>
          <Link href="/labels" className={cx(s.navItem, isActive("/labels") && "active")}>
            <span className={s.icon}>◈</span> User Segments
          </Link>
          <Link href="/risk" className={cx(s.navItem, isActive("/risk") && "active")}>
            <span className={s.icon}>⚠</span> Risk & Sybil
          </Link>
          <div className={s.divider} />

          <Link href="/campaigns" className={cx(s.cta, isActive("/campaigns") && "active")}>
            <span className={s.icon}>+</span> Create your campaigns
          </Link>
        </nav>

        <BotWidget isCampaignMode={pathname === "/campaigns"} />

        <div className={s.project}>Project name</div>
      </aside>
    </>
  );
}
