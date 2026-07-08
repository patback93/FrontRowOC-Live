"use client";

import { useEffect, useRef, useState } from "react";
import { PILLARS } from "./data";

// Editorial hero — mono label, display headline, CTAs, three pillars,
// and the reel card (498x280 on desktop, full-width on phones). The
// staged entrance (label → headline → subcopy → ctas → pillars → reel)
// arms on scroll-in via [data-run]; CSS keyframes carry the motion and
// prefers-reduced-motion disables it wholesale. The reel card opens a
// modal (Esc / backdrop / CLOSE dismiss, focus moves in and back out).
// The multicam program-cut loop is rights-gated — until footage lands
// the card and the modal render the designed placeholder state.
export default function HomeHero() {
  const secRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);

  // arm the entrance when the hero scrolls into view
  useEffect(() => {
    const sec = secRef.current;
    if (!sec) return;
    const run = () => sec.setAttribute("data-run", "1");
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof IntersectionObserver === "undefined"
    ) {
      run();
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            run();
            obs.disconnect();
          }
        });
      },
      { threshold: 0.18 },
    );
    obs.observe(sec);
    return () => obs.disconnect();
  }, []);

  // modal: scroll lock, Esc close, focus trap while open, focus in on
  // open / restored to the reel card on close
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const dialog = document.querySelector(".hm-modal-dialog");
      if (!dialog) return;
      const focusables = Array.from(
        dialog.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (!dialog.contains(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      openerRef.current?.focus();
    };
  }, [open]);

  const openModal = (e: React.MouseEvent | React.KeyboardEvent) => {
    openerRef.current = e.currentTarget as HTMLElement;
    setOpen(true);
  };

  return (
    <section className="hm-hero" id="top" ref={secRef}>
      <div className="hm-hero-grid" aria-hidden="true" />
      <div className="hm-hero-sprockets" aria-hidden="true" />
      <div className="hm-hero-inner">
        <div className="hm-hero-copy">
          <div className="hm-hero-label" data-enter="label">
            <span className="hm-hero-label-rule" />
            Orange County / nationwide live production
          </div>
          <h1 className="hm-hero-headline" data-enter="headline">
            Live event films with broadcast backbone<span className="hm-dot">.</span>
          </h1>
          <p className="hm-hero-sub" data-enter="subcopy">
            Cinematic multicam production for concerts, galas, brand events, and livestreams —
            engineered for the room, the stream, and the final cut.
          </p>
          <div className="hm-hero-ctas" data-enter="ctas">
            <a href="#book" className="hm-hero-cta-solid">
              Check availability
            </a>
            <a href="#projects" className="hm-hero-cta-ghost">
              View selected work
            </a>
          </div>
          <div className="hm-hero-pillars" data-enter="pillars">
            {PILLARS.map((p) => (
              <div key={p.name} className="hm-pillar">
                <div className="hm-pillar-name">{p.name}</div>
                <div className="hm-pillar-note">{p.note}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hm-hero-reel" data-enter="reel">
          <span className="hm-hero-deco" aria-hidden="true" />
          <div
            className="hm-reel-card"
            role="button"
            tabIndex={0}
            aria-label="Open the reel preview"
            onClick={openModal}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openModal(e);
              }
            }}
          >
            <div className="hm-reel-head">
              <span className="hm-reel-title">Watch the reel</span>
              <span className="hm-reel-rec">
                <span className="hm-reel-rec-dot" />
                Program
              </span>
            </div>
            <div className="hm-reel-frame" data-empty="true">
              <div className="hm-reel-shade" aria-hidden="true" />
              <div className="hm-reel-chrome" aria-hidden="true">
                <span className="hm-vf hm-tl" />
                <span className="hm-vf hm-tr" />
                <span className="hm-vf hm-bl" />
                <span className="hm-vf hm-br" />
                <span className="hm-reel-play">
                  <svg viewBox="0 0 30 34" aria-hidden="true">
                    <path d="M0 0 L30 17 L0 34 Z" fill="#F6F3EC" />
                  </svg>
                </span>
              </div>
            </div>
            <div className="hm-reel-foot">
              <span>Multicam</span>
              <span>Live switch</span>
              <span>Final cut</span>
            </div>
          </div>
          <div className="hm-reel-note">
            <span className="hm-reel-note-label">Watch</span>
            <span className="hm-reel-note-copy">
              A quick look at cinematic coverage, live switching, and show-day execution.
            </span>
          </div>
        </div>
      </div>

      {open && (
        <div
          className="hm-modal"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="hm-modal-dialog" role="dialog" aria-modal="true" aria-label="Watch the reel">
            <button
              type="button"
              className="hm-modal-close"
              ref={closeRef}
              onClick={() => setOpen(false)}
            >
              CLOSE
            </button>
            <div className="hm-modal-frame">
              <div className="hm-modal-glow" aria-hidden="true" />
              <div className="hm-modal-safe" aria-hidden="true" />
              <div className="hm-modal-center">
                <div>
                  <div className="hm-modal-kicker">Reel preview</div>
                  <div className="hm-modal-title">Watch the reel</div>
                  <div className="hm-modal-meta">Runtime TBD / 16:9 / Multicam + live switch</div>
                </div>
              </div>
            </div>
            <div className="hm-modal-foot">
              <p className="hm-modal-copy">
                A quick look at cinematic coverage, live switching, and show-day execution.
              </p>
              <a href="#book" className="hm-modal-cta" onClick={() => setOpen(false)}>
                Check availability
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
