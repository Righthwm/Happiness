import RevealText from "@/components/ui/RevealText";
import { MANIFESTO } from "@/lib/content";

export default function Manifesto() {
  return (
    <section id="filozofie" className="relative mx-auto flex min-h-[90svh] max-w-5xl flex-col justify-center px-6 py-32">
      <p className="eyebrow mb-10">Filozofia noastră</p>
      <RevealText
        as="h2"
        split="lines"
        className="display text-[clamp(1.8rem,4.5vw,3.6rem)] leading-[1.15] text-[var(--color-bone)]"
      >
        {MANIFESTO}
      </RevealText>
    </section>
  );
}
