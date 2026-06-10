"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/gala/track";
import TelLink from "./TelLink";

// Sticky bar — mounts once the hero leaves the viewport (IO threshold 0).
export default function StickyBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    const hero = document.querySelector(".frame");
    if (!bar || !hero || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          const on = !e.isIntersecting;
          bar.classList.toggle("on", on);
          bar.setAttribute("aria-hidden", on ? "false" : "true");
          // keep links unfocusable while the bar is off-screen
          bar.toggleAttribute("inert", !on);
        });
      },
      { threshold: 0 },
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  return (
    <div className="sticky-bar" id="sticky-bar" aria-hidden="true" inert ref={barRef}>
      <div className="sb-in">
        <span className="sb-mono">
          FR<i></i>
        </span>
        <div className="sb-act">
          <TelLink placement="sticky" className="phone" />
          <a
            className="btn sb-btn"
            href="#book"
            onClick={() => track("sticky_cta_click")}
          >
            <span className="btn-label">Hold your date</span>
          </a>
        </div>
      </div>
    </div>
  );
}
