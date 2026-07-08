"use client";

import { useState } from "react";
import Slate from "./Slate";
import { EVENT_TYPES } from "./data";

// 03 Contact — the booking sheet. POSTs to /api/booking, which relays
// to the same Apps Script webhook as the /galas hold form (see
// APPS-SCRIPT.md) and lands in hello@frontrowoc.com. Mirrors the hold
// form's honeypot ("company") and fail-soft error copy.
type Fields = {
  name: string;
  org: string;
  email: string;
  phone: string;
  date: string;
  venue: string;
  notes: string;
  company: string; // honeypot — humans never see or fill this
};

const EMPTY: Fields = {
  name: "",
  org: "",
  email: "",
  phone: "",
  date: "",
  venue: "",
  notes: "",
  company: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function BookingSheet() {
  const [f, setF] = useState<Fields>(EMPTY);
  const [type, setType] = useState(-1);
  const [invalid, setInvalid] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    if (!f.name.trim()) bad.add("name");
    if (!f.email.trim() || !EMAIL_RE.test(f.email.trim())) bad.add("email");
    if (!f.date.trim()) bad.add("date");
    if (bad.size) {
      setInvalid(bad);
      setError("Name, email, and event date are required.");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: f.name.trim(),
          org: f.org.trim(),
          email: f.email.trim(),
          phone: f.phone.trim(),
          date: f.date.trim(),
          venue: f.venue.trim(),
          type: type >= 0 ? EVENT_TYPES[type] : "",
          notes: f.notes.trim(),
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

  const reset = (e: React.MouseEvent) => {
    e.preventDefault();
    setF(EMPTY);
    setType(-1);
    setSent(false);
    setError("");
  };

  const cls = (k: string) => (invalid.has(k) ? "hm-invalid" : undefined);

  return (
    <section className="hm-book" id="book">
      <div className="hm-section-head">
        <Slate idx="03" name="Contact us" sub="Dates, availability, and holds" />
      </div>

      <div className="hm-book-title">
        <div className="hm-bt-1">Hold the</div>
        <div className="hm-bt-2 hm-outline">
          date<span className="hm-dot">.</span>
        </div>
      </div>
      <p className="hm-book-lede">
        Tell us the date, venue, and shape of the show. We&rsquo;ll confirm availability,
        recommend the right camera plan, and send back a clean path forward.
      </p>

      <div className="hm-book-body">
        {!sent ? (
          <form className="hm-sheet" onSubmit={submit} noValidate>
            <div className="hm-sheet-head">
              <span>Availability Request</span>
            </div>
            <div className="hm-sheet-grid">
              <div className="hm-field">
                <label htmlFor="ct-name">Name *</label>
                <input id="ct-name" type="text" placeholder="Your name" value={f.name} onChange={set("name")} className={cls("name")} />
              </div>
              <div className="hm-field">
                <label htmlFor="ct-org">Organization</label>
                <input id="ct-org" type="text" placeholder="Company, org, or artist" value={f.org} onChange={set("org")} />
              </div>
              <div className="hm-field">
                <label htmlFor="ct-email">Email *</label>
                <input id="ct-email" type="email" placeholder="you@org.com" value={f.email} onChange={set("email")} className={cls("email")} />
              </div>
              <div className="hm-field">
                <label htmlFor="ct-phone">Phone</label>
                <input id="ct-phone" type="tel" placeholder="(714) 555-0000" value={f.phone} onChange={set("phone")} />
              </div>
              <div className="hm-field">
                <label htmlFor="ct-date">Event date *</label>
                <input id="ct-date" type="text" className={`hm-mono-input${invalid.has("date") ? " hm-invalid" : ""}`} placeholder="MM/DD/YYYY" value={f.date} onChange={set("date")} />
              </div>
              <div className="hm-field">
                <label htmlFor="ct-venue">Venue / City</label>
                <input id="ct-venue" type="text" placeholder="Venue, city" value={f.venue} onChange={set("venue")} />
              </div>
            </div>

            <div className="hm-event-types">
              <div className="hm-et-label">Event type</div>
              <div className="hm-et-chips">
                {EVENT_TYPES.map((label, i) => (
                  <button
                    key={label}
                    type="button"
                    className={`hm-et-chip${type === i ? " hm-sel" : ""}`}
                    onClick={() => setType(type === i ? -1 : i)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="hm-field hm-notes">
              <label htmlFor="ct-notes">About the show</label>
              <textarea
                id="ct-notes"
                rows={4}
                placeholder="Audience size, run of show, screens in the room, where it streams — whatever you have so far."
                value={f.notes}
                onChange={set("notes")}
              />
            </div>

            {/* honeypot — mirrors the /galas hold form */}
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

            <div className="hm-sheet-submit">
              <button type="submit" className="hm-btn-primary" disabled={sending}>
                {sending ? "Sending…" : "Check availability"}
              </button>
              <span className="hm-req-note">* Required — everything else can come later</span>
            </div>
            {error && (
              <p className="hm-sheet-error" role="alert">
                {error}
              </p>
            )}
          </form>
        ) : (
          <div className="hm-received">
            <div className="hm-received-tag">
              <span className="hm-received-dot" />
              <span>Received</span>
            </div>
            <div className="hm-received-head">
              Your date is
              <br />
              on the board.
            </div>
            <p className="hm-received-copy">
              We&rsquo;ll confirm availability, recommend the right camera plan for your show, and
              send back a clean path forward — usually within one business day.
            </p>
            <a href="#book" className="hm-received-reset" onClick={reset}>
              Send another sheet
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
