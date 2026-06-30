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
