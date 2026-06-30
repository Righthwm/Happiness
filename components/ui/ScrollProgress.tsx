"use client";
import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? window.scrollY / h : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div aria-hidden className="fixed right-5 top-1/2 z-50 hidden h-32 w-px -translate-y-1/2 bg-[color-mix(in_srgb,var(--color-bone)_18%,transparent)] md:block">
      <div className="w-px bg-[var(--color-champagne)] origin-top" style={{ height: `${p * 100}%` }} />
    </div>
  );
}
