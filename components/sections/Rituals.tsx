import RitualRow from "@/components/sections/RitualRow";
import { RITUALS } from "@/lib/content";

export default function Rituals() {
  return (
    <section id="ritualuri" className="relative px-6 py-24">
      <div className="mx-auto mb-20 max-w-7xl">
        <p className="eyebrow mb-4">Experiențele Happiness</p>
        <h2 className="display text-[clamp(2.2rem,6vw,5rem)] text-[var(--color-bone)]">Ritualuri</h2>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-28 md:gap-40">
        {RITUALS.map((r, i) => (
          <RitualRow key={r.id} r={r} index={i} reversed={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}
