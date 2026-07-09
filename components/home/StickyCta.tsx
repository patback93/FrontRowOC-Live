"use client";

import { useEffect, useRef } from "react";

// Floating "Check availability" — a corner card on desktop, a
// full-width bottom bar on phones. Shows once the hero has scrolled
// past (bottom < 88% of the viewport) and hides while the contact
// section is on screen, matching the design doc's sticky logic.
export default function StickyCta() {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    const hero = document.getElementById("top");
    const book = document.getElementById("availability");
    if (!el || !hero || !book) return;
    const update = () => {
      const h = hero.getBoundingClientRect();
      const c = book.getBoundingClientRect();
      const afterHero = h.bottom < window.innerHeight * 0.88;
      const contactShowing =
        c.top < window.innerHeight * 0.82 && c.bottom > window.innerHeight * 0.12;
      el.setAttribute("data-state", afterHero && !contactShowing ? "shown" : "hidden");
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <a href="#availability" className="hm-sticky" data-state="hidden" ref={ref}>
      <span className="hm-sticky-kicker">Have a date?</span>
      <span className="hm-sticky-label">Check availability</span>
    </a>
  );
}
