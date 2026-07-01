"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { registerGsap, gsap } from "@/lib/gsap";
import { GALLERY } from "@/lib/content";

export default function Gallery() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const mm = gsap.matchMedia();
    // Horizontal scroll-jacking only on desktop with motion allowed.
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const el = track.current!;
      const distance = el.scrollWidth - window.innerWidth;
      const tween = gsap.to(el, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: () => `+=${distance}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progress.current) progress.current.style.transform = `scaleX(${self.progress})`;
          },
        },
      });
      return () => tween.kill();
    });
    return () => mm.revert();
  }, []);

  const total = String(GALLERY.length).padStart(2, "0");

  return (
    <section id="atmosfera" ref={section} className="relative md:h-[100svh] md:overflow-hidden">
      <div
        ref={track}
        className="flex flex-col gap-6 px-6 py-12 md:h-full md:flex-row md:items-center md:gap-10 md:px-0 md:py-0 md:pl-[8vw] md:pr-[10vw] md:will-change-transform"
      >
        {/* Intro panel */}
        <div className="shrink-0 md:flex md:h-[68vh] md:w-[32vw] md:flex-col md:justify-center md:pr-8">
          <p className="eyebrow mb-4">Atmosferă</p>
          <h2 className="display text-[clamp(2rem,5vw,4.2rem)] leading-[1.05] text-[var(--color-bone)]">
            În interiorul Happiness
          </h2>
          <p className="mt-6 max-w-xs text-[var(--color-bone)]/60">
            Un spațiu gândit ca un refugiu senzorial — lumină caldă, texturi organice, liniște.
          </p>
        </div>

        {/* TODO(owner): replace with real salon interior photography */}
        {GALLERY.map((g, idx) => (
          <figure
            key={idx}
            className="group relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-sm md:h-[68vh] md:w-[46vw] md:aspect-auto"
          >
            <Image
              src={g.image}
              alt={g.alt}
              fill
              sizes="(max-width: 768px) 100vw, 46vw"
              className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/60 via-transparent to-transparent" />
            <figcaption className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
              <span className="max-w-[70%] text-sm text-[var(--color-bone)]/85">{g.alt}</span>
              <span className="eyebrow normal-case tracking-[0.2em] text-[var(--color-champagne)]">
                {String(idx + 1).padStart(2, "0")} / {total}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Scroll progress bar (desktop pin only) */}
      <div className="absolute bottom-8 left-[8vw] right-[10vw] hidden h-px bg-[color-mix(in_srgb,var(--color-bone)_16%,transparent)] md:block">
        <div ref={progress} className="h-px origin-left scale-x-0 bg-[var(--color-champagne)]" />
      </div>
    </section>
  );
}
