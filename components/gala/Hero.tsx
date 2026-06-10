"use client";

import { useEffect, useRef } from "react";
import TelLink from "./TelLink";

// HERO — a paused program feed with a super on it.
// Pure CSS field (gradients + grain), no raster: LCP stays on the H1 text.
export default function Hero() {
  const tcRef = useRef<HTMLDivElement>(null);

  // running timecode (25fps)
  useEffect(() => {
    const el = tcRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = "19:38:00:00";
      return;
    }
    let frames = (19 * 3600 + 38 * 60) * 25;
    const p = (n: number) => String(n).padStart(2, "0");
    const id = setInterval(() => {
      frames++;
      const h = Math.floor(frames / (25 * 3600)) % 24,
        m = Math.floor(frames / (25 * 60)) % 60,
        s = Math.floor(frames / 25) % 60,
        f = frames % 25;
      el.textContent = p(h) + ":" + p(m) + ":" + p(s) + ":" + p(f);
    }, 1000 / 25);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="frame">
      {/* TODO (rights-gated): hero/PGM muted motion-loop slot — when cleared
          footage exists, mount a muted looping <video> layer here, behind
          .safe and the super. Structure only; do not add footage yet. */}
      <div className="safe">
        <i></i>
        <i></i>
        <i></i>
        <i></i>
      </div>

      <div className="wm" aria-label="Front Row Broadcast">
        <span className="l1">Front Row</span>
        <span className="l2">
          Broadcast <span className="tally"></span>
        </span>
      </div>

      <div className="status">
        <span className="dot"></span>LIVE
        <span className="loc-long"> · ORANGE COUNTY</span>
      </div>

      <div className="super">
        <div className="locator">
          DONORS GIVE MORE WHEN THE ROOM CAN SEE THE MOMENT
        </div>
        <h1>
          CINEMATIC BROADCAST
          <br />
          FOR GALAS &amp; FUNDRAISERS
        </h1>
        <div className="cta-row">
          <a className="btn" href="#book">
            <span className="btn-label">Hold your date</span>
          </a>
          <TelLink placement="hero" className="phone" />
        </div>
        <p className="hold-note">
          Free 5-day hold — while your committee decides
        </p>
      </div>

      <div className="tc" id="tc" ref={tcRef}>
        19:38:00:00
      </div>
    </div>
  );
}
