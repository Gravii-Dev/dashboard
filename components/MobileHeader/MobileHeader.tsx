"use client";

import { useState, useEffect, useRef } from "react";
import { cx } from "@/lib/utils";
import { useSidebarOpen } from "@/lib/SidebarOpenContext";
import s from "./MobileHeader.module.css";

const SCROLL_THRESHOLD = 8;
const MIN_SCROLL_DELTA = 4;

export default function MobileHeader() {
  const { openSidebar } = useSidebarOpen();
  const [visible, setVisible] = useState(true);
  const lastYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const delta = y - lastYRef.current;

      if (Math.abs(delta) < MIN_SCROLL_DELTA) return;

      if (delta > SCROLL_THRESHOLD) {
        setVisible(false);
      } else if (delta < -SCROLL_THRESHOLD) {
        setVisible(true);
      }

      lastYRef.current = y;
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={cx(s.header, visible ? s.visible : s.hidden)}>
      <div className={s.left}>
        <button
          type="button"
          className={s.hamburger}
          onClick={() => openSidebar()}
          aria-label="Open menu"
        >
          <span /><span /><span />
        </button>
      </div>
      <button
        type="button"
        className={s.title}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
      >
        <span className="glow">Gravii</span>
      </button>
      <div className={s.right} />
    </header>
  );
}
