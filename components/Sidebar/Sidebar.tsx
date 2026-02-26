"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BotWidget from "@/components/BotWidget/BotWidget";
import { cx } from "@/lib/utils";
import s from "./Sidebar.module.css";

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <aside className={s.sidebar}>
      <div className={s.logo}>
        <span className="glow">Gravii</span>
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
  );
}
