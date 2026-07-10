"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import GfLockup from "./GfLockup";

const LINKS = [
  { href: "#what-we-cover", label: "Use cases" },
  { href: "#video-plan", label: "Plan" },
  { href: "#engagement-types", label: "Engagements" },
  { href: "#check-availability", label: "Availability" },
];

const MENU = [
  { idx: "01", href: "#what-we-cover", label: "Use cases" },
  { idx: "02", href: "#video-plan", label: "Plan" },
  { idx: "03", href: "#engagement-types", label: "Engagements" },
  { idx: "04", href: "#check-availability", label: "Availability" },
];

// Sticky gala nav: lockup (→ homepage) + in-page section links;
// burger + full-screen menu under 1180px (scroll locks behind the
// overlay), with a small secondary "Front Row Home" escape hatch.
export default function GfNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <nav className="gf-nav" aria-label="Primary">
        <div className="gf-nav-inner">
          <Link href="/" className="gf-nav-home" aria-label="Front Row Broadcast home">
            <GfLockup />
          </Link>
          <div className="gf-nav-links">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
            <a href="#check-availability" className="gf-nav-cta">
              Check Your Date
            </a>
          </div>
          <button
            type="button"
            className="gf-burger"
            aria-label="Open menu"
            aria-controls="gala-mobile-menu"
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
        <div className="gf-menu" id="gala-mobile-menu" aria-label="Mobile menu">
          <div className="gf-menu-top">
            <Link
              href="/"
              className="gf-nav-home"
              aria-label="Front Row Broadcast home"
              onClick={() => setOpen(false)}
            >
              <GfLockup tile={34} word={22} gap={11} />
            </Link>
            <button type="button" className="gf-menu-close" onClick={() => setOpen(false)}>
              CLOSE ✕
            </button>
          </div>
          <div className="gf-menu-tagline">Gala &amp; fundraiser video production</div>
          <div className="gf-menu-links">
            {MENU.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
                <span className="gf-mi">{l.idx}</span>
                <span className="gf-mt">{l.label}</span>
              </a>
            ))}
          </div>
          <Link className="gf-menu-home" href="/" onClick={() => setOpen(false)}>
            Front Row Home <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}
    </>
  );
}
