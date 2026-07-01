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
