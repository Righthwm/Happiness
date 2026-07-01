"use client";
import { useEffect } from "react";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";

// Drives the body background-color through the narrative.
const STOPS: { id: string; color: string }[] = [
  { id: "#top", color: "#0a0908" },
  { id: "#filozofie", color: "#0d0b09" },
  { id: "#ritualuri", color: "#0a0908" },
  { id: "#echipa", color: "#100c0a" },
  { id: "#recenzii", color: "#0a0908" },
  { id: "#atmosfera", color: "#0d0b09" },
  { id: "#locatie", color: "#0a0908" },
  { id: "#programare", color: "#100c0a" },
];

export default function ActBackground() {
  useEffect(() => {
    registerGsap();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const triggers = STOPS.map((s) =>
      ScrollTrigger.create({
        trigger: s.id,
        start: "top 60%",
        end: "bottom 40%",
        onEnter: () => gsap.to(document.body, { backgroundColor: s.color, duration: 1.0 }),
        onEnterBack: () => gsap.to(document.body, { backgroundColor: s.color, duration: 1.0 }),
      })
    );
    return () => triggers.forEach((t) => t.kill());
  }, []);
  return null;
}
