# Happiness Digital Flagship — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a premium, cinematic, scrollytelling single-page site for Happiness — Salon de înfrumusețare (Cluj-Napoca), runnable locally with `npm run dev`.

**Architecture:** Next.js 16 App Router + TypeScript + Tailwind v4. A single page composes 8 "acts" (section components). A Lenis smooth-scroll provider is synced with GSAP ScrollTrigger for scroll-linked reveals/parallax/pinning; Framer Motion handles the menu overlay and micro-interactions. All real brand data lives in `lib/content.ts`. A booking form posts to `/api/booking` (zod-validated; optional Resend email gated by env var).

**Tech Stack:** Next.js 16.2, React 19, TypeScript, Tailwind CSS v4, GSAP 3.15 (+ ScrollTrigger, SplitText — free since 3.13), Lenis 1.3, Framer Motion 12, zod 4, Resend 6.

**Verification note:** This is animation-heavy UI. TDD applies to the booking validation + API route (Tasks 16–17). Visual sections are verified with `npm run build` (must compile) and the preview tools (snapshot/console/screenshot). Every task ends with a commit.

---

## File Structure

```
happiness/
  app/
    layout.tsx              # fonts, metadata, JSON-LD, providers, grain, cursor, nav, preloader
    page.tsx                # composes the 8 acts in order
    globals.css             # Tailwind import, CSS variables, base, grain, utilities
    api/booking/route.ts    # POST handler: zod validation + optional Resend
  components/
    sections/
      Hero.tsx              # Act I
      Manifesto.tsx         # Act II
      Rituals.tsx           # Act III
      Team.tsx              # Act IV
      Reviews.tsx           # Act V
      Gallery.tsx           # Act VI
      Location.tsx          # Act VII
      FinalCta.tsx          # Act VIII (closing title + CTAs + footer; embeds BookingForm)
    ui/
      SmoothScroll.tsx      # Lenis + GSAP ScrollTrigger sync provider
      Preloader.tsx
      CustomCursor.tsx
      Nav.tsx               # nav bar + fullscreen overlay menu
      ScrollProgress.tsx
      GrainOverlay.tsx
      RevealText.tsx        # word/line reveal (GSAP SplitText)
      RevealImage.tsx       # blur/grayscale -> clear/color on enter
      MagneticButton.tsx
      CountUp.tsx
      BookingForm.tsx
  lib/
    content.ts              # ALL real brand data, copy, services, reviews, links
    booking.ts              # zod schema + types (shared client/server)
    gsap.ts                 # central GSAP plugin registration
  public/
    noise.svg               # grain texture (generated)
  .env.example
```

---

## Task 1: Scaffold Next.js project

**Files:**
- Create: project files via `create-next-app` into the existing `happiness/` dir.

- [ ] **Step 1: Scaffold into current directory**

The repo dir already exists with `docs/` and `.git`. Scaffold in place (the `.` target).

Run:
```bash
cd /Users/righthwm/happiness
npx --yes create-next-app@16.2.9 . --ts --tailwind --app --eslint --src-dir false --import-alias "@/*" --no-turbopack --use-npm --yes
```
If it refuses due to existing files, scaffold in a temp dir and copy:
```bash
cd /Users/righthwm/happiness && npx --yes create-next-app@16.2.9 ../happiness-scaffold --ts --tailwind --app --eslint --import-alias "@/*" --use-npm --yes \
  && cp -R ../happiness-scaffold/. ./ && rm -rf ../happiness-scaffold node_modules && npm install
```
Expected: `app/`, `package.json`, `tsconfig.json`, `next.config.*`, `app/globals.css` exist.

- [ ] **Step 2: Install runtime deps**

Run:
```bash
cd /Users/righthwm/happiness
npm install gsap@3.15.0 lenis@1.3.25 framer-motion@12.42.2 zod@4.4.3 resend@6.16.0
```
Expected: all five appear under `dependencies` in `package.json`.

- [ ] **Step 3: Configure remote images for Unsplash placeholders**

Edit `next.config.ts` (or `.mjs`) so the `images.remotePatterns` includes Unsplash:
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
```
(If the generated config is `.mjs`, adapt syntax accordingly.)

- [ ] **Step 4: Verify it builds and runs**

Run:
```bash
cd /Users/righthwm/happiness && npm run build
```
Expected: build completes with no errors.

- [ ] **Step 5: Commit**

```bash
cd /Users/righthwm/happiness
git add -A
git commit -m "chore: scaffold Next.js 16 + deps (gsap, lenis, framer-motion, zod, resend)"
```

---

## Task 2: Design tokens & global styles

**Files:**
- Modify: `app/globals.css`
- Create: `public/noise.svg`

- [ ] **Step 1: Generate the grain texture**

Create `public/noise.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160">
  <filter id="n">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>
  <rect width="100%" height="100%" filter="url(#n)" opacity="0.5"/>
</svg>
```

- [ ] **Step 2: Write globals.css**

Replace `app/globals.css` with (Tailwind v4 uses `@import` + `@theme`):
```css
@import "tailwindcss";

@theme {
  --color-ink: #0a0908;
  --color-bone: #f5f1ea;
  --color-champagne: #c9a876;
  --color-clay: #b07c5b;
  --color-sage: #8a8c7a;
  --font-display: var(--font-fraunces);
  --font-sans: var(--font-inter);
}

:root {
  --bg: #0a0908;
  --fg: #f5f1ea;
  color-scheme: dark;
}

* { box-sizing: border-box; }

html { -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }

body {
  margin: 0;
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font-sans), system-ui, sans-serif;
  /* page bg transitions across acts via JS-set --bg */
  transition: background-color 1.2s ease;
  overflow-x: hidden;
}

/* Lenis */
html.lenis, html.lenis body { height: auto; }
.lenis.lenis-smooth { scroll-behavior: auto !important; }
.lenis.lenis-stopped { overflow: hidden; }

/* Eyebrow label */
.eyebrow {
  font-size: 0.72rem;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--color-champagne);
  font-weight: 500;
}

/* Display headline base */
.display {
  font-family: var(--font-display), Georgia, serif;
  font-weight: 300;
  line-height: 0.95;
  letter-spacing: -0.01em;
}

/* Fine champagne hairline */
.hairline { height: 1px; background: color-mix(in srgb, var(--color-champagne) 60%, transparent); }

