"use client";

import { useState } from "react";

// calendar link (see page-level TALK_HREF note); email is the honest
// interim path for "grab 15 minutes" until the calendar exists
const CAL_URL = process.env.NEXT_PUBLIC_CAL_URL || "";
const GRAB_HREF = CAL_URL || "mailto:hello@frontrowoc.com";

// 04 Check availability — the gala availability request. The design
// export shipped this visual-only; here it POSTs to /api/booking
// (page:"gala") → the same Apps Script webhook as the other forms
// (see APPS-SCRIPT.md), with the hold form's honeypot and fail-soft
// error copy. Email + event date required.
type Fields = {
  email: string;
  date: string;
  name: string;
  venue: string;
  notes: string;
  company: string; // honeypot — humans never see or fill this
};

const EMPTY: Fields = { email: "", date: "", name: "", venue: "", notes: "", company: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function GfAvailability() {
  const [f, setF] = useState<Fields>(EMPTY);
  const [invalid, setInvalid] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const set =
    (k: keyof Fields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setF((p) => ({ ...p, [k]: e.target.value }));
      setInvalid((p) => {
        if (!p.has(k)) return p;
        const n = new Set(p);
        n.delete(k);
        return n;
      });
    };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setError("");

    const bad = new Set<string>();
    if (!f.email.trim() || !EMAIL_RE.test(f.email.trim())) bad.add("email");
    if (!f.date.trim()) bad.add("date");
    if (bad.size) {
      setInvalid(bad);
      setError("Email and event date are required.");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: f.email.trim(),
          date: f.date.trim(),
          name: f.name.trim(),
          venue: f.venue.trim(),
          notes: f.notes.trim(),
          page: "gala",
          company: f.company, // honeypot passthrough
        }),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || !data.ok) {
        setError(
          data.error ??
            "We couldn't send that — email us directly at hello@frontrowoc.com and we'll take it from there.",
        );
        return;
      }
      setSent(true);
    } catch {
      setError(
        "We couldn't send that — email us directly at hello@frontrowoc.com and we'll take it from there.",
      );
    } finally {
      setSending(false);
    }
  };

  const reset = () => {
    setF(EMPTY);
    setSent(false);
    setError("");
  };

  return (
    <div className="gf-form-wrap">
      {!sent ? (
        <form onSubmit={submit} noValidate>
          <div className="gf-sheet-head">
            <span>Availability request</span>
          </div>
          <div className="gf-form-grid">
            <div className="gf-field">
              <label htmlFor="gf-email">Email *</label>
              <input
                id="gf-email"
                type="email"
                autoComplete="email"
                placeholder="you@organization.org"
                value={f.email}
                onChange={set("email")}
                className={invalid.has("email") ? "gf-invalid" : undefined}
                aria-required="true"
                aria-invalid={invalid.has("email") || undefined}
              />
            </div>
            <div className="gf-field">
              <label htmlFor="gf-date">Event Date *</label>
              <input
                id="gf-date"
                type="text"
                placeholder="MM/DD/YYYY"
                value={f.date}
                onChange={set("date")}
                className={`gf-mono-input${invalid.has("date") ? " gf-invalid" : ""}`}
                aria-required="true"
                aria-invalid={invalid.has("date") || undefined}
              />
            </div>
            <div className="gf-field">
              <label htmlFor="gf-name">
                Name <span className="gf-opt">— Optional</span>
              </label>
              <input
                id="gf-name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                value={f.name}
                onChange={set("name")}
              />
            </div>
            <div className="gf-field">
              <label htmlFor="gf-venue">
                Venue or City <span className="gf-opt">— Optional</span>
              </label>
              <input
                id="gf-venue"
                type="text"
                placeholder="Venue, city"
                value={f.venue}
                onChange={set("venue")}
              />
            </div>
          </div>
          <div className="gf-field gf-notes">
            <label htmlFor="gf-notes">
              Tell Us About the Event <span className="gf-opt">— Optional</span>
            </label>
            <textarea
              id="gf-notes"
              rows={5}
              placeholder="Annual gala, 500 guests, honoree program, live auction, remote donors, need recap + sponsor clips afterward…"
              value={f.notes}
              onChange={set("notes")}
            />
          </div>

          {/* honeypot — mirrors the other forms */}
          <input
            type="text"
            name="company"
            value={f.company}
            onChange={set("company")}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
          />

          <div className="gf-form-actions">
            <button type="submit" className="gf-submit" disabled={sending}>
              {sending ? "Sending…" : "Check My Date"}
            </button>
            <div className="gf-booking-line">
              Prefer to talk it through?{" "}
              {/* routes to the calendar once NEXT_PUBLIC_CAL_URL is set */}
              <a href={GRAB_HREF}>
                Grab 15 minutes with the production lead <span aria-hidden="true">→</span>
              </a>
            </div>
            <div className="gf-form-note">
              You&rsquo;ll talk directly with the production lead before anything is quoted.
            </div>
          </div>
          {error && (
            <p className="gf-form-error" role="alert">
              {error}
            </p>
          )}
        </form>
      ) : (
        <div className="gf-received">
          <div className="gf-received-tag">
            <span className="gf-received-dot" />
            <span>Received</span>
          </div>
          <div className="gf-received-head">
            Your date is
            <br />
            on the board.
          </div>
          <p className="gf-received-copy">
            We&rsquo;ll review the details and follow up with availability, a recommended crew
            shape, and next steps.
          </p>
          <button type="button" className="gf-received-reset" onClick={reset}>
            Send another request
          </button>
        </div>
      )}
    </div>
  );
}
