"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { BRAND, HERO_TITLES } from "@/lib/content";

export default function Hero() {
  const section = useRef<HTMLElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      // Parallax depth: bg moves slower, content drifts up + fades
      gsap.to(bg.current, {
        yPercent: 18, scale: 1.12, ease: "none",
        scrollTrigger: { trigger: section.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(content.current, {
        yPercent: -28, opacity: 0, ease: "none",
        scrollTrigger: { trigger: section.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section id="top" ref={section} className="relative h-[100svh] w-full overflow-hidden">
      {/* TODO(owner): replace with real cinematic salon video/photo */}
      <div ref={bg} className="absolute inset-0 will-change-transform">
        <Image
          src="https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?q=80&w=2400&auto=format&fit=crop"
          alt="Atmosferă cinematică din salonul Happiness"
          fill priority sizes="100vw" style={{ objectFit: "cover" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-ink)]/55 via-[var(--color-ink)]/25 to-[var(--color-ink)]" />
      </div>

      <div ref={content} className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.8 }}
        >
          {BRAND.legal} — {BRAND.city.toUpperCase()}
        </motion.p>
        <motion.h1
          className="display mt-6 max-w-5xl text-[clamp(2.8rem,9vw,9rem)] text-[var(--color-bone)]"
          initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.15, duration: 1.1, ease: "easeOut" }}
        >
          {HERO_TITLES[0]}
        </motion.h1>

        <motion.div
          className="mt-10 flex items-center gap-3 text-[var(--color-bone)]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5, duration: 0.9 }}
        >
          <span className="text-[var(--color-champagne)]">★</span>
          <span className="text-lg font-medium">{BRAND.rating.toFixed(2)}</span>
          <span className="eyebrow normal-case tracking-[0.2em] text-[var(--color-bone)]/70">
            din peste {BRAND.reviewCount.toLocaleString("ro-RO")} de recenzii
          </span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        aria-hidden
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8, duration: 1 }}
      >
        <div className="relative h-14 w-px overflow-hidden bg-[color-mix(in_srgb,var(--color-bone)_30%,transparent)]">
          <motion.div
            className="absolute left-0 top-0 h-6 w-px bg-[var(--color-champagne)]"
            animate={{ y: [-24, 56] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
