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
