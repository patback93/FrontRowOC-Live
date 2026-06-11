"use client";

import { useEffect, useRef } from "react";

// SIGNAL FLOW — the desktop SVG set piece. At ≤880px it renders inside a
// horizontal swipe viewport with edge fades (owner-directed 2026-06-11,
// DEVIATIONS.md §14 — replaces the prototype's summary-chain fallback).
// Wires draw in on view; fail-safes guarantee solid wires regardless:
// 1.4s force-finish clears all dash styling, 5s no-trigger fallback,
// reduced-motion skips entirely.
export default function SignalFlow() {
  const svgRef = useRef<SVGSVGElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // edge fades follow the swipe so neither end of the diagram is
  // permanently obscured
  useEffect(() => {
    const wrap = scrollRef.current;
    if (!wrap) return;
    const update = () => {
      wrap.classList.toggle("at-start", wrap.scrollLeft <= 8);
      wrap.classList.toggle(
        "at-end",
        wrap.scrollLeft >= wrap.scrollWidth - wrap.clientWidth - 8,
      );
    };
    update();
    wrap.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      wrap.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const paths: SVGPathElement[] = Array.prototype.slice.call(
      svg.querySelectorAll(".w-in, .w-out"),
    );
    const pgm = svg.querySelector<SVGPathElement>("#pgm-wire");
    if (pgm) paths.push(pgm);
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    )
      return;
    paths.forEach((p) => {
      try {
        const L = p.getTotalLength();
        p.style.strokeDasharray = String(L);
        p.style.strokeDashoffset = String(L);
      } catch {
        /* non-rendered path — leave untouched */
      }
    });
    let done = false;
    function finish() {
      if (done) return;
      done = true;
      paths.forEach((p) => {
        p.style.transition = "";
        p.style.strokeDasharray = "";
        p.style.strokeDashoffset = "";
      });
    }
    function play() {
      if (done) return;
      svg!.getBoundingClientRect();
      paths.forEach((p) => {
        const isIn = p.classList.contains("w-in");
        p.style.transition =
          "stroke-dashoffset .55s ease-out" + (isIn ? "" : " .3s");
        p.style.strokeDashoffset = "0";
      });
      setTimeout(finish, 1400);
    }
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) {
            io.disconnect();
            play();
          }
        });
      },
      { threshold: 0.35 },
    );
    io.observe(svg);
    const fallback = setTimeout(() => {
      if (!done) {
        try {
          io.disconnect();
        } catch {
          /* already disconnected */
        }
        finish();
      }
    }, 5000);
    return () => {
      clearTimeout(fallback);
      io.disconnect();
      finish();
    };
  }, []);

  return (
    <>
      <div
        className="flow-scroll"
        ref={scrollRef}
        tabIndex={0}
        role="region"
        aria-label="Signal flow diagram — scrollable on small screens"
      >
      <svg
        ref={svgRef}
        className="flow-svg"
        viewBox="0 0 920 380"
        role="img"
        aria-label="Signal flow: two cameras and tribute playback feed the Front Row vision switcher, which sends the live program to the ballroom screens, the recap film edit, and an optional remote stream."
      >
        <text className="fl-head" x="10" y="24">SOURCES</text>
        <text className="fl-head" x="710" y="24">OUTPUTS</text>

        <rect className="fl-box" x="10" y="42" width="200" height="58" />
        <circle className="fl-tally" id="fd-cam1" cx="196" cy="56" r="3.5" />
        <text className="fl-mono" x="26" y="68">CAM 1 — FOH</text>
        <text className="fl-sub" x="26" y="86">OPERATED · CINEMA BODY</text>

        <rect className="fl-box" x="10" y="161" width="200" height="58" />
        <circle className="fl-tally" id="fd-cam2" cx="196" cy="175" r="3.5" />
        <text className="fl-mono" x="26" y="187">CAM 2 — WIDE</text>
        <text className="fl-sub" x="26" y="205">REMOTE HEAD · DESK-DRIVEN</text>

        <rect className="fl-box" x="10" y="280" width="200" height="58" />
        <circle className="fl-tally" id="fd-pb" cx="196" cy="294" r="3.5" />
        <text className="fl-mono" x="26" y="306">PLAYBACK — TRIBUTE</text>
        <text className="fl-sub" x="26" y="324">MEDIA SERVER</text>

        <path className="fl-wire w-in" d="M210 71 H310 V155 H400" />
        <path className="fl-wire w-in" d="M210 190 H400" />
        <path className="fl-wire w-in" d="M210 309 H310 V225 H400" />
        <circle className="fl-bnc" cx="210" cy="71" r="2.5" />
        <circle className="fl-bnc" cx="210" cy="190" r="2.5" />
        <circle className="fl-bnc" cx="210" cy="309" r="2.5" />
        <text className="fl-sub" x="238" y="63">SDI</text>
        <text className="fl-sub" x="238" y="182">SDI</text>
        <text className="fl-sub" x="238" y="301">SDI</text>

        <rect className="fl-port" x="397" y="151" width="6" height="8" />
        <rect className="fl-port" x="397" y="186" width="6" height="8" />
        <rect className="fl-port" x="397" y="221" width="6" height="8" />
        <rect className="fl-raised" x="400" y="120" width="170" height="140" />
        <text className="fl-name" x="485" y="172" textAnchor="middle">FRONT ROW</text>
        <text className="fl-sub" x="485" y="194" textAnchor="middle">VISION SWITCHER</text>
        <text className="fl-sub" x="485" y="212" textAnchor="middle">1 ENGINEER-IN-CHARGE</text>
        <rect className="fl-port" x="567" y="151" width="6" height="8" />
        <rect className="fl-port" x="567" y="186" width="6" height="8" />
        <rect className="fl-port" x="567" y="221" width="6" height="8" />

        <path className="fl-pgm" id="pgm-wire" d="M570 155 H650 V71 H710" />
        <text className="fl-sub fl-red" x="578" y="147">PGM</text>
        <path className="fl-wire w-out" d="M570 190 H710" />
        <path className="fl-wire w-out" d="M570 225 H650 V309 H710" />
        <circle className="fl-bnc-r" cx="710" cy="71" r="2.5" />
        <circle className="fl-bnc" cx="710" cy="190" r="2.5" />
        <circle className="fl-bnc" cx="710" cy="309" r="2.5" />

        <rect className="fl-live" x="710" y="42" width="200" height="58" />
        <text className="fl-mono" x="726" y="68">BALLROOM SCREENS</text>
        <circle className="fl-dot" cx="731" cy="82" r="4" />
        <text className="fl-sub" x="742" y="86">LIVE DURING THE ASK</text>

        <rect className="fl-box" x="710" y="161" width="200" height="58" />
        <text className="fl-mono" x="726" y="187">RECAP FILM</text>
        <text className="fl-sub" x="726" y="205">90 SEC · 2 WKS</text>

        <rect className="fl-box" x="710" y="280" width="200" height="58" />
        <text className="fl-mono" x="726" y="306">REMOTE STREAM</text>
        <text className="fl-sub" x="726" y="324">OPTIONAL ADD-ON</text>
      </svg>
      </div>
      <div className="flow-hint" aria-hidden="true">
        ← SWIPE THE SIGNAL PATH →
      </div>
    </>
  );
}
