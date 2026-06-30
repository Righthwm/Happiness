# Happiness — Digital Flagship Experience · Design Spec

**Date:** 2026-06-30
**Project:** Premium scrollytelling website for Happiness — Salon de înfrumusețare, Cluj-Napoca
**Location of build:** `/Users/righthwm/happiness`

---

## 1. Goal

A premium, cinematic, scrollytelling "digital flagship" website for a top beauty
salon in Cluj-Napoca. It must read like a luxury jewelry house / 5-star hotel /
Awwwards Site-of-the-Day, **not** a typical salon landing page. Success criteria:

1. Immediate wow-effect within the first 3 seconds (Hero).
2. Section-to-section transitions feel directed (cinematic), not incidental.
3. All real Happiness data integrated correctly.
4. Mobile performance is not sacrificed for effects.

This is presented to the end client as a sellable product; execution quality must
visibly exceed any typical salon site.

## 2. Creative Direction — "Quiet Luxury Futurism"

Hybrid of a minimalist Japanese spa, a jewelry house, and Apple/Aesop. Calm,
sensorial, expensive, slightly futuristic. **Forbidden:** bubblegum pink, kitsch
script fonts, emoji icons, free-Wix-template layouts, harsh Bootstrap shadows,
meaningless basic fade-ins.

### Palette (CSS variables, flexible to client refinement)
- `--ink: #0A0908` (near-black base)
- `--bone: #F5F1EA` (warm off-white)
- `--champagne: #C9A876` (antique gold accent — used sparingly: hairlines, hover, micro-icons)
- `--clay: #B07C5B` (warm terracotta secondary, organic warmth without pink)
- `--sage: #8A8C7A` (very desaturated sage, optional secondary)
- Subtle grain/noise overlay globally. Page background tone shifts progressively
  across acts (deep dark → warm → dark) to mark narrative progress. No cheap gradients.

### Typography (`next/font`, Google Fonts)
- Display serif: **Fraunces** (editorial, high-contrast) for huge titles (8–14vw on desktop, generous letter-spacing).
- Body sans: **Inter** (geometric, clean). Eyebrows: small, uppercase, wide letter-spacing.

## 3. Tech Stack

- **Framework:** Next.js 14+ (App Router) + TypeScript + Tailwind CSS.
- **Scroll animation:** GSAP + ScrollTrigger (pinning, parallax, scroll-linked reveals).
- **Micro-interactions / transitions:** Framer Motion (menu overlay, page/element transitions).
- **Smooth scroll:** Lenis (cinematic feel), synced with ScrollTrigger.
- **Fonts:** `next/font/google` (Fraunces + Inter).
- **Images:** `next/image`, lazy-loaded. Unsplash editorial spa/beauty images as
  clearly-marked placeholders (`{/* TODO: poză profesională ... */}`) demonstrating
  layout, to be replaced with real salon photography.
- **3D:** Deferred. No Three.js/R3F in v1 (avoids mobile-perf risk). Hero is
  cinematic CSS/image. R3F is a documented future extension point.
- **Booking email (optional):** Resend, gated behind `RESEND_API_KEY` env var.

## 4. Brand Data (real — do not invent)

- **Name:** Happiness — Salon de înfrumusețare. **Legal:** S.C. Happiness S.R.L.
- **Address:** Strada Măcinului nr. 30A, Cluj-Napoca, Cartier Andrei Mureșanu.
- **Hours:** Marți–Vineri & Luni: 07:00–21:00 · Sâmbătă–Duminică: 09:00–19:00
  (weekend hours marked TODO-confirm before publishing).
- **Reputation:** 4.98/5 from 4000+ reviews (prominent social proof).
- **Instagram:** instagram.com/happiness.cluj
- **Online booking:** Mero platform (120+ services). Mero link is a placeholder
  constant to be filled with the real URL.
- **Brand tone:** relaxation + beauty for women and men; high quality, hygiene,
  professionalism; team of specialists + modern techniques/equipment; "răsfăț
  pentru corp și suflet."

All brand data centralized in `lib/content.ts` so copy/prices/links are edited in one place.

## 5. Narrative Structure — 8 Acts (single page, scrollytelling)

Each act is a directed "scene". Transitions: fade, scale, word/line text reveal,
images developing from blur/grayscale into clarity/color on viewport entry.

- **ACT I — Hero.** Fullscreen `100svh`. Editorial image + slow Ken Burns + grain
  overlay + parallax depth (text moves slower than background). Eyebrow
  "S.C. HAPPINESS — CLUJ-NAPOCA". Large editorial title — 3 copy variants to choose:
  (a) "Frumusețea ca formă de artă", (b) "Un ritual, nu o programare",
  (c) "Locul unde corpul și sufletul respiră". Rating 4.98★ / 4000+ reviews as an
  elegant trust stamp. Subtle animated scroll indicator.
- **ACT II — Manifesto.** Scroll-linked word/line text reveal. Editorial paraphrase
  of the brand description (body–soul balance, professionalism, specialists, modern
  technology). Static/very-slow-parallax background, no distraction.
- **ACT III — Ritualuri (Services).** NOT a card grid. Editorial gallery: each
  category gets its own scroll "moment" — large image one side, text the other,
  reveal on entry (slide+fade / clip-path). Alternating left/right for rhythm.
  **6–9 pillars:** Epilare definitivă, Exilis BTL, Masaj, Manichiură & Pedichiură,
  Cosmetică & îngrijire facială, Micropigmentare (signature), Gene & Sprâncene,
  Make-up & Hairstyling, Servicii dedicate bărbaților. Each: short poetic title +
  1–2 sentences + optional "de la X lei" (placeholder) + Mero CTA. Refined image
  hover (subtle scale + color overlay).
