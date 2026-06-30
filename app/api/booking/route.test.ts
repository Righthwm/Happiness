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
