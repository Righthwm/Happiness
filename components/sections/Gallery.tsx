"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { GALLERY } from "@/lib/content";

export default function Gallery() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const mm = gsap.matchMedia();
    // Horizontal scroll-jacking only on desktop with motion allowed
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
        },
      });
      return () => tween.kill();
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="atmosfera" ref={section} className="relative md:h-[100svh] md:overflow-hidden">
      <div className="px-6 pt-24 md:absolute md:left-6 md:top-12 md:z-10">
        <p className="eyebrow mb-4">Atmosferă</p>
        <h2 className="display text-[clamp(2rem,5vw,4rem)] text-[var(--color-bone)]">În interiorul Happiness</h2>
      </div>

      {/* TODO(owner): replace with real salon interior photography */}
      <div
        ref={track}
        className="flex flex-col gap-6 px-6 py-12 md:h-full md:flex-row md:items-center md:gap-8 md:py-0 md:pl-[40vw] md:pr-[10vw] md:will-change-transform"
      >
        {GALLERY.map((g, idx) => (
          <div key={idx} className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-sm md:h-[60vh] md:w-[42vw] md:aspect-auto">
            <Image src={g.image} alt={g.alt} fill sizes="(max-width: 768px) 100vw, 42vw" className="object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}
