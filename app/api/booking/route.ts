import { NextResponse } from "next/server";

// Homepage booking sheet — same shape and hardening as /api/hold, with
// the homepage's extra fields (event type + notes) and page:"home".
// Forwards to the same Apps Script webhook (HOLD_WEBHOOK_URL); the
// script emails hello@frontrowoc.com and appends a sheet row (see
// APPS-SCRIPT.md — update the script once to carry TYPE/NOTES).
export const runtime = "nodejs";

const MAX_BODY_BYTES = 4096; // booking sheet carries a free-text notes field
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FRIENDLY_FAIL =
  "We couldn't send that — email hello@frontrowoc.com and we'll take it from there.";

export async function POST(req: Request) {
  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 },
    );
  }
  if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) {
    return NextResponse.json(
      { ok: false, error: "Request too large." },
      { status: 413 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      throw new Error("not an object");
    }
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 },
    );
  }

  const field = (k: string) =>
    typeof body[k] === "string" ? (body[k] as string).trim() : "";
  const name = field("name"),
    org = field("org"),
    email = field("email"),
    phone = field("phone"),
    date = field("date"),
    venue = field("venue"),
    type = field("type"),
    notes = field("notes").slice(0, 2000),
    company = field("company");

  // Honeypot: a filled "company" means a bot — return 200, forward nothing.
  if (company) {
    return NextResponse.json({ ok: true });
  }

  if (!name || !email || !date) {
    return NextResponse.json(
      { ok: false, error: "Name, email, and event date are required." },
      { status: 400 },
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "That email doesn't look right." },
      { status: 400 },
    );
  }

  const hook = process.env.HOLD_WEBHOOK_URL;
  if (!hook) {
    // No webhook minted yet (see APPS-SCRIPT.md) — fail soft with the email.
    return NextResponse.json(
      { ok: false, error: FRIENDLY_FAIL },
      { status: 502 },
    );
  }

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 5000);
    const res = await fetch(hook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name,
        org,
        email,
        phone,
        date,
        venue,
        type,
        notes,
        page: "home",
        ts: new Date().toISOString(),
        ua: req.headers.get("user-agent") ?? "",
      }),
      signal: ctrl.signal,
      // Apps Script web apps answer POSTs with a 302 to googleusercontent —
      // follow it (fetch default) so a healthy hook reads as ok.
      redirect: "follow",
    });
    clearTimeout(timer);
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: FRIENDLY_FAIL },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: FRIENDLY_FAIL },
      { status: 502 },
    );
  }
}
