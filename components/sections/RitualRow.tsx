"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { registerGsap, gsap } from "@/lib/gsap";
import RevealText from "@/components/ui/RevealText";
import MagneticButton from "@/components/ui/MagneticButton";
import { BRAND, type Ritual } from "@/lib/content";

/**
 * A single ritual: the image lives in a fixed frame but is oversized and drifts
 * vertically as you scroll (inner parallax), and develops from blur+grayscale to
 * clear+color on entry. A giant ghost index number sits behind the copy.
 */
export default function RitualRow({ r, index, reversed }: { r: Ritual; index: number; reversed: boolean }) {
  const frame = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const fr = frame.current;
    const im = img.current;
    if (!fr || !im) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      im.style.transform = "none";
      return;
    }
    const ctx = gsap.context(() => {
      // Continuous vertical parallax of the oversized inner image.
      gsap.fromTo(im, { yPercent: -8 }, {
        yPercent: 8, ease: "none",
        scrollTrigger: { trigger: fr, start: "top bottom", end: "bottom top", scrub: true },
      });
      // Scroll-linked develop as the frame enters the viewport.
      gsap.fromTo(fr, { filter: "blur(16px) grayscale(1)" }, {
        filter: "blur(0px) grayscale(0)", ease: "none",
        scrollTrigger: { trigger: fr, start: "top 85%", end: "top 45%", scrub: true },
      });
    }, fr);
    return () => ctx.revert();
  }, []);

  const num = String(index + 1).padStart(2, "0");

  return (
    <article className={`grid items-center gap-8 md:grid-cols-2 md:gap-16 ${reversed ? "md:[&>*:first-child]:order-2" : ""}`}>
      <div ref={frame} className="relative aspect-[4/5] w-full overflow-hidden rounded-sm will-change-[filter]">
        <div ref={img} className="absolute inset-x-0 -top-[10%] h-[120%] will-change-transform">
          <Image src={r.image} alt={r.alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
        </div>
        <a
          href={BRAND.meroUrl}
          target="_blank"
          rel="noreferrer"
          data-cursor-label="Programează"
          aria-label={`Programează — ${r.title}`}
          className="absolute inset-0 z-10"
        />
      </div>

      <div className={`relative ${reversed ? "md:pr-6" : "md:pl-6"}`}>
        <span
          aria-hidden
          className="display pointer-events-none absolute -top-20 right-0 select-none text-[7rem] leading-none text-[color-mix(in_srgb,var(--color-champagne)_13%,transparent)] md:-top-28 md:text-[12rem]"
        >
          {num}
        </span>
        <p className="eyebrow relative mb-4">{r.eyebrow}</p>
        <RevealText as="h3" className="display relative text-[clamp(1.8rem,4vw,3rem)] text-[var(--color-bone)]">
          {r.title}
        </RevealText>
        <p className="relative mt-5 max-w-md leading-relaxed text-[var(--color-bone)]/70">{r.body}</p>
        {r.priceFrom && <p className="relative mt-4 text-sm text-[var(--color-champagne)]">de la {r.priceFrom}</p>}
        <div className="relative mt-8">
          <MagneticButton href={BRAND.meroUrl} variant="ghost">Programează-te</MagneticButton>
        </div>
      </div>
    </article>
  );
}
