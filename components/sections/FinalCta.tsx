import MagneticButton from "@/components/ui/MagneticButton";
import BookingForm from "@/components/ui/BookingForm";
import { BRAND } from "@/lib/content";

export default function FinalCta() {
  return (
    <section id="programare" className="relative px-6 pt-32">
      <div className="mx-auto max-w-5xl text-center">
        <p className="eyebrow mb-6">Programare</p>
        <h2 className="display text-[clamp(2.6rem,8vw,7rem)] text-[var(--color-bone)]">Rândul tău să strălucești</h2>
        <p className="mx-auto mt-6 max-w-xl text-[var(--color-bone)]/70">
          Programează-te direct pe Mero, unde găsești toate cele peste 120 de servicii, sau lasă-ne o cerere și te contactăm noi.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <MagneticButton href={BRAND.meroUrl} variant="solid">Programează pe Mero</MagneticButton>
          <MagneticButton href={BRAND.instagram} variant="ghost">{BRAND.instagramHandle}</MagneticButton>
        </div>
      </div>

      <div className="mx-auto mt-24 max-w-3xl rounded-sm border border-[color-mix(in_srgb,var(--color-bone)_12%,transparent)] p-8 md:p-12">
        <p className="eyebrow mb-8 text-center">Sau trimite o cerere</p>
        <BookingForm />
      </div>

      <footer className="mx-auto mt-28 max-w-7xl border-t border-[color-mix(in_srgb,var(--color-bone)_12%,transparent)] py-12">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="display text-2xl text-[var(--color-bone)]">{BRAND.name}</p>
            <p className="mt-2 text-sm text-[var(--color-bone)]/60">{BRAND.legal}</p>
            <p className="mt-1 text-sm text-[var(--color-bone)]/60">{BRAND.addressLine}, {BRAND.city}</p>
          </div>
          <div className="flex flex-col gap-2 text-sm md:items-end">
            <a href={BRAND.instagram} target="_blank" rel="noreferrer" className="text-[var(--color-bone)]/70 transition-colors hover:text-[var(--color-champagne)]">{BRAND.instagramHandle}</a>
            <a href={BRAND.meroUrl} target="_blank" rel="noreferrer" className="text-[var(--color-bone)]/70 transition-colors hover:text-[var(--color-champagne)]">Programări Mero</a>
            <p className="mt-4 text-xs text-[var(--color-bone)]/40">© {new Date().getFullYear()} {BRAND.legal}. Toate drepturile rezervate. · Prin utilizarea site-ului accepți politica de confidențialitate (GDPR).</p>
          </div>
        </div>
      </footer>
    </section>
  );
}