/* Global grain overlay */
.grain {
  position: fixed; inset: 0; z-index: 60; pointer-events: none;
  background-image: url("/noise.svg");
  opacity: 0.06; mix-blend-mode: overlay;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
  html { scroll-behavior: auto; }
}

/* Hide native cursor only on devices with a fine pointer (desktop) */
@media (hover: hover) and (pointer: fine) {
  body.has-custom-cursor, body.has-custom-cursor * { cursor: none; }
}
```

- [ ] **Step 3: Verify build**

Run: `cd /Users/righthwm/happiness && npm run build`
Expected: compiles (Tailwind v4 picks up `@theme` tokens).

- [ ] **Step 4: Commit**

```bash
git add app/globals.css public/noise.svg
git commit -m "feat: design tokens, grain texture, global base styles"
```

---

## Task 3: Central GSAP registration

**Files:**
- Create: `lib/gsap.ts`

- [ ] **Step 1: Write lib/gsap.ts**

```ts
"use client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText"; // free since GSAP 3.13

let registered = false;
export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  registered = true;
}

export { gsap, ScrollTrigger, SplitText };
```

- [ ] **Step 2: Commit**

```bash
git add lib/gsap.ts
git commit -m "feat: central GSAP plugin registration"
```

---

## Task 4: Brand content (single source of truth)

**Files:**
- Create: `lib/content.ts`

- [ ] **Step 1: Write lib/content.ts**

```ts
// All real Happiness data + editorial copy in one place.
// TODO(owner): replace MERO_URL, confirm weekend hours, fill prices & team.

export const BRAND = {
  name: "Happiness",
  tagline: "Salon de înfrumusețare",
  legal: "S.C. Happiness S.R.L.",
  city: "Cluj-Napoca",
  addressLine: "Strada Măcinului nr. 30A",
  addressArea: "Cartier Andrei Mureșanu, Cluj-Napoca",
  instagram: "https://instagram.com/happiness.cluj",
  instagramHandle: "@happiness.cluj",
  meroUrl: "https://mero.ro/", // TODO(owner): real Happiness Mero booking URL
  rating: 4.98,
  reviewCount: 4000,
};

// Hero title — 3 variants; index 0 is the default.
export const HERO_TITLES = [
  "Frumusețea ca formă de artă",
  "Un ritual, nu o programare",
  "Locul unde corpul și sufletul respiră",
];

export const HOURS = [
  { day: "Luni", value: "07:00 – 21:00", dow: 1 },
  { day: "Marți", value: "07:00 – 21:00", dow: 2 },
  { day: "Miercuri", value: "07:00 – 21:00", dow: 3 },
  { day: "Joi", value: "07:00 – 21:00", dow: 4 },
  { day: "Vineri", value: "07:00 – 21:00", dow: 5 },
  { day: "Sâmbătă", value: "09:00 – 19:00", dow: 6 }, // TODO(owner): confirm
  { day: "Duminică", value: "09:00 – 19:00", dow: 0 }, // TODO(owner): confirm
];

export const MANIFESTO =
  "Happiness este un loc de relaxare și înfrumusețare dedicat deopotrivă femeilor și bărbaților care vor să se simtă și să arate impecabil. Aici, profesionalismul, igiena fără compromis și tehnologia modernă se întâlnesc cu grija pentru detaliu. O echipă de specialiști transformă fiecare vizită într-un ritual pentru corp și suflet.";

export type Ritual = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  priceFrom?: string; // TODO(owner): real starting prices
  image: string;
  alt: string;
};

// Unsplash editorial placeholders — TODO(owner): replace with real salon photography.
export const RITUALS: Ritual[] = [
  {
    id: "epilare",
    eyebrow: "Pentru ea & pentru el",
    title: "Epilare definitivă",
    body: "Tehnologie laser de ultimă generație pentru o piele netedă, durabil. Full body sau zone individuale, în deplină siguranță.",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1600&auto=format&fit=crop",
    alt: "Detaliu de piele netedă în lumină difuză",
  },
  {
    id: "exilis",
    eyebrow: "Remodelare corporală",
    title: "Exilis BTL",
    body: "Fermitate, conturare și reducerea celulitei printr-o procedură neinvazivă, confortabilă, cu rezultate vizibile.",
    image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=1600&auto=format&fit=crop",
    alt: "Ambianță de tratament corporal premium",
  },
  {
    id: "masaj",
    eyebrow: "Echilibru",
    title: "Masaj",
    body: "Anticelulitic, terapeutic, sportiv, drenaj limfatic sau relaxare cu pietre vulcanice — fiecare gest, gândit pentru tine.",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1600&auto=format&fit=crop",
    alt: "Moment de masaj relaxant",
  },
  {
    id: "maini-picioare",
    eyebrow: "Detaliu",
    title: "Manichiură & Pedichiură",
    body: "De la oja semipermanentă și construcție în gel la pedichiură SPA de lux. Servicii dedicate și pentru bărbați.",
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=1600&auto=format&fit=crop",
    alt: "Manichiură rafinată",
  },
  {
    id: "cosmetica",
    eyebrow: "Lumină",
    title: "Cosmetică & îngrijire facială",
    body: "Tratamente faciale, masaj facial și laminare de sprâncene și gene pentru un ten odihnit, radiant.",
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=1600&auto=format&fit=crop",
    alt: "Tratament facial într-un cadru elegant",
  },
  {
    id: "micropigmentare",
    eyebrow: "Semnătură",
    title: "Micropigmentare",
    body: "Sprâncene și buze definite natural, cu tehnici fine și pigmenți de calitate. Serviciul nostru semnătură.",
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=1600&auto=format&fit=crop",
    alt: "Detaliu de privire și sprâncene definite",
  },
  {
    id: "gene-sprancene",
    eyebrow: "Privire",
    title: "Gene & Sprâncene",
    body: "Extensii Natural, Soft sau Mega Volume, stilizare, laminare și vopsit — pentru o privire intensă, fără efort zilnic.",
    image: "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?q=80&w=1600&auto=format&fit=crop",
    alt: "Detaliu gene și privire",
  },
  {
    id: "makeup-hair",
    eyebrow: "Eveniment",
    title: "Make-up & Hairstyling",
    body: "Machiaj de zi, de seară sau de mireasă, coafură și cursuri de self make-up. Pentru momentele care contează.",
    image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1600&auto=format&fit=crop",
    alt: "Pregătire make-up și coafură",
  },
  {
    id: "barbati",
    eyebrow: "Pentru el",
    title: "Servicii dedicate bărbaților",
    body: "Epilare, manichiură, pedichiură și cosmetică gândite pentru bărbați. Aceeași grijă, același standard.",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1600&auto=format&fit=crop",
    alt: "Îngrijire premium pentru bărbați",
  },
];

