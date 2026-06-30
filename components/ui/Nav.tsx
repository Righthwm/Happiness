"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BRAND, NAV_LINKS } from "@/lib/content";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

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
            className="fixed inset-0 z-[90] flex flex-col bg-[var(--color-ink)]"
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
              <span className="display text-xl text-[var(--color-bone)]">{BRAND.name}</span>
              <button onClick={() => setOpen(false)} className="eyebrow text-[var(--color-bone)]" aria-label="Închide meniul">
                Închide ✕
              </button>
            </div>
            <nav className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center gap-2 px-6">
              {NAV_LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="display w-fit text-5xl text-[var(--color-bone)] transition-colors hover:text-[var(--color-champagne)] md:text-7xl"
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 + i * 0.07, duration: 0.6, ease: "easeOut" }}
                >
                  {l.label}
                </motion.a>
              ))}
            </nav>
            <div className="mx-auto w-full max-w-7xl px-6 py-8 eyebrow text-[var(--color-bone)]">
              {BRAND.addressLine} · {BRAND.city}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
