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