export type TeamMember = { name: string; role: string; image: string };
// TODO(owner): real specialists — names, roles, professional photos.
export const TEAM: TeamMember[] = [
  { name: "Specialist 1", role: "Micropigmentare & sprâncene", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop" },
  { name: "Specialist 2", role: "Cosmetică & îngrijire facială", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1200&auto=format&fit=crop" },
  { name: "Specialist 3", role: "Hairstyling & make-up", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop" },
  { name: "Specialist 4", role: "Masaj & terapie corporală", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop" },
];

export type Review = { quote: string; author: string };
// Reformulated-generic, no invented real names.
export const REVIEWS: Review[] = [
  { quote: "Un loc în care te simți răsfățat din prima secundă. Profesionalism și o atmosferă pe care nu o găsești oriunde.", author: "Clientă Happiness" },
  { quote: "Cea mai bună experiență de înfrumusețare din Cluj. Atenție la detalii și rezultate impecabile, de fiecare dată.", author: "Client Happiness" },
  { quote: "Igienă perfectă, echipă caldă și pricepută. Pleci de aici altă persoană — mai frumoasă și mai liniștită.", author: "Clientă Happiness" },
  { quote: "Recomand cu toată încrederea. Se simte că fiecare serviciu e gândit ca un ritual, nu ca o programare grăbită.", author: "Client Happiness" },
];

// Salon interior atmosphere — TODO(owner): real interior photos.
export const GALLERY: { image: string; alt: string }[] = [
  { image: "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?q=80&w=1600&auto=format&fit=crop", alt: "Interior salon, detaliu de lumină caldă" },
  { image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1600&auto=format&fit=crop", alt: "Spațiu de tratament minimalist" },
  { image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=1600&auto=format&fit=crop", alt: "Detaliu de design interior" },
  { image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=1600&auto=format&fit=crop", alt: "Atmosferă senzorială" },
  { image: "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?q=80&w=1600&auto=format&fit=crop", alt: "Zonă de relaxare" },
];

export const NAV_LINKS = [
  { label: "Ritualuri", href: "#ritualuri" },
  { label: "Echipa", href: "#echipa" },
  { label: "Recenzii", href: "#recenzii" },
  { label: "Atmosferă", href: "#atmosfera" },
  { label: "Locație", href: "#locatie" },
  { label: "Programare", href: "#programare" },
];
```

- [ ] **Step 2: Verify it type-checks**

Run: `cd /Users/righthwm/happiness && npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/content.ts
git commit -m "feat: centralized brand content and editorial copy"
```

---

## Task 5: Smooth scroll provider (Lenis + ScrollTrigger)

**Files:**
- Create: `components/ui/SmoothScroll.tsx`

- [ ] **Step 1: Write SmoothScroll.tsx**

```tsx
"use client";
import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    registerGsap();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // native scroll, no smoothing

    const lenis = new Lenis({ duration: 1.1, lerp: 0.1, smoothWheel: true });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const onRaf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onRaf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onRaf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
```

- [ ] **Step 2: Verify build**

Run: `cd /Users/righthwm/happiness && npm run build`
Expected: compiles.

- [ ] **Step 3: Commit**

```bash
git add components/ui/SmoothScroll.tsx
git commit -m "feat: Lenis smooth scroll synced with GSAP ScrollTrigger"
```

---

## Task 6: Reveal primitives (text + image)

**Files:**
- Create: `components/ui/RevealText.tsx`, `components/ui/RevealImage.tsx`

- [ ] **Step 1: Write RevealText.tsx**

```tsx
"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react"; // not installed -> use plain useEffect instead
```
Do NOT use `@gsap/react`. Use this implementation instead:
```tsx
"use client";
import { ElementType, useEffect, useRef } from "react";
import { registerGsap, gsap, ScrollTrigger, SplitText } from "@/lib/gsap";

type Props = {
  children: string;
  as?: ElementType;
  className?: string;
  /** "words" (default) or "lines" */
  split?: "words" | "lines";
};

export default function RevealText({ children, as: Tag = "p", className, split = "words" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    registerGsap();
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const st = SplitText.create(el, { type: split, linesClass: "rt-line", wordsClass: "rt-word" });
    const targets = split === "lines" ? st.lines : st.words;
    gsap.set(targets, { yPercent: 110, opacity: 0 });
    const anim = gsap.to(targets, {
      yPercent: 0,
      opacity: 1,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.04,
      scrollTrigger: { trigger: el, start: "top 85%" },
    });
    return () => { anim.scrollTrigger?.kill(); anim.kill(); st.revert(); };
  }, [children, split]);

  return (
    <Tag ref={ref as React.Ref<HTMLElement>} className={className} style={{ overflow: "hidden" }}>
      {children}
    </Tag>
  );
}
```

- [ ] **Step 2: Write RevealImage.tsx**

```tsx
"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { registerGsap, gsap } from "@/lib/gsap";

type Props = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

/** Image that develops from blur+grayscale to clear+color on viewport entry. */
export default function RevealImage({ src, alt, className, priority, sizes = "100vw" }: Props) {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const el = wrap.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.filter = "none"; el.style.transform = "none"; return;
    }
    const anim = gsap.fromTo(
      el,
      { filter: "blur(14px) grayscale(1)", scale: 1.12 },
      {
        filter: "blur(0px) grayscale(0)",
        scale: 1,
        duration: 1.4,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 80%" },
      }
    );
    return () => { anim.scrollTrigger?.kill(); anim.kill(); };
  }, []);

  return (
    <div ref={wrap} className={className} style={{ overflow: "hidden", willChange: "filter, transform" }}>
      <Image src={src} alt={alt} fill priority={priority} sizes={sizes} style={{ objectFit: "cover" }} />
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

Run: `cd /Users/righthwm/happiness && npm run build`
Expected: compiles (note: `RevealImage` needs a positioned parent with set dimensions when used, handled by section CSS).

- [ ] **Step 4: Commit**

```bash
git add components/ui/RevealText.tsx components/ui/RevealImage.tsx
git commit -m "feat: scroll reveal primitives (SplitText text + develop image)"
```

---

## Task 7: Micro-interaction UI (MagneticButton, CountUp)

**Files:**
- Create: `components/ui/MagneticButton.tsx`, `components/ui/CountUp.tsx`

- [ ] **Step 1: Write MagneticButton.tsx**

```tsx
"use client";
import { useRef } from "react";
import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: "solid" | "ghost";
};

export default function MagneticButton({ children, href, onClick, className = "", variant = "solid" }: Props) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);

  function onMove(e: React.MouseEvent) {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * 0.2}px, ${y * 0.25}px)`;
  }
  function onLeave() { if (ref.current) ref.current.style.transform = "translate(0,0)"; }

  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm tracking-wide transition-colors duration-300 will-change-transform";
  const styles =
    variant === "solid"
      ? "bg-[var(--color-champagne)] text-[var(--color-ink)] hover:bg-[color-mix(in_srgb,var(--color-champagne)_85%,white)]"
      : "border border-[color-mix(in_srgb,var(--color-champagne)_50%,transparent)] text-[var(--color-bone)] hover:border-[var(--color-champagne)]";

  const cls = `${base} ${styles} ${className}`;
  const Comp: typeof motion.a = href ? motion.a : (motion.button as typeof motion.a);
  const extra = href ? { href, target: href.startsWith("http") ? "_blank" : undefined, rel: "noreferrer" } : { onClick };

  return (
    <Comp ref={ref} className={cls} onMouseMove={onMove} onMouseLeave={onLeave} {...extra}>
      {children}
    </Comp>
  );
}
```

- [ ] **Step 2: Write CountUp.tsx**

```tsx
"use client";
import { useEffect, useRef, useState } from "react";

type Props = { to: number; decimals?: number; suffix?: string; className?: string };

export default function CountUp({ to, decimals = 0, suffix = "", className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setVal(to); return; }
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !done.current) {
        done.current = true;
        const start = performance.now();
        const dur = 1600;
        const tick = (now: number) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(to * eased);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);

  return <span ref={ref} className={className}>{val.toFixed(decimals)}{suffix}</span>;
}
```

- [ ] **Step 3: Verify build**

Run: `cd /Users/righthwm/happiness && npm run build`
Expected: compiles.

- [ ] **Step 4: Commit**

```bash
git add components/ui/MagneticButton.tsx components/ui/CountUp.tsx
git commit -m "feat: magnetic button and count-up animation"
```

---

## Task 8: Global chrome — GrainOverlay, ScrollProgress, CustomCursor, Preloader

**Files:**
- Create: `components/ui/GrainOverlay.tsx`, `components/ui/ScrollProgress.tsx`, `components/ui/CustomCursor.tsx`, `components/ui/Preloader.tsx`

- [ ] **Step 1: GrainOverlay.tsx**

```tsx
export default function GrainOverlay() {
  return <div className="grain" aria-hidden />;
}
```

- [ ] **Step 2: ScrollProgress.tsx**

```tsx
"use client";
import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? window.scrollY / h : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div aria-hidden className="fixed right-5 top-1/2 z-50 hidden h-32 w-px -translate-y-1/2 bg-[color-mix(in_srgb,var(--color-bone)_18%,transparent)] md:block">
      <div className="w-px bg-[var(--color-champagne)] origin-top" style={{ height: `${p * 100}%` }} />
    </div>
  );
}
```

- [ ] **Step 3: CustomCursor.tsx**

```tsx
"use client";
import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;
    document.body.classList.add("has-custom-cursor");

    let rx = 0, ry = 0, dx = 0, dy = 0, raf = 0;
    const onMove = (e: MouseEvent) => {
      dx = e.clientX; dy = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${dx}px, ${dy}px)`;
    };
    const loop = () => {
      rx += (dx - rx) * 0.18; ry += (dy - ry) * 0.18;
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(loop);
    };
    const grow = () => ring.current?.classList.add("cursor-grow");
    const shrink = () => ring.current?.classList.remove("cursor-grow");

    window.addEventListener("mousemove", onMove);
    document.querySelectorAll("a, button, [data-cursor]").forEach((el) => {
      el.addEventListener("mouseenter", grow); el.addEventListener("mouseleave", shrink);
    });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <>
      <div ref={dot} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[70] h-1.5 w-1.5 -ml-[3px] -mt-[3px] rounded-full bg-[var(--color-champagne)]" />
      <div ref={ring} aria-hidden className="cursor-ring pointer-events-none fixed left-0 top-0 z-[70] h-9 w-9 -ml-[18px] -mt-[18px] rounded-full border border-[color-mix(in_srgb,var(--color-champagne)_60%,transparent)] transition-[width,height,opacity] duration-300" />
    </>
  );
}
```
Add to `globals.css`:
```css
.cursor-ring.cursor-grow { width: 64px; height: 64px; margin-left: -32px; margin-top: -32px; opacity: 0.6; }
```

