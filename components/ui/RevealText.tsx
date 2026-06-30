"use client";
import { ElementType, useEffect, useRef } from "react";
import { registerGsap, gsap, ScrollTrigger, SplitText } from "@/lib/gsap";

type Props = {
  children: string;
  as?: ElementType;
  className?: string;
  /** "words" (default) or "lines" */
  split?: "words" | "lines";
};

export default function RevealText({ children, as: Tag = "p", className, split = "words" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    registerGsap();
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const st = SplitText.create(el, { type: split, linesClass: "rt-line", wordsClass: "rt-word" });
    const targets = split === "lines" ? st.lines : st.words;
    gsap.set(targets, { yPercent: 110, opacity: 0 });
    const anim = gsap.to(targets, {
      yPercent: 0,
      opacity: 1,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.04,
      scrollTrigger: { trigger: el, start: "top 85%" },
    });
    return () => { anim.scrollTrigger?.kill(); anim.kill(); st.revert(); };
  }, [children, split]);

  return (
    <Tag ref={ref as React.Ref<HTMLElement>} className={className} style={{ overflow: "hidden" }}>
      {children}
    </Tag>
  );
}
