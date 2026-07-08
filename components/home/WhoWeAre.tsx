"use client";

import { useEffect, useRef } from "react";
import Slate from "./Slate";

// 00 Who we are — the annotated statement plus the working focus ring:
// drag the lens ruler to rack the section in and out of focus; on
// release (or after the scroll-in entrance) it eases back to critical
// focus at the 62 mark. The slate and the ruler itself stay sharp so
// the control is always readable — only [data-fw-blur] content racks.
const SWEET = 0.62;
const EASE = "cubic-bezier(0.22,1,0.36,1)";

export default function WhoWeAre() {
  const secRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sec = secRef.current;
    if (!sec) return;

    const mobile = window.matchMedia("(max-width: 860px)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ring = sec.querySelector<HTMLElement>('[data-fw="ring"]');
    const mark = sec.querySelector<HTMLElement>('[data-fw="mark"]');
    const blurEls = Array.from(sec.querySelectorAll<HTMLElement>("[data-fw-blur]"));
    const entranceEls = Array.from(sec.querySelectorAll<HTMLElement>("[data-enter]"));
    const rail = sec.querySelector<HTMLElement>("[data-rail]");
    const period = sec.querySelector<HTMLElement>("[data-period]");

    // --- staged entrance (opacity/translate per line, then the period pops)
    const stage = (el: HTMLElement, ms: number, color?: boolean) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(18px)";
      el.style.transition =
        `opacity 700ms ${EASE} ${ms}ms, transform 700ms ${EASE} ${ms}ms` +
        (color ? ", color 260ms ease-out" : "");
    };
    if (!reduceMotion) {
      entranceEls.forEach((el, i) => stage(el, [0, 100, 210, 320, 430, 540, 660][i] ?? 0, i === 2 || i === 3));
      if (rail) {
        rail.style.opacity = "0";
        rail.style.transition = "opacity 900ms ease-out 820ms";
      }
      if (period) {
        period.style.opacity = "0";
        period.style.transform = "scale(0)";
        period.style.transition =
          "opacity 260ms ease-out 950ms, transform 420ms cubic-bezier(0.34,1.56,0.64,1) 950ms";
      }
    }

    // --- focus rack
    const f = { pos: 0.05, drag: false, last: 9e15, raf: 0, lastBlur: -1, revealAt: 0 };
    let cleanupFocus = () => {};

    if (ring && mark && blurEls.length && !mobile && !reduceMotion) {
      const clamp = (e: PointerEvent) => {
        const r = ring.getBoundingClientRect();
        return Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
      };
      const move = (e: PointerEvent) => {
        if (!f.drag) return;
        f.pos = clamp(e);
        f.last = performance.now();
      };
      const down = (e: PointerEvent) => {
        f.drag = true;
        f.last = performance.now();
        f.revealAt = 0; // grabbing the ring cancels the auto-pull
        try {
          ring.setPointerCapture(e.pointerId);
        } catch {}
        f.pos = clamp(e);
      };
      const up = () => {
        if (!f.drag) return;
        f.drag = false;
        f.last = performance.now();
      };
      const loop = () => {
        if (f.revealAt) {
          // time-based entrance rack: starts 500ms after reveal, eases 1.8s
          const t = (performance.now() - f.revealAt - 500) / 1800;
          if (t >= 1) {
            f.pos = SWEET;
            f.revealAt = 0;
            f.last = performance.now();
          } else if (t > 0) {
            const e = 1 - Math.pow(1 - t, 3);
            f.pos = 0.05 + (SWEET - 0.05) * e;
          }
        } else if (!f.drag && performance.now() - f.last > 1400 && f.pos !== SWEET) {
          // autofocus catching: ease back to the sweet spot, then snap
          f.pos += (SWEET - f.pos) * 0.05;
          if (Math.abs(f.pos - SWEET) <= 0.002) f.pos = SWEET;
        }
        mark.style.left = (f.pos * 100).toFixed(2) + "%";
        const b = Math.min(16, Math.abs(f.pos - SWEET) * 40);
        if (Math.abs(b - f.lastBlur) > 0.05 || (b < 0.08 && f.lastBlur !== 0)) {
          f.lastBlur = b;
          const fil = b < 0.08 ? "none" : `blur(${b.toFixed(2)}px)`;
          blurEls.forEach((el) => {
            el.style.filter = fil;
          });
        }
        f.raf = requestAnimationFrame(loop);
      };
      f.raf = requestAnimationFrame(loop);
      ring.addEventListener("pointerdown", down);
      ring.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
      cleanupFocus = () => {
        cancelAnimationFrame(f.raf);
        ring.removeEventListener("pointerdown", down);
        ring.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
      };
    } else if (mark) {
      // mobile / reduced motion: static ruler at critical focus, no blur
      mark.style.left = `${SWEET * 100}%`;
    }

    // --- reveal on scroll-in
    const reveal = () => {
      entranceEls.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      });
      if (rail) rail.style.opacity = "1";
      if (period) {
        period.style.opacity = "1";
        period.style.transform = "scale(1)";
      }
      if (!mobile && !reduceMotion) f.revealAt = performance.now();
    };
    let obs: IntersectionObserver | null = null;
    if (reduceMotion || typeof IntersectionObserver === "undefined") {
      reveal();
    } else {
      obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              reveal();
              obs?.disconnect();
            }
          });
        },
        { threshold: 0.12 },
      );
      obs.observe(sec);
    }

    return () => {
      cleanupFocus();
      obs?.disconnect();
    };
  }, []);

  return (
    <section className="hm-who" id="who" ref={secRef}>
      <div className="hm-who-rail" data-rail data-fw-blur="">
        <span>Front Row Broadcast — Orange County, CA — MMXXVI</span>
      </div>

      <div className="hm-who-head" data-enter="">
        <Slate idx="00" name="Who we are" sub="The company behind the cameras" />
        <div className="hm-rec">
          <span className="hm-rec-dot" />
          <span className="hm-rec-label">REC</span>
        </div>
      </div>

      <div className="hm-who-statement" data-fw-blur="">
        <div className="hm-ws hm-l1" data-enter="">
          We&rsquo;re a premium
        </div>
        <div className="hm-ws hm-l2 hm-outline" data-enter="">
          Cinematic
        </div>
        <div className="hm-ws hm-l3" data-enter="">
          Multicam
        </div>
        <div className="hm-ws hm-l4" data-enter="">
          video production
        </div>
        <div className="hm-ws hm-l5" data-enter="">
          company
          <span className="hm-dot" data-period>
            .
          </span>
        </div>
      </div>

      <div className="hm-who-copy" data-fw-blur="" data-enter="">
        <div className="hm-who-copy-inner">
          <p className="hm-body">
            We bring the look of a feature film to the reliability of live broadcast — cinema
            cameras on every angle, cut live, engineered to hold up when there&rsquo;s no second
            take.
          </p>
          <div className="hm-who-creds">
            Based in Orange County
            <br />
            Lean, experienced core team
            <br />
            Trusted on national stages
          </div>
        </div>
      </div>

      <div className="hm-lens" data-fw="ring">
        <div className="hm-lens-label">Focus — drag to rack</div>
        <div className="hm-lens-track" />
        <div className="hm-lens-major" />
        <div className="hm-lens-mark" data-fw="mark" />
        <div className="hm-lens-ticks">
          <span>0.6</span>
          <span>1</span>
          <span>2</span>
          <span>4</span>
          <span>8</span>
          <span>16</span>
          <span>32</span>
          <span>50</span>
          <span>100</span>
          <span>200</span>
          <span>∞</span>
        </div>
      </div>
    </section>
  );
}