- [ ] **Step 4: Preloader.tsx**

```tsx
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
```

- [ ] **Step 5: Verify build**

Run: `cd /Users/righthwm/happiness && npm run build`
Expected: compiles.

- [ ] **Step 6: Commit**

```bash
git add components/ui/GrainOverlay.tsx components/ui/ScrollProgress.tsx components/ui/CustomCursor.tsx components/ui/Preloader.tsx app/globals.css
git commit -m "feat: global chrome — grain, scroll progress, custom cursor, preloader"
```

---

## Task 9: Navigation (bar + fullscreen overlay menu)

**Files:**
- Create: `components/ui/Nav.tsx`

- [ ] **Step 1: Write Nav.tsx**

```tsx
"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BRAND, NAV_LINKS } from "@/lib/content";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("lenis-stopped", open);
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[80] transition-colors duration-500 ${
          solid ? "bg-[color-mix(in_srgb,var(--color-ink)_82%,transparent)] backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="#top" className="display text-xl tracking-wide text-[var(--color-bone)]">{BRAND.name}</a>
          <button
            onClick={() => setOpen(true)}
            className="eyebrow flex items-center gap-3 text-[var(--color-bone)]"
            aria-label="Deschide meniul"
          >
            Meniu
            <span className="flex flex-col gap-1">
              <span className="block h-px w-6 bg-current" />
              <span className="block h-px w-6 bg-current" />
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[90] flex flex-col bg-[var(--color-ink)]"
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
              <span className="display text-xl text-[var(--color-bone)]">{BRAND.name}</span>
              <button onClick={() => setOpen(false)} className="eyebrow text-[var(--color-bone)]" aria-label="Închide meniul">
                Închide ✕
              </button>
            </div>
            <nav className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center gap-2 px-6">
              {NAV_LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="display w-fit text-5xl text-[var(--color-bone)] transition-colors hover:text-[var(--color-champagne)] md:text-7xl"
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 + i * 0.07, duration: 0.6, ease: "easeOut" }}
                >
                  {l.label}
                </motion.a>
              ))}
            </nav>
            <div className="mx-auto w-full max-w-7xl px-6 py-8 eyebrow text-[var(--color-bone)]">
              {BRAND.addressLine} · {BRAND.city}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `cd /Users/righthwm/happiness && npm run build`
Expected: compiles.

- [ ] **Step 3: Commit**

```bash
git add components/ui/Nav.tsx
git commit -m "feat: minimalist nav with fullscreen overlay menu"
```

---

## Task 10: Act I — Hero

**Files:**
- Create: `components/sections/Hero.tsx`

- [ ] **Step 1: Write Hero.tsx**

```tsx
"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { BRAND, HERO_TITLES } from "@/lib/content";

