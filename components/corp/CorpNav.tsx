"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CorpLockup from "./CorpLockup";

const LINKS = [
  { href: "#what-we-cover", label: "Use cases" },
  { href: "#video-plan", label: "Plan" },
  { href: "#engagement-types", label: "Engagements" },
  { href: "#check-availability", label: "Availability" },
];

const MENU = [
  { idx: "00", href: "#what-we-cover", label: "Use cases" },
  { idx: "01", href: "#video-plan", label: "Plan" },
  { idx: "02", href: "#engagement-types", label: "Engagements" },
  { idx: "03", href: "#check-availability", label: "Availability" },
];

// Sticky corporate nav: lockup (→ homepage) + in-page section links;
// burger + full-screen menu under 1180px (scroll locks behind the
// overlay), with a small secondary "Front Row Home" escape hatch.
export default function CorpNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <nav className="cp-nav" aria-label="Primary">
        <div className="cp-nav-inner">
          <Link href="/" className="cp-nav-home" aria-label="Front Row Broadcast home">
            <CorpLockup />
          </Link>
          <div className="cp-nav-links">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
            <a href="#check-availability" className="cp-nav-cta">
              Check Your Date
            </a>
          </div>
          <button
            type="button"
            className="cp-burger"
            aria-label="Open menu"
            aria-controls="corporate-mobile-menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {open && (
        <div className="cp-menu" id="corporate-mobile-menu" aria-label="Mobile menu">
          <div className="cp-menu-top">
            <Link
              href="/"
              className="cp-nav-home"
              aria-label="Front Row Broadcast home"
              onClick={() => setOpen(false)}
            >
              <CorpLockup tile={34} word={22} gap={11} />
            </Link>
            <button type="button" className="cp-menu-close" onClick={() => setOpen(false)}>
              CLOSE ✕
            </button>
          </div>
          <div className="cp-menu-tagline">Corporate live-event video</div>
          <div className="cp-menu-links">
            {MENU.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
                <span className="cp-mi">{l.idx}</span>
                <span className="cp-mt">{l.label}</span>
              </a>
            ))}
          </div>
          <Link className="cp-menu-home" href="/" onClick={() => setOpen(false)}>
            Front Row Home <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}
    </>
  );
}
