import RevealImage from "@/components/ui/RevealImage";
import RevealText from "@/components/ui/RevealText";
import MagneticButton from "@/components/ui/MagneticButton";
import { RITUALS, BRAND } from "@/lib/content";

export default function Rituals() {
  return (
    <section id="ritualuri" className="relative px-6 py-24">
      <div className="mx-auto mb-20 max-w-7xl">
        <p className="eyebrow mb-4">Experiențele Happiness</p>
        <h2 className="display text-[clamp(2.2rem,6vw,5rem)] text-[var(--color-bone)]">Ritualuri</h2>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-28 md:gap-40">
        {RITUALS.map((r, i) => {
          const reversed = i % 2 === 1;
          return (
            <article
              key={r.id}
              className={`grid items-center gap-8 md:grid-cols-2 md:gap-16 ${reversed ? "md:[&>*:first-child]:order-2" : ""}`}
            >
              <RevealImage
                src={r.image}
                alt={r.alt}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="group relative aspect-[4/5] w-full overflow-hidden rounded-sm"
              />
              <div className={reversed ? "md:pr-6" : "md:pl-6"}>
                <p className="eyebrow mb-4">{r.eyebrow}</p>
                <RevealText as="h3" className="display text-[clamp(1.8rem,4vw,3rem)] text-[var(--color-bone)]">
                  {r.title}
                </RevealText>
                <p className="mt-5 max-w-md text-[var(--color-bone)]/70 leading-relaxed">{r.body}</p>
                {r.priceFrom && <p className="mt-4 text-sm text-[var(--color-champagne)]">de la {r.priceFrom}</p>}
                <div className="mt-8">
                  <MagneticButton href={BRAND.meroUrl} variant="ghost">Programează-te</MagneticButton>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
