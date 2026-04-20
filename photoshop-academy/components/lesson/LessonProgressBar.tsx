"use client";

import { useEffect, useState } from "react";

export function LessonProgressBar() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      if (total <= 0) {
        setPct(0);
        return;
      }
      const p = (window.scrollY / total) * 100;
      setPct(Math.max(0, Math.min(100, p)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="fixed left-0 right-0 top-16 z-30 h-0.5 bg-transparent"
    >
      <div
        className="h-full bg-orange-500 transition-[width] duration-150"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
