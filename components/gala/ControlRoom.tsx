"use client";

import { useEffect, useRef } from "react";
import { createSwitcher, DEFS, type Source } from "@/lib/gala/switcher";

// CONTROL ROOM — multiviewer + control surface. One shared state machine
// (lib/gala/switcher.ts) paints the keys, the monitor rings, the LCD, and the
// signal-flow diagram tallies (#fd-cam1/#fd-cam2/#fd-pb), exactly like the
// prototype's unified controller.
export default function ControlRoom() {
  const rootRef = useRef<HTMLDivElement>(null);
  const clkRef = useRef<HTMLDivElement>(null);

  // unified switcher — one state drives the multiview AND the control surface
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sw = createSwitcher();

    const $ = <T extends Element>(sel: string) => root.querySelector<T>(sel);
    const pgmA = $<HTMLDivElement>("#pgm-a")!,
      pgmB = $<HTMLDivElement>("#pgm-b")!,
      veil = $<HTMLDivElement>("#ftb-veil")!,
      pvwF = $<HTMLDivElement>("#pvw-field")!,
      pvwN = $<HTMLSpanElement>("#pvw-name")!,
      tiles = root.querySelectorAll<HTMLDivElement>(".src"),
      keys = root.querySelectorAll<HTMLButtonElement>(".k-src"),
      kCut = $<HTMLButtonElement>("#k-cut")!,
      kAuto = $<HTMLButtonElement>("#k-auto")!,
      kMix = $<HTMLButtonElement>("#k-mix")!,
      kWipe = $<HTMLButtonElement>("#k-wipe")!,
      kFtb = $<HTMLButtonElement>("#k-ftb")!,
      bar = $<HTMLDivElement>("#tbar-h")!,
      track = $<HTMLDivElement>("#tbar-track")!,
      lcdMain = $<HTMLSpanElement>("#lcd-main")!,
      lcdFtb = $<HTMLSpanElement>("#lcd-ftb")!;

    if (RM && veil) veil.style.transition = "none";

    function setProg(x: number) {
      if (sw.state.trans === "mix") {
        pgmB.style.clipPath = "none";
        pgmB.style.opacity = String(x);
      } else {
        pgmB.style.opacity = "1";
        pgmB.style.clipPath = "inset(0 " + (1 - x) * 100 + "% 0 0)";
      }
      if (bar && track) bar.style.top = x * (track.clientHeight - 34) + "px";
      if (track) track.setAttribute("aria-valuenow", String(Math.round(x * 100)));
    }

    function paint() {
      const { pgm, pvw, ftb, trans } = sw.state;
      pgmA.className = "field " + DEFS[pgm].cls;
      pgmB.className = "field " + DEFS[pvw].cls;
      pvwF.className = "field " + DEFS[pvw].cls;
      pvwN.textContent = DEFS[pvw].short;
      tiles.forEach((t) => {
        const s = t.dataset.src as Source;
        t.classList.toggle("live", s === pgm);
        t.classList.toggle("pv", s === pvw && s !== pgm);
        t.setAttribute("aria-pressed", s === pgm ? "true" : "false");
      });
      keys.forEach((k) => {
        const on = k.dataset.bus === "pgm" ? k.dataset.src === pgm : k.dataset.src === pvw;
        k.classList.toggle(k.dataset.bus === "pgm" ? "lit-r" : "lit-w", on);
        k.setAttribute("aria-pressed", on ? "true" : "false");
      });
      (["cam1", "cam2", "pb"] as const).forEach((s) => {
        const d = document.getElementById("fd-" + s);
        if (d) d.classList.toggle("on", s === pgm);
      });
      if (kMix) {
        kMix.classList.toggle("lit-w", trans === "mix");
        kWipe.classList.toggle("lit-w", trans === "wipe");
        kFtb.classList.toggle("lit-r", ftb);
        kFtb.classList.toggle("blink", ftb && !RM);
        veil.style.opacity = ftb ? "1" : "0";
        lcdMain.textContent = sw.lcdMain();
        lcdFtb.hidden = !ftb;
      }
      setProg(0);
    }

    function commit() {
      sw.commit();
      kAuto.classList.remove("lit-r");
      paint();
    }

    function hardCut(s: Source) {
      if (sw.hardCut(s)) paint();
    }

    function cutKey() {
      if (sw.cutKey()) paint();
    }

    function animateTo(target: number, from: number, done: () => void) {
      let t0: number | null = null;
      const dur = Math.max(250, 700 * Math.abs(target - from));
      function step(ts: number) {
        if (!t0) t0 = ts;
        const k = Math.min((ts - t0) / dur, 1);
        setProg(from + (target - from) * k);
        if (k < 1) requestAnimationFrame(step);
        else done();
      }
      requestAnimationFrame(step);
    }

    function doAuto() {
      if (sw.state.busy || sw.state.pvw === sw.state.pgm) return;
      if (RM) {
        sw.swap();
        paint();
        return;
      }
      sw.beginTransition();
      kAuto.classList.add("lit-r");
      animateTo(1, 0, commit);
    }

    type Bound = [EventTarget, string, EventListener];
    const bound: Bound[] = [];
    const on = (el: EventTarget, type: string, fn: EventListener) => {
      el.addEventListener(type, fn);
      bound.push([el, type, fn]);
    };

    tiles.forEach((t) => {
      on(t, "click", () => hardCut(t.dataset.src as Source));
      on(t, "keydown", (e) => {
        const ke = e as KeyboardEvent;
        if (ke.key === "Enter" || ke.key === " ") {
          ke.preventDefault();
          hardCut(t.dataset.src as Source);
        }
      });
    });

    keys.forEach((k) => {
      on(k, "click", () => {
        if (sw.state.busy) return;
        if (k.dataset.bus === "pgm") {
          hardCut(k.dataset.src as Source);
        } else {
          sw.setPreview(k.dataset.src as Source);
          paint();
        }
      });
    });

    on(kCut, "click", cutKey);
    on(kAuto, "click", doAuto);
    on(kMix, "click", () => {
      if (sw.state.busy) return;
      sw.setTrans("mix");
      paint();
    });
    on(kWipe, "click", () => {
      if (sw.state.busy) return;
      sw.setTrans("wipe");
      paint();
    });
    on(kFtb, "click", () => {
      sw.toggleFtb();
      paint();
    });

    // T-bar — manual transition with spring-back (Pointer Events)
    let dragging = false,
      prog = 0;
    on(bar, "pointerdown", (e) => {
      const pe = e as PointerEvent;
      if (sw.state.busy || sw.state.pvw === sw.state.pgm) return;
      dragging = true;
      sw.beginTransition();
      bar.setPointerCapture(pe.pointerId);
      pe.preventDefault();
    });
    on(bar, "pointermove", (e) => {
      if (!dragging) return;
      const pe = e as PointerEvent;
      const r = track.getBoundingClientRect();
      prog = Math.min(1, Math.max(0, (pe.clientY - r.top - 17) / (r.height - 34)));
      setProg(prog);
    });
    on(bar, "pointerup", () => {
      if (!dragging) return;
      dragging = false;
      if (RM) {
        if (prog > 0.5) sw.swap();
        sw.release();
        prog = 0;
        paint();
        return;
      }
      if (prog > 0.5) {
        animateTo(1, prog, () => {
          commit();
          prog = 0;
        });
      } else {
        animateTo(0, prog, () => {
          sw.release();
          prog = 0;
        });
      }
    });
    on(track, "keydown", (e) => {
      const ke = e as KeyboardEvent;
      if (ke.key === "ArrowDown" || ke.key === "ArrowUp") {
        ke.preventDefault();
        if (!dragging) {
          if (sw.state.busy || sw.state.pvw === sw.state.pgm) return;
          dragging = true;
          sw.beginTransition();
        }
        prog = Math.min(1, Math.max(0, prog + (ke.key === "ArrowDown" ? 0.1 : -0.1)));
        setProg(prog);
        if (prog >= 1) {
          dragging = false;
          commit();
          prog = 0;
        } else if (prog <= 0) {
          dragging = false;
          sw.release();
        }
      }
      if (ke.key === "Enter" && dragging) {
        ke.preventDefault();
        dragging = false;
        animateTo(1, prog, () => {
          commit();
          prog = 0;
        });
      }
    });

    paint();

    return () => {
      bound.forEach(([el, type, fn]) => el.removeEventListener(type, fn));
    };
  }, []);

  // multiviewer clock — viewer's local time, always live
  useEffect(() => {
    const el = clkRef.current;
    if (!el) return;
    const p = (n: number) => (n < 10 ? "0" : "") + n;
    const set = () => {
      const d = new Date();
      el.textContent = p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds());
    };
    set();
    const id = setInterval(set, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div ref={rootRef}>
      <div className="mv">
        <div className="cell pvw">
          <div className="field f-pb" id="pvw-field"></div>
          <div className="lbl">
            PVW — <span id="pvw-name">TRIBUTE</span>
          </div>
        </div>
        <div className="cell pgm">
          <div className="field f-cam1" id="pgm-a"></div>
          <div className="field f-pb" id="pgm-b" style={{ opacity: 0 }}></div>
          <div className="field ftb-veil" id="ftb-veil"></div>
          <div className="lbl">
            <span className="dot"></span>PGM — TO SCREENS
          </div>
        </div>
        <div
          className="cell src live"
          data-src="cam1"
          tabIndex={0}
          role="button"
          aria-pressed="true"
          aria-label="CAM 1 — JIB, cut to program"
        >
          <div className="field f-cam1"></div>
          <div className="lbl">
            <span className="dot"></span>CAM 1 — JIB
          </div>
        </div>
        <div
          className="cell src"
          data-src="cam2"
          tabIndex={0}
          role="button"
          aria-pressed="false"
          aria-label="CAM 2 — HANDHELD, cut to program"
        >
          <div className="field f-cam2"></div>
          <div className="lbl">
            <span className="dot"></span>CAM 2 — HANDHELD
          </div>
        </div>
        <div
          className="cell src"
          data-src="pb"
          tabIndex={0}
          role="button"
          aria-pressed="false"
          aria-label="PLAYBACK — TRIBUTE, cut to program"
        >
          <div className="field f-pb"></div>
          <div className="lbl">
            <span className="dot"></span>PLAYBACK — TRIBUTE
          </div>
        </div>
        <div className="cell clk">
          <div className="lbl">CLOCK — LOCAL</div>
          <div className="time" id="clk" ref={clkRef}>
            00:00:00
          </div>
        </div>
      </div>
      <div className="desk">
        <div className="desk-head">
          <div>
            <span className="dh-name">Front Row</span>
            <span className="dh-sub">Control Surface — M/E 1</span>
          </div>
          <div className="lcd" aria-live="polite">
            <span id="lcd-main">PGM CAM 1 · PVW PB · MIX</span>
            <span id="lcd-ftb" className="lcd-ftb" hidden>
              {" · FTB"}
            </span>
          </div>
        </div>
        <div className="desk-inner">
          <div className="buses">
            <div className="bus">
              <span className="bus-lbl">Program</span>
              <button className="key k-src" data-bus="pgm" data-src="cam1" aria-pressed="true">
                CAM 1
              </button>
              <button className="key k-src" data-bus="pgm" data-src="cam2" aria-pressed="false">
                CAM 2
              </button>
              <button className="key k-src" data-bus="pgm" data-src="pb" aria-pressed="false">
                PB
              </button>
              <button className="key k-src" data-bus="pgm" data-src="blk" aria-pressed="false">
                BLK
              </button>
            </div>
            <div className="bus">
              <span className="bus-lbl">Preview</span>
              <button className="key k-src" data-bus="pvw" data-src="cam1" aria-pressed="false">
                CAM 1
              </button>
              <button className="key k-src" data-bus="pvw" data-src="cam2" aria-pressed="false">
                CAM 2
              </button>
              <button className="key k-src" data-bus="pvw" data-src="pb" aria-pressed="true">
                PB
              </button>
              <button className="key k-src" data-bus="pvw" data-src="blk" aria-pressed="false">
                BLK
              </button>
            </div>
          </div>
          <div className="tblock">
            <div className="tkeys">
              <div className="tk-row">
                <button className="key k-fn" id="k-mix">
                  MIX
                </button>
                <button className="key k-fn" id="k-wipe">
                  WIPE
                </button>
              </div>
              <div className="tk-row">
                <button className="key k-fn" id="k-cut">
                  CUT
                </button>
                <button className="key k-fn" id="k-auto">
                  AUTO
                </button>
              </div>
              <div className="tk-row">
                <button className="key k-fn ftbk" id="k-ftb">
                  FTB
                </button>
              </div>
            </div>
            <div
              className="tbar-track"
              id="tbar-track"
              role="slider"
              aria-orientation="vertical"
              aria-label="Transition bar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={0}
              tabIndex={0}
            >
              <div className="tbar-h" id="tbar-h"></div>
            </div>
          </div>
        </div>
        <div className="desk-cap">
          Program = on air (red) · Preview = next (white) · The bar rides a manual transition · FTB = fade to black
        </div>
      </div>
      <div className="mv-caption">
        <span>OPERATED BY BROADCAST ENGINEERS</span>
        <span>A MIXONE CINEMA COMPANY</span>
      </div>
    </div>
  );
}
