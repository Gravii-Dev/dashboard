"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: "⊞" },
  { href: "/dashboard/analytics", label: "User analytics", icon: "◎" },
  { href: "/dashboard/labels", label: "User Segments", icon: "◈" },
  { href: "/dashboard/risk", label: "Risk & Sybil", icon: "⚠" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="glow">Gravii</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className={`nav-item ${pathname === href ? "active" : ""}`}
          >
            <span className="icon">{icon}</span>
            {label}
          </Link>
        ))}
        <div className="nav-divider" />
        <Link href="/dashboard/campaigns" className="nav-cta">
          <span className="icon">+</span>
          Create your campaigns
        </Link>
      </nav>

      <div className="sidebar-bot">
        <div className="bot-label">Gravii Assistant</div>
        <div className="bot-box">
          <div className="bot-placeholder">
            e.g. I want to increase TVL. Give me some campaign ideas
          </div>
        </div>
      </div>

      <div className="sidebar-project">Project name</div>
    </aside>
  );
}
