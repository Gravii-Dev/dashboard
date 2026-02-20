import { useState, useEffect } from "react";

export function useHeaderVisible() {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // If scrolling down and past 50px, hide header
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setVisible(false);
      } else {
        // If scrolling up, show header
        setVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return visible;
}
