"use client";
import { useEffect, useState } from "react";
import { registerGsap, ScrollTrigger } from "@/lib/gsap";

// Fixed cinematic "act" marker (roman numeral + label) that updates as the
// active section changes — reinforcing the "a film in acts" narrative.
const ACTS = [
  { id: "top", label: "Deschidere" },
  { id: "filozofie", label: "Filozofie" },
  { id: "ritualuri", label: "Ritualuri" },
  { id: "echipa", label: "Echipa" },
  { id: "recenzii", label: "Recenzii" },
  { id: "atmosfera", label: "Atmosferă" },
  { id: "locatie", label: "Locație" },
  { id: "programare", label: "Programare" },
];
const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

export default function ActIndicator() {
  const [i, setI] = useState(0);

  useEffect(() => {
    registerGsap();
    const triggers = ACTS.map((a, idx) =>
      ScrollTrigger.create({
        trigger: `#${a.id}`,
        start: "top 55%",
        end: "bottom 45%",
        onToggle: (self) => { if (self.isActive) setI(idx); },
      })
    );
    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <div aria-hidden className="fixed bottom-6 left-6 z-40 hidden select-none md:block">
      <div className="flex items-center gap-3">
        <span className="display text-2xl leading-none text-[var(--color-champagne)]">{ROMAN[i]}</span>
        <span className="h-px w-8 bg-[color-mix(in_srgb,var(--color-champagne)_50%,transparent)]" />
        <span className="eyebrow normal-case tracking-[0.25em] text-[var(--color-bone)]/60">{ACTS[i].label}</span>
      </div>
    </div>
  );
}