- **ACT IV — Echipa.** Editorial portrait gallery. Large B&W photos → color on
  hover / reveal on scroll. Placeholders (TODO) for names + specialization. Emphasis
  on expertise and continuous professional training.
- **ACT V — Recenzii (Social proof).** Not a cheap carousel. 3–4 reformulated-generic
  reviews (no invented names) shown large, one at a time, elegant scroll/interval
  transition. 4.98 / 4000+ reaffirmed with a count-up animation on viewport entry.
- **ACT VI — Galerie atmosferă.** Immersive mini-gallery of salon interior
  (clearly-marked placeholders). Horizontal scroll-jacking (controlled) on desktop;
  degrades to vertical stack on mobile. A moment of cinematic variety.
- **ACT VII — Locație & Program.** Styled Google Maps embed in brand tones (custom
  styling, not raw default iframe) with address Str. Măcinului 30A. Operating hours
  displayed elegantly, current day subtly highlighted.
- **ACT VIII — CTA final + Programare + Footer.** Big closing impact title
  ("Rândul tău să strălucești" or similar). Integrated **booking form** (see §6).
  Primary CTA → Mero. Secondary CTA → Instagram. Minimalist footer: legal name
  S.C. Happiness S.R.L., address, social links, discreet GDPR/cookie note.

## 6. Booking Form (added per user request)

Mero stays the **primary** CTA; the form is an alternative "appointment request" path.

- **UI:** premium form matching the design system — fields: Nume, Telefon, Email
  (optional), Serviciu dorit (select from the 6–9 pillars), Dată/interval preferat,
  Mesaj (optional). Full client-side validation, refined focus/error states,
  elegant success state.
- **Backend:** Next.js Route Handler `POST /api/booking`.
  - Validates payload (zod). On success returns `{ ok: true }`.
  - **Email is optional and env-gated:** if `RESEND_API_KEY` is set, sends the
    request via Resend to the salon inbox; if not set, logs the submission
    server-side and still returns success (so it runs locally today with zero secrets).
  - Honeypot field for basic spam protection.
- **No database** in v1 (YAGNI). Email/logging is sufficient for an appointment request.

## 7. Cross-cutting Interactions (premium feel)

- Custom cursor on desktop (small dot + trailing ring, morphs on hover over links/images). Disabled on touch.
- Cinematic preloader on first load (developing logotype / fine progress bar — not a generic spinner).
- Navigation: minimalist menu, transparent over hero → solid background on scroll;
  fullscreen overlay menu with staggered link animation.
- Subtle side scroll-progress indicator.
- Micro-animations on all interactive elements (underline draw, subtle scale).
- Word/line text reveal on scroll for key titles (GSAP SplitText-style; custom split to avoid the paid SplitText plugin).
- Very subtle global grain/noise overlay.
- Background color transitions across acts.

## 8. Performance, Responsive, A11y, SEO

- Equally impressive on mobile: adapt scroll-jacking/parallax for touch (fewer heavy
  effects, keep visual identity + text transitions). Horizontal gallery degrades to vertical.
- Respect `prefers-reduced-motion` (disable heavy motion, keep content accessible).
- Lazy-load images/video; optimize Core Web Vitals (`next/image`, font display swap).
- A11y: sufficient text contrast, alt-text on images, full keyboard navigation, focus-visible states.
- SEO: meta title/description targeting "salon premium Cluj-Napoca"; semantic
  structure (single h1, h2 per act); schema.org `LocalBusiness` JSON-LD with real
  address, opening hours, and `aggregateRating` (4.98 / 4000+).

## 9. File / Component Structure

```
happiness/
  app/
    layout.tsx            # fonts, metadata, JSON-LD, global providers, grain overlay
    page.tsx              # composes the 8 acts in order
    globals.css           # CSS variables, base, grain, utilities
    api/booking/route.ts  # POST handler (zod + optional Resend)
  components/
    sections/             # Hero, Manifesto, Rituals, Team, Reviews, Gallery, Location, FinalCta
    ui/                   # CustomCursor, Preloader, Nav, ScrollProgress, RevealText,
                          #   RevealImage, MagneticButton, CountUp, BookingForm
  lib/
    content.ts            # ALL real brand data, copy, services, reviews, links (single source)
    smooth-scroll.tsx     # Lenis provider + GSAP ScrollTrigger sync
    use-reveal.ts         # shared scroll-reveal hooks
  public/                 # static assets, noise texture
  docs/superpowers/specs/ # this spec
```

- Each section is a focused, independently-understandable component consuming
  `lib/content.ts`. Animation logic lives in `lib/` hooks / `components/ui` so
  section components stay readable.

## 10. Out of Scope (YAGNI for v1)

- Three.js/R3F 3D hero (documented future extension).
- CMS / database / admin panel.
- Multi-language (Romanian only; salon serves Cluj).
- Real booking transactions (Mero handles that); form is request-only.
- Listing all 120+ services (only 6–9 experience pillars shown).

## 11. Deliverable

Complete, locally-runnable site (`npm run dev`) with all sections implemented and
animations functional — not a static mockup. Priority order: (1) flawless Hero,
(2) directed section transitions, (3) correct real Happiness data, (4) mobile
performance preserved over effects.
