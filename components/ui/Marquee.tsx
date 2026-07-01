"use client";
import { useEffect, useRef } from "react";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Velocity-reactive kinetic marquee. Drifts continuously and speeds up with
 * scroll velocity, then eases back — a cinematic "breathing" typographic band.
 */
export default function Marquee({ text, className = "" }: { text: string; className?: string }) {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    registerGsap();

    let x = 0;
    let boost = 0;
    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        boost = gsap.utils.clamp(-1, 1, self.getVelocity() / 3000);
      },
    });

    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const half = el.scrollWidth / 2;
      x -= (36 + Math.abs(boost) * 260) * dt; // base drift + scroll boost
      boost *= 0.9;
      if (half > 0 && -x >= half) x += half;
      el.style.transform = `translate3d(${x}px,0,0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); st.kill(); };
  }, []);

  const group = (
    <div className="flex shrink-0">
      {Array.from({ length: 6 }).map((_, i) => (
        <span key={i} className="display flex items-center text-[clamp(2rem,7vw,6rem)] text-[var(--color-bone)]/85">
          <span className="px-8">{text}</span>
          <span className="text-[var(--color-champagne)]">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={`relative overflow-hidden py-8 ${className}`} aria-hidden>
      <div ref={track} className="flex w-max whitespace-nowrap will-change-transform">
        {group}
        {group}
      </div>
    </div>
  );
}
