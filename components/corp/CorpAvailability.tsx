"use client";

import { useState } from "react";

// calendar link (see page-level TALK_HREF note); email is the honest
// interim path for "grab 15 minutes" until the calendar exists
const CAL_URL = process.env.NEXT_PUBLIC_CAL_URL || "";
const GRAB_HREF = CAL_URL || "mailto:hello@frontrowoc.com";

// 04 Check availability — the corporate availability request. The
// design export shipped this visual-only; here it POSTs to
// /api/booking (page:"corporate") → the same Apps Script webhook as
// the other forms (see APPS-SCRIPT.md), with the hold form's honeypot
// and fail-soft error copy. Email + event date required.
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

export default function CorpAvailability() {
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
          page: "corporate",
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
    <div className="cp-form-wrap">
      {!sent ? (
        <form onSubmit={submit} noValidate>
          <div className="cp-sheet-head">
            <span>Availability request</span>
          </div>
          <div className="cp-form-grid">
            <div className="cp-field">
              <label htmlFor="cp-email">Email *</label>
              <input
                id="cp-email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={f.email}
                onChange={set("email")}
                className={invalid.has("email") ? "cp-invalid" : undefined}
                aria-required="true"
                aria-invalid={invalid.has("email") || undefined}
              />
            </div>
            <div className="cp-field">
              <label htmlFor="cp-date">Event Date *</label>
              <input
                id="cp-date"
                type="text"
                placeholder="MM/DD/YYYY"
                value={f.date}
                onChange={set("date")}
                className={`cp-mono-input${invalid.has("date") ? " cp-invalid" : ""}`}
                aria-required="true"
                aria-invalid={invalid.has("date") || undefined}
              />
            </div>
            <div className="cp-field">
              <label htmlFor="cp-name">
                Name <span className="cp-opt">— Optional</span>
              </label>
              <input
                id="cp-name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                value={f.name}
                onChange={set("name")}
              />
            </div>
            <div className="cp-field">
              <label htmlFor="cp-venue">
                Venue or City <span className="cp-opt">— Optional</span>
              </label>
              <input
                id="cp-venue"
                type="text"
                placeholder="Venue, city"
                value={f.venue}
                onChange={set("venue")}
              />
            </div>
          </div>
          <div className="cp-field cp-notes">
            <label htmlFor="cp-notes">
              Tell Us About the Event <span className="cp-opt">— Optional</span>
            </label>
            <textarea
              id="cp-notes"
              rows={5}
              placeholder="Annual sales kickoff, 400 people, keynote + livestream, Anaheim ballroom, need recap clips afterward…"
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

          <div className="cp-form-actions">
            <button type="submit" className="cp-submit" disabled={sending}>
              {sending ? "Sending…" : "Check My Date"}
            </button>
            <div className="cp-booking-line">
              Prefer to talk it through?{" "}
              {/* routes to the calendar once NEXT_PUBLIC_CAL_URL is set */}
              <a href={GRAB_HREF}>
                Grab 15 minutes with the production lead <span aria-hidden="true">→</span>
              </a>
            </div>
            <div className="cp-form-note">
              You&rsquo;ll talk directly with the production lead before anything is quoted.
            </div>
          </div>
          {error && (
            <p className="cp-form-error" role="alert">
              {error}
            </p>
          )}
        </form>
      ) : (
        <div className="cp-received">
          <div className="cp-received-tag">
            <span className="cp-received-dot" />
            <span>Received</span>
          </div>
          <div className="cp-received-head">
            Your date is
            <br />
            on the board.
          </div>
          <p className="cp-received-copy">
            We&rsquo;ll review the details and follow up with availability, a recommended crew
            shape, and next steps.
          </p>
          <button type="button" className="cp-received-reset" onClick={reset}>
            Send another request
          </button>
        </div>
      )}
    </div>
  );
}
