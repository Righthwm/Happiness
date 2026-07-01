"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BRAND } from "@/lib/content";

export default function Preloader() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1900);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--color-ink)]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
        >
          <div className="text-center">
            <motion.h1
              className="display text-4xl text-[var(--color-bone)] md:text-6xl"
              initial={{ opacity: 0, y: 14, letterSpacing: "0.4em" }}
              animate={{ opacity: 1, y: 0, letterSpacing: "0.12em" }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              {BRAND.name}
            </motion.h1>
            <motion.div
              className="mx-auto mt-5 h-px bg-[var(--color-champagne)]"
              initial={{ width: 0 }}
              animate={{ width: 160 }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
