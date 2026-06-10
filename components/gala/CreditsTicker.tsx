"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

// Cleared exactly as shipped — these seven logos only. Artist names are NOT
// cleared and must never appear anywhere (incl. alt text and meta).
const LOGOS: {
  src: string;
  alt: string;
  lh: string;
  width: number;
  height: number;
}[] = [
  { src: "/galas/logos/livenation.png", alt: "Live Nation", lh: "30px", width: 266, height: 60 },
  { src: "/galas/logos/veeps.png", alt: "Veeps", lh: "26px", width: 239, height: 52 },
  { src: "/galas/logos/atlantic.png", alt: "Atlantic Records", lh: "34px", width: 68, height: 68 },
  { src: "/galas/logos/warner.png", alt: "Warner Music Group", lh: "30px", width: 152, height: 60 },
  { src: "/galas/logos/mddn.png", alt: "MDDN", lh: "32px", width: 133, height: 64 },
  { src: "/galas/logos/iheartradio.png", alt: "iHeartRadio", lh: "30px", width: 192, height: 60 },
  { src: "/galas/logos/blizzard.png", alt: "Blizzard Entertainment", lh: "26px", width: 112, height: 52 },
];

// credits ticker — duplicate the set once at runtime for a seamless loop
export default function CreditsTicker() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = trackRef.current;
    if (!t) return;
    const s = t.querySelector(".cred-set");
    if (!s || t.querySelectorAll(".cred-set").length > 1) return;
    const c = s.cloneNode(true) as HTMLElement;
    c.setAttribute("aria-hidden", "true");
    t.appendChild(c);
    return () => c.remove();
  }, []);

  return (
    <div className="credits">
      <div className="cred-mask">
        <div className="cred-track" ref={trackRef}>
          <div className="cred-set">
            {LOGOS.map((l) => (
              // eslint-disable-next-line @next/next/no-img-element -- served as-is per spec; next/image would rewrite the cleared files
              <img
                key={l.src}
                className="c-logo"
                style={{ "--lh": l.lh } as CSSProperties}
                src={l.src}
                alt={l.alt}
                width={l.width}
                height={l.height}
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
