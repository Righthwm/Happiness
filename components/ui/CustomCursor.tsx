"use client";
import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;
    document.body.classList.add("has-custom-cursor");

    let rx = 0, ry = 0, dx = 0, dy = 0, raf = 0;
    const onMove = (e: MouseEvent) => {
      dx = e.clientX; dy = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${dx}px, ${dy}px)`;
    };
    const loop = () => {
      rx += (dx - rx) * 0.18; ry += (dy - ry) * 0.18;
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(loop);
    };
    // Event delegation: works for elements rendered after mount (e.g. the
    // fullscreen menu links) and needs no per-element cleanup.
    const interactive = "a, button, [data-cursor]";
    const onOver = (e: MouseEvent) => {
      if ((e.target as Element)?.closest?.(interactive)) ring.current?.classList.add("cursor-grow");
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as Element)?.closest?.(interactive)) ring.current?.classList.remove("cursor-grow");
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(raf);
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <>
      <div ref={dot} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[70] h-1.5 w-1.5 -ml-[3px] -mt-[3px] rounded-full bg-[var(--color-champagne)]" />
      <div ref={ring} aria-hidden className="cursor-ring pointer-events-none fixed left-0 top-0 z-[70] h-9 w-9 -ml-[18px] -mt-[18px] rounded-full border border-[color-mix(in_srgb,var(--color-champagne)_60%,transparent)] transition-[width,height,opacity] duration-300" />
    </>
  );
}
