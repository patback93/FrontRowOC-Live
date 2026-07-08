"use client";

import { useEffect, useRef } from "react";
import Slate from "./Slate";
import { PROJECT_ITEMS } from "./data";

/* eslint-disable @next/next/no-img-element -- the concourse drives
   raw <img> transforms per-frame; next/image wrappers fight the rAF loop */

// 02 Projects — the poster concourse. Drag to walk the wall (momentum +
// snap), click a poster or a 35mm contact-strip frame to pull focus,
// followspot tracks the cursor, and it slow-drifts to the next title
// after 6s idle. Mobile gets a native scroll-snap swipe rail instead
// (the concourse is display:none under 860px and never initialized).
export default function Projects() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    // desktop only — the concourse is hidden on mobile
    if (window.matchMedia("(max-width: 860px)").matches) return;

    const stage = root.querySelector<HTMLElement>('[data-frbp="stage"]');
    const spot = root.querySelector<HTMLElement>('[data-frbp="spot"]');
    const titleEl = root.querySelector<HTMLElement>('[data-frbp="title"]');
    const subEl = root.querySelector<HTMLElement>('[data-frbp="sub"]');
    const counterEl = root.querySelector<HTMLElement>('[data-frbp="counter"]');
    const plateWrap = root.querySelector<HTMLElement>('[data-frbp="plate"]');
    const byIdx = (sel: string, attr: string) =>
      Array.from(root.querySelectorAll<HTMLElement>(sel)).sort(
        (a, b) => parseInt(a.getAttribute(attr)!, 10) - parseInt(b.getAttribute(attr)!, 10),
      );
    const cases = byIdx("[data-frbp-case]", "data-frbp-case");
    const tallies = byIdx("[data-frbp-tally]", "data-frbp-tally");
    const ticks = byIdx("[data-frbp-tick]", "data-frbp-tick");
    const thumbs = byIdx("[data-frbp-thumb]", "data-frbp-thumb");
    if (!stage || !cases.length) return;

    const meta = PROJECT_ITEMS;
    const gap = 120;
    const centers: number[] = [];
    let cx = 0;
    for (const m of meta) {
      centers.push(cx + m.w / 2);
      cx += m.w + gap;
    }
    const n = centers.length;
    const s = {
      x: centers[0],
      vx: 0,
      target: centers[0] as number | null,
      drag: false,
      sx: 0,
      x0: 0,
      vel: 0,
      moved: 0,
      last: performance.now(),
      active: -1,
    };

    const setActive = (i: number) => {
      if (i === s.active) return;
      const first = s.active === -1;
      s.active = i;
      for (let k = 0; k < n; k++) {
        if (tallies[k]) tallies[k].style.background = k === i ? "#D93A2B" : "#3A3740";
        if (thumbs[k]) thumbs[k].style.filter = k === i ? "none" : "grayscale(1) brightness(0.5)";
        if (ticks[k]) {
          ticks[k].style.outline = k === i ? "1px solid #D93A2B" : "none";
          ticks[k].style.outlineOffset = "-1px";
        }
      }
      const swap = () => {
        if (titleEl) titleEl.textContent = meta[i].title;
        if (subEl) subEl.textContent = meta[i].sub.toUpperCase();
        if (plateWrap) plateWrap.style.opacity = "1";
      };
      // program plate cross-fades (150ms) when the live poster changes
      if (!first && plateWrap) {
        plateWrap.style.opacity = "0";
        setTimeout(swap, 150);
      } else {
        swap();
      }
      if (counterEl) counterEl.textContent = `0${i + 1} / 0${n}`;
    };

    const nearest = () => {
      let bi = 0,
        bd = Infinity;
      for (let i = 0; i < n; i++) {
        const d = Math.abs(centers[i] - s.x);
        if (d < bd) {
          bd = d;
          bi = i;
        }
      }
      return bi;
    };

    const down = (e: PointerEvent) => {
      s.drag = true;
      s.sx = e.clientX;
      s.x0 = s.x;
      s.vel = 0;
      s.moved = 0;
      s.target = null;
      s.last = performance.now();
      try {
        stage.setPointerCapture(e.pointerId);
      } catch {}
      stage.style.cursor = "grabbing";
    };
    const move = (e: PointerEvent) => {
      if (spot) {
        const r = stage.getBoundingClientRect();
        spot.style.background = `radial-gradient(560px 560px at ${e.clientX - r.left}px ${
          e.clientY - r.top
        }px, rgba(246,243,236,0.10), rgba(246,243,236,0.035) 42%, rgba(246,243,236,0) 70%)`;
      }
      if (!s.drag) return;
      const dx = e.clientX - s.sx;
      let nx = s.x0 - dx;
      // rubber-band past the ends
      if (nx < centers[0]) nx = centers[0] - (centers[0] - nx) * 0.35;
      if (nx > centers[n - 1]) nx = centers[n - 1] + (nx - centers[n - 1]) * 0.35;
      s.vel = 0.75 * s.vel + 0.25 * (nx - s.x);
      s.x = nx;
      s.moved = Math.max(s.moved, Math.abs(dx));
      s.last = performance.now();
    };
    const up = (e: PointerEvent) => {
      if (!s.drag) return;
      s.drag = false;
      s.last = performance.now();
      stage.style.cursor = "grab";
      if (s.moved < 8) {
        // a click, not a drag — dolly to the poster under the cursor
        const hit = document.elementFromPoint(e.clientX, e.clientY);
        const c = hit?.closest?.("[data-frbp-case]");
        if (c) {
          s.target = centers[parseInt(c.getAttribute("data-frbp-case")!, 10)];
          return;
        }
      }
      s.vx = s.vel * 1.6;
    };
    const leave = () => {
      if (spot) spot.style.background = "none";
    };

    const tickHs = ticks.map((tk, i) => {
      const h = () => {
        s.target = centers[i];
        s.last = performance.now();
      };
      tk.addEventListener("click", h);
      return h;
    });

    let raf = 0;
    const loop = () => {
      const now = performance.now();
      if (!s.drag) {
        if (s.target != null) {
          s.x += (s.target - s.x) * 0.09;
          if (Math.abs(s.target - s.x) < 0.3) s.x = s.target;
        } else {
          s.x += s.vx;
          s.vx *= 0.94;
          if (s.x < centers[0]) {
            s.x += (centers[0] - s.x) * 0.2;
            s.vx *= 0.7;
          }
          if (s.x > centers[n - 1]) {
            s.x += (centers[n - 1] - s.x) * 0.2;
            s.vx *= 0.7;
          }
          if (Math.abs(s.vx) < 0.12) s.target = centers[nearest()];
        }
        // idle auto-drift to the next title
        if (now - s.last > 6000) {
          s.target = centers[(nearest() + 1) % n];
          s.last = now;
        }
      }
      for (let i = 0; i < n; i++) {
        const d = centers[i] - s.x;
        const rot = Math.max(-26, Math.min(26, -d * 0.042));
        const tz = -Math.min(Math.abs(d) * 0.5, 440);
        cases[i].style.transform = `translateX(${d}px) translateZ(${tz}px) rotateY(${rot}deg)`;
        cases[i].style.zIndex = String(1000 - Math.round(Math.abs(d) / 4));
        cases[i].style.opacity = String(1 - Math.min(Math.abs(d) / 1700, 0.5));
      }
      setActive(nearest());
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    stage.addEventListener("pointerdown", down);
    stage.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    stage.addEventListener("pointerleave", leave);

    return () => {
      cancelAnimationFrame(raf);
      stage.removeEventListener("pointerdown", down);
      stage.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      stage.removeEventListener("pointerleave", leave);
      ticks.forEach((tk, i) => tk.removeEventListener("click", tickHs[i]));
    };
  }, []);

  return (
    <section className="hm-projects" id="projects">
      <div className="hm-section-head">
        <Slate idx="02" name="Projects" sub="Selected work, presented with context" />
      </div>

      <div className="hm-proj-title">
        On the marquee<span className="hm-dot">.</span>
        <span className="hm-proj-note">
          <span className="hm-proj-note-rule" />
          DRAG TO WALK THE WALL
        </span>
      </div>

      {/* desktop: 3D concourse */}
      <div className="hm-concourse" ref={rootRef}>
        <div className="hm-stage" data-frbp="stage">
          <div className="hm-stage-bg" />
          <div className="hm-track" data-frbp="track">
            {PROJECT_ITEMS.map((it) => (
              <div
                key={it.idx}
                className="hm-poster-case"
                data-frbp-case={it.idx}
                style={{ width: it.w, marginLeft: -it.w / 2 }}
              >
                <div className="hm-poster-frame">
                  <img src={it.file} alt={`${it.title} poster`} draggable={false} />
                  <div className="hm-poster-sheen" />
                  <div className="hm-poster-ch">
                    <span className="hm-poster-tally" data-frbp-tally={it.idx} />
                    <span className="hm-poster-ch-label">{it.ch}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="hm-stage-fade hm-left" />
          <div className="hm-stage-fade hm-right" />
          <div className="hm-spot" data-frbp="spot" />
        </div>
        <div className="hm-plate" data-frbp="plate">
          <div className="hm-plate-title-row">
            <span className="hm-plate-dot" />
            <span className="hm-plate-title" data-frbp="title">
              Elton John
            </span>
          </div>
          <div className="hm-plate-sub" data-frbp="sub">
            BENEFIT CONCERT / LARGE-FORMAT LIVE CAPTURE — PETCO PARK
          </div>
        </div>
        <div className="hm-strip-wrap">
          <span className="hm-strip-counter" data-frbp="counter">
            01 / 07
          </span>
          <div className="hm-strip">
            <div className="hm-sprockets" />
            <div className="hm-strip-frames">
              {PROJECT_ITEMS.map((it) => (
                <button
                  key={it.idx}
                  type="button"
                  className="hm-strip-tick"
                  data-frbp-tick={it.idx}
                  aria-label={`Go to ${it.title}`}
                >
                  <span
                    className="hm-strip-thumb"
                    data-frbp-thumb={it.idx}
                    style={{ backgroundImage: `url('${it.file}')` }}
                  />
                </button>
              ))}
            </div>
            <div className="hm-sprockets" />
          </div>
        </div>
      </div>

      {/* mobile: swipe rail */}
      <div className="hm-proj-mobile">
        <div className="hm-proj-swipe-note">
          <span className="hm-proj-note-rule" />
          Swipe the wall — 07 titles
        </div>
        <div className="hm-swipe-rail">
          {PROJECT_ITEMS.map((it) => (
            <div key={it.idx} className="hm-swipe-card">
              <div className="hm-swipe-poster">
                <img src={it.file} alt={`${it.title} poster`} draggable={false} loading="lazy" />
                <div className="hm-swipe-ch">
                  <span className="hm-d" />
                  <span className="hm-c">{it.ch}</span>
                </div>
              </div>
              <div className="hm-swipe-credit">
                {it.title} — {it.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
