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
    const start = (e: TouchEvent) => { const t = e.touches[0]; if (!t) return; sx = t.clientX; sy = t.clientY; };
    const end = (e: TouchEvent) => {
      const t = e.changedTouches[0];
      if (!t) return;
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
            className="fixed inset-x-0 top-0 z-[90] flex bg-[color-mix(in_srgb,#141110_66%,transparent)] backdrop-blur-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Thin full-height strip with a right arrow — glides the menu shut */}
            <button
              onClick={() => setOpen(false)}
              aria-label="Închide meniul"
              className="group flex w-12 shrink-0 items-center justify-center border-r border-[color-mix(in_srgb,var(--color-champagne)_22%,transparent)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-champagne)_9%,transparent)] md:w-14"
            >
              <span aria-hidden className="text-2xl leading-none text-[var(--color-champagne)] transition-transform duration-300 ease-out group-hover:translate-x-1">
                &rarr;
              </span>
            </button>

            {/* Content — panel is only as tall as its content, so the page shows below */}
            <div className="flex flex-1 flex-col px-6 md:px-10">
              <div className="flex items-center justify-between py-5">
                <span className="display text-xl text-[var(--color-bone)]">{BRAND.name}</span>
                <a
                  href={BRAND.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="eyebrow normal-case tracking-[0.2em] text-[var(--color-bone)]/55 transition-colors hover:text-[var(--color-champagne)]"
                >
                  {BRAND.instagramHandle}
                </a>
              </div>
              <nav className="flex flex-col gap-1 pb-10 pt-2 md:gap-2">
                {NAV_LINKS.map((l, i) => (
                  <motion.a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="group flex w-fit items-baseline gap-4 py-1 transition-transform duration-300 ease-out hover:translate-x-3 md:gap-7"
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.28 + i * 0.06, duration: 0.55, ease: "easeOut" }}
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