export default function Hero() {
  const section = useRef<HTMLElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      // Parallax depth: bg moves slower, content drifts up + fades
      gsap.to(bg.current, {
        yPercent: 18, scale: 1.12, ease: "none",
        scrollTrigger: { trigger: section.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(content.current, {
        yPercent: -28, opacity: 0, ease: "none",
        scrollTrigger: { trigger: section.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section id="top" ref={section} className="relative h-[100svh] w-full overflow-hidden">
      {/* TODO(owner): replace with real cinematic salon video/photo */}
      <div ref={bg} className="absolute inset-0 will-change-transform">
        <Image
          src="https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?q=80&w=2400&auto=format&fit=crop"
          alt="Atmosferă cinematică din salonul Happiness"
          fill priority sizes="100vw" style={{ objectFit: "cover" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-ink)]/55 via-[var(--color-ink)]/25 to-[var(--color-ink)]" />
      </div>

      <div ref={content} className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.8 }}
        >
          {BRAND.legal} — {BRAND.city.toUpperCase()}
        </motion.p>
        <motion.h1
          className="display mt-6 max-w-5xl text-[clamp(2.8rem,9vw,9rem)] text-[var(--color-bone)]"
          initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.15, duration: 1.1, ease: "easeOut" }}
        >
          {HERO_TITLES[0]}
        </motion.h1>

        <motion.div
          className="mt-10 flex items-center gap-3 text-[var(--color-bone)]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5, duration: 0.9 }}
        >
          <span className="text-[var(--color-champagne)]">★</span>
          <span className="text-lg font-medium">{BRAND.rating.toFixed(2)}</span>
          <span className="eyebrow normal-case tracking-[0.2em] text-[var(--color-bone)]/70">
            din peste {BRAND.reviewCount.toLocaleString("ro-RO")} de recenzii
          </span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        aria-hidden
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8, duration: 1 }}
      >
        <div className="relative h-14 w-px overflow-hidden bg-[color-mix(in_srgb,var(--color-bone)_30%,transparent)]">
          <motion.div
            className="absolute left-0 top-0 h-6 w-px bg-[var(--color-champagne)]"
            animate={{ y: [-24, 56] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `cd /Users/righthwm/happiness && npm run build`
Expected: compiles.

- [ ] **Step 3: Commit**

```bash
git add components/sections/Hero.tsx
git commit -m "feat: Act I hero with parallax depth, trust stamp, scroll indicator"
```

---

## Task 11: Act II — Manifesto

**Files:**
- Create: `components/sections/Manifesto.tsx`

- [ ] **Step 1: Write Manifesto.tsx**

```tsx
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
```

- [ ] **Step 2: Verify build**

Run: `cd /Users/righthwm/happiness && npm run build`
Expected: compiles.

- [ ] **Step 3: Commit**

```bash
git add components/sections/Manifesto.tsx
git commit -m "feat: Act II manifesto with line-by-line scroll reveal"
```

---

## Task 12: Act III — Ritualuri (services)

**Files:**
- Create: `components/sections/Rituals.tsx`

- [ ] **Step 1: Write Rituals.tsx**

```tsx
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
```

- [ ] **Step 2: Verify build**

Run: `cd /Users/righthwm/happiness && npm run build`
Expected: compiles.

- [ ] **Step 3: Commit**

```bash
git add components/sections/Rituals.tsx
git commit -m "feat: Act III editorial alternating services gallery"
```

---

## Task 13: Act IV — Echipa (team)

**Files:**
- Create: `components/sections/Team.tsx`

- [ ] **Step 1: Write Team.tsx**

```tsx
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
```

- [ ] **Step 2: Verify build & commit**

Run: `cd /Users/righthwm/happiness && npm run build`
```bash
git add components/sections/Team.tsx
git commit -m "feat: Act IV team portrait gallery (B&W -> color hover)"
```

---

## Task 14: Act V — Recenzii (reviews + count-up)

**Files:**
- Create: `components/sections/Reviews.tsx`

- [ ] **Step 1: Write Reviews.tsx**

```tsx
"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CountUp from "@/components/ui/CountUp";
import { REVIEWS, BRAND } from "@/lib/content";

export default function Reviews() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % REVIEWS.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="recenzii" className="relative px-6 py-32">
      <div className="mx-auto max-w-4xl text-center">
        <p className="eyebrow mb-12">Ce spun clienții</p>

        <div className="relative min-h-[220px] md:min-h-[260px]">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="display text-[clamp(1.5rem,3.4vw,2.6rem)] leading-snug text-[var(--color-bone)]"
            >
              “{REVIEWS[i].quote}”
              <footer className="mt-8 text-sm not-italic tracking-[0.2em] text-[var(--color-champagne)]">
                {REVIEWS[i].author.toUpperCase()}
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="mt-16 flex items-center justify-center gap-3">
          {REVIEWS.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Recenzia ${idx + 1}`}
              onClick={() => setI(idx)}
              className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-[var(--color-champagne)]" : "w-1.5 bg-[var(--color-bone)]/30"}`}
            />
          ))}
        </div>

        <div className="mt-20 flex flex-col items-center gap-2">
          <div className="display text-[clamp(3rem,8vw,7rem)] text-[var(--color-champagne)]">
            <CountUp to={BRAND.rating} decimals={2} />
          </div>
          <p className="eyebrow normal-case tracking-[0.2em] text-[var(--color-bone)]/70">
            din <CountUp to={BRAND.reviewCount} suffix="+" /> de recenzii
          </p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build & commit**

