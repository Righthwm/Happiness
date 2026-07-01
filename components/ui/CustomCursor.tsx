"use client";
import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

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

    // Event delegation: works for elements rendered after mount and needs no
    // per-element cleanup. Elements with [data-cursor-label] show a text bubble.
    const interactive = "a, button, [data-cursor]";
    const onOver = (e: MouseEvent) => {
      const target = e.target as Element;
      const labelled = target?.closest?.("[data-cursor-label]") as HTMLElement | null;
      if (labelled && ring.current && label.current) {
        label.current.textContent = labelled.dataset.cursorLabel || "";
        ring.current.classList.add("cursor-view");
      } else if (target?.closest?.(interactive)) {
        ring.current?.classList.add("cursor-grow");
      }
    };
    const onOut = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target?.closest?.("[data-cursor-label]")) ring.current?.classList.remove("cursor-view");
      else if (target?.closest?.(interactive)) ring.current?.classList.remove("cursor-grow");
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
      <div ref={ring} aria-hidden className="cursor-ring pointer-events-none fixed left-0 top-0 z-[70] flex h-9 w-9 -ml-[18px] -mt-[18px] items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--color-champagne)_60%,transparent)] transition-[width,height,opacity,background-color] duration-300">
        <span ref={label} className="cursor-label text-[0.62rem] font-medium uppercase tracking-[0.2em] text-[var(--color-ink)] opacity-0" />
      </div>
    </>
  );
}
