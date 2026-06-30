import Image from "next/image";
import { TEAM } from "@/lib/content";

export default function Team() {
  return (
    <section id="echipa" className="relative px-6 py-24">
      <div className="mx-auto mb-16 max-w-7xl">
        <p className="eyebrow mb-4">Specialiștii</p>
        <h2 className="display max-w-3xl text-[clamp(2rem,5vw,4rem)] text-[var(--color-bone)]">
          O echipă formată continuu, dedicată detaliului
        </h2>
      </div>
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {/* TODO(owner): replace with real specialist photos, names, roles */}
        {TEAM.map((m) => (
          <figure key={m.name} className="group relative">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm">
              <Image
                src={m.image}
                alt={`${m.name} — ${m.role}`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/70 to-transparent" />
            </div>
            <figcaption className="absolute bottom-4 left-4 right-4">
              <p className="display text-lg text-[var(--color-bone)]">{m.name}</p>
              <p className="text-xs text-[var(--color-bone)]/70">{m.role}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
