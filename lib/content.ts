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
    image: "https://images.unsplash.com/photo-1519824145371-296894a0daa9?q=80&w=1600&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?q=80&w=1600&auto=format&fit=crop",
    alt: "Manichiură rafinată",
  },
  {
    id: "cosmetica",
    eyebrow: "Lumină",
    title: "Cosmetică & îngrijire facială",
    body: "Tratamente faciale, masaj facial și laminare de sprâncene și gene pentru un ten odihnit, radiant.",
    image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=1600&auto=format&fit=crop",
    alt: "Tratament facial într-un cadru elegant",
  },
  {
    id: "micropigmentare",
    eyebrow: "Semnătură",
    title: "Micropigmentare",
    body: "Sprâncene și buze definite natural, cu tehnici fine și pigmenți de calitate. Serviciul nostru semnătură.",
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=1600&auto=format&fit=crop",
    alt: "Detaliu de privire și sprâncene definite",
  },
  {
    id: "gene-sprancene",
    eyebrow: "Privire",
    title: "Gene & Sprâncene",
    body: "Extensii Natural, Soft sau Mega Volume, stilizare, laminare și vopsit — pentru o privire intensă, fără efort zilnic.",
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=1600&auto=format&fit=crop",
    alt: "Detaliu gene și privire",
  },
  {
    id: "makeup-hair",
    eyebrow: "Eveniment",
    title: "Make-up & Hairstyling",
    body: "Machiaj de zi, de seară sau de mireasă, coafură și cursuri de self make-up. Pentru momentele care contează.",
    image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=1600&auto=format&fit=crop",
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
  { image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=1600&auto=format&fit=crop", alt: "Interior salon, detaliu de lumină caldă" },
  { image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1600&auto=format&fit=crop", alt: "Spațiu de tratament minimalist" },
  { image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=1600&auto=format&fit=crop", alt: "Detaliu de design interior" },
  { image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1600&auto=format&fit=crop", alt: "Atmosferă senzorială" },
  { image: "https://images.unsplash.com/photo-1470259078422-826894b933aa?q=80&w=1600&auto=format&fit=crop", alt: "Zonă de relaxare" },
];

export const NAV_LINKS = [
  { label: "Ritualuri", href: "#ritualuri" },
  { label: "Echipa", href: "#echipa" },
  { label: "Recenzii", href: "#recenzii" },
  { label: "Atmosferă", href: "#atmosfera" },
  { label: "Locație", href: "#locatie" },
  { label: "Programare", href: "#programare" },
];
