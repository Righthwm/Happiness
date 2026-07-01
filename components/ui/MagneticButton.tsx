"use client";
import { useRef } from "react";
import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: "solid" | "ghost";
};

export default function MagneticButton({ children, href, onClick, className = "", variant = "solid" }: Props) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);

  function onMove(e: React.MouseEvent) {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * 0.2}px, ${y * 0.25}px)`;
  }
  function onLeave() { if (ref.current) ref.current.style.transform = "translate(0,0)"; }

  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm tracking-wide transition-colors duration-300 will-change-transform";
  const styles =
    variant === "solid"
      ? "bg-[var(--color-champagne)] text-[var(--color-ink)] hover:bg-[color-mix(in_srgb,var(--color-champagne)_85%,white)]"
      : "border border-[color-mix(in_srgb,var(--color-champagne)_50%,transparent)] text-[var(--color-bone)] hover:border-[var(--color-champagne)]";

  const cls = `${base} ${styles} ${className}`;
  const Comp: typeof motion.a = href ? motion.a : (motion.button as typeof motion.a);
  const extra = href ? { href, target: href.startsWith("http") ? "_blank" : undefined, rel: "noreferrer" } : { onClick };

  return (
    <Comp ref={ref} className={cls} onMouseMove={onMove} onMouseLeave={onLeave} {...extra}>
      {children}
    </Comp>
  );
}
