"use client";
import { useEffect, useRef } from "react";
import { registerGsap, gsap, SplitText } from "@/lib/gsap";
import { MANIFESTO } from "@/lib/content";

/**
 * Signature scrollytelling moment: the section pins and the manifesto's words
 * illuminate from dim to bright one after another as you scroll through it
 * (scroll-linked, à la Apple / Awwwards). Renders full-brightness text server-side
 * and for reduced-motion users, so it degrades gracefully.
 */
export default function Manifesto() {
  const section = useRef<HTMLElement>(null);
  const text = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    registerGsap();
    const sec = section.current;
    const el = text.current;
    if (!sec || !el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mm = gsap.matchMedia();

    // Desktop: pin the section and scrub the word-by-word illumination.
    mm.add("(min-width: 768px)", () => {
      const split = SplitText.create(el, { type: "words", wordsClass: "mf-word" });
      gsap.set(split.words, { opacity: 0.14 });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sec, start: "top top", end: "+=120%", scrub: true, pin: true },
      });
      tl.to(split.words, { opacity: 1, color: "#f5f1ea", stagger: 0.5, ease: "none" });
      return () => { tl.scrollTrigger?.kill(); tl.kill(); split.revert(); };
    });

    // Mobile: lighter scrubbed reveal, no pin (pinning is janky on touch).
    mm.add("(max-width: 767px)", () => {
      const split = SplitText.create(el, { type: "words", wordsClass: "mf-word" });
      gsap.set(split.words, { opacity: 0.18 });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sec, start: "top 80%", end: "bottom 45%", scrub: true },
      });
      tl.to(split.words, { opacity: 1, stagger: 0.3, ease: "none" });
      return () => { tl.scrollTrigger?.kill(); tl.kill(); split.revert(); };
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="filozofie" ref={section} className="relative flex min-h-[100svh] items-center px-6">
      <div className="mx-auto max-w-5xl">
        <p className="eyebrow mb-10">Filozofia noastră</p>
        <h2
          ref={text}
          className="display text-[clamp(1.9rem,4.6vw,3.7rem)] leading-[1.22] text-[var(--color-bone)]"
        >
          {MANIFESTO}
        </h2>
      </div>
    </section>
  );
}
