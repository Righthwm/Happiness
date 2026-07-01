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