Run: `cd /Users/righthwm/happiness && npm run build`
```bash
git add components/sections/Reviews.tsx
git commit -m "feat: Act V reviews with sequential transition and count-up"
```

---

## Task 15: Act VI — Galerie (horizontal scroll, vertical on mobile)

**Files:**
- Create: `components/sections/Gallery.tsx`

- [ ] **Step 1: Write Gallery.tsx**

```tsx
"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { GALLERY } from "@/lib/content";

export default function Gallery() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const mm = gsap.matchMedia();
    // Horizontal scroll-jacking only on desktop with motion allowed
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const el = track.current!;
      const distance = el.scrollWidth - window.innerWidth;
      const tween = gsap.to(el, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: () => `+=${distance}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
      return () => tween.kill();
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="atmosfera" ref={section} className="relative md:h-[100svh] md:overflow-hidden">
      <div className="px-6 pt-24 md:absolute md:left-6 md:top-12 md:z-10">
        <p className="eyebrow mb-4">Atmosferă</p>
        <h2 className="display text-[clamp(2rem,5vw,4rem)] text-[var(--color-bone)]">În interiorul Happiness</h2>
      </div>

      {/* TODO(owner): replace with real salon interior photography */}
      <div
        ref={track}
        className="flex flex-col gap-6 px-6 py-12 md:h-full md:flex-row md:items-center md:gap-8 md:py-0 md:pl-[40vw] md:pr-[10vw] md:will-change-transform"
      >
        {GALLERY.map((g, idx) => (
          <div key={idx} className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-sm md:h-[60vh] md:w-[42vw] md:aspect-auto">
            <Image src={g.image} alt={g.alt} fill sizes="(max-width: 768px) 100vw, 42vw" className="object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build & commit**

Run: `cd /Users/righthwm/happiness && npm run build`
```bash
git add components/sections/Gallery.tsx
git commit -m "feat: Act VI horizontal-scroll atmosphere gallery (vertical on mobile)"
```

---

## Task 16: Booking schema (TDD)

**Files:**
- Create: `lib/booking.ts`, `lib/booking.test.ts`
- Modify: `package.json` (add test script + vitest)

- [ ] **Step 1: Install vitest**

Run:
```bash
cd /Users/righthwm/happiness && npm install -D vitest@latest
```
Add to `package.json` `"scripts"`: `"test": "vitest run"`.

- [ ] **Step 2: Write the failing test**

Create `lib/booking.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { bookingSchema } from "./booking";

describe("bookingSchema", () => {
  const valid = { name: "Ana Pop", phone: "0740123456", service: "epilare", date: "2026-07-10", message: "", website: "" };

  it("accepts a valid request", () => {
    expect(bookingSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a too-short name", () => {
    expect(bookingSchema.safeParse({ ...valid, name: "A" }).success).toBe(false);
  });

  it("rejects an invalid phone", () => {
    expect(bookingSchema.safeParse({ ...valid, phone: "abc" }).success).toBe(false);
  });

  it("rejects when honeypot 'website' is filled", () => {
    expect(bookingSchema.safeParse({ ...valid, website: "spam" }).success).toBe(false);
  });

  it("allows empty optional email but rejects malformed email", () => {
    expect(bookingSchema.safeParse({ ...valid, email: "" }).success).toBe(true);
    expect(bookingSchema.safeParse({ ...valid, email: "nope" }).success).toBe(false);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `cd /Users/righthwm/happiness && npm test`
Expected: FAIL — `bookingSchema` not found.

- [ ] **Step 4: Write lib/booking.ts**

```ts
import { z } from "zod";

const phoneRe = /^[+0-9][0-9 ()-]{6,19}$/;

export const bookingSchema = z.object({
  name: z.string().trim().min(2, "Numele este prea scurt").max(80),
  phone: z.string().trim().regex(phoneRe, "Număr de telefon invalid"),
  email: z.union([z.literal(""), z.string().email("Email invalid")]).optional(),
  service: z.string().trim().min(1, "Alege un serviciu"),
  date: z.string().trim().min(1, "Alege o dată/interval"),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
  // Honeypot: must be empty for a real human.
  website: z.literal("").optional().or(z.literal("")),
}).refine((d) => !d.website, { message: "Spam detectat", path: ["website"] });

export type BookingInput = z.infer<typeof bookingSchema>;
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd /Users/righthwm/happiness && npm test`
Expected: PASS (5 tests).

- [ ] **Step 6: Commit**

```bash
git add lib/booking.ts lib/booking.test.ts package.json package-lock.json
git commit -m "feat: booking zod schema with honeypot (tested)"
```

---

## Task 17: Booking API route (TDD)

**Files:**
- Create: `app/api/booking/route.ts`, `app/api/booking/route.test.ts`, `.env.example`

- [ ] **Step 1: Write the failing test**

Create `app/api/booking/route.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { POST } from "./route";

function req(body: unknown) {
  return new Request("http://localhost/api/booking", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/booking", () => {
  const valid = { name: "Ana Pop", phone: "0740123456", service: "epilare", date: "2026-07-10", message: "", email: "", website: "" };

  it("returns 200 ok for a valid request (no RESEND key => logs only)", async () => {
    const res = await POST(req(valid));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it("returns 400 for an invalid request", async () => {
    const res = await POST(req({ ...valid, phone: "x" }));
    expect(res.status).toBe(400);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/righthwm/happiness && npm test`
Expected: FAIL — cannot import `./route`.

- [ ] **Step 3: Write route.ts**

```ts
import { NextResponse } from "next/server";
import { bookingSchema } from "@/lib/booking";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON invalid" }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Date invalide" }, { status: 400 });
  }
  const data = parsed.data;

  // Optional email delivery, env-gated. No key => log only (works locally, no secrets).
  const key = process.env.RESEND_API_KEY;
  const to = process.env.BOOKING_TO_EMAIL;
  if (key && to) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(key);
      await resend.emails.send({
        from: process.env.BOOKING_FROM_EMAIL || "Happiness <onboarding@resend.dev>",
        to,
        subject: `Cerere de programare — ${data.name}`,
        text: [
          `Nume: ${data.name}`,
          `Telefon: ${data.phone}`,
          `Email: ${data.email || "—"}`,
          `Serviciu: ${data.service}`,
          `Dată/interval: ${data.date}`,
          `Mesaj: ${data.message || "—"}`,
        ].join("\n"),
      });
    } catch (e) {
      console.error("[booking] email failed", e);
      return NextResponse.json({ ok: false, error: "Trimitere eșuată" }, { status: 502 });
    }
  } else {
    console.log("[booking] new request (email disabled):", data);
  }

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd /Users/righthwm/happiness && npm test`
Expected: PASS.

- [ ] **Step 5: Write .env.example**

```bash
# Optional — booking form email delivery via Resend. Leave unset to log-only.
RESEND_API_KEY=
BOOKING_TO_EMAIL=
BOOKING_FROM_EMAIL=Happiness <onboarding@resend.dev>
```

- [ ] **Step 6: Commit**

```bash
git add app/api/booking/route.ts app/api/booking/route.test.ts .env.example
git commit -m "feat: /api/booking handler with optional Resend (tested)"
```

---

## Task 18: Booking form component

**Files:**
- Create: `components/ui/BookingForm.tsx`

- [ ] **Step 1: Write BookingForm.tsx**

```tsx
"use client";
import { useState } from "react";
import { bookingSchema } from "@/lib/booking";
import { RITUALS } from "@/lib/content";

type Status = "idle" | "submitting" | "success" | "error";

export default function BookingForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    const parsed = bookingSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
      setErrors(fieldErrors);
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const field =
    "w-full border-0 border-b border-[color-mix(in_srgb,var(--color-bone)_22%,transparent)] bg-transparent py-3 text-[var(--color-bone)] placeholder-[var(--color-bone)]/40 outline-none focus:border-[var(--color-champagne)] transition-colors";

  if (status === "success") {
    return (
      <div className="rounded-sm border border-[color-mix(in_srgb,var(--color-champagne)_40%,transparent)] p-10 text-center">
        <p className="display text-2xl text-[var(--color-bone)]">Mulțumim!</p>
        <p className="mt-3 text-[var(--color-bone)]/70">Cererea ta a fost trimisă. Te contactăm în cel mai scurt timp pentru confirmare.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6 md:grid-cols-2">
      {/* Honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <div>
        <input name="name" placeholder="Nume" className={field} aria-label="Nume" />
        {errors.name && <p className="mt-1 text-xs text-[var(--color-clay)]">{errors.name}</p>}
      </div>
      <div>
        <input name="phone" placeholder="Telefon" className={field} aria-label="Telefon" inputMode="tel" />
        {errors.phone && <p className="mt-1 text-xs text-[var(--color-clay)]">{errors.phone}</p>}
      </div>
      <div>
        <input name="email" placeholder="Email (opțional)" className={field} aria-label="Email" inputMode="email" />
        {errors.email && <p className="mt-1 text-xs text-[var(--color-clay)]">{errors.email}</p>}
      </div>
      <div>
        <select name="service" defaultValue="" className={`${field} appearance-none`} aria-label="Serviciu dorit">
          <option value="" disabled>Serviciu dorit</option>
          {RITUALS.map((r) => (
            <option key={r.id} value={r.title} className="bg-[var(--color-ink)]">{r.title}</option>
          ))}
        </select>
        {errors.service && <p className="mt-1 text-xs text-[var(--color-clay)]">{errors.service}</p>}
      </div>
      <div className="md:col-span-2">
        <input name="date" placeholder="Dată / interval preferat" className={field} aria-label="Dată sau interval preferat" />
        {errors.date && <p className="mt-1 text-xs text-[var(--color-clay)]">{errors.date}</p>}
      </div>
      <div className="md:col-span-2">
        <textarea name="message" placeholder="Mesaj (opțional)" rows={3} className={field} aria-label="Mesaj" />
      </div>

      <div className="md:col-span-2 flex flex-col items-start gap-4">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="rounded-full bg-[var(--color-champagne)] px-10 py-4 text-sm tracking-wide text-[var(--color-ink)] transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {status === "submitting" ? "Se trimite…" : "Trimite cererea"}
        </button>
        {status === "error" && <p className="text-sm text-[var(--color-clay)]">A apărut o eroare. Încearcă din nou sau programează direct pe Mero.</p>}
      </div>
    </form>
  );
}
```

- [ ] **Step 2: Verify build & commit**

Run: `cd /Users/righthwm/happiness && npm run build`
```bash
git add components/ui/BookingForm.tsx
git commit -m "feat: booking form with client validation and success state"
```

---

## Task 19: Act VII — Locație & Program

**Files:**
- Create: `components/sections/Location.tsx`

- [ ] **Step 1: Write Location.tsx**

```tsx
"use client";
import { useEffect, useState } from "react";
import { BRAND, HOURS } from "@/lib/content";

export default function Location() {
  const [today, setToday] = useState<number>(-1);
  useEffect(() => setToday(new Date().getDay()), []);

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
```

- [ ] **Step 2: Verify build & commit**

Run: `cd /Users/righthwm/happiness && npm run build`
```bash
git add components/sections/Location.tsx
git commit -m "feat: Act VII location + hours with brand-tinted map, today highlighted"
```

---

## Task 20: Act VIII — Final CTA, booking, footer

**Files:**
- Create: `components/sections/FinalCta.tsx`

- [ ] **Step 1: Write FinalCta.tsx**

```tsx
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
```

- [ ] **Step 2: Verify build & commit**

Run: `cd /Users/righthwm/happiness && npm run build`
```bash
git add components/sections/FinalCta.tsx
git commit -m "feat: Act VIII final CTA, booking form, footer"
```

---

## Task 21: Layout (fonts, metadata, JSON-LD, providers, chrome)

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Write app/layout.tsx**

```tsx
import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/ui/SmoothScroll";
import GrainOverlay from "@/components/ui/GrainOverlay";
import ScrollProgress from "@/components/ui/ScrollProgress";
import CustomCursor from "@/components/ui/CustomCursor";
import Preloader from "@/components/ui/Preloader";
import Nav from "@/components/ui/Nav";
import { BRAND, HOURS } from "@/lib/content";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://happiness.example"), // TODO(owner): real domain
  title: "Happiness — Salon de înfrumusețare premium în Cluj-Napoca",
  description:
    "Salon premium de înfrumusețare în Cluj-Napoca: epilare definitivă, micropigmentare, cosmetică, masaj, gene și sprâncene, make-up. 4.98★ din peste 4000 de recenzii.",
  openGraph: {
    title: "Happiness — Salon de înfrumusețare premium în Cluj-Napoca",
    description: "Un ritual pentru corp și suflet. 4.98★ din peste 4000 de recenzii.",
    locale: "ro_RO",
    type: "website",
  },
};

function jsonLd() {
  const dayMap: Record<number, string> = { 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday", 0: "Sunday" };
  return {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    name: BRAND.name,
    legalName: BRAND.legal,
    address: { "@type": "PostalAddress", streetAddress: BRAND.addressLine, addressLocality: BRAND.city, addressCountry: "RO" },
    aggregateRating: { "@type": "AggregateRating", ratingValue: BRAND.rating, reviewCount: BRAND.reviewCount },
    sameAs: [BRAND.instagram],
    openingHoursSpecification: HOURS.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: dayMap[h.dow],
      opens: h.value.split("–")[0].trim().replace(/\s/g, ""),
      closes: h.value.split("–")[1].trim().replace(/\s/g, ""),
    })),
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }} />
        <Preloader />
        <GrainOverlay />
        <CustomCursor />
        <ScrollProgress />
        <Nav />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Verify build & commit**

Run: `cd /Users/righthwm/happiness && npm run build`
```bash
git add app/layout.tsx
git commit -m "feat: root layout — fonts, SEO metadata, LocalBusiness JSON-LD, global chrome"
```

---

## Task 22: Page composition + background act transitions

**Files:**
- Modify: `app/page.tsx`
- Create: `components/ui/ActBackground.tsx`

- [ ] **Step 1: Write ActBackground.tsx (page bg color shifts per act)**

```tsx
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
```

- [ ] **Step 2: Write app/page.tsx**

```tsx
import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";
import Rituals from "@/components/sections/Rituals";
import Team from "@/components/sections/Team";
import Reviews from "@/components/sections/Reviews";
import Gallery from "@/components/sections/Gallery";
import Location from "@/components/sections/Location";
import FinalCta from "@/components/sections/FinalCta";
import ActBackground from "@/components/ui/ActBackground";

export default function Page() {
  return (
    <main>
      <ActBackground />
      <Hero />
      <Manifesto />
      <Rituals />
      <Team />
      <Reviews />
      <Gallery />
      <Location />
      <FinalCta />
    </main>
  );
}
```

- [ ] **Step 3: Verify build & commit**

Run: `cd /Users/righthwm/happiness && npm run build`
Expected: full build succeeds.
```bash
git add app/page.tsx components/ui/ActBackground.tsx
git commit -m "feat: compose 8 acts with scroll-driven background transitions"
```

---

## Task 23: Final verification pass (dev server + preview)

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server**

Use the preview tooling: `preview_start` (command `npm run dev`, cwd `/Users/righthwm/happiness`).

- [ ] **Step 2: Check console + snapshot the hero**

- `preview_console_logs` → expect no runtime errors (Unsplash images may warn about sizing only).
- `preview_snapshot` → expect eyebrow "S.C. HAPPINESS — CLUJ-NAPOCA", the hero title, and "4.98 ... din peste 4.000 de recenzii".

- [ ] **Step 3: Scroll-through checks**

- `preview_eval`: `window.scrollTo(0, document.body.scrollHeight)` then `preview_snapshot` → confirm footer shows `S.C. Happiness S.R.L.` and Mero/Instagram links.
- Confirm sections render: Ritualuri (9 articles), Echipa (4), Recenzii (count-up), Atmosferă, Locație (hours list).

- [ ] **Step 4: Booking form check**

- `preview_fill` the form fields with valid data, `preview_click` submit, `preview_snapshot` → expect "Mulțumim!" success state. Check `preview_logs` for `[booking] new request (email disabled)`.
- Submit empty → expect inline validation messages.

- [ ] **Step 5: Responsive + reduced-motion**

- `preview_resize` to 390×844 → `preview_screenshot`; confirm hero readable, gallery stacks vertically, nav works.
- `preview_screenshot` desktop hero for the final proof.

- [ ] **Step 6: Type-check, lint, tests, build (all green)**

Run:
```bash
cd /Users/righthwm/happiness && npx tsc --noEmit && npm run lint && npm test && npm run build
```
Expected: all pass.

- [ ] **Step 7: Final commit**

```bash
git add -A
git commit -m "chore: final verification pass — site complete and runnable" --allow-empty
```

---

## Self-Review — spec coverage

- Quiet-luxury palette + grain + tokens → Task 2. Typography (Fraunces/Inter) → Task 21.
- Lenis + GSAP ScrollTrigger + Framer Motion → Tasks 3, 5, 7, 9.
- 8 acts → Tasks 10–15, 19, 20, 22. Booking form (added requirement) → Tasks 16–18, 20.
- Custom cursor, preloader, overlay nav, scroll progress, text/image reveal, magnetic buttons, count-up, grain, bg transitions → Tasks 6, 7, 8, 9, 22.
- Real brand data centralized → Task 4; placeholders clearly TODO-marked throughout.
- Perf/responsive/reduced-motion: `gsap.matchMedia`, `prefers-reduced-motion` guards, `next/image`, lazy map iframe → Tasks 5, 6, 8, 15, 19.
- A11y: alt text, aria-labels, keyboard-usable nav/form, focus styles → Tasks 9, 13, 18.
- SEO: metadata + semantic h1/h2 + LocalBusiness JSON-LD w/ aggregateRating + hours → Task 21.
- Runnable locally (`npm run dev`), not a mockup → Task 23.

No placeholders-as-instructions remain; all `TODO(owner)` markers are intentional content handoffs (real photos, prices, Mero URL, weekend hours, domain), as agreed in the spec.
