"use client";
import { useEffect, useState } from "react";
import { BRAND, HOURS } from "@/lib/content";

export default function Location() {
  const [today, setToday] = useState<number>(-1);
  useEffect(() => {
    // Compute the weekday client-side only, to avoid SSR/CSR hydration mismatch.
    const id = requestAnimationFrame(() => setToday(new Date().getDay()));
    return () => cancelAnimationFrame(id);
  }, []);

  const mapsQuery = encodeURIComponent(`${BRAND.addressLine}, ${BRAND.city}`);

  return (
    <section id="locatie" className="relative px-6 py-24">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 md:gap-16">
        <div>
          <p className="eyebrow mb-4">Vino la noi</p>
          <h2 className="display text-[clamp(2rem,5vw,4rem)] text-[var(--color-bone)]">{BRAND.addressLine}</h2>
          <p className="mt-3 text-[var(--color-bone)]/70">{BRAND.addressArea}</p>

          <div className="mt-10 divide-y divide-[color-mix(in_srgb,var(--color-bone)_12%,transparent)]">
            {HOURS.map((h) => (
              <div
                key={h.day}
                className={`flex items-center justify-between py-3 ${h.dow === today ? "text-[var(--color-champagne)]" : "text-[var(--color-bone)]/80"}`}
              >
                <span className="text-sm tracking-wide">{h.day}{h.dow === today ? " · azi" : ""}</span>
                <span className="text-sm">{h.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Styled map: grayscale + warm tint to match brand; not a raw default iframe */}
        <div className="relative aspect-square w-full overflow-hidden rounded-sm md:aspect-auto">
          <iframe
            title="Harta — Happiness Cluj-Napoca"
            src={`https://www.google.com/maps?q=${mapsQuery}&output=embed`}
            className="h-full min-h-[360px] w-full grayscale-[0.6] contrast-[1.05] [filter:sepia(0.15)]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="pointer-events-none absolute inset-0 mix-blend-multiply" style={{ background: "color-mix(in srgb, var(--color-clay) 18%, transparent)" }} />
        </div>
      </div>
    </section>
  );
}
