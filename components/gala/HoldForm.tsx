"use client";

import { useState, type FormEvent } from "react";
import { track } from "@/lib/gala/track";

type Status = "idle" | "submitting" | "error" | "success";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function HoldForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errMsg, setErrMsg] = useState<string>("");

  // TODO: NEXT_PUBLIC_CAL_URL for "OR BOOK A 15-MIN CALL" — keep `#` until
  // the env is set (booking link not minted yet).
  const calUrl = process.env.NEXT_PUBLIC_CAL_URL || "#";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    const fd = new FormData(e.currentTarget);
    const v = (k: string) => String(fd.get(k) ?? "").trim();
    const payload = {
      name: v("name"),
      org: v("org"),
      email: v("email"),
      phone: v("phone"),
      date: v("date"),
      venue: v("venue"),
      company: v("company"), // honeypot — humans never see or fill this
    };
    if (!payload.name || !payload.date) {
      setErrMsg("NAME AND EVENT DATE REQUIRED — OR CALL");
      setStatus("error");
      return;
    }
    if (payload.email && !EMAIL_RE.test(payload.email)) {
      setErrMsg("THAT EMAIL DOESN'T LOOK RIGHT — FIX IT OR CALL");
      setStatus("error");
      return;
    }
    setStatus("submitting");
    track("hold_submit");
    try {
      const res = await fetch("/api/hold", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("success");
      track("hold_success");
    } catch {
      setErrMsg("COULDN'T SEND — CALL US AND WE'LL HOLD IT NOW:");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="form-ok" role="status">
        <div className="ok-line">
          <span className="dot"></span>WE&apos;VE GOT IT — EXPECT A REPLY
          WITHIN 2 HOURS
        </div>
        <a
          className="phone"
          href="tel:+19492367573"
          onClick={() => track("tel_click", { placement: "book" })}
        >
          (949) 236-7573
        </a>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="hold-name">NAME</label>
        <input id="hold-name" name="name" type="text" placeholder="Your name" autoComplete="name" />
      </div>
      <div className="field">
        <label htmlFor="hold-org">ORGANIZATION</label>
        <input id="hold-org" name="org" type="text" placeholder="Organization" autoComplete="organization" />
      </div>
      <div className="field">
        <label htmlFor="hold-email">EMAIL</label>
        <input id="hold-email" name="email" type="email" placeholder="you@org.org" autoComplete="email" inputMode="email" />
      </div>
      <div className="field">
        <label htmlFor="hold-phone">PHONE</label>
        <input id="hold-phone" name="phone" type="tel" placeholder="(714) 555-0000" autoComplete="tel" inputMode="tel" />
      </div>
      <div className="field">
        <label htmlFor="hold-date">EVENT DATE</label>
        <input id="hold-date" name="date" type="text" placeholder="MM/DD/YYYY" inputMode="numeric" autoComplete="off" />
      </div>
      <div className="field">
        <label htmlFor="hold-venue">VENUE</label>
        <input id="hold-venue" name="venue" type="text" placeholder="Venue" autoComplete="off" />
      </div>
      {/* honeypot — visually hidden, off the tab order; bots fill it, the API
          accepts with 200 and drops silently */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="hold-company">COMPANY</label>
        <input id="hold-company" name="company" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
      <div className="full">
        <button className="btn" type="submit" disabled={status === "submitting"}>
          <span className="btn-label">
            {status === "submitting" ? "HOLDING…" : "Hold your date"}
          </span>
        </button>
        <a className="alt-link" href={calUrl} onClick={() => track("cal_click")}>
          OR BOOK A 15-MIN CALL
        </a>
      </div>
      {status === "error" ? (
        <div className="form-err" role="alert">
          {errMsg}{" "}
          <a href="tel:+19492367573" onClick={() => track("tel_click", { placement: "book" })}>
            (949) 236-7573
          </a>
        </div>
      ) : null}
    </form>
  );
}
