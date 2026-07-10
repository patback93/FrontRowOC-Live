"use client";

import { useEffect, useRef } from "react";

// Fixed bottom "Check Date" bar (phones only, ≤640px via CSS). Shows
// once the hero has scrolled past; hides near the use-case and
// availability sections and whenever the form has focus — the design
// export's exact gating logic.
export default function GfMobileCta() {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const cta = ref.current;
    const availability = document.getElementById("check-availability");
    const who = document.getElementById("what-we-cover");
    const hero = document.getElementById("top");
    if (!cta || !availability) return;

    let availabilityVisible = false;
    const setHidden = (hidden: boolean) =>
      cta.setAttribute("data-state", hidden ? "hidden" : "shown");

    const update = () => {
      const heroGate = hero
        ? hero.offsetTop + hero.offsetHeight - Math.min(120, window.innerHeight * 0.18)
        : 520;
      const pastHero = window.scrollY > heroGate;
      const a = availability.getBoundingClientRect();
      const nearAvailability = a.top < window.innerHeight - 88 && a.bottom > 72;
      const w = who ? who.getBoundingClientRect() : null;
      const nearWho = w ? w.top < window.innerHeight - 80 && w.bottom > 80 : false;
      setHidden(!pastHero || availabilityVisible || nearAvailability || nearWho);
    };

    let obs: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      obs = new IntersectionObserver(
        (entries) => {
          availabilityVisible = entries.some((en) => en.isIntersecting);
          update();
        },
        { rootMargin: "0px 0px -35% 0px" },
      );
      obs.observe(availability);
    }
    const onFocusIn = (e: FocusEvent) => {
      const t = e.target as Element | null;
      if (t?.closest?.("#check-availability")) setHidden(true);
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    document.addEventListener("focusin", onFocusIn);
    update();
    return () => {
      obs?.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      document.removeEventListener("focusin", onFocusIn);
    };
  }, []);

  return (
    <a href="#check-availability" className="gf-mobile-cta" data-state="hidden" ref={ref}>
      Check Date
    </a>
  );
}
