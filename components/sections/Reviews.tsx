"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CountUp from "@/components/ui/CountUp";
import { REVIEWS, BRAND } from "@/lib/content";

export default function Reviews() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % REVIEWS.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="recenzii" className="relative px-6 py-32">
      <div className="mx-auto max-w-4xl text-center">
        <p className="eyebrow mb-12">Ce spun clienții</p>

        <div className="relative min-h-[220px] md:min-h-[260px]">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="display text-[clamp(1.5rem,3.4vw,2.6rem)] leading-snug text-[var(--color-bone)]"
            >
              “{REVIEWS[i].quote}”
              <footer className="mt-8 text-sm not-italic tracking-[0.2em] text-[var(--color-champagne)]">
                {REVIEWS[i].author.toUpperCase()}
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="mt-16 flex items-center justify-center gap-3">
          {REVIEWS.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Recenzia ${idx + 1}`}
              onClick={() => setI(idx)}
              className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-[var(--color-champagne)]" : "w-1.5 bg-[var(--color-bone)]/30"}`}
            />
          ))}
        </div>

        <div className="mt-20 flex flex-col items-center gap-2">
          <div className="display text-[clamp(3rem,8vw,7rem)] text-[var(--color-champagne)]">
            <CountUp to={BRAND.rating} decimals={2} />
          </div>
          <p className="eyebrow normal-case tracking-[0.2em] text-[var(--color-bone)]/70">
            din <CountUp to={BRAND.reviewCount} suffix="+" /> de recenzii
          </p>
        </div>
      </div>
    </section>
  );
}
