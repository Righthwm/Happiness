"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BRAND, NAV_LINKS } from "@/lib/content";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  // Mobile: close the menu with a right-swipe (native listeners, active while open).
  useEffect(() => {
    if (!open) return;
    let sx = 0, sy = 0;
    const start = (e: TouchEvent) => { const t = e.touches[0]; sx = t.clientX; sy = t.clientY; };
    const end = (e: TouchEvent) => {
      const t = e.changedTouches[0];
      const dx = t.clientX - sx;
      const dy = t.clientY - sy;
      if (dx > 70 && Math.abs(dx) > Math.abs(dy)) setOpen(false);
    };
    document.addEventListener("touchstart", start, { passive: true });
    document.addEventListener("touchend", end, { passive: true });
    return () => {
      document.removeEventListener("touchstart", start);
      document.removeEventListener("touchend", end);
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("lenis-stopped", open);
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[80] transition-colors duration-500 ${
          solid ? "bg-[color-mix(in_srgb,var(--color-ink)_82%,transparent)] backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="#top" className="display text-xl tracking-wide text-[var(--color-bone)]">{BRAND.name}</a>
          <button
            onClick={() => setOpen(true)}
            className="eyebrow flex items-center gap-3 text-[var(--color-bone)]"
            aria-label="Deschide meniul"
          >
            Meniu
            <span className="flex flex-col gap-1">
              <span className="block h-px w-6 bg-current" />
              <span className="block h-px w-6 bg-current" />
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[90] flex flex-col bg-[color-mix(in_srgb,#141110_66%,transparent)] backdrop-blur-2xl"
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
              <span className="display text-xl text-[var(--color-bone)]">{BRAND.name}</span>
              <button onClick={() => setOpen(false)} className="eyebrow flex items-center gap-2 text-[var(--color-bone)] transition-colors hover:text-[var(--color-champagne)]" aria-label="Închide meniul">
                Închide <span aria-hidden>✕</span>
              </button>
            </div>
            <nav className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center gap-1 px-6 md:gap-2">
              {NAV_LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="group flex w-fit items-baseline gap-4 py-1 transition-transform duration-300 ease-out hover:translate-x-3 md:gap-7"
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ delay: 0.28 + i * 0.07, duration: 0.6, ease: "easeOut" }}
                >
                  <span className="w-8 pt-2 text-right text-xs tracking-[0.2em] text-[color-mix(in_srgb,var(--color-champagne)_80%,transparent)] transition-colors duration-300 group-hover:text-[var(--color-champagne)]">
                    0{i + 1}
                  </span>
                  <span className="relative display text-5xl leading-[1.05] text-[var(--color-bone)]/90 transition-colors duration-300 group-hover:text-[var(--color-champagne)] md:text-7xl">
                    {l.label}
                    <span className="absolute -bottom-1 left-0 h-px w-0 bg-[var(--color-champagne)] transition-[width] duration-500 ease-out group-hover:w-full" />
                  </span>
                </motion.a>
              ))}
            </nav>
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-8">
              <span className="eyebrow normal-case tracking-[0.2em] text-[var(--color-bone)]/60">{BRAND.addressLine} · {BRAND.city}</span>
              <a href={BRAND.instagram} target="_blank" rel="noreferrer" className="eyebrow normal-case tracking-[0.2em] text-[var(--color-bone)]/60 transition-colors hover:text-[var(--color-champagne)]">{BRAND.instagramHandle}</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
