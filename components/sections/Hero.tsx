"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { registerGsap, gsap } from "@/lib/gsap";
import { BRAND, HERO_TITLES } from "@/lib/content";

export default function Hero() {
  const section = useRef<HTMLElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const curtain = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const mm = gsap.matchMedia();

    // Desktop: pin the hero and play a "curtain" handoff — the image zooms, the
    // content lifts and fades, and an ink panel with a rounded top rises to
    // reveal the story beneath.
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section.current, start: "top top", end: "+=90%", scrub: true, pin: true, invalidateOnRefresh: true },
      });
      tl.to(bg.current, { scale: 1.2, yPercent: 6, ease: "none", duration: 1 }, 0);
      tl.to(content.current, { yPercent: -16, opacity: 0, ease: "none", duration: 0.45 }, 0);
      tl.fromTo(curtain.current, { yPercent: 100 }, { yPercent: 0, ease: "power2.inOut", duration: 0.72 }, 0.28);
      return () => { tl.scrollTrigger?.kill(); tl.kill(); };
    });

    // Mobile: lighter parallax fade, no pin (smoother on touch).
    mm.add("(max-width: 767px)", () => {
      const ctx = gsap.context(() => {
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
    });

    return () => mm.revert();
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
        <h1 className="display mt-6 flex max-w-5xl flex-wrap justify-center gap-x-[0.28em] text-[clamp(2.8rem,9vw,9rem)] text-[var(--color-bone)]">
          {/* Per-word mask reveal: each word rises out of a clipped line. */}
          {HERO_TITLES[0].split(" ").map((word, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.12em]">
              <motion.span
                className="inline-block"
                initial={{ y: "115%" }}
                animate={{ y: 0 }}
                transition={{ delay: 2.05 + i * 0.09, duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.div
          className="mx-auto mt-4 h-px w-40 origin-center bg-[var(--color-champagne)]"
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 2.7, duration: 1.0, ease: "easeInOut" }}
        />

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

      {/* Curtain that rises to hand off into the story (desktop pin) */}
      <div
        ref={curtain}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-30 translate-y-full rounded-t-[3rem] bg-[var(--color-ink)]"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-[color-mix(in_srgb,var(--color-champagne)_50%,transparent)]" />
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
