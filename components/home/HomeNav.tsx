"use client";

import { useEffect, useState } from "react";
import Lockup from "./Lockup";

// order + indices mirror the page's running order (Selected work leads,
// just under the logo bar; Plan is the compact process section)
const LINKS = [
  { idx: "01", href: "#selected-work", label: "Selected work" },
  { idx: "02", href: "#services", label: "What we do" },
  { idx: "03", href: "#plan", label: "Plan" },
  { idx: "04", href: "#availability", label: "Availability" },
];

export default function HomeNav() {
  const [open, setOpen] = useState(false);

  // lock page scroll behind the full-screen menu
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="hm-nav">
        <a className="hm-nav-lockup" href="#top" aria-label="Front Row Broadcast — home">
          <Lockup />
        </a>

        <nav className="hm-nav-links" aria-label="Primary">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
          <a href="#availability" className="hm-nav-cta">
            Check availability
          </a>
        </nav>

        <button
          type="button"
          className="hm-burger"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      {open && (
        <div className="hm-menu">
          <div className="hm-menu-top">
            <button type="button" className="hm-menu-close" onClick={() => setOpen(false)}>
              CLOSE ✕
            </button>
          </div>
          <div className="hm-menu-tagline">Cinematic multicam / live event films</div>
          <nav className="hm-menu-links" aria-label="Mobile">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
                <span className="hm-mi">{l.idx}</span>
                <span className="hm-mt">{l.label}</span>
              </a>
            ))}
          </nav>
          <a href="#availability" className="hm-menu-cta" onClick={() => setOpen(false)}>
            Check availability
          </a>
        </div>
      )}
    </>
  );
}
