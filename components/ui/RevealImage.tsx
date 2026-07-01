"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { registerGsap, gsap } from "@/lib/gsap";

type Props = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

/** Image that develops from blur+grayscale to clear+color on viewport entry. */
export default function RevealImage({ src, alt, className, priority, sizes = "100vw" }: Props) {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const el = wrap.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.filter = "none"; el.style.transform = "none"; return;
    }
    const anim = gsap.fromTo(
      el,
      { filter: "blur(14px) grayscale(1)", scale: 1.12 },
      {
        filter: "blur(0px) grayscale(0)",
        scale: 1,
        duration: 1.4,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 80%" },
      }
    );
    return () => { anim.scrollTrigger?.kill(); anim.kill(); };
  }, []);

  return (
    <div ref={wrap} className={className} style={{ overflow: "hidden", willChange: "filter, transform" }}>
      <Image src={src} alt={alt} fill priority={priority} sizes={sizes} style={{ objectFit: "cover" }} />
    </div>
  );
}
