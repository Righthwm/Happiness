import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";
import Rituals from "@/components/sections/Rituals";
import Team from "@/components/sections/Team";
import Reviews from "@/components/sections/Reviews";
import Gallery from "@/components/sections/Gallery";
import Location from "@/components/sections/Location";
import FinalCta from "@/components/sections/FinalCta";
import ActBackground from "@/components/ui/ActBackground";
import ActIndicator from "@/components/ui/ActIndicator";
import Marquee from "@/components/ui/Marquee";

export default function Page() {
  return (
    <main>
      <ActBackground />
      <ActIndicator />
      <Hero />
      <Manifesto />
      <Marquee text="Un ritual pentru corp și suflet" />
      <Rituals />
      <Team />
      <Reviews />
      <Marquee text="Happiness · Cluj-Napoca" />
      <Gallery />
      <Location />
      <FinalCta />
    </main>
  );
}
